# 🚀 Quick Start Guide - IoT Engagement System

## One-Click Setup (Windows PowerShell)

```powershell
# 1. Navigate to project
cd "C:\Users\athar\OneDrive\Desktop\IOT\iot Backend"

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev  # Runs on http://localhost:5000

# 3. In new terminal - Setup ML
cd ..\ml-model
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py  # Runs on http://localhost:8000

# 4. In new terminal - Setup Frontend
cd ..\frontend
npm install
npm start  # Runs on http://localhost:3000
```

## Docker Setup (Optional)

```bash
# Backend
docker build -t iot-backend ./backend
docker run -p 5000:5000 iot-backend

# ML Model
docker build -t iot-ml ./ml-model
docker run -p 8000:8000 iot-ml

# Frontend
docker build -t iot-frontend ./frontend
docker run -p 3000:3000 iot-frontend
```

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iot-engagement
JWT_SECRET=your_jwt_secret_key_here
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
```

### ML Model (.env)

```
ML_SERVICE_PORT=8000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Backend won't start

- Check MongoDB is running: Check MongoDB Compass or run `mongod`
- Check port 5000 isn't in use
- Clear node_modules: `rm -r node_modules && npm install`

### ML Service won't train

- Ensure Python 3.8+ installed: `python --version`
- Activate venv: `source venv/bin/activate` (Unix) or `venv\Scripts\activate` (Windows)
- Check dependencies: `pip list`

### Frontend blank/errors

- Clear browser cache
- Check backend is running on 5000
- Check frontend .env has correct API URL
- Check console for errors: F12

### Database issues

- Start MongoDB: `mongod` or use MongoDB Compass
- Check connection string in .env
- Ensure MongoDB port 27017 is available

## Testing the System

1. Visit `http://localhost:3000`
2. Register as Student/Parent/Teacher
3. Try mock dashboards
4. Check console for API calls

## Default Test Credentials (Mock)

```
Email: test@example.com
Password: test123
```

---

Need help? Check README.md for full documentation!
