# Databutton app

This project consists of a FastAPI backend server and a React + TypeScript frontend application.

## Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Python FastAPI

## 🚀 Quickstart (Docker) - Recommended

The easiest way to run the application is using Docker. This works for both local development and deployment.

1. **Start the application**:
    ```bash
    docker compose up --build
    ```

2. **Access the app**:
    - Frontend: <http://localhost>
    - Backend API Docs: <http://localhost:8000/docs>

## 🛠️ Manual Setup

If you cannot use Docker, you can run the services manually.

### Backend

1. **Install dependencies**:
    ```bash
    cd backend
    bash install.sh
    ```

2. **Run the server**:
    ```bash
    bash run.sh
    ```
    The backend runs on <http://localhost:8000>.

### Frontend

1. **Install dependencies** (using npm):
    ```bash
    cd frontend
    npm install --legacy-peer-deps
    ```

2. **Run the development server**:
    ```bash
    npm run dev
    ```
    The frontend runs on <http://localhost:5173>.

## Deployment

See [deployment_guide.md](deployment_guide.md) for instructions on how to deploy to a Hostinger VPS.
