#!/usr/bin/env bash
set -e

# Change to project root directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "================================================================"
echo "    🚀 Starting Email Signature Studio (Full-Stack)            "
echo "================================================================"

# Check if Python virtualenv exists, create if missing
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating Python virtual environment in backend/venv..."
    python3 -m venv backend/venv
    ./backend/venv/bin/pip install -r backend/requirements.txt
fi

# Check frontend node_modules
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend Node.js packages..."
    (cd frontend && npm install)
fi

echo "🟢 Launching Python FastAPI Backend on http://127.0.0.1:8000 ..."
(cd backend && ./venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --reload) &
BACKEND_PID=$!

echo "🟢 Launching Node.js Vite Frontend on http://localhost:3000 ..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

# Handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down backend and frontend servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "✨ Services are up and running!"
echo "➡️  Frontend: http://localhost:3000"
echo "➡️  Backend Docs: http://127.0.0.1:8000/docs"
echo "Press Ctrl+C to stop both servers."

wait
