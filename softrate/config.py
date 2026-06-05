import os

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    DB_NAME = os.getenv("DB_NAME", "softrate_gst_db")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    FALLBACK_DB_PATH = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), 
        os.getenv("FALLBACK_DB_PATH", "db_fallback.json")
    )
