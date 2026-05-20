#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS=()

cleanup() {
  echo
  echo "Stopping services..."

  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
}

trap cleanup EXIT INT TERM

echo "Starting All Services..."

echo "Starting AI Service on port 8000..."
(
  cd "$ROOT_DIR/AI-Service"
  source ~/python-venv/bin/activate
  uvicorn app.main:app --port 8000
) &
PIDS+=("$!")

echo "Starting Backend Service..."
(
  cd "$ROOT_DIR/Backend"
  ./mvnw spring-boot:run
) &
PIDS+=("$!")

echo "Starting Frontend Service..."
(
  cd "$ROOT_DIR/Frontend"
  npm run dev
) &
PIDS+=("$!")

echo "All services started."
echo "AI Service: http://localhost:8000"
echo "Frontend:   http://localhost:5173"
echo "Press Ctrl+C to stop all services."

wait
