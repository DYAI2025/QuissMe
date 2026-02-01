# QuissMe Backend API

FastAPI backend for QuissMe - a couple entertainment app with quizzes, astrology compatibility, and relationship challenges.

## Features

- 🎯 50+ interactive quizzes
- 🌟 BaZi astrology compatibility calculations
- 🎮 Gamification with buff system
- 🤖 AI-powered pattern detection
- 🎪 30+ relationship challenges
- 🔐 JWT authentication
- 📊 Relationship insights

## Quick Start

### Docker (Recommended)

```bash
docker-compose up
```

API will be available at http://localhost:8000

### Local Development

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
docker-compose up -d postgres redis
uvicorn app.main:app --reload
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

```bash
pytest
```
