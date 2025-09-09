# SecureAuth - Multi-Device Authentication Platform

A professional FastAPI + NextJS + Auth0 authentication system with intelligent N-device session management.

## Features

✅ **Multi-Device Authentication** - Control how many devices can be logged in simultaneously  
✅ **Intelligent Session Management** - Force logout from selected devices when limit is reached  
✅ **Real-time Session Monitoring** - View and manage active sessions across all devices  
✅ **Professional UI/UX** - Modern gradient design with smooth animations  
✅ **Secure JWT Validation** - Enterprise-grade Auth0 integration  
✅ **User Profile Management** - Display and edit full name and phone number  

## Project Structure

```
authProject/
├── frontend/          # NextJS application with Tailwind CSS
│   ├── components/    # React components (Layout, Modals, etc.)
│   ├── pages/        # NextJS pages (Dashboard, Profile, Sessions)
│   ├── hooks/        # Custom React hooks
│   └── lib/          # API client and utilities
├── backend/          # FastAPI application
│   ├── app/         # Application code
│   │   ├── api/     # API endpoints
│   │   ├── models/  # SQLAlchemy models
│   │   ├── services/# Business logic
│   │   └── dependencies/ # Auth dependencies
│   └── migrations/  # Database migrations
└── start.bat         # Easy startup script
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Auth0 account (already configured)

### Installation

1. **Backend Setup**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Frontend Setup**:
```bash
cd frontend
npm install
```

3. **Run Application**:
```bash
# Easy way - double click start.bat
# Or manually:
# Terminal 1: cd backend && python -m uvicorn app.main:app --reload
# Terminal 2: cd frontend && npm run dev
```

## How It Works

### N-Device Functionality
1. **Device Limit Configuration**: Set `MAX_DEVICES_PER_USER=3` in backend/.env
2. **Session Creation**: When user logs in, system checks active session count
3. **Limit Exceeded**: If N+1 device tries to login, user sees device selection modal
4. **Force Logout**: User can select which device to logout and continue with new device
5. **Graceful Logout**: Logged out device shows graceful logout message on next visit

### User Profile Display
- **Dashboard**: Shows full name and phone number prominently
- **Profile Page**: Allows editing of full name and phone number
- **Real-time Updates**: Changes reflect immediately across the application

## Usage

1. **Run the application**: Double-click `start.bat` or run both services manually
2. **Access frontend**: http://localhost:3000
3. **Login with Auth0**: Click "Sign In Securely"
4. **Test N-device limit**: Login from multiple browsers/devices
5. **Manage sessions**: Visit Sessions page to view and terminate active sessions

## Testing the N-Device Feature

1. Login from Browser 1 (Chrome)
2. Login from Browser 2 (Firefox) 
3. Login from Browser 3 (Edge)
4. Try to login from Browser 4 - Device selection modal appears
5. Select a device to logout and continue
6. Check the logged out browser - shows graceful logout message

## Configuration

### Backend (.env)
```env
MAX_DEVICES_PER_USER=3
SESSION_TIMEOUT_MINUTES=30
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
```

### Frontend (.env.local)
```env
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Architecture

- **Frontend**: NextJS with TypeScript, Tailwind CSS, Auth0 SDK
- **Backend**: FastAPI with SQLAlchemy, JWT validation, session management
- **Database**: SQLite (easily configurable to PostgreSQL)
- **Authentication**: Auth0 with JWT tokens
- **Session Storage**: Database-backed with automatic cleanup

## Key Components

- **DeviceSelectionModal**: Handles N+1 device login scenario
- **SessionService**: Manages device sessions and limits
- **AuthContext**: Handles authentication state
- **ProtectedRoute**: Ensures authenticated access
- **Professional UI**: Modern gradient design with animations