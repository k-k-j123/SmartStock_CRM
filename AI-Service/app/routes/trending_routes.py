from fastapi import APIRouter, HTTPException
from app.services.trending_service import get_all_trending_products, fetch_trending_products

router = APIRouter(
    prefix="/api/trending",
    tags=["trending"]
)

@router.get("/")
async def get_trending():
    try:
        return await get_all_trending_products()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{category}")
async def get_trending_by_category(category: str):
    try:
        products = await fetch_trending_products(category)
        if not products and category not in ["electronics", "beauty", "grocery"]:
             raise HTTPException(status_code=404, detail="Category not found")
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
