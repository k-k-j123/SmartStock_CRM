import os
import httpx
from typing import List, Dict, Any
from datetime import datetime, timedelta
from dotenv import load_dotenv
from app.database import get_collection

load_dotenv()

SERP_API_KEY = "<API_KEY>"
SERP_BASE_URL = "https://serpapi.com/search.json"

CATEGORIES = {
    "electronics": "electronics",
    "beauty": "beauty",
    "grocery": "grocery"
}

# Collection name for caching
CACHE_COLLECTION = "trending_cache"

async def fetch_trending_products(category: str) -> List[Dict[str, Any]]:
    if category not in CATEGORIES:
        return []
    
    collection = get_collection(CACHE_COLLECTION)
    
    # Check cache first
    cached_data = collection.find_one({"category": category})
    
    if cached_data:
        last_updated = cached_data.get("last_updated")
        # Check if cache is less than 24 hours old
        if datetime.utcnow() - last_updated < timedelta(days=1):
            print(f"Returning cached results for {category}")
            return cached_data.get("products", [])

    # Cache is old or missing, fetch from SerpAPI
    print(f"Fetching fresh data from SerpAPI for {category}")
    params = {
        "engine": "amazon",
        "k": CATEGORIES[category],
        "rh": "p_72:1248897011",
        "s": "review-rank",
        "api_key": SERP_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(SERP_BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            products = data.get("organic_results", [])
            
            # Update cache
            collection.update_one(
                {"category": category},
                {
                    "$set": {
                        "products": products,
                        "last_updated": datetime.utcnow()
                    }
                },
                upsert=True
            )
            
            return products
        except Exception as e:
            print(f"Error fetching {category} trending products: {e}")
            # If fetch fails, return cached data even if old, or empty list
            return cached_data.get("products", []) if cached_data else []

async def get_all_trending_products() -> Dict[str, List[Dict[str, Any]]]:
    results = {}
    for category in CATEGORIES:
        results[category] = await fetch_trending_products(category)
    return results
