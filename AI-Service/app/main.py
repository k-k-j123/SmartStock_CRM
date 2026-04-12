from fastapi import FastAPI
from app.routes.analytics_routes import router as analytics_router
from app.routes.trending_routes import router as trending_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SmartStock AI Microservice",
    description="AI-driven business analytics for SmartStock CRM",
    version="1.0.0"
)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routes
app.include_router(analytics_router)
app.include_router(trending_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to SmartStock AI Microservice"}
