# Server Vercel Deployment Setup

## ✅ Completed Setup

The server has been configured for Vercel serverless deployment. Here's what was done:

### 1. Created Vercel Serverless Function
- **File**: `server/api/index.ts`
- Wraps the Express app as a Vercel serverless function
- All routes are accessible via `/api/*` paths

### 2. Vercel Configuration
- **File**: `server/vercel.json`
- Configured for serverless function deployment
- Function timeout set to 30 seconds
- Memory set to 1024MB

### 3. TypeScript Fixes
- Fixed JWT payload type compatibility issues
- All TypeScript errors resolved
- Type checking passes

### 4. MongoDB Connection Optimization
- Updated connection handling for serverless environments
- Proper connection reuse across invocations

### 5. Build Script
- Added `vercel-build` script to `package.json`
- Ensures TypeScript compilation before deployment

## Deployment Steps

### Option 1: Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"

2. **Import Repository**
   - Connect your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: `npm run vercel-build` (or leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   FRONTEND_URL=https://your-frontend.vercel.app
   GMAIL_USER=your-email@gmail.com (optional)
   GMAIL_APP_PASSWORD=your-app-password (optional)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Vercel CLI

```bash
cd server
npm i -g vercel
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? dineontime-server
# - Override settings? No
```

Then set environment variables:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add FRONTEND_URL
```

## API Endpoints

Once deployed, your API will be available at:
- `https://your-project.vercel.app/api/auth/*`
- `https://your-project.vercel.app/api/insights/*`
- `https://your-project.vercel.app/api/dashboard/*`
- `https://your-project.vercel.app/api/partnership/*`
- `https://your-project.vercel.app/api/restaurant/*`
- `https://your-project.vercel.app/health` (health check)
- `https://your-project.vercel.app/` (root endpoint)

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing
- `FRONTEND_URL` - Frontend URL for CORS

### Optional
- `GMAIL_USER` - Gmail address for emails
- `GMAIL_APP_PASSWORD` - Gmail app password
- `PORT` - Not used in serverless (kept for compatibility)

## Project Structure

```
server/
├── api/
│   └── index.ts          # Vercel serverless entry point
├── src/
│   ├── routes/            # Express routes
│   ├── middleware/        # Auth middleware
│   ├── lib/               # Utilities (auth, email)
│   └── config/            # MongoDB config
├── vercel.json            # Vercel configuration
├── package.json
└── tsconfig.json
```

## Important Notes

1. **MongoDB Connection**: 
   - Ensure MongoDB Atlas allows connections from `0.0.0.0/0` (all IPs) for serverless
   - Or add Vercel's IP ranges to whitelist

2. **CORS Configuration**:
   - Update `FRONTEND_URL` to match your frontend domain
   - CORS is configured in `api/index.ts`

3. **Function Timeout**:
   - Default: 10 seconds (Hobby plan)
   - Pro plan: Up to 60 seconds
   - Currently set to 30 seconds in `vercel.json`

4. **Cold Starts**:
   - First request may be slower (cold start)
   - Subsequent requests are faster (warm start)
   - MongoDB connection is reused across invocations

## Testing Deployment

After deployment, test with:

```bash
# Health check
curl https://your-project.vercel.app/health

# Test API endpoint
curl https://your-project.vercel.app/api/auth/me
```

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run type-check`
- Verify all dependencies in `package.json`
- Check Vercel build logs

### Function Timeout
- Optimize database queries
- Increase timeout in `vercel.json` (requires Pro plan)
- Consider breaking long operations into smaller tasks

### MongoDB Connection Issues
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas IP whitelist
- Ensure MongoDB user has proper permissions

### CORS Errors
- Update `FRONTEND_URL` environment variable
- Check CORS configuration in `api/index.ts`

## Local Development

Continue using the existing dev setup:

```bash
cd server
npm run dev
```

This runs the Express server directly (not as serverless function).

## Production vs Development

- **Development**: `src/index.ts` - Express server on port 3001
- **Production (Vercel)**: `api/index.ts` - Serverless function

Both use the same routes and middleware.

## Next Steps

1. Deploy to Vercel
2. Set environment variables
3. Update frontend `NEXT_PUBLIC_API_URL` to point to Vercel server URL
4. Test all API endpoints
5. Monitor function logs in Vercel dashboard

## Support

For issues:
- Check Vercel function logs
- Test endpoints with Postman/curl
- Verify environment variables
- Check MongoDB connection status



