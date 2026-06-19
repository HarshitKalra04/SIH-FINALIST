#!/bin/bash

echo "🔧 Setting up AgroVision development environment..."

# Install uv for Python package management
echo "📦 Installing uv..."
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.cargo/bin:$PATH"

# Setup Backend
echo "🐍 Setting up Python backend..."
cd /workspace/backend

# Create virtual environment with uv
uv venv

# Install Python dependencies
uv pip install -r pyproject.toml

# Setup Frontend
echo "⚛️  Setting up React frontend..."
cd /workspace/frontend

# Install Node dependencies
npm install

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy backend/.env.sample to backend/.env and add your API keys"
echo "2. Run 'npm run dev' in frontend/ to start the frontend"
echo "3. Run 'uvicorn main:app --reload --host 0.0.0.0' in backend/ to start the backend"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
