# AgroVision - Gamified Platform for Sustainable Farming

**Team TRIBYTE's Final Contribution for Problem Statement PS25075**

A comprehensive platform combining gamified learning with AI-powered crop disease diagnosis to promote sustainable farming practices among Indian farmers.

---

## Project Demo

[![AgroVision Demo](https://img.youtube.com/vi/8zUWeQG9PRw/maxresdefault.jpg)](https://www.youtube.com/watch?v=8zUWeQG9PRw)

**[Watch Full Demo on YouTube](https://www.youtube.com/watch?v=8zUWeQG9PRw)**

---

## Project Overview

AgroVision is built around **two core modules** designed to educate and empower farmers:

### 1. **Duolingo-Based Learning Path Module**
An engaging, gamified educational platform that teaches sustainable farming practices through:
- **Interactive lessons** organized in a skill-tree format
- **Calibration quiz** to assess farmer's current knowledge level
- **Progressive difficulty** with units covering soil health, water management, pest control, and more
- **XP and leveling system** to track progress and maintain engagement
- **Panchayat leaderboards** to foster healthy competition among local farmers
- **Streak tracking** to encourage daily learning habits
- **PKVY rewards** (Paramparagat Krishi Vikas Yojana) for milestone achievements
- **Multi-language support** (7 Indian languages) for accessibility

This module follows a Duolingo-inspired approach where farmers progress through bite-sized lessons, earn points, unlock achievements, and compete with peers—making agricultural education fun and accessible.

### 2. **AI-Powered Disease Prediction Module**
A sophisticated diagnostic tool leveraging dual AI agents for accurate crop disease identification:
- **Multi-step diagnostic form** with image upload and contextual questions
- **Dual AI analysis** using OpenAI GPT-4 and Google Gemini 2.0 Pro
- **Weather integration** for environmental context
- **Real-time chat** for follow-up questions and clarifications
- **Treatment recommendations** with actionable steps
- **Historical tracking** of diagnoses and treatments

---

## Lessons Learned & Advice for Future SIH Aspirants

### **Our Experience: Why We Didn't Win First Place**

While we're proud of what we built, we learned valuable lessons that future participants should consider:

**The Core Issue:** We focused heavily on the **Disease Prediction module** (the "extra feature") and didn't fully polish the **Gamified Learning Path** (the core requirement of PS25075).

### **Key Takeaways for Future Participants:**

1. **Build the Core First**
   - The problem statement's primary requirement should be your **top priority**
   - Get the core functionality to a **production-ready state** before adding extras
   - Judges evaluate primarily based on how well you solve the stated problem

2. **Time Management is Critical**
   - We spent ~60% of our time on disease prediction (the "wow factor")
   - We should have spent ~80% on the learning platform (the actual requirement)
   - **Lesson:** Impressive extras don't compensate for an incomplete core

3. **Polish the Primary Feature**
   - Our learning module worked but lacked the refinement judges expected
   - The disease prediction was impressive but wasn't the main evaluation criteria
   - **Lesson:** A polished core beats a flashy extra every time

4. **Stick to the Problem Statement**
   - Read the PS multiple times and ensure you understand the **primary objective**
   - Additional features should **enhance**, not overshadow, the core solution
   - **Lesson:** Innovation is great, but relevance is critical

5. **Iterate on Core Features**
   - We should have done more user testing on the learning path
   - The disease prediction got all our testing attention
   - **Lesson:** Your best feature should be the one they asked for

### **What We Did Right:**

- Full-stack implementation with modern tech
- Excellent UI/UX with smooth animations
- Multi-language support for accessibility
- Comprehensive gamification mechanics
- Strong technical architecture

### **Our Advice:**

> **"Build what they asked for first, build it well, then add the extras."**

If you're working on a similar problem statement:
1. **Week 1-2:** Core feature development (80% complete)
2. **Week 3:** Polish and user testing of core features
3. **Week 4:** Add impressive extras that complement the core
4. **Final Days:** Integration, bug fixes, and presentation prep

Don't make our mistake—the judges want to see you solve **their problem** exceptionally well, not a different problem you found more interesting.

---

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS v4** for modern styling
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **Axios** for API communication

### Backend
- **FastAPI** for high-performance REST API
- **PostgreSQL** for robust data storage
- **Google Cloud Storage** for image management
- **OpenAI GPT-4** for AI diagnosis (Agent 1)
- **Google Gemini 2.0 Pro** for AI diagnosis (Agent 2)
- **SQLAlchemy** for database ORM

---

## Quick Start with Dev Container

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [VS Code](https://code.visualstudio.com/)
- [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sihproject
   ```

2. **Configure environment variables**
   ```bash
   # Backend configuration (REQUIRED for backend to work)
   cp backend/.env.sample backend/.env
   # Edit backend/.env and add your API keys

   # Frontend configuration (optional - frontend works without this)
   cp frontend/.env.sample frontend/.env
   ```

3. **Open in Dev Container**
   - Open the project in VS Code
   - Press `F1` or `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows)
   - Select: "Dev Containers: Reopen in Container"
   - Wait for the container to build and setup (first time takes 3-5 minutes)
   - Everything installs automatically!

4. **Start the services**

   **Option A - Using convenience scripts (Recommended):**
   ```bash
   # Terminal 1 - Frontend (React/Vite)
   ./start-frontend.sh

   # Terminal 2 - Backend (FastAPI) - only if you need backend
   ./start-backend.sh
   ```

   **Option B - Manual commands:**
   ```bash
   # Terminal 1 - Frontend
   cd frontend
   npm run dev -- --host

   # Terminal 2 - Backend
   cd backend
   source .venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Mobile: http://\<your-ip\>:5173 (when using --host flag)

## 📱 Mobile Access

To test on mobile devices on the same network:
```bash
cd frontend
npm run dev -- --host
```
Then access via `http://<your-ip>:5173` on your mobile device.

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **FastAPI** for REST API
- **PostgreSQL** for database
- **Google Cloud Storage** for image storage
- **OpenAI GPT-4** for AI diagnosis (Agent 1)
- **Google Gemini 2.0 Pro** for AI diagnosis (Agent 2)
- **SQLAlchemy** for ORM

## 🎮 Features

- **Multi-step form** with progress tracking
- **Gamification system** with points, levels, badges, and streaks
- **Dual AI agents** for accurate disease diagnosis
- **Weather integration** for contextual analysis
- **Real-time chat** for follow-up questions
- **Multi-language support** (7 Indian languages)
- **Mobile-optimized** responsive design

## 📋 Required API Keys

1. **OpenAI API Key**: https://platform.openai.com/api-keys
2. **Google Gemini API Key**: https://makersuite.google.com/app/apikey
3. **Google Cloud Storage**: https://console.cloud.google.com/storage
4. **Google Maps API Key**: https://console.cloud.google.com/apis/credentials

## 🗄️ Database Setup

The PostgreSQL database is automatically created in the dev container. To initialize tables:

```bash
cd backend
python -c "from app.database import init_db; init_db()"
```

## 🤝 Team Collaboration

### For Team Members Working on Frontend Only:

1. Install Docker Desktop and VS Code with Dev Containers extension
2. Clone the repository
3. Open in Dev Container (VS Code will handle everything)
4. Run `./start-frontend.sh` 
5. Start coding! UI will be running at http://localhost:5173

**Note:** You can work on the frontend without backend or API keys! The UI is fully functional independently.

### For Team Members Working on Full Stack:

1. Install Docker Desktop and VS Code with Dev Containers extension
2. Clone the repository
3. Copy `.env.sample` to `.env` and add API keys
4. Open in Dev Container
5. Run both `./start-frontend.sh` and `./start-backend.sh`
6. Full environment ready!

## 📝 Scripts

### Backend
```bash
# Run server
uvicorn main:app --reload --host 0.0.0.0

# Run with different port
uvicorn main:app --reload --host 0.0.0.0 --port 8001

# Install new dependency
uv add <package-name>
```

### Frontend
```bash
# Development server
npm run dev

# Development server with network access
npm run dev -- --host

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**PostgreSQL connection error:**
- Check if the database container is running: `docker ps`
- Verify DB_PASSWORD in `.env` matches docker-compose.yml

**API keys not working:**
- Ensure `.env` file is in the correct location
- Check for extra spaces or quotes in the API keys
- Restart the backend server after updating `.env`

## 📦 Project Structure

```
sihproject/
├── .devcontainer/          # Dev container configuration
│   ├── devcontainer.json
│   ├── docker-compose.yml
│   └── setup.sh
├── backend/                # FastAPI backend
│   ├── app/               # Application modules
│   ├── main.py            # Main application
│   ├── .env.sample        # Environment template
│   └── pyproject.toml     # Python dependencies
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.jsx       # Main component
│   │   └── index.css     # Styles
│   ├── .env.sample       # Environment template
│   └── package.json      # Node dependencies
└── README.md
```
