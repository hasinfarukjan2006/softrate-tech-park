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
        self.assertIn(b"Expense Report Generator", response.data)

    def test_per_diem_calculator_content(self):
        """Test if the Per Diem Calculator section is in the rendered landing page."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Per diem calculator", response.data)
        self.assertIn(b"2026 for USA", response.data)
        self.assertIn(b"Calculate your travel per diem rate", response.data)

    def test_per_diem_calculator_route(self):
        """Test if the /per-diem-calculator route renders successfully and serves the page."""
        response = self.client.get("/per-diem-calculator")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Per diem calculator", response.data)
        self.assertIn(b"2026 for USA", response.data)

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

    def test_save_gst_to_mongo(self):
        """Test saving GST calculation payload to MongoDB."""
        db, _ = get_db()
        created_at = "2026-06-08T15:00:00Z"
        db.gst_history.delete_many({"created_at": created_at})

        payload = {
            "amount": 1500,
            "gstRate": 18,
            "gstAmount": 270,
            "grandTotal": 1770,
            "created_at": created_at
        }

        response = self.client.post(
            "/save-gst",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertTrue(res_data["success"])
        self.assertEqual(res_data["message"], "GST saved")

        saved_gst = db.gst_history.find_one({"created_at": created_at})
        self.assertIsNotNone(saved_gst)
        self.assertEqual(saved_gst["gstAmount"], 270)
        self.assertEqual(saved_gst["grandTotal"], 1770)

    def test_save_expense_alias_to_mongo(self):
        """Test saving expense reports through the /save-expense alias."""
        db, _ = get_db()
        submitted_by = "Test Suite Alias Employee"
        db.expense_reports.delete_many({"submitted_by": submitted_by})

        payload = {
            "company_name": "Softrate Tech Park Pvt. Ltd.",
            "company_address": "123 Tech Park Avenue, Bangalore, India",
            "report_title": "Q2 Expense Claim Alias",
            "business_purpose": "Client Relations summit",
            "submitted_by": submitted_by,
            "submitted_date": "2026-06-08",
            "report_to": "Finance Director",
            "reporting_period": "June 2026",
            "expenses": [
                {
                    "date": "2026-06-07",
                    "description": "Travel flight ticket",
                    "merchant": "Air India",
                    "category": "Travel",
                    "amount": 4500.0
                }
            ],
            "total_amount": 4500.0,
            "created_at": "2026-06-08T15:05:00Z"
        }

        response = self.client.post(
            "/save-expense",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertTrue(res_data["success"])
        self.assertEqual(res_data["message"], "Expense report saved successfully")

        saved_report = db.expense_reports.find_one({"submitted_by": submitted_by})
        self.assertIsNotNone(saved_report)
        self.assertEqual(saved_report["report_title"], "Q2 Expense Claim Alias")
        self.assertEqual(saved_report["total_amount"], 4500.0)

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

    def test_save_expense_report(self):
        """Test saving expense reports to MongoDB via the new API endpoint."""
        db, _ = get_db()
        db.expense_reports.delete_many({"submitted_by": "Test Suite Employee"})

        payload = {
            "company_name": "Softrate Tech Park Pvt. Ltd.",
            "company_address": "123 Tech Park Avenue, Bangalore, India",
            "report_title": "Q2 Expense Claim",
            "business_purpose": "Client Relations summit",
            "submitted_by": "Test Suite Employee",
            "submitted_date": "2026-06-08",
            "report_to": "Finance Director",
            "reporting_period": "June 2026",
            "expenses": [
                {
                    "date": "2026-06-07",
                    "description": "Travel flight ticket",
                    "merchant": "Air India",
                    "category": "Travel",
                    "amount": 4500.0
                }
            ],
            "total_amount": 4500.0,
            "created_at": "2026-06-08T14:26:00Z"
        }

        response = self.client.post(
            "/api/save-expense-report",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_data = json.loads(response.data)
        self.assertTrue(res_data["success"])
        self.assertEqual(res_data["message"], "Expense report saved successfully")

        # Verify it exists in database
        saved_report = db.expense_reports.find_one({"submitted_by": "Test Suite Employee"})
        self.assertIsNotNone(saved_report)
        self.assertEqual(saved_report["report_title"], "Q2 Expense Claim")
        self.assertEqual(saved_report["total_amount"], 4500.0)

    def test_shipping_label_generator_route(self):
        """Test if the /shipping-label-generator route renders successfully and serves the page."""
        response = self.client.get("/shipping-label-generator")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Shipping Label Generator", response.data)

    def test_barcode_generator_route(self):
        """Test if the /barcode-generator route renders successfully and serves the page."""
        response = self.client.get("/barcode-generator")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Barcode Generator", response.data)

    def test_packing_slip_generator_route(self):
        """Test if the /packing-slip-generator route renders successfully and serves the page."""
        response = self.client.get("/packing-slip-generator")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Packing Slip Generator", response.data)

    def test_inventory_turnover_route(self):
        """Test if the /inventory-turnover route renders successfully and serves the page."""
        response = self.client.get("/inventory-turnover")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Inventory Turnover", response.data)
        self.assertIn(b"Calculate your Inventory Turnover", response.data)

    def test_reorder_point_route(self):
        """Test if the /reorder-point route renders successfully and serves the page."""
        response = self.client.get("/reorder-point")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Reorder point", response.data)
        self.assertIn(b"Calculate your reorder point", response.data)

    def test_purchase_order_generator_route(self):
        """Test if the /purchase-order-generator route renders successfully and serves the page."""
        response = self.client.get("/purchase-order-generator")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Purchase Order Generator", response.data)
        self.assertIn(b"Every field is editable.", response.data)

    def test_sku_generator_route(self):
        """Test if the /sku-generator route renders successfully and serves the page."""
        response = self.client.get("/sku-generator")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"SKU Generator", response.data)
        self.assertIn(b"Generate Product SKUs Instantly", response.data)

    def test_hra_exemption_calculator_route(self):
        """Test if the /hra-exemption-calculator route renders successfully and serves the page."""
        response = self.client.get("/hra-exemption-calculator")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"HRA Exemption", response.data)
        self.assertIn(b"Calculator", response.data)

    def test_statutory_bonus_calculator_route(self):
        """Test if the /statutory-bonus-calculator route renders successfully and serves the page."""
        response = self.client.get("/statutory-bonus-calculator")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Statutory Bonus", response.data)
        self.assertIn(b"Calculator", response.data)

    def test_gratuity_calculator_route(self):
        """Test if the /gratuity-calculator and /in/payroll/gratuity-calculator/ routes render successfully."""
        for path in ["/gratuity-calculator", "/in/payroll/gratuity-calculator/"]:
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"Gratuity Calculator", response.data)
            self.assertIn(b"Calculate your gratuity amount", response.data)

    def test_eps_calculator_route(self):
        """Test if the /eps-pension-calculator and /in/payroll/eps-pension-calculator/ routes render successfully."""
        for path in ["/eps-pension-calculator", "/in/payroll/eps-pension-calculator/"]:
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"EPS Pension Calculator", response.data)
            self.assertIn(b"Estimate your Employees", response.data)

    def test_nps_calculator_route(self):
        """Test if the /nps-calculator and /in/payroll/nps-calculator/ routes render successfully."""
        for path in ["/nps-calculator", "/in/payroll/nps-calculator/"]:
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"NPS Calculator", response.data)
            self.assertIn(b"Estimate your National Pension", response.data)

    def test_free_payslip_generator_route(self):
        """Test if the /free-payslip-generator and /in/payroll/free-payslip-generator/ routes render successfully."""
        for path in ["/free-payslip-generator", "/in/payroll/free-payslip-generator/"]:
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"Create Professional Employee Payslips Instantly", response.data)

    def test_form_w9_generator_route(self):
        """Test if the /form-w9-generator and /in/payroll/form-w9-generator/ routes render successfully."""
        for path in ["/form-w9-generator", "/in/payroll/form-w9-generator/"]:
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"Form W-9", response.data)
            self.assertIn(b"W-9 Form Generator", response.data)

    def test_project_estimate_calculator_route(self):
        """Test if the /free-project-estimate-calculator, /in/payroll/free-project-estimate-calculator/, and /project-cost routes render successfully."""
        for path in ["/free-project-estimate-calculator", "/in/payroll/free-project-estimate-calculator/", "/project-cost"]:
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"Free Project Cost Estimate Calculator", response.data)
            self.assertIn(b"Project Cost Estimator", response.data)

    def test_financial_report_generator_route(self):
        """Test if the /financial-report-generator and /in/payroll/financial-report-generator/ routes render successfully."""
        for path in ["/financial-report-generator", "/in/payroll/financial-report-generator/"]:
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"Free financial report", response.data)
            self.assertIn(b"Financial Report Details", response.data)

    def test_save_financial_report_api(self):
        """Test the save financial report API endpoint."""
        payload = {
            "report_type": "profit-loss",
            "company_name": "Test Company",
            "date_from": "2026-01-01",
            "date_to": "2026-12-31",
            "currency": "USD",
            "revenue": 100000,
            "cogs": 40000,
            "operating_expenses": 30000,
            "other_income": 5000,
            "taxes": 10000,
            "assets": 500000,
            "liabilities": 200000,
            "equity": 300000,
            "gross_profit": 60000,
            "net_profit": 25000
        }
        response = self.client.post("/api/save-financial-report", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["message"], "Financial report saved successfully")

    def test_paycheck_calculator_route(self):
        """Test if the /paycheck-calculator and /in/payroll/paycheck-calculator/ routes render successfully."""
        for path in ["/paycheck-calculator", "/in/payroll/paycheck-calculator/"]:
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"Paycheck Calculator", response.data)

if __name__ == "__main__":
    unittest.main()



