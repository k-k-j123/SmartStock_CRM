from app.database import get_collection
from datetime import datetime, timedelta
import pandas as pd
import math

def get_restock_suggestions():
    sales_collection = get_collection("sales")
    products_collection = get_collection("products")
    
    # Analyze the last 14 days for demand forecasting
    start_date = datetime.now() - timedelta(days=14)
    sales_cursor = sales_collection.find({"createdAt": {"$gte": start_date}})
    
    items = []
    for sale in sales_cursor:
        for item in sale.get("items", []):
            items.append({
                "productId": item.get("productId"),
                "quantity": item.get("quantity"),
                "date": sale.get("createdAt")
            })
    
    if not items:
        return []
    
    df = pd.DataFrame(items)
    
    # Calculate daily average demand for each product
    demand_df = df.groupby("productId").agg({"quantity": "sum"}).reset_index()
    demand_df["dailyDemand"] = demand_df["quantity"] / 14.0
    demand_df["predictedDemand_7days"] = demand_df["dailyDemand"] * 7
    
    suggestions = []
    # Cross check with current products and their stock
    for _, row in demand_df.iterrows():
        product_id = row["productId"]
        from bson import ObjectId
        
        # Try both string and ObjectId lookups
        product_data = products_collection.find_one({"_id": product_id})
        if not product_data:
            try:
                product_data = products_collection.find_one({"_id": ObjectId(product_id)})
            except:
                pass
        
        if product_data:
            current_stock = product_data.get("stockQuantity", 0)
            predicted_demand = math.ceil(row["predictedDemand_7days"])
            
            # Suggest restocking if demand exceeds current stock
            if predicted_demand > current_stock:
                suggestions.append({
                    "product": product_data.get("name"),
                    "currentStock": current_stock,
                    "predictedDemand": predicted_demand,
                    "suggestedOrder": predicted_demand - current_stock
                })
                
    return suggestions
