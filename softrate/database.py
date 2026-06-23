import json
import os
import datetime
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config import Config

class FallbackCollection:
    """
    A file-backed mock MongoDB collection that mimics basic operations:
    insert_one, find, delete_many.
    """
    def __init__(self, db_path, collection_name):
        self.db_path = db_path
        self.collection_name = collection_name

    def _load_data(self):
        if not os.path.exists(self.db_path):
            return {}
        try:
            with open(self.db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {}

    def _save_data(self, data):
        try:
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, default=str)
        except IOError as e:
            print(f"Error saving fallback database: {e}")

    def insert_one(self, document):
        # Generate string ObjectId representation for consistency
        if "_id" not in document:
            document["_id"] = str(ObjectId())
        
        # Convert any datetime objects to ISO format string
        for k, v in document.items():
            if isinstance(v, datetime.datetime):
                document[k] = v.isoformat()
        
        data = self._load_data()
        if self.collection_name not in data:
            data[self.collection_name] = []
        data[self.collection_name].append(document)
        self._save_data(data)
        
        # Return a simple mock result object with inserted_id
        class InsertOneResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertOneResult(document["_id"])

    def find(self, query=None):
        data = self._load_data()
        docs = data.get(self.collection_name, [])
        
        # Simple query filtering (e.g. matching equality)
        filtered_docs = []
        if query:
            for doc in docs:
                match = True
                for k, v in query.items():
                    if doc.get(k) != v:
                        match = False
                        break
                if match:
                    filtered_docs.append(doc)
        else:
            filtered_docs = docs.copy()

        # Wrap in a cursor-like class to support sorting and limiting
        class FallbackCursor:
            def __init__(self, documents):
                self.documents = documents

            def sort(self, key, direction=-1):
                # Reverse parameter in Python sorted: True for DESC (-1), False for ASC (1)
                reverse = True if direction == -1 else False
                self.documents = sorted(
                    self.documents, 
                    key=lambda x: x.get(key, ""), 
                    reverse=reverse
                )
                return self

            def limit(self, limit_count):
                self.documents = self.documents[:limit_count]
                return self

            def __iter__(self):
                return iter(self.documents)
                
            def __list__(self):
                return self.documents

        return FallbackCursor(filtered_docs)

    def find_one(self, query=None):
        cursor = self.find(query)
        if cursor.documents:
            return cursor.documents[0]
        return None

    def delete_many(self, query=None):
        data = self._load_data()
        if self.collection_name not in data:
            data[self.collection_name] = []
            
        initial_count = len(data[self.collection_name])
        
        if not query:
            data[self.collection_name] = []
            deleted_count = initial_count
        else:
            # Delete matches
            new_docs = []
            deleted_count = 0
            for doc in data[self.collection_name]:
                match = True
                for k, v in query.items():
                    if doc.get(k) != v:
                        match = False
                        break
                if match:
                    deleted_count += 1
                else:
                    new_docs.append(doc)
            data[self.collection_name] = new_docs
            
        self._save_data(data)
        
        class DeleteResult:
            def __init__(self, count):
                self.deleted_count = count
        return DeleteResult(deleted_count)

    def update_one(self, filter_query, update_operation):
        data = self._load_data()
        docs = data.get(self.collection_name, [])
        modified_count = 0
        set_data = update_operation.get("$set", {})
        
        for doc in docs:
            match = True
            for k, v in filter_query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                for sk, sv in set_data.items():
                    doc[sk] = sv
                modified_count += 1
                break
                
        if modified_count > 0:
            self._save_data(data)
            
        class UpdateResult:
            def __init__(self, count):
                self.modified_count = count
        return UpdateResult(modified_count)


class FallbackDatabase:
    """
    Simulates a MongoDB Database containing collections.
    """
    def __init__(self, db_path):
        self.db_path = db_path
        self._collections = {}

    def __getattr__(self, name):
        if name not in self._collections:
            self._collections[name] = FallbackCollection(self.db_path, name)
        return self._collections[name]

    def __getitem__(self, name):
        return self.__getattr__(name)


# Initialize DB Connection Layer
_db = None
_using_fallback = False

def get_db():
    global _db, _using_fallback
    if _db is not None:
        return _db, _using_fallback

    # Try connecting to real MongoDB
    try:
        print(f"Connecting to MongoDB at {Config.MONGO_URI}...")
        client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=2000)
        # Force a connection test
        client.server_info()
        _db = client[Config.DB_NAME]
        _using_fallback = False
        print("Successfully connected to MongoDB.")
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"MongoDB connection failed: {e}. Falling back to file-backed JSON database.")
        _db = FallbackDatabase(Config.FALLBACK_DB_PATH)
        _using_fallback = True
    
    # Initialize default values for gst_rates collection if empty
    try:
        # Load standard rate slabs
        default_rates = [
            {"rate": 0, "name": "Exempted / Zero Rated", "description": "Essential items, grains, fresh fruits, vegetables."},
            {"rate": 3, "name": "Special Rate (Gold/Silver)", "description": "Precious metals, stones, and jewelry."},
            {"rate": 5, "name": "Lower Rate", "description": "Mass consumption items like tea, coffee, edible oil, life-saving drugs."},
            {"rate": 12, "name": "Standard Rate (Lower)", "description": "Processed food, computer accessories, writing instruments."},
            {"rate": 18, "name": "Standard Rate (Higher)", "description": "IT services, telecom, capital goods, restaurants, steel, electronics."},
            {"rate": 28, "name": "Luxury / Demerit Rate", "description": "Luxury items, automobiles, aerated drinks, tobacco products."}
        ]
        
        # Check if rate slabs exist
        rates_cursor = _db.gst_rates.find()
        rates_list = list(rates_cursor)
        if not rates_list:
            for rate_doc in default_rates:
                _db.gst_rates.insert_one(rate_doc)
            print("Populated default GST rate slabs in database.")
    except Exception as err:
        print(f"Error initializing default GST rates: {err}")

    return _db, _using_fallback
