# Calus - AI-Powered Fraud Detection

This is a full-stack application built with React, Express, and SQLite.

## Features
- **Fluid UI**: responsive dashboard using Tailwind CSS and Motion.
- **AI Assessment**: Uses Google Gemini to analyze transaction risk.
- **Persistence**: SQLite database for transaction history and audit logs.
- **Architecture**: Separated Frontend and Backend directories.

---

## Getting Started in VS Code

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher)
- [VS Code](https://code.visualstudio.com/)

### 2. Installation
Open your terminal in the project root and run:
```bash
npm install
```

### 3. Environment Setup
Create a file named `.env` in the root directory and add your Google Gemini API Key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```
*Note: You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

### 4. Run the Application
Start the unified development server (Backend + Frontend):
```bash
npm run dev
```

### 5. Open in Browser
Visit [http://localhost:3000](http://localhost:3000) to scan transactions.

---

## Project Structure
- `/frontend`: React application (Vite).
- `/backend`: API logic, AI services, and SQLite helpers.
- `server.ts`: The main Express server entry point.
- `calus.db`: The SQLite database file (generated after first run).
