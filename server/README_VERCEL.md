# Vercel Deployment Guide for Server

## Overview

This server is configured to deploy on Vercel as serverless functions. The Express app is wrapped in a Vercel serverless function format.

## Deployment Steps

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
cd server
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account/team)
# - Link to existing project? No (for first deployment)
# - Project name? dineontime-server (or your preferred name)
# - Override settings? No
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset:** Other
   - **Root Directory:** `server`
   - **Build Command:** `npm run vercel-build` (or leave empty, Vercel will auto-detect)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`

### 3. Configure Environment Variables

In your Vercel project settings, add these environment variables:

**Required:**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://your-frontend.vercel.app
```

**Optional (for email functionality):**
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
PORT=3001
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Project Structure

```
server/
├── api/
│   └── index.ts          # Vercel serverless function entry point
├── src/
│   ├── routes/           # Express routes
│   ├── middleware/       # Express middleware
│   ├── lib/              # Utility functions
│   └── config/           # Configuration files
├── vercel.json           # Vercel configuration
└── package.json
```

## How It Works

1. **Vercel Serverless Function**: `api/index.ts` wraps the Express app
2. **Routes**: All routes are mounted under `/api/*` paths
3. **Middleware**: CORS, JSON parsing, and cookie parsing are configured
4. **Environment Variables**: Loaded automatically by Vercel

## API Endpoints

Once deployed, your API will be available at:
- `https://your-project.vercel.app/api/auth/*`
- `https://your-project.vercel.app/api/insights/*`
- `https://your-project.vercel.app/api/dashboard/*`
- `https://your-project.vercel.app/api/partnership/*`
- `https://your-project.vercel.app/api/restaurant/*`
- `https://your-project.vercel.app/health` (health check)

## Environment Variables Reference

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `FRONTEND_URL` - Frontend application URL (for CORS)

### Optional
- `GMAIL_USER` - Gmail address for sending emails
- `GMAIL_APP_PASSWORD` - Gmail app password for authentication
- `PORT` - Server port (not used in serverless, but kept for compatibility)
- `NODE_ENV` - Node environment (automatically set by Vercel)

## Troubleshooting

### Build Errors

1. **TypeScript Errors**: 
   - Run `npm run type-check` locally to check for errors
   - Ensure all dependencies are in `package.json`

2. **Module Not Found**:
   - Check that all imports use correct paths
   - Verify `tsconfig.json` is properly configured

### Runtime Errors

1. **MongoDB Connection Issues**:
   - Verify `MONGODB_URI` is set correctly
   - Check MongoDB Atlas IP whitelist (allow all IPs for serverless: `0.0.0.0/0`)

2. **CORS Errors**:
   - Update `FRONTEND_URL` to match your frontend domain
   - Check that CORS middleware is configured correctly

3. **Function Timeout**:
   - Default timeout is 10 seconds
   - Increased to 30 seconds in `vercel.json`
   - For longer operations, consider optimizing or using background jobs

### Common Issues

- **"Cannot find module"**: Ensure all dependencies are listed in `package.json`
- **"Function timeout"**: Optimize database queries or increase timeout in `vercel.json`
- **"CORS error"**: Update `FRONTEND_URL` environment variable

## Local Development

For local development, continue using:

```bash
npm run dev
```

This runs the Express server directly (not as a serverless function).

## Production vs Development

- **Development**: Uses `src/index.ts` (Express server on port 3001)
- **Production (Vercel)**: Uses `api/index.ts` (Serverless function)

Both use the same routes and middleware, just different entry points.

## Monitoring

- Check Vercel dashboard for function logs
- Monitor function execution time and errors
- Set up alerts for function failures

## Security Notes

- Never commit `.env` files
- Use Vercel's environment variable encryption
- Rotate `JWT_SECRET` regularly
- Use MongoDB Atlas IP whitelisting
- Enable MongoDB authentication

## Support

For issues:
1. Check Vercel function logs
2. Test endpoints with Postman/curl
3. Verify environment variables are set
4. Check MongoDB connection status



