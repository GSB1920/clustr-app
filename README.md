# Clustr 🎉

Clustr is a mobile app designed to strengthen local communities by making it effortless to discover, create, and participate in hyper-local events and micro-communities.

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

### Backend (Python - FastAPI)
1.  Navigate to the backend directory: `cd backend`
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment:
    - On macOS/Linux: `source venv/bin/activate`
    - On Windows: `.\venv\Scripts\activate`
4.  Install dependencies: `pip install -r requirements.txt`
5.  Start the server: `uvicorn main:app --reload`
6.  The API will be available at `http://localhost:8000`.

## 📁 Architecture & Documentation

For a detailed overview of the system design, data models, and API endpoints, please see the [ARCHITECTURE.md](docs/ARCHITECTURE.md) document.

---

*This project was built as part of an assignment.*
