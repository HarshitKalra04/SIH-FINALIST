#!/bin/bash

echo "🚀 Starting AgroVision Backend..."

cd /workspace/backend

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Please copy .env.sample to .env and add your API keys:"
    echo "   cp backend/.env.sample backend/.env"
    echo ""
    read -p "Press Enter to continue anyway or Ctrl+C to exit..."
fi

# Activate virtual environment
source .venv/bin/activate

# Start the FastAPI server
echo "✨ Starting FastAPI server..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000
