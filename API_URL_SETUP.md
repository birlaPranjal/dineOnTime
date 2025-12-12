# Setting Up API URL for Production

## Problem
The frontend at `https://dine-onn-time.vercel.app` is trying to call `http://localhost:3001` because the `NEXT_PUBLIC_API_URL` environment variable is not set in Vercel.

## Solution

### Step 1: Find Your Backend API URL

Your backend API should be deployed separately. Common locations:
- If deployed on Vercel: `https://your-api-project.vercel.app`
- If deployed on Railway: `https://your-project.railway.app`
- If deployed on Render: `https://your-project.onrender.com`
- Or any other hosting service

### Step 2: Set Environment Variable in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your frontend project (`dine-onn-time` or similar)
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** Your backend API URL (e.g., `https://your-api.vercel.app`)
   - **Environment:** Production (and Preview if needed)
5. Click **Save**
6. **Redeploy** your application for the changes to take effect

### Step 3: Verify

After redeploying, check the browser console on `https://dine-onn-time.vercel.app/admin/login`. You should see:
- ✅ API calls going to your production API URL
- ❌ No more calls to `localhost:3001`

## Example

If your backend is deployed at `https://dineontime-api.vercel.app`, set:
```
NEXT_PUBLIC_API_URL=https://dineontime-api.vercel.app
```

## Troubleshooting

### Still seeing localhost?
1. Make sure you redeployed after adding the environment variable
2. Check that the variable name is exactly `NEXT_PUBLIC_API_URL` (case-sensitive)
3. Verify it's set for the Production environment
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### CORS Errors?
Make sure your backend CORS configuration includes:
```javascript
allowedOrigins: [
  "https://dine-onn-time.vercel.app",
  // ... other origins
]
```

## Quick Fix Command (Vercel CLI)

If you have Vercel CLI installed:

```bash
cd frontend
vercel env add NEXT_PUBLIC_API_URL production
# Enter your API URL when prompted
vercel --prod  # Redeploy
```

