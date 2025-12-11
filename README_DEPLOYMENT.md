# Deployment Guide for Vercel

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your backend server deployed (can be on Vercel, Railway, Render, or any Node.js hosting)
3. MongoDB database (MongoDB Atlas recommended)

## Frontend Deployment Steps

### 1. Prepare Your Repository

The project is already configured for Vercel deployment. The frontend is in the `frontend/` directory.

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project root
cd /path/to/dineOnTime

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account/team)
# - Link to existing project? No (for first deployment)
# - Project name? dineontime (or your preferred name)
# - Directory? frontend
# - Override settings? No
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** `.next` (or leave default)
   - **Install Command:** `npm install` (or leave default)

### 3. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Important:** 
- Replace `https://your-backend-url.com` with your actual backend server URL
- The `NEXT_PUBLIC_` prefix makes the variable available in the browser
- Do NOT add any secrets here (they should be in your backend)

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Backend Deployment

The backend server should be deployed separately. Here are recommended options:

### Option 1: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select the `server/` directory
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT=3001`
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `server/`
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Add environment variables (same as Railway)

### Option 3: Vercel (Serverless Functions)
If you want to deploy backend on Vercel, you'll need to convert routes to serverless functions.

## Environment Variables Reference

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (Railway/Render/etc.)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

## Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS configured on backend to allow frontend domain
- [ ] Test login/register functionality
- [ ] Test API calls from frontend
- [ ] Verify MongoDB connection

## Troubleshooting

### Build Errors

1. **TypeScript Errors**: Check `frontend/tsconfig.json` and fix any type errors
2. **Missing Dependencies**: Run `npm install` in `frontend/` directory
3. **Environment Variables**: Ensure `NEXT_PUBLIC_API_URL` is set in Vercel

### Runtime Errors

1. **API Calls Failing**: 
   - Check `NEXT_PUBLIC_API_URL` is correct
   - Verify backend is running and accessible
   - Check CORS settings on backend

2. **CORS Errors**:
   - Update backend CORS to include your Vercel domain
   - Example: `origin: process.env.FRONTEND_URL || "https://your-app.vercel.app"`

### Common Issues

- **"Module not found"**: Run `npm install` in the frontend directory
- **Build timeout**: Increase build timeout in Vercel settings
- **API 404 errors**: Verify backend routes match frontend API calls

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Monitoring

- Vercel provides built-in analytics and monitoring
- Check deployment logs in Vercel dashboard
- Monitor backend logs in your hosting platform

## Support

For issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test API endpoints directly with Postman/curl



