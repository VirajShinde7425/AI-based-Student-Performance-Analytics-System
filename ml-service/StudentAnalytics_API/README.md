# 🎓 AI-Based Student Performance Analytics API

A Machine Learning powered Flask REST API developed as part of the CDAC Final Project.

The system analyzes student academic performance, predicts overall scores using a trained Machine Learning model, generates personalized recommendations, and provides analytics for Students, Teachers, and Administrators.

---

# Project Architecture

```
                    ASP.NET Core Web Application
         (Authentication, CRUD, PostgreSQL, PDF, Email)

                              │
                              │ HTTP REST
                              ▼

           Flask Machine Learning Analytics API

        ┌──────────────────────────────────────┐
        │ Student Analytics                    │
        │ Score Prediction                     │
        │ Class Analytics                      │
        │ Teacher Dashboard Analytics          │
        │ Admin Dashboard Analytics            │
        └──────────────────────────────────────┘
```

---

# Technologies Used

### Backend

- Python 3
- Flask
- Flask REST API
- python-dotenv

### Machine Learning

- Scikit-Learn
- Pandas
- NumPy
- Joblib

### Development

- VS Code
- Postman
- Git
- GitHub

---

# Features

## Student

- Student Performance Analysis
- ML-based Score Prediction
- Personalized Recommendations
- Academic Insights
- Strength & Weakness Analysis

## Teacher

- Class Analytics
- Class Performance Summary
- Risk Student Identification
- Attendance Analysis
- Performance Charts

## Administrator

- Department Statistics
- Overall Institute Performance
- Attendance Overview
- Student Risk Analysis

---

# Machine Learning Model

### Input Features

- Attendance
- Internal Marks
- Assignment Marks
- Practical Marks
- Quiz Marks

### Output

- Predicted Total Score

Current model performance:

| Metric | Value |
|---------|------:|
| MAE | ~4.0 |
| RMSE | ~4.8 |
| R² Score | ~0.60 |

---

# API Endpoints

| Method | Endpoint | Description |
|----------|------------------------------|-------------------------------|
| POST | `/api/v1/predict` | Predict Student Score |
| POST | `/api/v1/student/analytics` | Generate Student Analytics |
| POST | `/api/v1/class-analytics` | Generate Class Analytics |
| GET | `/api/v1/student/<studentId>` | Student Dashboard |
| GET | `/api/v1/teacher/dashboard` | Teacher Dashboard |
| GET | `/api/v1/admin/dashboard` | Admin Dashboard |
| GET | `/api/v1/health` | Health Check |

---

# Project Structure

```
StudentAnalytics_API/

│── app.py
│── config.py
│── requirements.txt
│── README.md
│── API_DOCUMENTATION.md
│── .env

├── data/
├── errors/
├── ml/
├── models/
├── routes/
├── services/
├── validators/
├── utils/
├── logs/
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Create Virtual Environment

```bash
python -m venv venv
```

Activate Environment

Windows

```bash
venv\Scripts\activate
```

Linux/macOS

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Application

```bash
python app.py
```

---

# Configuration

Create a `.env` file.

Example:

```env
DEBUG=True
HOST=127.0.0.1
PORT=5000

API_VERSION=v1

PROJECT_NAME=AI-Based Student Performance Analytics API

MODEL_PATH=models/student_performance_model.pkl
```

---

# Integration with ASP.NET

This API is designed to work as an independent Machine Learning microservice.

The ASP.NET application is responsible for:

- Authentication
- Database Operations
- Student Management
- Teacher Management
- PDF Generation
- Email Services

The Flask API is responsible for:

- Prediction
- Analytics
- Recommendation Generation
- Machine Learning Inference

Communication between both applications happens through REST APIs.

---

# Future Improvements

- PostgreSQL integration
- JWT Authentication
- AI Chatbot Integration
- Automated PDF Reports
- Email Report Generation
- Model Retraining Pipeline
- Docker Deployment

---

# Project Team

Developed as part of the CDAC Final Project.

Machine Learning Analytics Service developed using Flask and Scikit-Learn as one component of the AI-Based Student Performance Analytics System.