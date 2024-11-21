import sys
import logging
import os
from dotenv import load_dotenv
from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer
from datetime import datetime
import pandas as pd
import numpy as np
from typing import Dict, List, Any
from threading import Event
from abs_request_manager import get_request_manager
from time import sleep
import requests

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('abs_labour_force.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

class ABSDataRetriever:
    def __init__(self):
        self.base_url = 'https://api.data.abs.gov.au/data'
        self.api_key = os.getenv('ABS_API_KEY')
        self.request_manager = get_request_manager()
        if not self.api_key:
            raise ValueError("ABS API key not found in environment variables")
        
    def get_labour_force_data(self, start_date: str, end_date: str, region_code: str) -> Dict[str, Any]:
        """
        Retrieve labour force data from ABS API
        
        Args:
            start_date: Start date in YYYY-MM format
            end_date: End date in YYYY-MM format
            region_code: ABS region code
            
        Returns:
            Dictionary containing the labour force data
        """
        # Create an event to wait for the response
        response_event = Event()
        response_data = {}
        
        def callback(data):
            response_data['result'] = data
            response_event.set()
        
        # Prepare request parameters
        params = {
            'startPeriod': start_date,
            'endPeriod': end_date,
            'c[REGION]': region_code,
            'frequency': 'M',
            'detail': 'Full',
            'format': 'json'
        }
        
        # Queue the request
        self.request_manager.request(
            endpoint='LM',
            params=params,
            priority=1,
            callback=callback
        )
        
        # Wait for response (with timeout)
        if not response_event.wait(timeout=60):
            raise TimeoutError("Request timed out")
        
        if 'result' not in response_data:
            raise ValueError("No data received from API")
        
        return response_data['result']

class ABSAnalyzer:
    def __init__(self):
        self.data_retriever = ABSDataRetriever()

    def get_regions(self):
        # Return real ABS regions with correct ASGS codes
        regions = [
            # Victoria
            {"code": "2GMEL", "name": "Greater Melbourne", "state": "Victoria"},
            {"code": "2RVIC", "name": "Rest of Vic.", "state": "Victoria"},
            {"code": "2", "name": "Victoria", "state": "Victoria"},
            # NSW
            {"code": "1GSYD", "name": "Greater Sydney", "state": "New South Wales"},
            {"code": "1RNSW", "name": "Rest of NSW", "state": "New South Wales"},
            {"code": "1", "name": "New South Wales", "state": "New South Wales"},
            # Queensland
            {"code": "3GBRI", "name": "Greater Brisbane", "state": "Queensland"},
            {"code": "3RQLD", "name": "Rest of Qld.", "state": "Queensland"},
            {"code": "3", "name": "Queensland", "state": "Queensland"},
            # South Australia
            {"code": "4GADE", "name": "Greater Adelaide", "state": "South Australia"},
            {"code": "4RSAU", "name": "Rest of SA", "state": "South Australia"},
            {"code": "4", "name": "South Australia", "state": "South Australia"},
            # Western Australia
            {"code": "5GPER", "name": "Greater Perth", "state": "Western Australia"},
            {"code": "5RWAU", "name": "Rest of WA", "state": "Western Australia"},
            {"code": "5", "name": "Western Australia", "state": "Western Australia"},
            # Tasmania
            {"code": "6GHOB", "name": "Greater Hobart", "state": "Tasmania"},
            {"code": "6RTAS", "name": "Rest of Tas.", "state": "Tasmania"},
            {"code": "6", "name": "Tasmania", "state": "Tasmania"},
            # Northern Territory
            {"code": "7GDAR", "name": "Greater Darwin", "state": "Northern Territory"},
            {"code": "7RNTE", "name": "Rest of NT", "state": "Northern Territory"},
            {"code": "7", "name": "Northern Territory", "state": "Northern Territory"},
            # ACT
            {"code": "8ACTE", "name": "Australian Capital Territory", "state": "Australian Capital Territory"},
            # Australia
            {"code": "0", "name": "Australia", "state": "Australia"}
        ]
        return {"regions": regions}

    def _process_region_data(self, raw_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Process raw ABS data into a pandas DataFrame
        
        Args:
            raw_data: Raw JSON data from ABS API
            
        Returns:
            Processed DataFrame with employment statistics
        """
        try:
            # Extract observations from the ABS data structure
            observations = raw_data.get('dataSets', [{}])[0].get('observations', {})
            if not observations:
                raise ValueError("No observations found in ABS data")
            
            # Convert observations to list of dictionaries
            data_list = []
            for key, value in observations.items():
                indices = key.split(':')
                if len(value) >= 1:  # Ensure there's at least one value
                    data_list.append({
                        'time_period': indices[0],
                        'value': value[0]
                    })
            
            # Convert to DataFrame
            df = pd.DataFrame(data_list)
            
            # Convert values to numeric
            df['value'] = pd.to_numeric(df['value'], errors='coerce')
            
            # Add date column in proper format
            df['date'] = pd.to_datetime(df['time_period'], format='%Y-%m').dt.strftime('%Y-%m')
            
            # Calculate rates based on the type of data
            # Note: The actual calculation will depend on the specific data structure from the ABS API
            # You may need to adjust these calculations based on the actual data received
            
            df = df.sort_values('date')
            
            return df
            
        except Exception as e:
            logging.error(f"Error processing ABS data: {str(e)}")
            raise

    def analyze_labour_force(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze labour force data for selected regions
        
        Args:
            params: Dictionary containing:
                - start_date: Start date in YYYY-MM format
                - end_date: End date in YYYY-MM format
                - selected_regions: List of region codes
                
        Returns:
            Dictionary containing analyzed data and visualizations
        """
        try:
            start_date = params['start_date']
            end_date = params['end_date']
            region_codes = params.get('selected_regions', []) or params.get('selected_states', [])

            if not region_codes:
                raise ValueError("No regions selected for analysis")

            results = []
            for region_code in region_codes:
                try:
                    data = self.data_retriever.get_labour_force_data(
                        start_date, 
                        end_date,
                        region_code
                    )
                    processed_data = self._process_region_data(data)
                    processed_data['region'] = region_code  # Add region identifier
                    results.append(processed_data)
                except Exception as e:
                    logging.error(f"Error processing region {region_code}: {str(e)}")
                    continue

            if not results:
                raise ValueError("No data could be processed for any region")

            return self._aggregate_results(results)

        except Exception as e:
            logging.error(f"Analysis error: {str(e)}")
            raise

    def _aggregate_results(self, results: List[pd.DataFrame]) -> Dict[str, Any]:
        """
        Aggregate results from multiple regions
        
        Args:
            results: List of processed DataFrames
            
        Returns:
            Dictionary containing aggregated statistics and visualizations
        """
        try:
            # Combine all regional data
            combined_df = pd.concat(results, ignore_index=True)
            
            # Get latest and previous month data
            latest_data = combined_df.sort_values('date').groupby('region').last()
            prev_data = combined_df.sort_values('date').groupby('region').nth(-2)
            
            # Calculate changes
            changes = latest_data - prev_data
            
            # Prepare the response
            response = {
                "latest_date": combined_df['date'].max(),
                "regions": {}
            }
            
            # Process each region
            for region in latest_data.index:
                response["regions"][region] = {
                    "current": {
                        "value": float(latest_data.loc[region, 'value'])
                    },
                    "changes": {
                        "value": float(changes.loc[region, 'value'])
                    }
                }
            
            # Add time series data
            response["time_series"] = {
                region: df[['date', 'value']]
                .to_dict('records')
                for region, df in combined_df.groupby('region')
            }
            
            return response
            
        except Exception as e:
            logging.error(f"Error aggregating results: {str(e)}")
            raise

def start_rpc_server(host='localhost', port=8080):
    server = SimpleJSONRPCServer((host, port))
    analyzer = ABSAnalyzer()
    
    server.register_function(analyzer.get_regions, 'get_regions')
    server.register_function(analyzer.analyze_labour_force, 'analyze_labour_force')
    
    print(f"Starting RPC server on {host}:{port}")
    server.serve_forever()

if __name__ == "__main__":
    start_rpc_server()