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

    def test_expense_report_lifecycle(self):
        """Test expense report submission, retrieval, and status update workflow."""
        # 1. Post a valid expense report
        report_payload = {
            "report_id": "EXP-TEST-9999",
            "employee_name": "Test Employee",
            "employee_email": "employee@softrate.com",
            "department": "Finance",
            "project_name": "Test Project",
            "travel_purpose": "Testing",
            "report_period": "June 2026",
            "budget_limit": 50000.0,
            "subtotal": 1000.0,
            "gst_amount": 180.0,
            "grand_total": 1180.0,
            "items": [
                {
                    "date": "2026-06-04",
                    "category": "Software",
                    "merchant": "AWS",
                    "payment_mode": "Credit Card",
                    "description": "Test SaaS",
                    "gst_percentage": 18,
                    "amount": 1000.0,
                    "gst_amount": 180.0,
                    "total": 1180.0
                }
            ],
            "status": "Submitted"
        }
        
        response = self.client.post(
            "/api/expenses",
            data=json.dumps(report_payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertIn("submitted successfully", res_data["message"])

        # 2. Test validation error (missing employee_name)
        invalid_payload = {
            "report_id": "EXP-TEST-ERR",
            "employee_email": "err@softrate.com"
        }
        response = self.client.post(
            "/api/expenses",
            data=json.dumps(invalid_payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        # 3. Retrieve expense reports
        response = self.client.get("/api/expenses")
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertIn("reports", res_data)
        self.assertGreater(len(res_data["reports"]), 0)

        # Find our report in the list to get its DB _id
        reports = res_data["reports"]
        test_report = next((r for r in reports if r["report_id"] == "EXP-TEST-9999"), None)
        self.assertIsNotNone(test_report)
        db_id = test_report["id"]

        # 4. Update status to Approved
        response = self.client.put(
            f"/api/expenses/{db_id}/status",
            data=json.dumps({"status": "Approved"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["message"], "Report status updated to Approved.")

        # 5. Retrieve reports again and verify the status is updated
        response = self.client.get("/api/expenses")
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        updated_report = next((r for r in res_data["reports"] if r["report_id"] == "EXP-TEST-9999"), None)
        self.assertIsNotNone(updated_report)
        self.assertEqual(updated_report["status"], "Approved")

    def test_new_custom_expense_routes(self):
        """Test the new expense endpoints: save, approve, reject, export-pdf, export-excel."""
        # 1. Save a new report
        report_payload = {
            "report_id": "EXP-CUSTOM-8888",
            "employee_name": "Custom Tester",
            "employee_email": "tester@softrate.com",
            "department": "IT",
            "project_name": "Test project",
            "travel_purpose": "Testing custom routes",
            "report_period": "June 2026",
            "budget_limit": 10000.0,
            "subtotal": 500.0,
            "gst_amount": 90.0,
            "grand_total": 590.0,
            "items": [
                {
                    "date": "2026-06-04",
                    "category": "Travel",
                    "merchant": "Uber",
                    "payment_mode": "Cash",
                    "description": "Taxi ride",
                    "gst_percentage": 18,
                    "amount": 500.0,
                    "gst_amount": 90.0,
                    "total": 590.0
                }
            ],
            "status": "Submitted"
        }
        
        response = self.client.post(
            "/expense-report/save",
            data=json.dumps(report_payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["report_id"], "EXP-CUSTOM-8888")

        # 2. Test validation error (missing email)
        invalid_payload = {
            "report_id": "EXP-CUSTOM-ERR",
            "employee_name": "Tester"
        }
        response = self.client.post(
            "/expense-report/save",
            data=json.dumps(invalid_payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        # 3. Approve report
        response = self.client.post("/expense-report/approve/EXP-CUSTOM-8888")
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["message"], "Report status updated to APPROVED.")

        # Verify status is APPROVED in database query
        response = self.client.get("/api/expenses")
        res_data = json.loads(response.data)
        saved_report = next((r for r in res_data["reports"] if r["report_id"] == "EXP-CUSTOM-8888"), None)
        self.assertIsNotNone(saved_report)
        self.assertEqual(saved_report["status"], "APPROVED")

        # 4. Reject report
        response = self.client.post("/expense-report/reject/EXP-CUSTOM-8888")
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["message"], "Report status updated to REJECTED.")

        # Verify status is REJECTED in database query
        response = self.client.get("/api/expenses")
        res_data = json.loads(response.data)
        saved_report = next((r for r in res_data["reports"] if r["report_id"] == "EXP-CUSTOM-8888"), None)
        self.assertEqual(saved_report["status"], "REJECTED")

        # 5. Export PDF
        response = self.client.get("/expense-report/export-pdf/EXP-CUSTOM-8888")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, "application/pdf")
        self.assertTrue(len(response.data) > 0)

        # 6. Export Excel
        response = self.client.get("/expense-report/export-excel/EXP-CUSTOM-8888")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, "text/csv; charset=utf-8")
        self.assertTrue(len(response.data) > 0)
        self.assertIn(b"EXP-CUSTOM-8888", response.data)

    def test_signup_page(self):
        """Test if the sign-up page renders successfully."""
        response = self.client.get("/signup")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"SOFTRATE", response.data)
        self.assertIn(b"Start Free Trial", response.data)

    def test_signup_api_success(self):
        """Test successful registration API flow."""
        db, _ = get_db()
        db.users.delete_many({"email": "signup_test@softrate.com"})

        payload = {
            "user_type": "Business User",
            "company_name": "Test Company Ltd",
            "email": "signup_test@softrate.com",
            "mobile_number": "1234567890",
            "password": "securepassword123",
            "country": "India",
            "state": "Karnataka",
            "terms_accepted": True
        }
        response = self.client.post(
            "/api/signup",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["user"]["name"], "Test Company Ltd")

        # Verify doc saved in fallback DB
        saved_user = db.users.find_one({"email": "signup_test@softrate.com", "record_type": "registration"})
        self.assertIsNotNone(saved_user)
        self.assertEqual(saved_user["company_name"], "Test Company Ltd")
        self.assertEqual(saved_user["user_type"], "Business User")
        self.assertNotEqual(saved_user["password"], "securepassword123")

    def test_signup_api_validation(self):
        """Test API registration validations."""
        payload = {
            "user_type": "Business User",
            "company_name": "Test Company Ltd",
            "email": "signup_test2@softrate.com",
            "mobile_number": "1234567890",
            "password": "securepassword123",
            "country": "India",
            "state": "Karnataka",
            "terms_accepted": False
        }
        response = self.client.post(
            "/api/signup",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"must accept the Terms of Service", response.data)

        payload_missing = {
            "user_type": "Business User",
            "company_name": "",
            "email": "signup_test2@softrate.com",
            "mobile_number": "1234567890",
            "password": "securepassword123",
            "country": "India",
            "state": "Karnataka",
            "terms_accepted": True
        }
        response = self.client.post(
            "/api/signup",
            data=json.dumps(payload_missing),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"fields are required", response.data)

    def test_oauth_url_missing_keys(self):
        """Test that missing Client ID/Secret returns a 400 error."""
        app.config["GOOGLE_CLIENT_ID"] = None
        app.config["GOOGLE_CLIENT_SECRET"] = None
        response = self.client.get("/api/auth/url/google")
        self.assertEqual(response.status_code, 400)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "error")
        self.assertIn("OAuth not configured", res_data["message"])

    def test_oauth_url_with_keys(self):
        """Test that configured Client ID/Secret returns a valid redirect URL."""
        app.config["GOOGLE_CLIENT_ID"] = "mock_client_id"
        app.config["GOOGLE_CLIENT_SECRET"] = "mock_client_secret"
        response = self.client.get("/api/auth/url/google")
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertIn("accounts.google.com", res_data["url"])
        self.assertIn("client_id=mock_client_id", res_data["url"])

    def test_oauth_callback_unsupported_provider(self):
        """Test callback behaviour with unsupported OAuth provider."""
        response = self.client.get("/auth/callback/unsupported?code=123")
        self.assertEqual(response.status_code, 400)

    def test_api_auth_demo_success(self):
        """Test successful demo OAuth endpoint."""
        db, _ = get_db()
        db.users.delete_many({"email": "demo_oauth@softrate.com"})
        
        payload = {
            "email": "demo_oauth@softrate.com",
            "provider": "Google"
        }
        response = self.client.post(
            "/api/auth/demo",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["user"]["email"], "demo_oauth@softrate.com")
        self.assertEqual(res_data["user"]["name"], "Demo_oauth")
        
        saved_user = db.users.find_one({"email": "demo_oauth@softrate.com", "record_type": "registration"})
        self.assertIsNotNone(saved_user)
        self.assertEqual(saved_user["oauth_provider"], "Google")

    def test_api_auth_demo_validation(self):
        """Test validation error in demo OAuth endpoint."""
        payload = {
            "email": "invalidemail",
            "provider": "Google"
        }
        response = self.client.post(
            "/api/auth/demo",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"valid email address", response.data)

if __name__ == "__main__":
    unittest.main()

