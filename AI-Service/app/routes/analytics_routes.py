from fastapi import APIRouter, Depends
from typing import List
from app.models import ProductSales, RestockSuggestion, LoyalCustomer, AIRecommendations
from app.services.analytics_service import get_best_selling_products, get_loyal_customers
from app.services.prediction_service import get_restock_suggestions

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/best-products", response_model=List[ProductSales])
def best_products():
    return get_best_selling_products()

@router.get("/restock-suggestions", response_model=List[RestockSuggestion])
def restock_suggestions():
    return get_restock_suggestions()

@router.get("/loyal-customers", response_model=List[LoyalCustomer])
def loyal_customers():
    return get_loyal_customers()

@router.get("/recommendations", response_model=AIRecommendations)
def recommendations():
    return {
        "bestSellingProducts": get_best_selling_products(),
        "restockSuggestions": get_restock_suggestions(),
        "loyalCustomers": get_loyal_customers()
    }
