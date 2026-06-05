import unittest
import json
import os
from app import app
from database import get_db

class GstCalculatorTestCase(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_home_page(self):
        """Test if the main HTML landing page renders successfully."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Softrate Tech Park", response.data)
        self.assertIn(b"GST Calculator", response.data)

    def test_calculate_exclusive(self):
        """Test Exclusive GST calculation logic and API."""
        payload = {
            "amount": 1000,
            "rate": 18,
            "type": "exclusive"
        }
        response = self.client.post(
            "/api/calculate",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        
        calc = res_data["data"]
        self.assertEqual(calc["original_amount"], 1000.0)
        self.assertEqual(calc["gst_rate"], 18.0)
        self.assertEqual(calc["gst_amount"], 180.0)
        self.assertEqual(calc["cgst"], 90.0)
        self.assertEqual(calc["sgst"], 90.0)
        self.assertEqual(calc["igst"], 180.0)
        self.assertEqual(calc["total_amount"], 1180.0)

    def test_calculate_inclusive(self):
        """Test Inclusive GST calculation logic and API."""
        payload = {
            "amount": 1180,
            "rate": 18,
            "type": "inclusive"
        }
        response = self.client.post(
            "/api/calculate",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        
        calc = res_data["data"]
        self.assertEqual(calc["original_amount"], 1000.0)
        self.assertEqual(calc["gst_rate"], 18.0)
        self.assertEqual(calc["gst_amount"], 180.0)
        self.assertEqual(calc["cgst"], 90.0)
        self.assertEqual(calc["sgst"], 90.0)
        self.assertEqual(calc["total_amount"], 1180.0)

    def test_calculate_invalid_inputs(self):
        """Test that validation rejects negative values and invalid parameters."""
        # Negative amount
        response = self.client.post(
            "/api/calculate",
            data=json.dumps({"amount": -100, "rate": 18, "type": "exclusive"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        
        # Out-of-bounds GST rate
        response = self.client.post(
            "/api/calculate",
            data=json.dumps({"amount": 100, "rate": 120, "type": "exclusive"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        # Invalid type
        response = self.client.post(
            "/api/calculate",
            data=json.dumps({"amount": 100, "rate": 18, "type": "other"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

    def test_get_gst_rates(self):
        """Test fetching default GST rates."""
        response = self.client.get("/api/gst-rates")
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertGreater(len(res_data["rates"]), 0)
        
        # Validate that rate 18% is in the list
        rates = [r["rate"] for r in res_data["rates"]]
        self.assertIn(18, rates)

    def test_history_endpoints(self):
        """Test logging calculations, fetching history, and clearing history."""
        # Add a calculation
        payload = {"amount": 500, "rate": 12, "type": "exclusive"}
        self.client.post(
            "/api/calculate",
            data=json.dumps(payload),
            content_type="application/json"
        )

        # Fetch history
        response = self.client.get("/api/history")
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertGreater(len(res_data["history"]), 0)
        
        # Clear history
        clear_response = self.client.delete("/api/history")
        self.assertEqual(clear_response.status_code, 200)
        
        # Fetch history again and verify it is empty
        empty_response = self.client.get("/api/history")
        self.assertEqual(empty_response.status_code, 200)
        empty_data = json.loads(empty_response.data)
        self.assertEqual(len(empty_data["history"]), 0)

    def test_contact_form(self):
        """Test contact form validation and submission logs."""
        payload = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "subject": "GST Software licensing query",
            "message": "Hi, we are looking to integrate your API within our tech park office space."
        }
        response = self.client.post(
            "/api/contact",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        
        # Test validation error
        invalid_payload = {
            "name": "",
            "email": "invalidemail",
            "subject": "",
            "message": ""
        }
        err_response = self.client.post(
            "/api/contact",
            data=json.dumps(invalid_payload),
            content_type="application/json"
        )
        self.assertEqual(err_response.status_code, 400)

if __name__ == "__main__":
    unittest.main()
