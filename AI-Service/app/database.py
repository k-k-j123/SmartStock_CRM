import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://joshikaushik419:kkj123@cluster0.oftyv.mongodb.net/smartstock?retryWrites=true&w=majority")
DATABASE_NAME = "smartstock"

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

def get_db():
    return db

def get_collection(collection_name):
    return db[collection_name]
