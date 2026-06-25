import datetime
from datetime import datetime
import os
from bson import ObjectId
from flask import Flask, jsonify, request, render_template, render_template_string, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from config import Config
from database import get_db

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app, resources={r"/*": {
    "origins": [
        "https://softrate-tech-park.netlify.app",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
}})
app.config.from_object(Config)

# Fetch database interface for fallback/application use
db_conn, using_fallback = get_db()

users = db_conn["users"]
gst_history = db_conn["gst_history"]
expense_reports = db_conn["expense_reports"]

if os.path.isdir(os.path.join(app.root_path, "dist")):
    DIST_DIR = os.path.join(app.root_path, "dist")
else:
    DIST_DIR = os.path.join(app.root_path, "../dist")

@app.route("/")
def home():
    return send_from_directory(DIST_DIR, "index.html")


@app.route("/<path:path>")
def serve_dist(path):
    file_path = os.path.join(DIST_DIR, path)
    if os.path.isfile(file_path):
        return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, "index.html")

@app.route("/signup")
def signup():
    """Render the Sign Up For Free Trial page."""
    return render_template("signup.html")

@app.route("/test-db")
def test_db():
    db_conn, using_fallback = get_db()
    if using_fallback:
        return jsonify({"error": "MongoDB connection failed, using fallback database"})
    try:
        db_conn.client.admin.command("ping")
        return jsonify({"message": "MongoDB Connected"})
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/api/calculate", methods=["POST"])
def calculate_gst():
    """
    POST endpoint to perform and store GST calculations.
    Expected JSON body:
    {
        "amount": float,
        "rate": float,
        "type": "inclusive" | "exclusive"
    }
    """
    data = request.get_json() or {}
    
    # Form Validation
    try:
        amount = float(data.get("amount", 0))
        rate = float(data.get("rate", 0))
        gst_type = data.get("type", "exclusive").lower()
        
        if amount <= 0:
            return jsonify({"status": "error", "message": "Amount must be a positive number."}), 400
        if rate < 0 or rate > 100:
            return jsonify({"status": "error", "message": "GST Rate must be between 0% and 100%."}), 400
        if gst_type not in ["inclusive", "exclusive"]:
            return jsonify({"status": "error", "message": "Invalid GST calculation type."}), 400
            
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid input formatting."}), 400

    # Calculation logic
    if gst_type == "exclusive":
        original_amount = amount
        gst_amount = original_amount * (rate / 100.0)
        total_amount = original_amount + gst_amount
    else: # inclusive
        total_amount = amount
        original_amount = total_amount / (1.0 + (rate / 100.0))
        gst_amount = total_amount - original_amount

    # Split logic (standard Indian GST rules)
    # CGST and SGST apply to intra-state transactions (half of total GST each)
    # IGST applies to inter-state transactions (equal to total GST)
    cgst = gst_amount / 2.0
    sgst = gst_amount / 2.0
    igst = gst_amount

    record = {
        "amount": round(original_amount, 2),
        "gst_rate": rate,
        "gst_type": gst_type,
        "gst_amount": round(gst_amount, 2),
        "final_amount": round(total_amount, 2),
        "timestamp": datetime.now()
    }
    
    try:
        gst_history.insert_one(record)
    except Exception as e:
        print(f"Error logging calculation to database: {e}")

    _, fallback_active = get_db()

    # Return calculated outputs formatted to 2 decimal places
    response_data = {
        "original_amount": round(original_amount, 2),
        "gst_rate": rate,
        "gst_type": gst_type,
        "gst_amount": round(gst_amount, 2),
        "cgst": round(cgst, 2),
        "sgst": round(sgst, 2),
        "igst": round(igst, 2),
        "total_amount": round(total_amount, 2),
        "timestamp": record["timestamp"].isoformat() if isinstance(record["timestamp"], datetime) else record["timestamp"]
    }

    return jsonify({
        "status": "success",
        "data": response_data,
        "using_fallback": fallback_active
    })

@app.route("/api/history", methods=["GET"])
def get_history():
    """Fetch the last 15 calculations from database."""
    _, fallback_active = get_db()
    try:
        history_cursor = gst_history.find().sort("timestamp", -1).limit(15)
        history_list = []
        for doc in history_cursor:
            # Format documentation
            doc_id = str(doc.get("_id"))
            history_list.append({
                "id": doc_id,
                "amount": doc.get("amount", 0.0),
                "gst_rate": doc.get("gst_rate", 0.0),
                "gst_type": doc.get("gst_type", "exclusive"),
                "gst_amount": doc.get("gst_amount", 0.0),
                "final_amount": doc.get("final_amount", 0.0),
                "timestamp": doc.get("timestamp")
            })
        return jsonify({
            "status": "success",
            "history": history_list,
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Could not retrieve history: {str(e)}"}), 500

@app.route("/api/history", methods=["DELETE"])
def clear_history():
    """Clear calculation history from database."""
    _, fallback_active = get_db()
    try:
        gst_history.delete_many({})
        return jsonify({
            "status": "success",
            "message": "Calculation history cleared successfully.",
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Could not clear history: {str(e)}"}), 500

@app.route("/api/gst-rates", methods=["GET"])
def get_gst_rates():
    """Retrieve official GST Rate Slabs from database."""
    db_conn, fallback_active = get_db()
    try:
        rates_cursor = db_conn.gst_rates.find()
        rates_list = []
        for doc in rates_cursor:
            rates_list.append({
                "rate": doc.get("rate"),
                "name": doc.get("name"),
                "description": doc.get("description")
            })
        # Sort rates by value
        rates_list = sorted(rates_list, key=lambda x: x["rate"])
        return jsonify({
            "status": "success",
            "rates": rates_list,
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Could not retrieve GST rates: {str(e)}"}), 500

@app.route("/api/contact", methods=["POST"])
def contact_form():
    """
    Handle contact submissions and save to users / contact collections.
    """
    db_conn, fallback_active = get_db()
    data = request.get_json() or {}
    
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    subject = data.get("subject", "").strip()
    message = data.get("message", "").strip()
    
    if not name or not email or not message:
        return jsonify({"status": "error", "message": "Name, email, and message are required fields."}), 400
        
    contact_record = {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message,
        "timestamp": datetime.now()
    }
    
    try:
        db_conn.users.insert_one(contact_record)
        return jsonify({
            "status": "success",
            "message": "Thank you for contacting Softrate. Your inquiry has been received.",
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to submit message: {str(e)}"}), 500

@app.route("/api/signup", methods=["POST"])
def api_signup():
    """POST endpoint to register a new user."""
    db_conn, fallback_active = get_db()
    data = request.get_json() or {}
    
    user_type = data.get("user_type", "").strip()
    company_name = data.get("company_name", "").strip()
    email = data.get("email", "").strip()
    mobile_number = data.get("mobile_number", "").strip()
    password = data.get("password", "").strip()
    country = data.get("country", "").strip()
    state = data.get("state", "").strip()
    terms_accepted = data.get("terms_accepted", False)
    
    if not all([user_type, company_name, email, mobile_number, password, country, state]):
        return jsonify({"status": "error", "message": "All fields are required."}), 400
        
    if not terms_accepted:
        return jsonify({"status": "error", "message": "You must accept the Terms of Service."}), 400
        
    try:
        existing = db_conn.users.find_one({"email": email, "record_type": "registration"})
        if existing:
            return jsonify({"status": "error", "message": "An account with this email address already exists."}), 400
    except Exception as e:
        print(f"Error checking existing user: {e}")
        
    from werkzeug.security import generate_password_hash
    hashed_password = generate_password_hash(password)
    
    user_record = {
        "record_type": "registration",
        "user_type": user_type,
        "company_name": company_name,
        "email": email,
        "mobile_number": mobile_number,
        "password": hashed_password,
        "country": country,
        "state": state,
        "timestamp": datetime.now()
    }
    
    try:
        db_conn.users.insert_one(user_record)
        return jsonify({
            "status": "success",
            "message": "Account created successfully!",
            "user": {
                "name": company_name,
                "email": email
            },
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to save user account: {str(e)}"}), 500


@app.route("/api/auth/demo", methods=["POST"])
def api_auth_demo():
    """Demo OAuth signup/login using email input directly for presentation purposes."""
    db_conn, fallback_active = get_db()
    data = request.get_json() or {}
    
    email = data.get("email", "").strip()
    provider = data.get("provider", "").strip()
    
    if not email or not provider:
        return jsonify({"status": "error", "message": "Email and provider are required."}), 400
        
    if "@" not in email:
        return jsonify({"status": "error", "message": "Please enter a valid email address."}), 400
        
    name = email.split("@")[0]
    
    try:
        existing = db_conn.users.find_one({"email": email, "record_type": "registration"})
        if not existing:
            user_record = {
                "record_type": "registration",
                "user_type": "Business User",
                "company_name": name.capitalize(),
                "email": email,
                "mobile_number": "",
                "password": "",
                "country": "India",
                "state": "General",
                "oauth_provider": provider,
                "timestamp": datetime.now()
            }
            db_conn.users.insert_one(user_record)
        else:
            name = existing.get("company_name", name)
            
        return jsonify({
            "status": "success",
            "message": f"Successfully signed in with {provider}!",
            "user": {
                "name": name.capitalize(),
                "email": email
            },
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to log in: {str(e)}"}), 500


@app.route("/api/auth/url/<provider>", methods=["GET"])
def api_auth_url(provider):
    """Generate registration OAuth redirect URL for the given provider."""
    provider = provider.lower()
    
    if provider == "google":
        client_id = app.config.get("GOOGLE_CLIENT_ID")
        client_secret = app.config.get("GOOGLE_CLIENT_SECRET")
        auth_base = "https://accounts.google.com/o/oauth2/v2/auth"
        scope = "openid email profile"
    elif provider == "microsoft":
        client_id = app.config.get("MICROSOFT_CLIENT_ID")
        client_secret = app.config.get("MICROSOFT_CLIENT_SECRET")
        auth_base = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
        scope = "openid email profile User.Read"
    elif provider == "linkedin":
        client_id = app.config.get("LINKEDIN_CLIENT_ID")
        client_secret = app.config.get("LINKEDIN_CLIENT_SECRET")
        auth_base = "https://www.linkedin.com/oauth/v2/authorization"
        scope = "openid email profile"
    else:
        return jsonify({"status": "error", "message": f"Unsupported OAuth provider: {provider}"}), 400
        
    if not client_id or not client_secret:
        return jsonify({"status": "error", "message": "OAuth not configured. Please add Client ID and Secret."}), 400
        
    import urllib.parse
    import secrets
    state = secrets.token_hex(16)
    redirect_uri = f"{request.scheme}://{request.host}/auth/callback/{provider}"
    
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": scope,
        "state": state
    }
    
    auth_url = f"{auth_base}?{urllib.parse.urlencode(params)}"
    return jsonify({"status": "success", "url": auth_url})


@app.route("/auth/callback/<provider>", methods=["GET"])
def auth_callback(provider):
    """Handle the OAuth provider redirection callback."""
    provider = provider.lower()
    code = request.args.get("code")
    error = request.args.get("error")
    error_desc = request.args.get("error_description")
    
    if error:
        err_msg = error_desc or error
        return render_template_string("""
            <script>
                localStorage.setItem("signupOAuthError", "OAuth Error: {{ error }}");
                window.location.href = "/signup";
            </script>
        """, error=err_msg)
        
    if not code:
        return render_template_string("""
            <script>
                localStorage.setItem("signupOAuthError", "Authorization code not returned.");
                window.location.href = "/signup";
            </script>
        """)

    if provider == "google":
        client_id = app.config.get("GOOGLE_CLIENT_ID")
        client_secret = app.config.get("GOOGLE_CLIENT_SECRET")
        token_url = "https://oauth2.googleapis.com/token"
        userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    elif provider == "microsoft":
        client_id = app.config.get("MICROSOFT_CLIENT_ID")
        client_secret = app.config.get("MICROSOFT_CLIENT_SECRET")
        token_url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
        userinfo_url = "https://graph.microsoft.com/v1.0/me"
    elif provider == "linkedin":
        client_id = app.config.get("LINKEDIN_CLIENT_ID")
        client_secret = app.config.get("LINKEDIN_CLIENT_SECRET")
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        userinfo_url = "https://api.linkedin.com/v2/userinfo"
    else:
        return "Unsupported OAuth provider", 400

    if not client_id or not client_secret:
        return "OAuth client not configured", 400

    import urllib.request
    import urllib.parse
    import json
    
    redirect_uri = f"{request.scheme}://{request.host}/auth/callback/{provider}"
    
    token_payload = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }
    
    try:
        data = urllib.parse.urlencode(token_payload).encode("utf-8")
        req = urllib.request.Request(token_url, data=data)
        req.add_header("Content-Type", "application/x-www-form-urlencoded")
        
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            access_token = res_data.get("access_token")
    except Exception as e:
        print(f"Error exchanging token: {e}")
        return render_template_string("""
            <script>
                localStorage.setItem("signupOAuthError", "Failed to exchange authorization token.");
                window.location.href = "/signup";
            </script>
        """)

    if not access_token:
        return render_template_string("""
            <script>
                localStorage.setItem("signupOAuthError", "Access token was not returned by the auth server.");
                window.location.href = "/signup";
            </script>
        """)

    try:
        req = urllib.request.Request(userinfo_url)
        req.add_header("Authorization", f"Bearer {access_token}")
        
        with urllib.request.urlopen(req) as response:
            profile = json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return render_template_string("""
            <script>
                localStorage.setItem("signupOAuthError", "Failed to fetch user profile details.");
                window.location.href = "/signup";
            </script>
        """)

    email = None
    name = None
    
    if provider == "google":
        email = profile.get("email")
        name = profile.get("name")
    elif provider == "microsoft":
        email = profile.get("mail") or profile.get("userPrincipalName")
        name = profile.get("displayName")
    elif provider == "linkedin":
        email = profile.get("email")
        name = profile.get("name") or f"{profile.get('given_name', '')} {profile.get('family_name', '')}".strip() or profile.get("localizedLastName")
        
    if not email:
        return render_template_string("""
            <script>
                localStorage.setItem("signupOAuthError", "Could not fetch email from your profile.");
                window.location.href = "/signup";
            </script>
        """)

    if not name:
        name = email.split("@")[0]

    db_conn, fallback_active = get_db()
    try:
        existing = db_conn.users.find_one({"email": email, "record_type": "registration"})
        if not existing:
            user_record = {
                "record_type": "registration",
                "user_type": "Business User",
                "company_name": name,
                "email": email,
                "mobile_number": "",
                "password": "",
                "country": "India",
                "state": "General",
                "oauth_provider": provider,
                "timestamp": datetime.now()
            }
            db_conn.users.insert_one(user_record)
        else:
            name = existing.get("company_name", name)
    except Exception as e:
        print(f"Error saving OAuth user: {e}")
        return render_template_string("""
            <script>
                localStorage.setItem("signupOAuthError", "Database error logging user in.");
                window.location.href = "/signup";
            </script>
        """)

    return render_template_string("""
        <script>
            localStorage.setItem("sessionUserName", "{{ name }}");
            localStorage.setItem("sessionUserEmail", "{{ email }}");
            window.location.href = "/";
        </script>
    """, name=name, email=email)


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    print("Register data:", data)

    users.insert_one(data)

    return jsonify({"success": True, "message": "User saved"})

@app.route('/save-gst', methods=['POST'])
def save_gst():
    data = request.json or {}
    print("GST DATA RECEIVED:", data)
    try:
        gst_history.insert_one(data)
        return jsonify({
            "success": True,
            "message": "GST saved"
        })
    except Exception as e:
        print(f"Error saving GST to database: {e}")
        return jsonify({
            "success": False,
            "message": f"Database insertion failed: {str(e)}"
        }), 500
def fix_id(data):
    for item in data:
        item["_id"] = str(item["_id"])
    return data

@app.route("/api/gst-history", methods=["GET"])
def get_gst_history():
    data = list(gst_history.find())
    return jsonify(fix_id(data))


@app.route("/save-expense", methods=["POST"])
@app.route("/api/save-expense-report", methods=["POST"])
def save_expense_report():
    data = request.json or {}
    try:
        db_conn, fallback_active = get_db()
        db_conn.expense_reports.insert_one(data)
        return jsonify({
            "success": True,
            "message": "Expense report saved successfully"
        })
    except Exception as e:
        print(f"Error saving expense report: {e}")
        return jsonify({
            "success": False,
            "message": f"Database insertion failed: {str(e)}"
        }), 500


# Wholesale Price Calculator page
@app.route("/wholesale-price")
def wholesale_price_page():
    """Render the Wholesale Price Calculator page inside the main SPA."""
    return render_template("index.html")

# Shipping Label Generator page
@app.route("/shipping-label-generator")
def shipping_label_generator_page():
    """Render the Shipping Label Generator page inside the main SPA."""
    return render_template("index.html")

# Barcode Generator page
@app.route("/barcode-generator")
def barcode_generator_page():
    """Render the Barcode Generator page inside the main SPA."""
    return render_template("index.html")

# Packing Slip Generator page
@app.route("/packing-slip-generator")
def packing_slip_generator_page():
    """Render the Packing Slip Generator page inside the main SPA."""
    return render_template("index.html")

# Inventory Turnover Ratio Calculator page
@app.route("/inventory-turnover")
def inventory_turnover_page():
    """Render the Inventory Turnover Ratio Calculator page inside the main SPA."""
    return render_template("index.html")

# Purchase Order Generator page
@app.route("/purchase-order-generator")
def purchase_order_generator_page():
    """Render the Purchase Order Generator page inside the main SPA."""
    return render_template("index.html")

# SKU Generator page
@app.route("/sku-generator")
def sku_generator_page():
    """Render the SKU Generator page inside the main SPA."""
    return render_template("index.html")

# HRA Exemption Calculator page
@app.route("/hra-exemption-calculator")
def hra_exemption_calculator_page():
    """Render the HRA Exemption Calculator page inside the main SPA."""
    return render_template("index.html")

# Statutory Bonus Calculator page
@app.route("/statutory-bonus-calculator")
def statutory_bonus_calculator_page():
    """Render the Statutory Bonus Calculator page inside the main SPA."""
    return render_template("index.html")

# Gratuity Calculator page
@app.route("/in/payroll/gratuity-calculator/")
@app.route("/gratuity-calculator")
def gratuity_calculator_page():
    """Render the Gratuity Calculator page inside the main SPA."""
    return render_template("index.html")

# EPS Pension Calculator page
@app.route("/in/payroll/eps-pension-calculator/")
@app.route("/eps-pension-calculator")
def eps_pension_calculator_page():
    """Render the EPS Pension Calculator page inside the main SPA."""
    return render_template("index.html")


# NPS Calculator page
@app.route("/in/payroll/nps-calculator/")
@app.route("/nps-calculator")
def nps_calculator_page():
    """Render the NPS Calculator page inside the main SPA."""
    return render_template("index.html")


# Form W-9 Generator page
@app.route("/in/payroll/form-w9-generator/")
@app.route("/form-w9-generator")
def form_w9_generator_page():
    """Render the Form W-9 Generator page inside the main SPA."""
    return render_template("index.html")

# Free Project Cost Estimate Calculator page
@app.route("/free-project-estimate-calculator")
@app.route("/in/payroll/free-project-estimate-calculator/")
def free_project_estimate_calculator_page():
    """Render the Free Project Cost Estimate Calculator page inside the main SPA."""
    return render_template("index.html")

@app.route("/api/save-project-estimate", methods=["POST"])
def save_project_estimate():
    """POST endpoint to save project cost estimate calculations."""
    db_conn, fallback_active = get_db()
    data = request.get_json() or {}
    try:
        db_conn.project_estimate_history.insert_one(data)
        if "_id" in data:
            data["_id"] = str(data["_id"])
        return jsonify({
            "status": "success",
            "message": "Project cost estimate saved successfully",
            "using_fallback": fallback_active
        })
    except Exception as e:
        print(f"Error saving project estimate: {e}")
        return jsonify({"status": "error", "message": f"Database insertion failed: {str(e)}"}), 500


# Financial Report Generator page
@app.route("/financial-report-generator")
@app.route("/in/payroll/financial-report-generator/")
def financial_report_generator_page():
    """Render the Financial Report Generator page inside the main SPA."""
    return render_template("index.html")

@app.route("/api/save-financial-report", methods=["POST"])
def save_financial_report():
    """POST endpoint to save financial report calculations."""
    db_conn, fallback_active = get_db()
    data = request.get_json() or {}
    try:
        db_conn.financial_report_history.insert_one(data)
        if "_id" in data:
            data["_id"] = str(data["_id"])
        return jsonify({
            "status": "success",
            "message": "Financial report saved successfully",
            "using_fallback": fallback_active
        })
    except Exception as e:
        print(f"Error saving financial report: {e}")
        return jsonify({"status": "error", "message": f"Database insertion failed: {str(e)}"}), 500


# Uk Vat page
@app.route("/uk-vat-calculator")
@app.route("/in/payroll/uk-vat-calculator/")
def uk_vat_calculator_page():
    return render_template("index.html")


# Uae Vat page
@app.route("/uae-vat-calculator")
@app.route("/in/payroll/uae-vat-calculator/")
def uae_vat_calculator_page():
    return render_template("index.html")


# Uk Flat page
@app.route("/uk-flat-rate-vat-calculator")
@app.route("/in/payroll/uk-flat-rate-vat-calculator/")
def uk_flat_rate_vat_calculator_page():
    return render_template("index.html")


# Invoice page
@app.route("/invoice-generator")
@app.route("/in/payroll/invoice-generator/")
def invoice_generator_page():
    return render_template("index.html")


# Quote page
@app.route("/quote-generator")
@app.route("/in/payroll/quote-generator/")
def quote_generator_page():
    return render_template("index.html")


# Receipts page
@app.route("/receipt-generator")
@app.route("/in/payroll/receipt-generator/")
def receipt_generator_page():
    return render_template("index.html")


# Forecaster page
@app.route("/revenue-forecaster")
@app.route("/in/payroll/revenue-forecaster/")
def revenue_forecaster_page():
    return render_template("index.html")

# UK Corporation Tax Calculator page
@app.route("/uk-corp-tax-calculator")
@app.route("/in/payroll/uk-corp-tax-calculator/")
def uk_corp_tax_page():
    return render_template("index.html")

# HMRC Furlough Claim Calculator page
@app.route("/hmrc-furlough-calculator")
@app.route("/in/payroll/hmrc-furlough-calculator/")
def hmrc_furlough_page():
    return render_template("index.html")

# Income Tax Calculator page
@app.route("/income-tax-calculator")
@app.route("/in/payroll/income-tax-calculator/")
def income_tax_calculator_page():
    """Render the Income Tax Calculator page inside the main SPA."""
    return render_template("index.html")

# Paycheck Calculator page
@app.route("/paycheck-calculator")
@app.route("/in/payroll/paycheck-calculator/")
def paycheck_calculator_page():
    """Render the Paycheck Calculator page inside the main SPA."""
    return render_template("index.html")




@app.route("/api/wholesale-price", methods=["POST"])
def api_wholesale_price():
    """Calculate and store wholesale price data.
    Expected JSON:
    {
        "cost_price_per_unit": float,
        "overhead_expenses": float,
        "administrative_cost": float,
        "number_of_units": int,
        "profit_margin": float
    }
    """
    data = request.get_json() or {}
    try:
        cost = float(data.get("cost_price_per_unit", 0))
        overhead = float(data.get("overhead_expenses", 0))
        admin = float(data.get("administrative_cost", 0))
        units = int(data.get("number_of_units", 1))
        profit = float(data.get("profit_margin", 0))
        if cost < 0 or overhead < 0 or admin < 0 or units <= 0 or profit < 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid input values."}), 400

    total_cost = (cost + overhead + admin) * units
    wholesale_price = total_cost * (1 + profit / 100.0)

    record = {
        "cost_price_per_unit": cost,
        "overhead_expenses": overhead,
        "administrative_cost": admin,
        "number_of_units": units,
        "total_cost_price": round(total_cost, 2),
        "profit_margin": profit,
        "wholesale_price": round(wholesale_price, 2),
        "created_at": datetime.now()
    }
    try:
        db_conn, _ = get_db()
        db_conn.wholesale_price_history.insert_one(record)
        if "_id" in record:
            record["_id"] = str(record["_id"])
        if "created_at" in record:
            record["created_at"] = record["created_at"].isoformat()
    except Exception as e:
        print(f"Error saving wholesale price: {e}")
    return jsonify({"status": "success", "data": record})

# ==================================================
# GLOBAL SEO OPTIMIZATION - METADATA & SCHEMA GENERATION
# ==================================================

import json
from flask import request

SEO_METADATA = {
    "/": {
        "title": "India GST Calculator | Softrate Finance Tools",
        "description": "Calculate CGST, SGST, and IGST in real-time with the Softrate India GST Calculator. Learn how GST applies to inclusive and exclusive values.",
        "keywords": "gst calculator, gst tax calculator, india gst calculator, tax calculation",
        "canonical": "/",
        "category": "Accounting",
        "faq": [
            {"q": "What is India GST?", "a": "GST (Goods and Services Tax) is an indirect tax levied in India on the supply of goods and services. It is divided into CGST, SGST, and IGST depending on state transactions."},
            {"q": "How is GST calculated?", "a": "For exclusive GST, multiply the base amount by the GST rate (e.g., 18%). For inclusive GST, divide the total amount by (1 + GST rate) to retrieve the base cost."}
        ]
    },
    "/invoice-generator": {
        "title": "Invoice Generator | Softrate Finance Tools",
        "description": "Create professional invoices online with Softrate Invoice Generator. Customize templates, calculate taxes, and download print-ready PDFs.",
        "keywords": "invoice generator, gst invoice, billing software, invoice maker, tax invoice, online invoice",
        "canonical": "/invoice-generator",
        "category": "Billing",
        "faq": [
            {"q": "Can I download receipts as PDF?", "a": "Yes, you can generate and download print-ready PDF invoices directly to your device."},
            {"q": "Can I add taxes automatically?", "a": "Yes, our tool computes CGST, SGST, IGST, and cess automatically based on the selected tax rates."}
        ]
    },
    "/quote-generator": {
        "title": "Quote Generator | Softrate Finance Tools",
        "description": "Generate professional quotes and estimates instantly with Softrate Quote Generator. Manage client billing templates with real-time tax calculations.",
        "keywords": "quote generator, billing tools, financial software, estimate maker, invoice quote",
        "canonical": "/quote-generator",
        "category": "Billing",
        "faq": [
            {"q": "Can I convert quotes to invoices?", "a": "Yes, you can easily copy estimate parameters over to the Invoice Generator for formal billing."}
        ]
    },
    "/receipt-generator": {
        "title": "Receipt Generator | Softrate Finance Tools",
        "description": "Create and download professional transaction receipts using Softrate Receipt Generator. Ideal for bookkeeping, tracking payments, and audits.",
        "keywords": "receipt generator, proof of payment, transaction records, cash receipt, digital receipt",
        "canonical": "/receipt-generator",
        "category": "Billing",
        "faq": [
            {"q": "Can I print receipts directly?", "a": "Yes, click the print action button to open your browser's native print interface instantly."}
        ]
    },
    "/revenue-forecaster": {
        "title": "Revenue Forecaster | Softrate Finance Tools",
        "description": "Project your monthly recurring revenue growth and CAGR with the Softrate Revenue Forecaster. Compare growth paths against customer churn rates.",
        "keywords": "revenue forecasting, business forecast, financial planning, growth prediction, mrr forecaster",
        "canonical": "/revenue-forecaster",
        "category": "Billing",
        "faq": [
            {"q": "Why do I need a revenue forecaster tool?", "a": "A revenue forecaster helps predict future recurring revenue, budgets, and operational growth vectors."},
            {"q": "How accurate are revenue forecasts?", "a": "Projections are mathematical estimations based on current parameters. Actual outcomes can vary based on market shifts."}
        ]
    },
    "/uk-vat-calculator": {
        "title": "UK VAT Calculator | Softrate Finance Tools",
        "description": "Calculate UK Value Added Tax easily with Softrate UK VAT Calculator. Supports Standard and Reduced VAT rates for corporate billing.",
        "keywords": "uk vat calculator, value added tax, vat calculation, uk tax tools",
        "canonical": "/uk-vat-calculator",
        "category": "Accounting"
    },
    "/uae-vat-calculator": {
        "title": "UAE VAT Calculator | Softrate Finance Tools",
        "description": "Compute UAE VAT in compliance with Federal Tax Authority guidelines. Softrate UAE VAT Calculator simplifies standard 5% tax calculations.",
        "keywords": "uae vat calculator, fta vat, uae tax calculator, middle east tax",
        "canonical": "/uae-vat-calculator",
        "category": "Accounting"
    },
    "/uk-flat-rate-vat-calculator": {
        "title": "UK Flat Rate Calculator | Softrate Finance Tools",
        "description": "Project savings under the UK Flat Rate VAT scheme using the Softrate UK Flat Rate Calculator. Ideal for UK small businesses and contractors.",
        "keywords": "uk flat rate calculator, flat rate vat, small business tax, uk tax scheme",
        "canonical": "/uk-flat-rate-vat-calculator",
        "category": "Accounting"
    },
    "/uk-corp-tax-calculator": {
        "title": "UK Corporation Tax Calculator | Softrate Finance Tools",
        "description": "Estimate UK corporation tax liabilities based on profits with Softrate UK Corporation Tax Calculator. Plan corporate tax schedules.",
        "keywords": "uk corporation tax calculator, corp tax uk, business tax calculation",
        "canonical": "/uk-corp-tax-calculator",
        "category": "Accounting"
    },
    "/hmrc-furlough-calculator": {
        "title": "HMRC Furlough Claim Calculator | Softrate Finance Tools",
        "description": "Calculate government wage support grants under Coronavirus Job Retention Scheme rules with the Softrate HMRC Furlough Claim Calculator.",
        "keywords": "hmrc furlough claim calculator, cjrs furlough, wage grant calculator",
        "canonical": "/hmrc-furlough-calculator",
        "category": "Accounting"
    },
    "/income-tax-calculator": {
        "title": "Income Tax Calculator | Softrate Finance Tools",
        "description": "Project personal income tax liabilities, standard deductions, and net payouts using the Softrate Income Tax Calculator.",
        "keywords": "income tax calculator, salary tax calculator, tax deduction planner",
        "canonical": "/income-tax-calculator",
        "category": "Accounting"
    },
    "/financial-report-generator": {
        "title": "Financial Report Templates | Softrate Finance Tools",
        "description": "Generate and download balance sheets and cash flow reports with Softrate Financial Report Templates. Standardize financial filings.",
        "keywords": "financial reports, balance sheet template, cash flow generator",
        "canonical": "/financial-report-generator",
        "category": "Accounting"
    },
    "/free-project-estimate-calculator": {
        "title": "Free Project Cost Estimate Calculator | Softrate Finance Tools",
        "description": "Calculate project cost estimations, resource costs, and profit margins. softrate Project Cost Calculator simplifies budget drafts.",
        "keywords": "project cost calculator, cost estimation tool, resource budget planner",
        "canonical": "/free-project-estimate-calculator",
        "category": "Accounting"
    },
    "/form-w9-generator": {
        "title": "Form W9 Generator | Softrate Finance Tools",
        "description": "Create and download W-9 forms securely with the Softrate W-9 Generator. Easily request Taxpayer Identification Numbers (TINs) online.",
        "keywords": "form w9 generator, request tin, irs tax forms, w-9 creator",
        "canonical": "/form-w9-generator",
        "category": "Accounting"
    },
    "/expense-report-generator": {
        "title": "Expense Report Generator | Softrate Finance Tools",
        "description": "Record business expenses, capture mileage costs, and export claims with the Softrate Expense Report Generator.",
        "keywords": "expense report generator, track expenses, reimbursement claim creator",
        "canonical": "/expense-report-generator",
        "category": "Expense"
    },
    "/per-diem-calculator": {
        "title": "Expense Report Template | Softrate Finance Tools",
        "description": "Plan standard business trip expenses and per-diem allowances with the Softrate Per-Diem Calculator.",
        "keywords": "expense report template, per diem allowance, travel reimbursement",
        "canonical": "/per-diem-calculator",
        "category": "Expense"
    },
    "/sku-generator": {
        "title": "SKU Generator | Softrate Finance Tools",
        "description": "Create structured Stock Keeping Unit codes for your catalog items with Softrate SKU Generator. Organize inventory databases.",
        "keywords": "sku generator, stock keeping unit creator, inventory codes",
        "canonical": "/sku-generator",
        "category": "Inventory"
    },
    "/purchase-order-generator": {
        "title": "Purchase Order Generator | Softrate Finance Tools",
        "description": "Draft professional purchase orders instantly with Softrate Purchase Order Generator. Send formatted PO PDFs to vendors.",
        "keywords": "purchase order generator, buy orders, vendor billing software",
        "canonical": "/purchase-order-generator",
        "category": "Inventory"
    },
    "/reorder-point": {
        "title": "Reorder Point Calculator | Softrate Finance Tools",
        "description": "Calculate optimal stock reorder thresholds based on lead time and safety stocks using the Softrate Reorder Point Calculator.",
        "keywords": "reorder point calculator, stock replenishing thresholds, lead time safety",
        "canonical": "/reorder-point",
        "category": "Inventory"
    },
    "/economic-order-quantity": {
        "title": "Economic Order Quantity Calculator | Softrate Finance Tools",
        "description": "Find the cost-optimal ordering volume with Softrate Economic Order Quantity (EOQ) Calculator. Maximize warehouse budget efficiency.",
        "keywords": "economic order quantity calculator, eoq calculator, inventory optimization, stock planning",
        "canonical": "/economic-order-quantity",
        "category": "Inventory",
        "faq": [
            {"q": "What is Economic Order Quantity?", "a": "Economic Order Quantity (EOQ) is the optimal order quantity that minimizes total inventory holding and ordering costs."}
        ]
    },
    "/break-even-point": {
        "title": "Break-Even Point Calculator | Softrate Finance Tools",
        "description": "Calculate the break-even volume and pricing thresholds for your products with the Softrate Break-Even Point Calculator.",
        "keywords": "break-even point calculator, find break even, cost volume profit analysis",
        "canonical": "/break-even-point",
        "category": "Inventory",
        "faq": [
            {"q": "How is Break-Even calculated?", "a": "Break-even point is calculated by dividing fixed costs by the difference between unit price and unit variable cost."}
        ]
    },
    "/inventory-turnover": {
        "title": "Inventory Turnover Ratio Calculator | Softrate Finance Tools",
        "description": "Evaluate stock liquidity and cost of goods sold efficiency with the Softrate Inventory Turnover Ratio Calculator.",
        "keywords": "inventory turnover ratio calculator, evaluate stock liquidity, cogs efficiency",
        "canonical": "/inventory-turnover",
        "category": "Inventory"
    },
    "/packing-slip-generator": {
        "title": "Packing Slip Generator | Softrate Finance Tools",
        "description": "Generate and print professional shipment packaging slips with Softrate Packing Slip Generator. Streamline warehousing.",
        "keywords": "packing slip generator, shipping labels, packaging invoices",
        "canonical": "/packing-slip-generator",
        "category": "Inventory"
    },
    "/barcode-generator": {
        "title": "Barcode Generator | Softrate Finance Tools",
        "description": "Create Code128, EAN, or UPC barcodes online with Softrate Barcode Generator. Export labels as high-resolution PNGs.",
        "keywords": "barcode generator, create code128, barcode maker, print barcode",
        "canonical": "/barcode-generator",
        "category": "Inventory"
    },
    "/shipping-label-generator": {
        "title": "Shipping Label Generator | Softrate Finance Tools",
        "description": "Create standard warehouse shipping labels with Softrate Shipping Label Generator. Fast delivery slip layout creator.",
        "keywords": "shipping label generator, print shipping slips, postage layout builder",
        "canonical": "/shipping-label-generator",
        "category": "Inventory"
    },
    "/wholesale-price": {
        "title": "Wholesale Price Calculator | Softrate Finance Tools",
        "description": "Compute wholesale prices, markup values, and recommended retail prices (RRPs) with the Softrate Wholesale Price Calculator.",
        "keywords": "wholesale price calculator, markup pricing tool, retail margins",
        "canonical": "/wholesale-price",
        "category": "Inventory"
    },
    "/free-payslip-generator": {
        "title": "Payslip Generator | Softrate Finance Tools",
        "description": "Create professional salary payslips with tax splits and allowances. Softrate Payslip Generator outputs print-ready PDFs.",
        "keywords": "payslip generator, salary slips, payroll billing tool",
        "canonical": "/free-payslip-generator",
        "category": "Payroll",
        "faq": [
            {"q": "What details go into a payslip?", "a": "A payslip includes base pay, standard deductions, HRA allocations, pension cuts, and net home pay splits."}
        ]
    },
    "/paycheck-calculator": {
        "title": "Paycheck Calculator | Softrate Finance Tools",
        "description": "Estimate take-home pay, federal/state withholdings, and payroll deductions with the Softrate Paycheck Calculator.",
        "keywords": "paycheck calculator, take home pay calculator, net pay estimator",
        "canonical": "/paycheck-calculator",
        "category": "Payroll"
    },
    "/gratuity-calculator": {
        "title": "Gratuity Calculator | Softrate Finance Tools",
        "description": "Estimate corporate gratuity payouts under retirement benefits acts with the Softrate Gratuity Calculator.",
        "keywords": "gratuity calculator, retirement benefits act estimation",
        "canonical": "/gratuity-calculator",
        "category": "Payroll"
    },
    "/statutory-bonus-calculator": {
        "title": "Statutory Bonus Calculator | Softrate Finance Tools",
        "description": "Compute statutory employee bonus allocations in line with payroll regulations using the Statutory Bonus Calculator.",
        "keywords": "statutory bonus calculator, payroll bonus allocator",
        "canonical": "/statutory-bonus-calculator",
        "category": "Payroll"
    },
    "/hra-exemption-calculator": {
        "title": "HRA Exemption Calculator | Softrate Finance Tools",
        "description": "Optimize tax savings on house rent allowances with the Softrate House Rent Allowance (HRA) Exemption Calculator.",
        "keywords": "hra exemption calculator, tax savings on rent, allowance deduction calculator",
        "canonical": "/hra-exemption-calculator",
        "category": "Payroll"
    },
    "/eps-pension-calculator": {
        "title": "EPS Pension Calculator | Softrate Finance Tools",
        "description": "Estimate monthly employee pension scheme payouts on retirement with the Softrate EPS Pension Calculator.",
        "keywords": "eps pension calculator, employee pension scheme retirement",
        "canonical": "/eps-pension-calculator",
        "category": "Payroll"
    },
    "/nps-calculator": {
        "title": "NPS Calculator | Softrate Finance Tools",
        "description": "Calculate compound returns and annuity allocations under the National Pension System with the Softrate NPS Calculator.",
        "keywords": "nps calculator, national pension system compound returns",
        "canonical": "/nps-calculator",
        "category": "Payroll"
    },
    "/about-us": {
        "title": "About Us | Softrate Finance Platform",
        "description": "Learn more about Softrate Tech Park Pvt Ltd, our vision, and our mission to provide smart enterprise finance tools and billing systems.",
        "keywords": "about softrate, finance park, billing software mission",
        "canonical": "/about-us",
        "category": "Trust"
    },
    "/contact-us": {
        "title": "Contact Us | Softrate Finance Platform",
        "description": "Get in touch with the support team at Softrate Tech Park Pvt Ltd. Reach out via email or phone for inquiry help.",
        "keywords": "contact softrate, customer support, billing platform helpline",
        "canonical": "/contact-us",
        "category": "Trust"
    },
    "/privacy-policy": {
        "title": "Privacy Policy | Softrate Finance Platform",
        "description": "Read the Privacy Policy of Softrate Tech Park Pvt Ltd. Understand how we protect your personal and corporate finance data.",
        "keywords": "privacy policy, data protection, data privacy policy",
        "canonical": "/privacy-policy",
        "category": "Trust"
    },
    "/terms-conditions": {
        "title": "Terms & Conditions | Softrate Finance Platform",
        "description": "Read the terms of use and conditions governing the Softrate Business Finance software portal.",
        "keywords": "terms and conditions, user agreement, licensing terms",
        "canonical": "/terms-conditions",
        "category": "Trust"
    },
    "/disclaimer": {
        "title": "Disclaimer | Softrate Finance Platform",
        "description": "Financial disclaimer statement for calculations and projections made on the Softrate calculator tools.",
        "keywords": "disclaimer, calculator accuracy, financial advice disclaimer",
        "canonical": "/disclaimer",
        "category": "Trust"
    },
    "/sitemap": {
        "title": "Sitemap | Softrate Finance Platform",
        "description": "Table of links containing every calculator, billing generator, and corporate page inside the Softrate site directory.",
        "keywords": "sitemap, website directory, navigation checklist",
        "canonical": "/sitemap",
        "category": "Trust"
    }
}

def normalize_seo_path(path):
    p = path.strip("/")
    if p.startswith("in/payroll/"):
        p = p[len("in/payroll/"):]
    elif p.startswith("in/payroll"):
        p = p[len("in/payroll"):]
    p = p.strip("/")
    
    if p == "per-diem-calculator":
        p = "per-diem-calculator"
    elif p == "wholesale-price":
        p = "wholesale-price"
    elif p == "free-payslip-generator" or p == "free-payslip-generator/":
        p = "free-payslip-generator"
    elif p == "":
        return "/"
    
    return "/" + p

@app.context_processor
def inject_seo():
    path = normalize_seo_path(request.path)
    meta = SEO_METADATA.get(path)
    if not meta:
        meta = {
            "title": "Softrate Tech Park Pvt Ltd | Smart Business Finance Solutions",
            "description": "Softrate Tech Park offers smart business finance solutions, calculators, invoice generators, and payroll systems for enterprises.",
            "keywords": "finance tools, calculators, billing, invoice generator, gst, vat",
            "canonical": "/",
            "category": "Home"
        }
    
    base_url = "https://softrate-tech-park.netlify.app"
    full_canonical = base_url + meta["canonical"]
    
    graphs = []
    graphs.append({
        "@type": "Organization",
        "@id": base_url + "/#organization",
        "name": "Softrate Tech Park Pvt Ltd",
        "url": base_url + "/",
        "logo": base_url + "/static/images/logo.png",
        "email": "support@softrate.com",
        "sameAs": [
            "https://www.facebook.com/softrate",
            "https://twitter.com/softrate",
            "https://www.linkedin.com/company/softrate",
            "https://www.instagram.com/softrate"
        ]
    })
    
    graphs.append({
        "@type": "WebSite",
        "@id": base_url + "/#website",
        "url": base_url + "/",
        "name": "Softrate Finance Tools",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": base_url + "/?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    })
    
    graphs.append({
        "@type": "LocalBusiness",
        "@id": base_url + "/#localbusiness",
        "name": "Softrate Tech Park Pvt Ltd",
        "image": base_url + "/static/images/logo.png",
        "email": "support@softrate.com",
        "telephone": "+918000000000",
        "url": base_url + "/"
    })
    
    breadcrumb_elements = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": base_url + "/"
        }
    ]
    if meta["canonical"] != "/":
        breadcrumb_elements.append({
            "@type": "ListItem",
            "position": 2,
            "name": meta["category"],
            "item": base_url + meta["canonical"]
        })
        breadcrumb_elements.append({
            "@type": "ListItem",
            "position": 3,
            "name": meta["title"].split("|")[0].strip(),
            "item": base_url + meta["canonical"]
        })
    
    graphs.append({
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumb_elements
    })
    
    if meta["category"] in ["Billing", "Accounting", "Expense", "Inventory", "Payroll"] or meta["canonical"] == "/":
        graphs.append({
            "@type": "SoftwareApplication",
            "name": "Softrate " + meta["title"].split("|")[0].strip(),
            "operatingSystem": "All",
            "applicationCategory": "FinanceApplication",
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "description": meta["description"],
            "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD"
            }
        })
        
    if "faq" in meta:
        faq_entities = []
        for item in meta["faq"]:
            faq_entities.append({
                "@type": "Question",
                "name": item["q"],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item["a"]
                }
            })
        graphs.append({
            "@type": "FAQPage",
            "mainEntity": faq_entities
        })
        
    schema_graph = {
        "@context": "https://schema.org",
        "@graph": graphs
    }
    
    seo_data = {
        "title": meta["title"],
        "description": meta["description"],
        "keywords": meta["keywords"],
        "canonical": full_canonical,
        "image": base_url + "/static/images/logo.png",
        "schema_json": json.dumps(schema_graph)
    }
    
    return dict(seo=seo_data)

# Additional explicit calculator GET routes
@app.route("/per-diem-calculator")
def per_diem_calculator_page():
    return render_template("index.html")

@app.route("/expense-report-generator")
def expense_report_generator_page():
    return render_template("index.html")

@app.route("/free-payslip-generator")
def free_payslip_generator_page_alias():
    return render_template("index.html")

# Trust Pages Routes
@app.route("/about-us")
def about_us_page():
    return render_template("index.html")

@app.route("/contact-us")
def contact_us_page():
    return render_template("index.html")

@app.route("/privacy-policy")
def privacy_policy_page():
    return render_template("index.html")

@app.route("/terms-conditions")
def terms_conditions_page():
    return render_template("index.html")

@app.route("/disclaimer")
def disclaimer_page():
    return render_template("index.html")

@app.route("/sitemap")
def sitemap_page():
    return render_template("index.html")

# Sitemap.xml & Robots.txt Routes
from flask import Response

@app.route("/robots.txt")
def robots_txt():
    content = "User-agent: *\nAllow: /\nSitemap: https://softrate-tech-park.netlify.app/sitemap.xml"
    return Response(content, mimetype="text/plain")

@app.route("/sitemap.xml")
def sitemap_xml():
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    canonical_paths = set(d["canonical"] for d in SEO_METADATA.values())
    for path in canonical_paths:
        xml += '  <url>\n'
        xml += f'    <loc>https://softrate-tech-park.netlify.app{path}</loc>\n'
        xml += '    <changefreq>weekly</changefreq>\n'
        xml += '    <priority>0.8</priority>\n'
        xml += '  </url>\n'
    xml += '</urlset>\n'
    return Response(xml, mimetype="application/xml")

if __name__ == "__main__":
    # Start Flask Server
    app.run(host="0.0.0.0", port=5000, debug=True)
