import os
import logging
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import requests
from dotenv import load_dotenv
from queue import PriorityQueue
from threading import Thread, Lock
from dataclasses import dataclass, field
from time import sleep
from collections import OrderedDict

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('abs_api.log'),
        logging.StreamHandler()
    ]
)

@dataclass(order=True)
class PrioritizedRequest:
    priority: int
    timestamp: float = field(compare=False)
    request_id: str = field(compare=False)
    endpoint: str = field(compare=False)
    params: Dict = field(compare=False)
    callback: callable = field(compare=False)

class MemoryCache:
    def __init__(self, max_size=1000):
        self.cache = OrderedDict()
        self.max_size = max_size
        self.lock = Lock()

    def get(self, key: str) -> Optional[Dict]:
        with self.lock:
            if key not in self.cache:
                return None
            value, expiry = self.cache[key]
            if expiry < time.time():
                del self.cache[key]
                return None
            # Move to end (most recently used)
            self.cache.move_to_end(key)
            return value

    def set(self, key: str, value: Dict, ttl: int = 3600):
        with self.lock:
            # Remove oldest item if cache is full
            if len(self.cache) >= self.max_size:
                self.cache.popitem(last=False)
            expiry = time.time() + ttl
            self.cache[key] = (value, expiry)
            self.cache.move_to_end(key)

    def clear_expired(self):
        """Remove expired entries"""
        with self.lock:
            current_time = time.time()
            expired_keys = [
                k for k, (_, exp) in self.cache.items() 
                if exp < current_time
            ]
            for k in expired_keys:
                del self.cache[k]

class ABSRequestManager:
    def __init__(self):
        self.api_key = os.getenv('ABS_API_KEY')
        if not self.api_key:
            raise ValueError("ABS API key not found in environment variables")
        
        # In-memory cache
        self.cache = MemoryCache()
        
        # Rate limiting settings
        self.requests_per_minute = int(os.getenv('ABS_REQUESTS_PER_MINUTE', 30))
        self.request_window = 60  # seconds
        self.min_request_interval = self.request_window / self.requests_per_minute
        
        # Request queue and processing
        self.request_queue = PriorityQueue()
        self.processing_lock = Lock()
        self.last_request_time = 0
        
        # Start request processing thread
        self.processing_thread = Thread(target=self._process_queue, daemon=True)
        self.processing_thread.start()
        
        # Cache cleanup thread
        self.cleanup_thread = Thread(target=self._cleanup_cache, daemon=True)
        self.cleanup_thread.start()
        
        # Base URL for ABS API
        self.base_url = 'https://api.data.abs.gov.au/data'
        
        logging.info(f"ABS Request Manager initialized with {self.requests_per_minute} requests per minute limit")

    def _cleanup_cache(self):
        """Periodically clean up expired cache entries"""
        while True:
            self.cache.clear_expired()
            sleep(300)  # Clean every 5 minutes

    def _generate_cache_key(self, endpoint: str, params: Dict) -> str:
        """Generate a unique cache key for the request"""
        # Sort params to ensure consistent cache keys
        sorted_params = json.dumps(params, sort_keys=True)
        return f"abs_api:{endpoint}:{sorted_params}"

    def _get_cached_response(self, cache_key: str) -> Optional[Dict]:
        """Get cached response if available"""
        return self.cache.get(cache_key)

    def _cache_response(self, cache_key: str, response: Dict, ttl: int = 3600) -> None:
        """Cache the API response"""
        self.cache.set(cache_key, response, ttl)

    def _make_request(self, endpoint: str, params: Dict) -> Dict[str, Any]:
        """Make the actual API request"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Accept': 'application/json'
        }
        
        url = f"{self.base_url}/{endpoint}"
        
        try:
            response = requests.get(
                url,
                headers=headers,
                params=params,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logging.error(f"API request error: {str(e)}")
            raise

    def _process_queue(self) -> None:
        """Process requests from the queue"""
        while True:
            try:
                # Get next request from queue
                request = self.request_queue.get()
                
                # Ensure minimum interval between requests
                with self.processing_lock:
                    current_time = time.time()
                    time_since_last = current_time - self.last_request_time
                    if time_since_last < self.min_request_interval:
                        sleep_time = self.min_request_interval - time_since_last
                        logging.debug(f"Rate limiting: sleeping for {sleep_time:.2f} seconds")
                        sleep(sleep_time)
                    
                    # Generate cache key
                    cache_key = self._generate_cache_key(request.endpoint, request.params)
                    
                    # Check cache first
                    cached_response = self._get_cached_response(cache_key)
                    if cached_response:
                        logging.debug(f"Cache hit for request: {request.request_id}")
                        request.callback(cached_response)
                        self.request_queue.task_done()
                        continue
                    
                    # Make API request
                    logging.debug(f"Making API request: {request.request_id}")
                    response = self._make_request(request.endpoint, request.params)
                    
                    # Update last request time
                    self.last_request_time = time.time()
                    
                    # Cache the response
                    self._cache_response(cache_key, response)
                    
                    # Call the callback with the response
                    request.callback(response)
                    
            except Exception as e:
                logging.error(f"Error processing request: {str(e)}")
            
            finally:
                self.request_queue.task_done()

    def request(self, endpoint: str, params: Dict, priority: int = 1, callback: callable = None) -> None:
        """
        Queue a new API request
        
        Args:
            endpoint: API endpoint
            params: Request parameters
            priority: Request priority (lower number = higher priority)
            callback: Function to call with the response
        """
        request_id = f"{time.time()}_{endpoint}"
        request = PrioritizedRequest(
            priority=priority,
            timestamp=time.time(),
            request_id=request_id,
            endpoint=endpoint,
            params=params,
            callback=callback or (lambda x: None)
        )
        
        self.request_queue.put(request)
        logging.debug(f"Request queued: {request_id}")

# Global request manager instance
_request_manager = None

def get_request_manager() -> ABSRequestManager:
    """Get or create the global request manager instance"""
    global _request_manager
    if _request_manager is None:
        _request_manager = ABSRequestManager()
    return _request_manager
