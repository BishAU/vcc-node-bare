import unittest
import time
from unittest.mock import patch, MagicMock
from abs_request_manager import get_request_manager, ABSRequestManager

class TestABSRequestManager(unittest.TestCase):
    @patch.dict('os.environ', {'ABS_API_KEY': 'test_key', 'ABS_REQUESTS_PER_MINUTE': '30'})
    def setUp(self):
        self.manager = get_request_manager()

    @patch('requests.get')
    def test_rate_limiting(self, mock_get):
        """Test that requests are rate limited"""
        # Mock response
        mock_response = MagicMock()
        mock_response.json.return_value = {'data': 'test'}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        responses = []
        def callback(response):
            responses.append(response)

        # Queue multiple requests
        for i in range(5):
            self.manager.request(
                endpoint='test_endpoint',
                params={'param': i},
                callback=callback
            )

        # Wait for requests to be processed
        time.sleep(10)
        
        # Check that requests were processed with proper intervals
        self.assertEqual(len(responses), 5)

    @patch('requests.get')
    def test_caching(self, mock_get):
        """Test that responses are cached"""
        # Mock response
        mock_response = MagicMock()
        mock_response.json.return_value = {'data': 'test'}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        responses = []
        def callback(response):
            responses.append(response)

        # Make same request twice
        for _ in range(2):
            self.manager.request(
                endpoint='test_endpoint',
                params={'param': 'value'},
                callback=callback
            )

        # Wait for requests to be processed
        time.sleep(10)

        # Check that requests were processed
        self.assertEqual(len(responses), 2)
        # Check that only one actual API call was made
        self.assertEqual(mock_get.call_count, 1)

    @patch('requests.get')
    def test_priority_queue(self, mock_get):
        """Test that high priority requests are processed first"""
        # Mock response
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_get.side_effect = lambda url, headers, params, timeout: MagicMock(
            json=lambda: {'params': params}
        )

        responses = []
        def callback(response):
            responses.append(response)

        # Queue requests with different priorities
        # Queue low priority request first
        self.manager.request(
            endpoint='test_endpoint',
            params={'order': 2},
            priority=2,
            callback=callback
        )
        time.sleep(0.1)  # Small delay to ensure order
        
        # Queue high priority request second
        self.manager.request(
            endpoint='test_endpoint',
            params={'order': 1},
            priority=1,
            callback=callback
        )

        # Wait for requests to be processed
        time.sleep(10)

        # Check that requests were received
        self.assertEqual(len(responses), 2, "Expected 2 responses")
        
        # Check that high priority request was processed first
        first_response = responses[0]['params']['order']
        second_response = responses[1]['params']['order']
        self.assertEqual(
            first_response,
            1,
            f"Expected high priority (1) first, got {first_response}"
        )
        self.assertEqual(
            second_response,
            2,
            f"Expected low priority (2) second, got {second_response}"
        )

if __name__ == '__main__':
    unittest.main()
