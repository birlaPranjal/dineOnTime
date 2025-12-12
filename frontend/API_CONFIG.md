# API Configuration Guide

## Overview

All API requests in this application use a centralized configuration that reads from the `NEXT_PUBLIC_API_URL` environment variable.

## Base URL Configuration

The base URL for all API requests is defined in `lib/api.ts`:

```typescript
export const API_URL = getApiUrl()
```

This constant:
- **Prioritizes** `NEXT_PUBLIC_API_URL` environment variable if set
- Falls back to `http://localhost:3001` for local development
- Is the **single source of truth** for server URLs throughout the application

## Usage

### Making API Requests

All API requests should use the centralized `apiRequest` function from `lib/api.ts`:

```typescript
import { apiRequest } from "@/lib/api"

// This automatically uses API_URL
const data = await apiRequest("/api/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password })
})
```

### Using API_URL Directly

If you need the base URL directly (rare), you can import it:

```typescript
import { API_URL } from "@/lib/api"

const fullUrl = `${API_URL}/api/some/endpoint`
```

## Environment Variable Setup

### Local Development

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Production (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** Your production API URL (e.g., `https://your-api.vercel.app`)
   - **Environment:** Production (and Preview if needed)
3. Redeploy your application

## Important Notes

- ✅ Always use `apiRequest` from `lib/api.ts` for API calls
- ✅ The `API_URL` constant is exported and can be imported if needed
- ❌ Never hardcode API URLs in components
- ❌ Never use `fetch` directly with hardcoded URLs
- ✅ All existing API functions in `lib/api.ts` already use `API_URL`

## Verification

Check the browser console:
- **Development:** You'll see `🔗 API Base URL: http://localhost:3001`
- **Production (with env var):** You'll see `✅ Using API URL: https://your-api.vercel.app`
- **Production (without env var):** You'll see warnings about missing `NEXT_PUBLIC_API_URL`

## Current Implementation

All API functions in `lib/api.ts` use the `API_URL` constant:
- `authApi.*` - Authentication endpoints
- `insightsApi.*` - Insights endpoints  
- `dashboardApi.*` - Dashboard endpoints
- `restaurantApi.*` - Restaurant endpoints
- `partnershipApi.*` - Partnership endpoints
- `tableApi.*` - Table management endpoints
- `bookingApi.*` - Booking endpoints

All components import and use these functions, ensuring consistent API URL usage across the entire application.

