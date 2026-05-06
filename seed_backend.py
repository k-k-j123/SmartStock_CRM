#!/usr/bin/env python3
"""
Seed SmartStock with fake data through the Spring backend API.

Start the backend first, then run:
    python scripts/seed_backend.py

Use --dry-run to preview requests without writing data.
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from dataclasses import dataclass
from json import JSONDecodeError
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


CUSTOMERS = [
    {"name": "Aarav Mehta", "phone": "9876501001", "email": "aarav.mehta@example.com"},
    {"name": "Priya Nair", "phone": "9876501002", "email": "priya.nair@example.com"},
    {"name": "Rohan Sharma", "phone": "9876501003", "email": "rohan.sharma@example.com"},
    {"name": "Sneha Iyer", "phone": "9876501004", "email": "sneha.iyer@example.com"},
    {"name": "Vikram Rao", "phone": "9876501005", "email": "vikram.rao@example.com"},
    {"name": "Ananya Gupta", "phone": "9876501006", "email": "ananya.gupta@example.com"},
    {"name": "Kabir Malhotra", "phone": "9876501007", "email": "kabir.malhotra@example.com"},
    {"name": "Meera Joshi", "phone": "9876501008", "email": "meera.joshi@example.com"},
    {"name": "Neha Kapoor", "phone": "9876501009", "email": "neha.kapoor@example.com"},
    {"name": "Arjun Menon", "phone": "9876501010", "email": "arjun.menon@example.com"},
    {"name": "Ishaan Khanna", "phone": "9876501011", "email": "ishaan.khanna@example.com"},
    {"name": "Tara Bansal", "phone": "9876501012", "email": "tara.bansal@example.com"},
    {"name": "Dev Patel", "phone": "9876501013", "email": "dev.patel@example.com"},
    {"name": "Kavya Reddy", "phone": "9876501014", "email": "kavya.reddy@example.com"},
    {"name": "Nikhil Verma", "phone": "9876501015", "email": "nikhil.verma@example.com"},
    {"name": "Pooja Sinha", "phone": "9876501016", "email": "pooja.sinha@example.com"},
    {"name": "Aditya Kulkarni", "phone": "9876501017", "email": "aditya.kulkarni@example.com"},
    {"name": "Simran Arora", "phone": "9876501018", "email": "simran.arora@example.com"},
    {"name": "Karan Chopra", "phone": "9876501019", "email": "karan.chopra@example.com"},
    {"name": "Diya Shah", "phone": "9876501020", "email": "diya.shah@example.com"},
    {"name": "Rahul Bose", "phone": "9876501021", "email": "rahul.bose@example.com"},
    {"name": "Maya Krishnan", "phone": "9876501022", "email": "maya.krishnan@example.com"},
    {"name": "Sahil Jain", "phone": "9876501023", "email": "sahil.jain@example.com"},
    {"name": "Riya Chatterjee", "phone": "9876501024", "email": "riya.chatterjee@example.com"},
    {"name": "Yash Agarwal", "phone": "9876501025", "email": "yash.agarwal@example.com"},
    {"name": "Leela Thomas", "phone": "9876501026", "email": "leela.thomas@example.com"},
    {"name": "Manav Saxena", "phone": "9876501027", "email": "manav.saxena@example.com"},
    {"name": "Aisha Khan", "phone": "9876501028", "email": "aisha.khan@example.com"},
    {"name": "Varun Das", "phone": "9876501029", "email": "varun.das@example.com"},
    {"name": "Naina Bhat", "phone": "9876501030", "email": "naina.bhat@example.com"},
]


PRODUCTS = [
    {
        "name": "Organic Basmati Rice 5kg",
        "category": "Grocery",
        "costPrice": 520.0,
        "sellingPrice": 649.0,
        "stockQuantity": 500,
        "lowStockThreshold": 12,
    },
    {
        "name": "Cold Pressed Groundnut Oil 1L",
        "category": "Grocery",
        "costPrice": 210.0,
        "sellingPrice": 279.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Premium Arabica Coffee 250g",
        "category": "Beverages",
        "costPrice": 280.0,
        "sellingPrice": 399.0,
        "stockQuantity": 500,
        "lowStockThreshold": 8,
    },
    {
        "name": "Green Tea Bags 100 Count",
        "category": "Beverages",
        "costPrice": 180.0,
        "sellingPrice": 249.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Almond Cookies 300g",
        "category": "Snacks",
        "costPrice": 95.0,
        "sellingPrice": 149.0,
        "stockQuantity": 500,
        "lowStockThreshold": 15,
    },
    {
        "name": "Dark Chocolate Bar 70%",
        "category": "Snacks",
        "costPrice": 75.0,
        "sellingPrice": 129.0,
        "stockQuantity": 500,
        "lowStockThreshold": 18,
    },
    {
        "name": "Herbal Shampoo 400ml",
        "category": "Personal Care",
        "costPrice": 160.0,
        "sellingPrice": 239.0,
        "stockQuantity": 500,
        "lowStockThreshold": 8,
    },
    {
        "name": "Aloe Vera Face Wash 150ml",
        "category": "Personal Care",
        "costPrice": 110.0,
        "sellingPrice": 179.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Laundry Detergent Liquid 2L",
        "category": "Home Care",
        "costPrice": 260.0,
        "sellingPrice": 349.0,
        "stockQuantity": 500,
        "lowStockThreshold": 8,
    },
    {
        "name": "Kitchen Cleaner Spray 500ml",
        "category": "Home Care",
        "costPrice": 90.0,
        "sellingPrice": 139.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Cotton Bath Towels Pack of 2",
        "category": "Home Essentials",
        "costPrice": 420.0,
        "sellingPrice": 599.0,
        "stockQuantity": 500,
        "lowStockThreshold": 6,
    },
    {
        "name": "Stainless Steel Water Bottle 1L",
        "category": "Home Essentials",
        "costPrice": 240.0,
        "sellingPrice": 349.0,
        "stockQuantity": 500,
        "lowStockThreshold": 8,
    },
    {
        "name": "Whole Wheat Atta 10kg",
        "category": "Grocery",
        "costPrice": 430.0,
        "sellingPrice": 549.0,
        "stockQuantity": 500,
        "lowStockThreshold": 12,
    },
    {
        "name": "Toor Dal 2kg",
        "category": "Grocery",
        "costPrice": 250.0,
        "sellingPrice": 329.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Masala Oats 1kg",
        "category": "Breakfast",
        "costPrice": 140.0,
        "sellingPrice": 209.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Corn Flakes 875g",
        "category": "Breakfast",
        "costPrice": 210.0,
        "sellingPrice": 299.0,
        "stockQuantity": 500,
        "lowStockThreshold": 8,
    },
    {
        "name": "Mixed Fruit Jam 500g",
        "category": "Breakfast",
        "costPrice": 95.0,
        "sellingPrice": 149.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Peanut Butter Creamy 1kg",
        "category": "Breakfast",
        "costPrice": 260.0,
        "sellingPrice": 369.0,
        "stockQuantity": 500,
        "lowStockThreshold": 8,
    },
    {
        "name": "Fresh Paneer 500g",
        "category": "Dairy",
        "costPrice": 180.0,
        "sellingPrice": 249.0,
        "stockQuantity": 500,
        "lowStockThreshold": 12,
    },
    {
        "name": "Greek Yogurt 400g",
        "category": "Dairy",
        "costPrice": 120.0,
        "sellingPrice": 179.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Cheddar Cheese Slices 200g",
        "category": "Dairy",
        "costPrice": 135.0,
        "sellingPrice": 199.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Tomato Ketchup 1kg",
        "category": "Condiments",
        "costPrice": 110.0,
        "sellingPrice": 169.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Peri Peri Sauce 250g",
        "category": "Condiments",
        "costPrice": 85.0,
        "sellingPrice": 139.0,
        "stockQuantity": 500,
        "lowStockThreshold": 8,
    },
    {
        "name": "Instant Noodles Pack of 6",
        "category": "Snacks",
        "costPrice": 90.0,
        "sellingPrice": 135.0,
        "stockQuantity": 500,
        "lowStockThreshold": 15,
    },
    {
        "name": "Roasted Makhana 100g",
        "category": "Snacks",
        "costPrice": 120.0,
        "sellingPrice": 189.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Sparkling Lemon Soda 750ml",
        "category": "Beverages",
        "costPrice": 45.0,
        "sellingPrice": 79.0,
        "stockQuantity": 500,
        "lowStockThreshold": 20,
    },
    {
        "name": "Mango Juice 1L",
        "category": "Beverages",
        "costPrice": 70.0,
        "sellingPrice": 115.0,
        "stockQuantity": 500,
        "lowStockThreshold": 15,
    },
    {
        "name": "Hand Wash Refill 750ml",
        "category": "Personal Care",
        "costPrice": 95.0,
        "sellingPrice": 149.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
    {
        "name": "Moisturizing Body Lotion 300ml",
        "category": "Personal Care",
        "costPrice": 190.0,
        "sellingPrice": 289.0,
        "stockQuantity": 500,
        "lowStockThreshold": 8,
    },
    {
        "name": "Dishwash Gel 1L",
        "category": "Home Care",
        "costPrice": 140.0,
        "sellingPrice": 219.0,
        "stockQuantity": 500,
        "lowStockThreshold": 10,
    },
]


@dataclass
class ApiClient:
    base_url: str
    timeout: int
    dry_run: bool

    def request(self, method: str, path: str, payload: dict[str, Any] | None = None) -> Any:
        url = f"{self.base_url.rstrip('/')}{path}"

        if self.dry_run and method != "GET":
            print(f"DRY RUN {method} {url}: {json.dumps(payload, indent=2)}")
            return payload or {}

        data = None
        headers = {"Accept": "application/json"}
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"

        req = Request(url, data=data, headers=headers, method=method)

        try:
            with urlopen(req, timeout=self.timeout) as response:
                body = response.read().decode("utf-8")
                content_type = response.headers.get("content-type", "")
        except HTTPError as exc:
            details = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"{method} {url} failed with HTTP {exc.code}: {details}") from exc
        except URLError as exc:
            raise RuntimeError(f"Could not reach backend at {url}: {exc.reason}") from exc

        if not body:
            return None
        if "application/json" in content_type:
            try:
                return json.loads(body)
            except JSONDecodeError:
                return body
        return body

    def get(self, path: str) -> Any:
        return self.request("GET", path)

    def post(self, path: str, payload: dict[str, Any]) -> Any:
        return self.request("POST", path, payload)

    def put(self, path: str, payload: dict[str, Any]) -> Any:
        return self.request("PUT", path, payload)


def create_customers(api: ApiClient) -> list[dict[str, Any]]:
    if api.dry_run:
        for customer in CUSTOMERS:
            api.post("/api/customer", customer)
        return CUSTOMERS

    existing_customers = api.get("/api/customer")
    existing_by_phone = {
        customer.get("phone"): customer
        for customer in existing_customers
        if customer.get("phone")
    }

    for customer in CUSTOMERS:
        if customer["phone"] not in existing_by_phone:
            api.post("/api/customer", customer)

    customers = api.get("/api/customer")
    seeded_phones = {customer["phone"] for customer in CUSTOMERS}
    return [customer for customer in customers if customer.get("phone") in seeded_phones]


def create_products(api: ApiClient) -> list[dict[str, Any]]:
    if api.dry_run:
        products = []
        for product in PRODUCTS:
            api.post("/api/product", product)
            products.append(product)
        return products

    existing_products = api.get("/api/product")
    existing_by_name = {
        product.get("name"): product
        for product in existing_products
        if product.get("name")
    }

    products = []
    for product in PRODUCTS:
        if product["name"] in existing_by_name:
            existing = existing_by_name[product["name"]]
            updated = api.put(f"/api/product/{existing['id']}", product)
            products.append(updated)
        else:
            products.append(api.post("/api/product", product))
    return products


def create_sales(api: ApiClient, customers: list[dict[str, Any]], products: list[dict[str, Any]], count: int) -> None:
    if api.dry_run:
        customers = [{**customer, "id": f"dry-customer-{index}"} for index, customer in enumerate(customers, start=1)]
        products = [{**product, "id": f"dry-product-{index}"} for index, product in enumerate(products, start=1)]

    for _ in range(count):
        customer = random.choice(customers)
        basket_size = random.randint(1, 3)
        chosen_products = random.sample(products, k=basket_size)
        items = [
            {"productId": product["id"], "quantity": random.randint(1, 4)}
            for product in chosen_products
        ]

        api.post(
            "/api/sales",
            {
                "customerId": customer["id"],
                "customerPhone": customer["phone"],
                "customerName": customer["name"],
                "items": items,
            },
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed SmartStock fake data through the backend API.")
    parser.add_argument("--base-url", default="http://localhost:8080", help="Spring backend base URL.")
    parser.add_argument("--sales", type=int, default=100, help="Number of fake sales to create.")
    parser.add_argument("--timeout", type=int, default=10, help="HTTP timeout in seconds.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for repeatable sale baskets.")
    parser.add_argument("--dry-run", action="store_true", help="Print write requests without sending them.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.sales < 0:
        print("--sales must be zero or greater", file=sys.stderr)
        return 2

    random.seed(args.seed)
    api = ApiClient(base_url=args.base_url, timeout=args.timeout, dry_run=args.dry_run)

    try:
        customers = create_customers(api)
        products = create_products(api)
        create_sales(api, customers, products, args.sales)
    except RuntimeError as exc:
        print(exc, file=sys.stderr)
        return 1

    action = "Prepared" if args.dry_run else "Seeded"
    print(f"{action} {len(CUSTOMERS)} customers, {len(PRODUCTS)} products, and {args.sales} sales.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
