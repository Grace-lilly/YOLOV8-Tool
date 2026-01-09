# Aiding Eyes - AI-Powered Assistive Mobility Tool for Visually Impaired

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-brightgreen.svg)](https://fastapi.tiangolo.com/)

**Aiding Eyes** is an AI-powered web application that processes uploaded videos to detect obstacles, traffic signs, vehicles, and pedestrians using YOLOv8 object detection. It generates real-time audio narration guidance for visually impaired users to navigate safely.

## ✨ Features

- 🎥 **Video Upload & Recording** - Drag & drop or webcam recording
- 🧠 **Dual YOLOv8 Detection** - Official + custom-trained models
- 🔊 **Text-to-Speech Narration** - Real-time audio guidance
- 🎨 **Visual Overlays** - Bounding boxes on detected objects
- 🛡️ **Secure Authentication** - Clerk JWT token verification
- 📱 **Responsive UI** - React + TypeScript + shadcn/ui
- 🚀 **FastAPI Backend** - Production-ready API server

## 🏗️ Tech Stack

| Frontend | Backend | AI/ML | Infrastructure |
|----------|---------|-------|----------------|
| React 18 | FastAPI | YOLOv8 | Supabase |
| TypeScript | Python 3.12 | PyTorch | Clerk Auth |
| Vite | Uvicorn | Transformers | SQLite |
| shadcn/ui | OpenCV | MoviePy | Docker-ready |

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd aiding-eyes

2. Backend Setup
cd backend
pip install -r requirements.txt
# Copy your Supabase/Clerk keys to .env
cp .env.example .env
uvicorn main:app --reload --host 0.0.0.0 --port 5000

3. Frontend Setup
cd frontend
npm install
npm run dev

4. Access Application
Backend: http://localhost:5000
Frontend: http://localhost:8080

📁 Project Structure
aiding-eyes/
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── final_implementation_2.py # YOLO + TTS processing
│   ├── requirements.txt        # Python dependencies
│   ├── uploads/               # Temporary uploads
│   └── processed/             # Output videos
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── VideoUpload.tsx    # Main upload component
│   ├── package.json
│   └── vite.config.ts
└── README.md


🔧 Environment Variables
backend/.env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

frontend/.env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:5000


🧪 Model Files Required
Place these files in backend/:
yolov8n.pt          # Official YOLOv8 nano (auto-downloads)
best.pt            # Your custom-trained model

🎯 Usage
Upload video via drag & drop or webcam recording
Process - AI detects obstacles & generates narration
Download processed video with bounding boxes + audio guidance
Real-time feedback for safe navigation

🛠️ Development Commands
Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 5000

Frontend
cd frontend
npm install
npm run dev

📈 Performance
Frame Skip: Adjustable (default: 5)
Memory Usage: ~2-4GB per video
Processing Time: 10-30s for 30s video
Supported Formats: MP4, AVI, MOV, WMV, MKV

Built with ❤️ for accessibility