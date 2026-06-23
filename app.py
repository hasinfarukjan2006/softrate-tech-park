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

if __name__ == "__main__":
    # Start Flask Server
    app.run(host="0.0.0.0", port=5000, debug=True)

