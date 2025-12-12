# CORS Configuration Explanation

## Why Your Domain Calls the API

The frontend application (`https://dine-onn-time.vercel.app`) makes API calls to your backend server from **multiple pages**:

1. **Admin Login** (`/admin/login`) - Calls `/api/auth/login`
2. **Customer Login** (`/customer/login`) - Calls `/api/auth/login`
3. **Restaurant Login** (`/restaurant/login`) - Calls `/api/auth/login`
4. **Dashboard Pages** - Call various `/api/dashboard/*` endpoints
5. **Restaurant Pages** - Call `/api/restaurant/*` endpoints
6. **Bookings Pages** - Call `/api/bookings/*` endpoints
7. **And many more...**

## How CORS Works

**Important:** CORS checks only the **origin** (protocol + domain + port), NOT the path!

- ✅ **Origin:** `https://dine-onn-time.vercel.app`
- ❌ **Path:** `/admin/login` (NOT used by CORS)

When a page at `https://dine-onn-time.vercel.app/admin/login` makes an API call, the browser sends the origin header as just:
```
Origin: https://dine-onn-time.vercel.app
```

The path (`/admin/login`) is **NOT** included in the origin header. This means:

- `https://dine-onn-time.vercel.app` in `allowedOrigins` covers **ALL pages** on that domain:
  - `/admin/login` ✅
  - `/customer/login` ✅
  - `/restaurant/dashboard` ✅
  - Any other path ✅

## Current Configuration

```typescript
const allowedOrigins = [
  "http://localhost:3000",                    // Local development
  "https://dine-onn-time.vercel.app",        // Production frontend (covers ALL paths)
  process.env.FRONTEND_URL,                   // Environment variable override
].filter(Boolean)
```

**The origin `https://dine-onn-time.vercel.app` is already configured and covers all paths!**

## Debugging CORS Issues

If you see CORS errors, check the server logs. The updated configuration now logs:
- 🚫 Blocked origins
- ✅ List of allowed origins

This helps identify if:
1. The origin is not in the allowed list
2. There's a typo in the domain
3. The request is coming from an unexpected source

