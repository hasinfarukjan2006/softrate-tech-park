# Softrate GST Calculator

A professional, high-fidelity Goods and Services Tax (GST) calculation dashboard built for **Softrate Tech Park Pvt. Ltd.** The application features a custom, high-fidelity UI/UX, brand design, corporate styling, database connectivity model, and backend integration.

## Features
- **Real-Time Calculation:** Instantaneous math as you type, reflecting original amount, total GST, splits (CGST + SGST or IGST), and gross total.
- **Multiple Valuation Modes:** Support for Standard, GST Inclusive, GST Exclusive, GST Splits, and State/Integrated partitions.
- **Persistent Computation History:** Stores recent tax calculations, allowing review and deletion.
- **Zero-Dependency Fallback DB:** Tries to connect to MongoDB, but automatically falls back to a file-backed JSON database (`db_fallback.json`) if MongoDB is offline.
- **Responsive & Modern Design:** Dashboard-style layout with Outfit / Inter typography, rounded cards, custom inputs, accordion FAQs, dynamic dark mode toggle, and slide drawer navigation for mobile.
- **Contact Form Submission:** Corporate inquiry interface that persists entries in the database.
- **SEO Ready:** Semantic HTML5 outline with SEO meta tags and descriptive titles.

---

## Technical Stack
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla JS), Lucide Icons
- **Backend:** Python Flask
- **Database:** MongoDB (with automatic local JSON file-based database fallback)

---

## Setup and Running Instructions

### 1. Install Dependencies
Make sure Python 3.8+ is installed. Navigate to the project directory and install the packages listed in `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 2. Configure Environment (Optional)
By default, the application connects to a local MongoDB instance at `mongodb://localhost:27017/`. If MongoDB is not running on your host, the application will **automatically fall back to using a local JSON database** inside the project folder. No manual configuration is required!

If you wish to configure a remote MongoDB connection, you can create a `.env` file or export environment variables:
```env
MONGO_URI=mongodb://localhost:27017/
DB_NAME=softrate_db
PORT=5000
DEBUG=True
```

### 3. Run the Application
Start the Flask development server:
```bash
python app.py
```
Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your web browser.

### 4. Running Unit Tests
Execute the unit tests to verify the calculations and API integrity:
```bash
python -m unittest test_app.py
```

---

## Directory Structure
- `app.py`: Main Flask application server.
- `config.py`: Environment configuration mapping.
- `database.py`: Database client builder with MongoDB interface and JSON mock.
- `requirements.txt`: Dependency specifications.
- `test_app.py`: Comprehensive test suite verifying calculation and API endpoint logic.
- `static/`: Contains static elements (style.css, app.js, and logo.svg).
- `templates/`: Contains index.html layout.
- `db_fallback.json`: Local JSON database created automatically in fallback mode.
