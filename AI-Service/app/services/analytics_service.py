from app.database import get_collection
from datetime import datetime, timedelta
import pandas as pd

def get_best_selling_products(days=30):
    sales_collection = get_collection("sales")
    start_date = datetime.now() - timedelta(days=days)
    
    # Query sales in the last 30 days
    sales_cursor = sales_collection.find({"createdAt": {"$gte": start_date}})
    sales_list = list(sales_cursor)
    
    if not sales_list:
        return []

    # Flatten the items from each sale
    items = []
    for sale in sales_list:
        for item in sale.get("items", []):
            items.append({
                "productId": item.get("productId"),
                "name": item.get("name"),
                "quantity": item.get("quantity"),
                "price": item.get("priceAtSale")
            })
    
    df = pd.DataFrame(items)
    
    if df.empty:
        return []

    # Group by productId and sum quantities
    best_sellers = df.groupby(["productId", "name"]).agg({
        "quantity": "sum",
        "price": "mean" # average price
    }).reset_index()
    
    best_sellers["totalRevenue"] = best_sellers["quantity"] * best_sellers["price"]
    best_sellers = best_sellers.sort_values(by="quantity", ascending=False).head(10)
    
    return [
        {
            "productId": row["productId"],
            "name": row["name"],
            "quantitySold": int(row["quantity"]),
            "totalRevenue": round(float(row["totalRevenue"]), 2)
        } for _, row in best_sellers.iterrows()
    ]

def get_loyal_customers(limit=10):
    customers_collection = get_collection("customers")
    
    # Fetch top 10 customers by totalSpent
    customers_cursor = customers_collection.find().sort("totalSpent", -1).limit(limit)
    
    loyal_customers = []
    for cust in customers_cursor:
        loyal_customers.append({
            "customerId": str(cust.get("_id")),
            "name": cust.get("name"),
            "phone": cust.get("phone"),
            "totalSpent": cust.get("totalSpent", 0.0),
            "lastVisit": cust.get("lastVisit")
        })
    
    return loyal_customers
