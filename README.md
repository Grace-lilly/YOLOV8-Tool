# 👁️ Aiding Eyes - AI-Powered Assistive Mobility Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/downloads/)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-brightgreen.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

> **Aiding Eyes** is an innovative AI-powered web application designed to assist visually impaired individuals in navigating their environment safely. By leveraging advanced computer vision (YOLOv8) and text-to-speech technology, the application processes video footage to detect obstacles, traffic signs, vehicles, and pedestrians, providing real-time audio narration guidance for independent mobility.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation & Setup](#-installation--setup)
- [⚙️ Configuration](#️-configuration)
- [📁 Project Structure](#-project-structure)
- [🎯 Usage Guide](#-usage-guide)
- [🛠️ Development](#️-development)
- [📊 Performance](#-performance)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎥 Video Processing
- **Multiple Upload Methods**: Drag & drop interface or direct webcam recording
- **Format Support**: MP4, AVI, MOV, WMV, MKV
- **Real-time Preview**: Instant video preview before processing
- **Batch Processing**: Upload and process multiple videos simultaneously

### 🧠 AI-Powered Detection
- **Dual YOLOv8 Models**: 
  - Official YOLOv8 nano model for general object detection
  - Custom-trained model for specialized obstacle recognition
- **Comprehensive Detection**: Identifies pedestrians, vehicles, traffic signs, obstacles, and more
- **Visual Overlays**: Bounding boxes and labels on detected objects in processed videos

### 🔊 Audio Guidance
- **Text-to-Speech Narration**: Real-time audio descriptions using Facebook MMS-TTS
- **Intelligent Descriptions**: Context-aware narration of detected objects
- **Synchronized Audio**: Audio guidance perfectly synced with video frames

### 🛡️ Security & Authentication
- **Clerk Integration**: Secure JWT-based authentication
- **Protected Routes**: All features require user authentication
- **User Profiles**: Personalized experience with user accounts

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility First**: WCAG-compliant interface with screen reader support
- **Beautiful Components**: Built with shadcn/ui and Tailwind CSS
- **Dark Mode Ready**: Theme-aware components for comfortable viewing

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | Modern UI framework |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool and dev server |
| **shadcn/ui** | High-quality component library |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router** | Client-side routing |
| **Clerk** | Authentication & user management |
| **TanStack Query** | Data fetching and caching |

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python web framework |
| **Python 3.12** | Backend runtime |
| **Uvicorn** | ASGI server |
| **OpenCV** | Computer vision and video processing |
| **PyTorch** | Deep learning framework |
| **Ultralytics YOLOv8** | Object detection models |
| **Transformers** | Text-to-speech models (MMS-TTS) |
| **MoviePy** | Video editing and composition |
| **Pydub** | Audio processing |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Supabase** | Database and backend services |
| **Clerk** | Authentication provider |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.12+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/downloads))
- **CUDA-capable GPU** (optional, but recommended for faster processing)

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd aiding-eyes
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create necessary directories (if not already present)
mkdir -p uploads processed temp

# Set up environment variables (see Configuration section)
# Copy .env.example to .env and fill in your credentials
```

### 3️⃣ Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install Node.js dependencies
npm install

# Set up environment variables (see Configuration section)
# Create .env file in root directory with required variables
```

### 4️⃣ Model Files

Ensure you have the required model files in the `backend/` directory:

- **`yolov8n.pt`**: Official YOLOv8 nano model (auto-downloads on first run)
- **`best.pt`**: Your custom-trained YOLOv8 model (required)

> **Note**: The `yolov8n.pt` model will be automatically downloaded by Ultralytics on first use if not present. Make sure you have `best.pt` in the backend directory for custom detection.

### 5️⃣ Start the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

### 6️⃣ Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/docs (FastAPI auto-generated docs)

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Server Configuration (optional)
HOST=0.0.0.0
PORT=5000

# Model Configuration (optional)
MODEL_DEVICE=cuda  # or 'cpu' if no GPU available
```

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# Backend API URL
VITE_BACKEND_URL=http://localhost:5000

# Supabase (if used in frontend)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **⚠️ Security Note**: Never commit `.env` files to version control. Add them to `.gitignore`.

---

## 📁 Project Structure

```
aiding-eyes/
├── backend/                      # Python FastAPI backend
│   ├── main.py                  # FastAPI application entry point
│   ├── final_implementation_2.py # YOLO + TTS processing logic
│   ├── requirements.txt         # Python dependencies
│   ├── yolov8n.pt              # Official YOLOv8 model
│   ├── best.pt                 # Custom-trained YOLOv8 model
│   ├── uploads/                # Temporary video uploads
│   ├── processed/              # Processed output videos
│   └── temp/                   # Temporary processing files
│
├── src/                         # React frontend source
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/            # Layout components
│   │   │   └── Navigation.tsx
│   │   ├── ui/                # shadcn/ui components
│   │   └── VideoRecorder.tsx  # Video recording component
│   ├── hooks/                 # Custom React hooks
│   │   ├── useClerkAuth.tsx   # Clerk authentication hook
│   │   └── use-toast.ts       # Toast notification hook
│   ├── pages/                 # Page components
│   │   ├── Index.tsx          # Home page
│   │   ├── About.tsx          # About page
│   │   ├── VideoUpload.tsx    # Video upload page
│   │   ├── Profile.tsx        # User profile page
│   │   ├── Auth.tsx           # Authentication page
│   │   └── NotFound.tsx       # 404 page
│   ├── integrations/          # Third-party integrations
│   │   └── supabase/          # Supabase client
│   ├── lib/                   # Utility functions
│   │   └── utils.ts           # Helper utilities
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Application entry point
│
├── supabase/                   # Supabase configuration
│   ├── functions/             # Edge functions
│   │   └── process-video/     # Video processing function
│   ├── migrations/            # Database migrations
│   └── config.toml           # Supabase config
│
├── public/                    # Static assets
├── package.json               # Node.js dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

---

## 🎯 Usage Guide

### For End Users

1. **Sign Up / Log In**
   - Navigate to the application
   - Create an account or log in using Clerk authentication

2. **Upload Video**
   - Go to the "Upload" page
   - Choose one of the following methods:
     - **Drag & Drop**: Drag video files into the upload area
     - **File Browser**: Click "Select Videos" to browse your files
     - **Webcam Recording**: Use the video recorder to capture live footage

3. **Process Video**
   - Click "Process Video" on any uploaded video
   - Wait for AI processing (typically 10-30 seconds for a 30-second video)
   - View the processed video with bounding boxes and audio narration

4. **Download Results**
   - Once processing is complete, download the processed video
   - The video includes visual overlays and synchronized audio guidance

### For Developers

#### Running in Development Mode

**Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

**Frontend:**
```bash
npm run dev
```

#### Building for Production

**Frontend:**
```bash
npm run build
# Output will be in the 'dist' directory
```

**Backend:**
```bash
# Use a production ASGI server like Gunicorn with Uvicorn workers
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:5000
```

---

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 5000

# Run with specific workers (production)
uvicorn main:app --workers 4 --host 0.0.0.0 --port 5000
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/process-video` | Upload and process a video file |
| `GET` | `/processed/{filename}` | Download processed video |
| `GET` | `/docs` | Interactive API documentation |

### Code Style

- **Frontend**: Follow React and TypeScript best practices
- **Backend**: Follow PEP 8 Python style guide
- Use ESLint for frontend linting
- Use type hints in Python code

---

## 📊 Performance

### Processing Metrics

- **Frame Skip**: Configurable (default: processes every frame)
- **Memory Usage**: ~2-4GB RAM per video processing
- **Processing Time**: 
  - 10-30 seconds for a 30-second video (CPU)
  - 5-15 seconds for a 30-second video (GPU with CUDA)
- **Supported Formats**: MP4, AVI, MOV, WMV, MKV
- **Max File Size**: 1GB per video

### Optimization Tips

1. **GPU Acceleration**: Use CUDA-enabled PyTorch for faster processing
2. **Frame Skipping**: Adjust frame processing rate for longer videos
3. **Batch Processing**: Process multiple videos sequentially
4. **Model Selection**: Use smaller models (nano) for faster inference

### System Requirements

**Minimum:**
- CPU: 4 cores
- RAM: 8GB
- Storage: 10GB free space

**Recommended:**
- CPU: 8+ cores
- RAM: 16GB+
- GPU: NVIDIA GPU with CUDA support
- Storage: 20GB+ free space

---

## 🧪 Model Information

### YOLOv8 Models

The application uses two YOLOv8 models:

1. **Official YOLOv8 Nano (`yolov8n.pt`)**
   - Pre-trained on COCO dataset
   - Detects 80 common object classes
   - Fast inference, good for general detection

2. **Custom Model (`best.pt`)**
   - Trained on custom dataset
   - Specialized for obstacle and hazard detection
   - Optimized for navigation scenarios

### Text-to-Speech

- **Model**: Facebook MMS-TTS (English)
- **Framework**: Hugging Face Transformers
- **Quality**: High-quality neural TTS

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clear, documented code
- Add tests for new features
- Follow existing code style
- Update documentation as needed
- Ensure accessibility compliance

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check Python version (3.12+)
- Verify all dependencies are installed
- Ensure model files are present
- Check port 5000 is not in use

**Frontend won't start:**
- Check Node.js version (18+)
- Delete `node_modules` and run `npm install` again
- Verify environment variables are set

**Video processing fails:**
- Check video format is supported
- Ensure file size is under 1GB
- Verify GPU drivers (if using CUDA)
- Check available disk space

**Authentication issues:**
- Verify Clerk keys are correct
- Check backend CORS settings
- Ensure frontend and backend URLs match

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Ultralytics** for YOLOv8 models
- **Facebook AI** for MMS-TTS
- **shadcn** for beautiful UI components
- **Clerk** for authentication infrastructure
- **FastAPI** for the excellent web framework

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review the API docs at `/docs` endpoint

---

**Built with ❤️ for accessibility and independence**

*Empowering visually impaired individuals through AI-powered navigation assistance*
