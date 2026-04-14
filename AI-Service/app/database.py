import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = "smartstock"

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

def get_db():
    return db

def get_collection(collection_name):
    return db[collection_name]
