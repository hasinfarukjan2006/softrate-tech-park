import datetime
from flask import Flask, jsonify, request, render_template
from config import Config
from database import get_db

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config.from_object(Config)

# Fetch database interface
db, using_fallback = get_db()

@app.route("/")
def index():
    """Render the main GST Calculator SPA dashboard."""
    return render_template("index.html")

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
        "timestamp": datetime.datetime.now()
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
        "timestamp": record["timestamp"].isoformat() if isinstance(record["timestamp"], datetime.datetime) else record["timestamp"]
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
        "timestamp": datetime.datetime.now()
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

if __name__ == "__main__":
    # Start Flask Server
    app.run(host="127.0.0.1", port=5000, debug=True)
