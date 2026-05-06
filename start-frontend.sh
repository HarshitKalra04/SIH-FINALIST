#!/bin/bash

echo "🚀 Starting AgroVision Frontend..."

cd /workspace/frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the dev server with network access
echo "✨ Starting Vite dev server..."
npm run dev -- --host
