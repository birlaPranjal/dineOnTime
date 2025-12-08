# DineOnTime Server

Backend server for the DineOnTime application built with Node.js, Express, and TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT tokens
- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

## Development

Run the development server with hot reload:
```bash
npm run dev
```

## Production

Build the TypeScript code:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (requires authentication)

### Insights
- `GET /api/insights/customer` - Get customer insights (requires customer role)
- `GET /api/insights/admin` - Get admin insights (requires admin role)
- `GET /api/insights/restaurant` - Get restaurant insights (requires restaurant role)

### Health Check
- `GET /health` - Server health check

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── mongodb.ts      # MongoDB connection
│   ├── lib/
│   │   └── auth.ts         # Authentication utilities
│   ├── middleware/
│   │   └── auth.ts         # Authentication middleware
│   ├── routes/
│   │   ├── auth.ts         # Authentication routes
│   │   └── insights.ts     # Insights routes
│   └── index.ts            # Server entry point
├── .env.example            # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

