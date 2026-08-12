import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not set")
DATABASE_NAME = "smartstock"

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

def get_db():
    return db

def get_collection(collection_name):
    return db[collection_name]
