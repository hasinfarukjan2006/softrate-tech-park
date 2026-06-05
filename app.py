import datetime
from datetime import datetime
from bson import ObjectId
from flask import Flask, jsonify, request, render_template, render_template_string
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

@app.route("/")
def index():
    """Render the main GST Calculator SPA dashboard."""
    return render_template("index.html")

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

    # Store calculation in database
    db_conn, fallback_active = get_db()
    
    record = {
        "amount": round(original_amount, 2),
        "gst_rate": rate,
        "gst_type": gst_type,
        "gst_amount": round(gst_amount, 2),
        "final_amount": round(total_amount, 2),
        "timestamp": datetime.now()
    }
    
    try:
        db_conn.calculation_history.insert_one(record)
    except Exception as e:
        print(f"Error logging calculation to database: {e}")

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
    db_conn, fallback_active = get_db()
    try:
        history_cursor = db_conn.calculation_history.find().sort("timestamp", -1).limit(15)
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
    db_conn, fallback_active = get_db()
    try:
        db_conn.calculation_history.delete_many({})
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


@app.route("/api/expenses", methods=["POST"])
def save_expense_report():
    db_conn, fallback_active = get_db()
    data = request.get_json() or {}
    
    report_id = data.get("report_id", "").strip()
    employee_name = data.get("employee_name", "").strip()
    employee_email = data.get("employee_email", "").strip()
    
    if not report_id or not employee_name or not employee_email:
        return jsonify({"status": "error", "message": "Report ID, employee name, and email are required."}), 400
        
    record = {
        "report_id": report_id,
        "employee_name": employee_name,
        "employee_email": employee_email,
        "department": data.get("department", "General"),
        "project_name": data.get("project_name", ""),
        "travel_purpose": data.get("travel_purpose", ""),
        "report_period": data.get("report_period", ""),
        "items": data.get("items", []),
        "budget_limit": float(data.get("budget_limit", 0)),
        "subtotal": float(data.get("subtotal", 0)),
        "gst_amount": float(data.get("gst_amount", 0)),
        "grand_total": float(data.get("grand_total", 0)),
        "status": data.get("status", "Submitted"),
        "timestamp": datetime.now()
    }
    
    try:
        db_conn.expense_reports.insert_one(record)
        return jsonify({
            "status": "success",
            "message": f"Expense report {report_id} has been submitted successfully.",
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to save report: {str(e)}"}), 500

@app.route("/api/expenses", methods=["GET"])
def get_expense_reports():
    db_conn, fallback_active = get_db()
    try:
        reports_cursor = db_conn.expense_reports.find().sort("timestamp", -1)
        reports_list = []
        for doc in reports_cursor:
            doc_id = str(doc.get("_id"))
            reports_list.append({
                "id": doc_id,
                "report_id": doc.get("report_id"),
                "employee_name": doc.get("employee_name"),
                "employee_email": doc.get("employee_email"),
                "department": doc.get("department"),
                "project_name": doc.get("project_name"),
                "travel_purpose": doc.get("travel_purpose"),
                "report_period": doc.get("report_period"),
                "items": doc.get("items", []),
                "budget_limit": doc.get("budget_limit", 0),
                "subtotal": doc.get("subtotal", 0),
                "gst_amount": doc.get("gst_amount", 0),
                "grand_total": doc.get("grand_total", 0),
                "status": doc.get("status", "Submitted"),
                "timestamp": doc.get("timestamp")
            })
        return jsonify({
            "status": "success",
            "reports": reports_list,
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Could not retrieve expense reports: {str(e)}"}), 500

@app.route("/api/expenses/<report_id>/status", methods=["PUT"])
def update_expense_status(report_id):
    db_conn, fallback_active = get_db()
    data = request.get_json() or {}
    new_status = data.get("status", "").strip()
    
    if not new_status:
        return jsonify({"status": "error", "message": "Status field is required."}), 400
        
    try:
        from bson import ObjectId
        query = {}
        try:
            query = {"_id": ObjectId(report_id)}
        except Exception:
            query = {"_id": report_id}
            
        update_op = {"$set": {"status": new_status}}
        result = db_conn.expense_reports.update_one(query, update_op)
        
        if result.modified_count == 0:
            query = {"_id": report_id}
            result = db_conn.expense_reports.update_one(query, update_op)
            
        return jsonify({
            "status": "success",
            "message": f"Report status updated to {new_status}.",
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to update status: {str(e)}"}), 500

@app.route("/expense-report/save", methods=["POST"])
def expense_report_save():
    db_conn, fallback_active = get_db()
    data = request.get_json() or {}
    
    report_id = data.get("report_id", "").strip()
    employee_name = data.get("employee_name", "").strip()
    employee_email = data.get("employee_email", "").strip()
    
    if not report_id or not employee_name or not employee_email:
        return jsonify({"status": "error", "message": "Report ID, employee name, and email are required."}), 400
        
    record = {
        "report_id": report_id,
        "employee_name": employee_name,
        "employee_email": employee_email,
        "department": data.get("department", "General"),
        "project_name": data.get("project_name", ""),
        "travel_purpose": data.get("travel_purpose", ""),
        "report_period": data.get("report_period", ""),
        "items": data.get("items", []),
        "budget_limit": float(data.get("budget_limit", 0)),
        "subtotal": float(data.get("subtotal", 0)),
        "gst_amount": float(data.get("gst_amount", data.get("gst_total", 0))),
        "grand_total": float(data.get("grand_total", 0)),
        "status": data.get("status", "Submitted"),
        "timestamp": datetime.now()
    }
    
    try:
        existing = db_conn.expense_reports.find_one({"report_id": report_id})
        if existing:
            db_conn.expense_reports.update_one({"report_id": report_id}, {"$set": record})
        else:
            db_conn.expense_reports.insert_one(record)
            
        return jsonify({
            "status": "success",
            "message": f"Expense report {report_id} has been saved successfully.",
            "report_id": report_id,
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to save report: {str(e)}"}), 500

@app.route("/expense-report/approve/<report_id>", methods=["POST"])
def expense_report_approve(report_id):
    db_conn, fallback_active = get_db()
    try:
        from bson import ObjectId
        query = {"report_id": report_id}
        update_op = {"$set": {"status": "APPROVED"}}
        
        result = db_conn.expense_reports.update_one(query, update_op)
        if result.modified_count == 0:
            try:
                result = db_conn.expense_reports.update_one({"_id": ObjectId(report_id)}, update_op)
            except Exception:
                result = db_conn.expense_reports.update_one({"_id": report_id}, update_op)
                
        return jsonify({
            "status": "success",
            "message": f"Report status updated to APPROVED.",
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to approve report: {str(e)}"}), 500

@app.route("/expense-report/reject/<report_id>", methods=["POST"])
def expense_report_reject(report_id):
    db_conn, fallback_active = get_db()
    try:
        from bson import ObjectId
        query = {"report_id": report_id}
        update_op = {"$set": {"status": "REJECTED"}}
        
        result = db_conn.expense_reports.update_one(query, update_op)
        if result.modified_count == 0:
            try:
                result = db_conn.expense_reports.update_one({"_id": ObjectId(report_id)}, update_op)
            except Exception:
                result = db_conn.expense_reports.update_one({"_id": report_id}, update_op)
                
        return jsonify({
            "status": "success",
            "message": f"Report status updated to REJECTED.",
            "using_fallback": fallback_active
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to reject report: {str(e)}"}), 500

@app.route("/api/approve-report/<report_id>", methods=["POST"])
def api_approve_report(report_id):
    db_conn, fallback_active = get_db()
    try:
        update_op = {"$set": {"status": "APPROVED"}}
        result = db_conn.expense_reports.update_one({"report_id": report_id}, update_op)
        if result.matched_count == 0:
            try:
                db_conn.expense_reports.update_one({"_id": ObjectId(report_id)}, update_op)
            except Exception:
                db_conn.expense_reports.update_one({"_id": report_id}, update_op)

        return jsonify({"success": True, "message": "Report approved", "using_fallback": fallback_active})
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to approve report: {str(e)}"}), 500

@app.route("/api/reject-report/<report_id>", methods=["POST"])
def api_reject_report(report_id):
    db_conn, fallback_active = get_db()
    try:
        update_op = {"$set": {"status": "REJECTED"}}
        result = db_conn.expense_reports.update_one({"report_id": report_id}, update_op)
        if result.matched_count == 0:
            try:
                db_conn.expense_reports.update_one({"_id": ObjectId(report_id)}, update_op)
            except Exception:
                db_conn.expense_reports.update_one({"_id": report_id}, update_op)

        return jsonify({"success": True, "message": "Report rejected", "using_fallback": fallback_active})
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to reject report: {str(e)}"}), 500

@app.route("/expense-report/export-pdf/<report_id>", methods=["GET"])
def expense_report_export_pdf(report_id):
    db_conn, fallback_active = get_db()
    report = db_conn.expense_reports.find_one({"report_id": report_id})
    if not report:
        from bson import ObjectId
        try:
            report = db_conn.expense_reports.find_one({"_id": ObjectId(report_id)})
        except Exception:
            pass
            
    if not report:
        return "Report not found", 404
        
    import io
    from flask import send_file
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F4C81'),
        alignment=1,
        spaceAfter=15
    )
    section_style = ParagraphStyle(
        'SecTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#008080'),
        spaceBefore=10,
        spaceAfter=10
    )
    normal_style = ParagraphStyle(
        'NormalText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#333333')
    )
    bold_style = ParagraphStyle(
        'BoldText',
        parent=normal_style,
        fontName='Helvetica-Bold'
    )
    
    story.append(Paragraph("SOFTRATE EXPENSE CLAIM REPORT", title_style))
    story.append(Spacer(1, 10))
    
    ts = report.get("timestamp")
    if ts:
        if hasattr(ts, "strftime"):
            ts_str = ts.strftime("%Y-%m-%d %H:%M:%S")
        else:
            ts_str = str(ts)
    else:
        ts_str = "N/A"

    meta_data = [
        [Paragraph("<b>Report ID:</b>", normal_style), Paragraph(str(report.get("report_id")), normal_style),
         Paragraph("<b>Submission Date:</b>", normal_style), Paragraph(ts_str, normal_style)],
        [Paragraph("<b>Employee Name:</b>", normal_style), Paragraph(str(report.get("employee_name")), normal_style),
         Paragraph("<b>Employee Email:</b>", normal_style), Paragraph(str(report.get("employee_email")), normal_style)],
        [Paragraph("<b>Department:</b>", normal_style), Paragraph(str(report.get("department")), normal_style),
         Paragraph("<b>Project Name:</b>", normal_style), Paragraph(str(report.get("project_name")), normal_style)],
        [Paragraph("<b>Travel Purpose:</b>", normal_style), Paragraph(str(report.get("travel_purpose")), normal_style),
         Paragraph("<b>Report Period:</b>", normal_style), Paragraph(str(report.get("report_period")), normal_style)],
        [Paragraph("<b>Budget Limit:</b>", normal_style), Paragraph(f"INR {report.get('budget_limit', 0):,.2f}", normal_style),
         Paragraph("<b>Status:</b>", normal_style), Paragraph(str(report.get("status", "Submitted")), bold_style)]
    ]
    
    meta_table = Table(meta_data, colWidths=[110, 160, 110, 160])
    meta_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.lightgrey),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Expense Line Items", section_style))
    
    items_header = [
        Paragraph("<b>Date</b>", bold_style),
        Paragraph("<b>Category</b>", bold_style),
        Paragraph("<b>Description</b>", bold_style),
        Paragraph("<b>Merchant</b>", bold_style),
        Paragraph("<b>Payment Mode</b>", bold_style),
        Paragraph("<b>GST %</b>", bold_style),
        Paragraph("<b>Amount</b>", bold_style),
        Paragraph("<b>GST</b>", bold_style),
        Paragraph("<b>Total</b>", bold_style)
    ]
    
    items_data = [items_header]
    for item in report.get("items", []):
        row = [
            Paragraph(str(item.get("date", "")), normal_style),
            Paragraph(str(item.get("category", "")), normal_style),
            Paragraph(str(item.get("description", "")), normal_style),
            Paragraph(str(item.get("merchant", "")), normal_style),
            Paragraph(str(item.get("payment_mode", "")), normal_style),
            Paragraph(f"{item.get('gst_percentage', 0)}%", normal_style),
            Paragraph(f"INR {item.get('amount', 0):,.2f}", normal_style),
            Paragraph(f"INR {item.get('gst_amount', 0):,.2f}", normal_style),
            Paragraph(f"INR {item.get('total', 0):,.2f}", normal_style)
        ]
        items_data.append(row)
        
    items_data.append([
        "", "", "", "", "", "",
        Paragraph("<b>Subtotal:</b>", bold_style), "",
        Paragraph(f"<b>INR {report.get('subtotal', 0):,.2f}</b>", bold_style)
    ])
    items_data.append([
        "", "", "", "", "", "",
        Paragraph("<b>GST Total:</b>", bold_style), "",
        Paragraph(f"<b>INR {report.get('gst_amount', report.get('gst_total', 0)):,.2f}</b>", bold_style)
    ])
    items_data.append([
        "", "", "", "", "", "",
        Paragraph("<b>Grand Total:</b>", bold_style), "",
        Paragraph(f"<b>INR {report.get('grand_total', 0):,.2f}</b>", bold_style)
    ])
    
    col_widths = [60, 60, 95, 60, 65, 35, 65, 65, 75]
    items_table = Table(items_data, colWidths=col_widths)
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F4C81')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1, len(report.get("items", []))), 0.5, colors.grey),
        ('SPAN', (6, -3), (7, -3)),
        ('SPAN', (6, -2), (7, -2)),
        ('SPAN', (6, -1), (7, -1)),
        ('ALIGN', (6, -3), (6, -1), 'RIGHT'),
        ('BACKGROUND', (6, -1), (8, -1), colors.HexColor('#e6f2f2')),
    ]))
    story.append(items_table)
    
    doc.build(story)
    buffer.seek(0)
    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"Softrate_Expense_Report_{report_id}.pdf",
        mimetype="application/pdf"
    )

@app.route("/expense-report/export-excel/<report_id>", methods=["GET"])
def expense_report_export_excel(report_id):
    db_conn, fallback_active = get_db()
    report = db_conn.expense_reports.find_one({"report_id": report_id})
    if not report:
        from bson import ObjectId
        try:
            report = db_conn.expense_reports.find_one({"_id": ObjectId(report_id)})
        except Exception:
            pass
            
    if not report:
        return "Report not found", 404
        
    import io
    import csv
    from flask import Response
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["SOFTRATE EXPENSE CLAIM REPORT"])
    writer.writerow(["Report ID", report.get("report_id")])
    writer.writerow(["Employee Name", report.get("employee_name")])
    writer.writerow(["Employee Email", report.get("employee_email")])
    writer.writerow(["Department", report.get("department")])
    writer.writerow(["Project Name", report.get("project_name")])
    writer.writerow(["Travel Purpose", report.get("travel_purpose")])
    writer.writerow(["Report Period", report.get("report_period")])
    writer.writerow(["Budget Limit", report.get("budget_limit", 0)])
    writer.writerow(["Status", report.get("status")])
    writer.writerow([])
    
    writer.writerow(["Date", "Category", "Description", "Merchant", "Payment Mode", "GST %", "Amount", "GST Amount", "Total"])
    for item in report.get("items", []):
        writer.writerow([
            item.get("date"),
            item.get("category"),
            item.get("description"),
            item.get("merchant"),
            item.get("payment_mode"),
            f"{item.get('gst_percentage')}%",
            item.get("amount"),
            item.get("gst_amount"),
            item.get("total")
        ])
        
    writer.writerow([])
    writer.writerow(["", "", "", "", "", "", "Subtotal", "", report.get("subtotal", 0)])
    writer.writerow(["", "", "", "", "", "", "GST Total", "", report.get("gst_amount", report.get("gst_total", 0))])
    writer.writerow(["", "", "", "", "", "", "Grand Total", "", report.get("grand_total", 0)])
    
    response = Response(output.getvalue(), mimetype="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=Softrate_Expense_Report_{report_id}.csv"
    return response

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    print("Register data:", data)

    users.insert_one(data)

    return jsonify({"success": True, "message": "User saved"})

@app.route('/save-gst', methods=['POST'])
def save_gst():
    data = request.json
    print("GST DATA RECEIVED:", data)

    gst_history.insert_one(data)

    return jsonify({
        "success": True,
        "message": "GST saved"
    })
@app.route('/test-expense')
def test_expense():
    expense_reports.insert_one({
        "category": "Office",
        "amount": 1000,
        "description": "Test Expense"
    })

    return "Expense Added"

def fix_id(data):
    for item in data:
        item["_id"] = str(item["_id"])
    return data

@app.route("/api/gst-history", methods=["GET"])
def get_gst_history():
    data = list(gst_history.find())
    return jsonify(fix_id(data))

@app.route("/api/expense-reports", methods=["GET"])
def get_expense_reports_direct():
    data = list(expense_reports.find())
    return jsonify(fix_id(data))
@app.route('/save-expense', methods=['POST'])
def save_expense():
    data = request.json
    print("EXPENSE DATA RECEIVED:", data)

    expense_reports.insert_one(data)

    return jsonify({
        "success": True,
        "message": "Expense saved successfully"
    })

if __name__ == "__main__":
    # Start Flask Server
    app.run(host="0.0.0.0", port=5000, debug=True)
