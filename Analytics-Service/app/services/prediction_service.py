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
    
    demand_by_product = {}
    if items:
        df = pd.DataFrame(items)

        # Calculate daily average demand for each product
        demand_df = df.groupby("productId").agg({"quantity": "sum"}).reset_index()
        demand_df["dailyDemand"] = demand_df["quantity"] / 14.0
        demand_df["predictedDemand_7days"] = demand_df["dailyDemand"] * 7
        demand_by_product = {
            row["productId"]: math.ceil(row["predictedDemand_7days"])
            for _, row in demand_df.iterrows()
        }
    
    suggestions = []

    # Include every product that is at or below its configured low-stock threshold,
    # even when it has no recent sales data.
    for product_data in products_collection.find({}):
        product_id = str(product_data.get("_id"))
        current_stock = product_data.get("stockQuantity", 0) or 0
        low_stock_threshold = product_data.get("lowStockThreshold", 0) or 0
        predicted_demand = demand_by_product.get(product_id, low_stock_threshold)

        if current_stock <= low_stock_threshold or predicted_demand > current_stock:
            target_stock = max(predicted_demand, low_stock_threshold)
            suggested_order = max(target_stock - current_stock, 1)
            suggestions.append({
                "product": product_data.get("name"),
                "currentStock": current_stock,
                "predictedDemand": target_stock,
                "suggestedOrder": suggested_order
            })
                
    return suggestions
