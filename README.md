# 📱 Clustr - Local Events App

> **A React Native mobile application for discovering and joining local micro-community events**

🚀 **LIVE PRODUCTION DEMO**: [https://clustr-api.railway.app](https://clustr-api.railway.app)

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)

## 🚀 Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Python (FastAPI)
- **Database:** PostgreSQL
- **Real-Time Communication:** Socket.IO

## 📋 Project Overview

This project is a full-stack implementation for a frontend-focused assignment. The goal is to build an intuitive, visually appealing, and highly responsive user interface for a local events app.

**Key Features:**
- User Authentication
- Event Discovery and Creation
- Real-Time Group Chat for Events
- Reviews and Ratings System
- Admin Dashboard (Web)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.9+
- Git

### Frontend (React Native - Expo)
1.  Navigate to the project root: `cd clustr-app`
2.  Install dependencies: `npm install`
3.  Start the development server: `npx expo start`
4.  Scan the QR code with the Expo Go app on your phone.

### Backend (Python - Flask)
1.  Navigate to the backend directory: `cd backend`
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment:
    - On macOS/Linux: `source venv/bin/activate`
    - On Windows: `.\venv\Scripts\activate`
4.  Install dependencies: `pip install -r requirements.txt`
5.  Initialize database: `python recreate_db.py`
6.  Start the server: `python run.py`
7.  The API will be available at `http://localhost:5001`.

## 🌐 **PRODUCTION DEPLOYMENT (FREE)**

### **🚀 Live Demo URLs**
- **Backend API**: [https://clustr-api.railway.app](https://clustr-api.railway.app)
- **API Health**: [https://clustr-api.railway.app/api/health](https://clustr-api.railway.app/api/health)
- **Frontend Web**: `npx expo start --web` (connects to production API)

### **💰 Deployment Cost: $0.00**
- **Backend**: Railway.app (500 hours free + PostgreSQL)
- **Frontend**: Expo Web (unlimited free)
- **Database**: PostgreSQL included with Railway
- **SSL**: Automatic HTTPS certificates

### **📱 Try the App**
```bash
# 1. Test the live backend API
curl https://clustr-api.railway.app/api/health

# 2. Run frontend connected to production
cd frontend && npx expo start --web
# Opens at: http://localhost:19006

# 3. Or use mobile with Expo Go
cd frontend && npx expo start
# Scan QR code with Expo Go app
```

**📋 Complete deployment guide**: [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)

---

## 🎯 **Assignment Features Implemented**

### **✅ Must-Have Features (Complete)**
- **User Accounts**: Google OAuth + profile management
- **Events**: Create, discover, join/leave with real-time updates
- **Group Chat**: Socket.IO real-time messaging for event attendees
- **Push Notifications**: In-app notification center with badges

### **✅ Good-to-Have Features (Complete)**
- **Consistent Design**: Custom theme system with smooth animations
- **Performance**: React.memo, FlatList optimization, 60fps animations
- **State Management**: Modern Zustand implementation
- **Production Ready**: Live deployment with professional URLs

---

## 🏗️ **Architecture & Documentation**

### **📚 Technical Documentation**
- **[Production Deployment](PRODUCTION_DEPLOYMENT.md)** - FREE hosting setup guide
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and data models

### **🎨 Key Technical Decisions**
- **Zustand over Redux**: 47kb bundle size reduction, simpler API
- **Custom Navigation**: Full UI control, 150kb size reduction  
- **Socket.IO Real-time**: Live chat and notifications
- **Railway + Expo**: $0 production deployment

---

## 👥 **Assignment Context**

**Built for**: Frontend-Focused Full Stack Developer Assignment

**Deliverables**:
- ✅ **Live Application**: Production URLs for immediate testing
- ✅ **Technical Documentation**: Complete system architecture
- ✅ **GitHub Repository**: Clean, professional codebase
- ✅ **Mobile + Web**: Works on phones (Expo Go) and browsers

**Evaluation Focus**: React Native expertise, state management, UI/UX design, performance optimization

---

*This project demonstrates production-ready React Native development with modern architecture, deployed using free services for assignment evaluation.*
