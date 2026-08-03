# AI-Based Student Performance Analytics API

## Base URL

```
http://localhost:5000/api/v1
```

---

# Authentication

Currently authentication is **not implemented**.

The API is intended to be consumed internally by the ASP.NET Core application.

---

# Response Format

Successful Response

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

Error Response

```json
{
    "success": false,
    "message": "..."
}
```

---

# 1. Predict Student Score

## Endpoint

```
POST /predict
```

### Request

```json
{
    "attendance": 90,
    "internalMarks": 80,
    "assignmentMarks": 85,
    "practicalMarks": 88,
    "quizMarks": 84
}
```

### Response

```json
{
    "success": true,
    "message": "Prediction generated successfully.",
    "data": {
        "predictedScore": 79.44,
        "performance": "Good",
        "risk": "Low",
        "recommendations": [
            "Keep up the good work and stay consistent."
        ]
    }
}
```

---

# 2. Student Analytics

## Endpoint

```
POST /student/analytics
```

### Request

```json
{
    "studentId": "ST101",
    "name": "Pranav Mandavkar",
    "department": "MCA",
    "semester": 2,
    "email": "pranav@example.com",
    "attendance": 90,
    "internalMarks": 80,
    "assignmentMarks": 85,
    "practicalMarks": 88,
    "quizMarks": 84,
    "cgpa": 8.4
}
```

### Response

```json
{
    "success": true,
    "message": "Student analytics generated successfully.",
    "data": {
        "prediction": {},
        "insights": {}
    }
}
```

---

# 3. Class Analytics

## Endpoint

```
POST /class-analytics
```

### Request

```json
{
    "students": [
        {
            "studentId": "ST101",
            "name": "Pranav",
            "attendance": 90,
            "average": 84.25
        }
    ]
}
```

### Response

```json
{
    "success": true,
    "message": "Class analytics generated successfully.",
    "data": {
        "summary": {},
        "topPerformer": {},
        "lowestPerformer": {},
        "riskStudents": [],
        "charts": {}
    }
}
```

---

# 4. Student Dashboard

## Endpoint

```
GET /student/<studentId>
```

Returns complete student profile including:

- Student Details
- Academic Details
- Prediction
- Insights

---

# 5. Teacher Dashboard

## Endpoint

```
GET /teacher/dashboard
```

Returns

- Class Summary
- Charts
- Risk Students
- Top Performer
- Lowest Performer

---

# 6. Admin Dashboard

## Endpoint

```
GET /admin/dashboard
```

Returns

- Institute Summary
- Department Performance
- Overall Statistics

---

# Health Check

```
GET /health
```

Response

```json
{
    "status": "Healthy"
}
```

---

# Integration Flow

```
PostgreSQL

      │

ASP.NET Core

      │

HTTP POST

      │

Flask Analytics API

      │

JSON Response

      │

ASP.NET

      │

Charts
PDF
Email
Dashboard
```

---

# Notes

- Flask does not directly connect to PostgreSQL.
- ASP.NET fetches data from the database.
- ASP.NET sends student/class JSON to Flask.
- Flask performs analytics and prediction.
- Flask returns JSON.
- ASP.NET renders charts, dashboards, PDFs, and emails.