# SmartStock CRM

SmartStock CRM is a full-stack inventory and customer relationship management app for small retail workflows. It combines product and customer management, sales tracking, low-stock monitoring, customer purchase history, email outreach, search, and analytics.

## Project Structure

```text
SmartStock_CRM/
├── Backend/      # Spring Boot API backed by MongoDB
├── Frontend/     # Vite + React + TypeScript dashboard
├── Analytics-Service/   # FastAPI analytics and trending microservice
├── seed_backend.py
├── run.sh
└── run.bat
```

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query, Recharts
- Backend: Java 21, Spring Boot, Spring Web MVC, Spring Data MongoDB, Spring Mail, OpenAPI UI
- Analytics service: FastAPI, Uvicorn, PyMongo, Pandas, scikit-learn
- Database: MongoDB

## Features

- Admin dashboard for products, customers, sales, analytics, and settings
- Product CRUD with stock quantity and low-stock thresholds
- Customer CRUD with purchase history and customer login flow
- Sales creation with itemized baskets and automatic customer/product updates
- Global search across products and customers
- Email outreach endpoint for customer messages
- Analytics for best-selling products, restock suggestions, loyal customers, and trending products
- Seed script for demo customers, products, and sales

## Prerequisites

- Java 21
- Node.js and npm
- Python 3.10+
- MongoDB connection string

## Environment Variables

Create the backend environment file at `Backend/.env`:

```properties
SPRING_MONGODB_URI=mongodb://localhost:27017/smartstock
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_email@example.com
SPRING_MAIL_PASSWORD=your_app_password
```

Create the analytics service environment file at `Analytics-Service/.env`:

```properties
MONGO_URI=mongodb://localhost:27017/smartstock
```

Optional frontend variables can be placed in `Frontend/.env`:

```properties
VITE_API_BASE_URL=http://localhost:8080
VITE_ANALYTICS_BASE_URL=http://localhost:8000
```

## Run Locally

### Option 1: Start all services

On Linux/macOS:

```bash
chmod +x run.sh
./run.sh
```

On Windows:

```bat
run.bat
```

The helper script starts:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Analytics service: `http://localhost:8000`

Note: `run.sh` expects a Python virtual environment at `~/python-venv`.

### Option 2: Start services manually

Backend:

```bash
cd Backend
./mvnw spring-boot:run
```

Analytics service:

```bash
cd Analytics-Service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

Frontend:

```bash
cd Frontend
npm install
npm run dev
```

## Demo Login

Admin login credentials are defined in the frontend:

```text
Email: admin@smartstock.com
Password: admin123
```

Customer login uses an existing customer record, usually by phone number from seeded data.

## Seed Demo Data

Start the backend first, then run:

```bash
python seed_backend.py
```

Useful options:

```bash
python seed_backend.py --sales 250
python seed_backend.py --base-url http://localhost:8080
python seed_backend.py --dry-run
```

The script creates demo customers, demo products, and randomized sales through the Spring backend API.

## API Overview

Backend endpoints:

- `GET /api/product`
- `POST /api/product`
- `PUT /api/product/{id}`
- `DELETE /api/product/{id}`
- `GET /api/product/low-stock?threshold=10`
- `GET /api/customer`
- `POST /api/customer`
- `GET /api/customer/{id}`
- `GET /api/customer/phone/{phone}`
- `PUT /api/customer/{id}`
- `DELETE /api/customer/{id}`
- `POST /api/customer/{id}/sendMail`
- `GET /api/sales`
- `POST /api/sales`
- `GET /api/sales/{id}`
- `GET /api/sales/customer/{customerId}`
- `DELETE /api/sales/{id}`
- `GET /api/search?query=term`

Analytics service endpoints:

- `GET /analytics/best-products`
- `GET /analytics/restock-suggestions`
- `GET /analytics/loyal-customers`
- `GET /analytics/recommendations`
- `GET /api/trending/`
- `GET /api/trending/{category}`

## Testing and Quality Checks

Backend tests:

```bash
cd Backend
./mvnw test
```

Frontend tests:

```bash
cd Frontend
npm test
```

Frontend lint:

```bash
cd Frontend
npm run lint
```

Frontend production build:

```bash
cd Frontend
npm run build
```

## Notes

- MongoDB must be reachable by both the backend and analytics service.
- The backend reads environment variables from `.env` in the project root or `Backend/.env`.
- The analytics service reads `MONGO_URI` from `Analytics-Service/.env`.
- CORS is configured for localhost and private network development origins.
- OpenAPI UI is available from the Spring backend when the app is running.
