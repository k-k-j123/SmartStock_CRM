from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductSales(BaseModel):
    productId: str
    name: str
    quantitySold: int
    totalRevenue: float

class RestockSuggestion(BaseModel):
    product: str
    currentStock: int
    predictedDemand: int
    suggestedOrder: int

class LoyalCustomer(BaseModel):
    customerId: str
    name: str
    phone: str
    totalSpent: float
    lastVisit: Optional[datetime]

class AIRecommendations(BaseModel):
    bestSellingProducts: List[ProductSales]
    restockSuggestions: List[RestockSuggestion]
    loyalCustomers: List[LoyalCustomer]
