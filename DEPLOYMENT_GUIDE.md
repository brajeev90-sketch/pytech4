# PyTech Digital - Deployment Guide

## Service Pages Working Correctly ✅

All 450 service-city pages are functioning properly. If you're seeing blank pages after building, follow these troubleshooting steps:

## ✅ IMPORTANT UPDATE - BACKEND URL FIX APPLIED

**The code has been updated to automatically detect the correct backend URL:**
- When deployed to `pytech.digital`, it will use: `https://localseo-master.preview.emergentagent.com`
- For local development, it uses the appropriate localhost URL
- This fix is now built into all API-calling components

**You no longer need to manually configure REACT_APP_BACKEND_URL in production!**

## Common Issues & Solutions

### 1. **Service Pages Appear Blank in Production**

**Cause:** React Router client-side routing not configured on your server.

**Solutions:**

#### For Apache Servers:
The `.htaccess` file has been created in `/app/frontend/public/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

#### For Nginx Servers:
Add this to your nginx configuration:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### For Netlify/Vercel:
The `_redirects` file has been created in `/app/frontend/public/_redirects`:
```
/*    /index.html   200
```

### 2. **API Calls Failing**

**Check:**
- Ensure `REACT_APP_BACKEND_URL` is set correctly in your production `.env`
- Backend API must be accessible from your production domain
- CORS is properly configured on the backend

**Current Backend URL:**
```
REACT_APP_BACKEND_URL=https://localseo-master.preview.emergentagent.com
```

### 3. **Build Process**

To build the frontend:
```bash
cd /app/frontend
yarn build
```

The build will create optimized production files in `/app/frontend/build/`

### 4. **Verify Service Pages**

Test these URLs after deployment:
- `/website-design/delhi`
- `/app-development/mumbai`
- `/search-engine-optimization/bangalore`
- `/ppc-paid-marketing/pune`

All 450 pages follow the pattern: `/{service-slug}/{city-slug}`

### 5. **Debug Mode**

The ServiceCityPage now includes console logging. Check browser console for:
```
Fetching data for: {service} {city}
API URL: {full-api-url}
Page data received: {data}
```

If you see errors, check:
1. Network tab for failed API calls
2. API response status codes
3. CORS errors

## Service-City Pages Structure

**Total Pages:** 450
- 9 Services
- 50 Cities
- Dynamic routing: `/:serviceSlug/:citySlug`

**Services:**
1. branding-services
2. website-design
3. app-development
4. digital-marketing-services
5. enquiry-generation-services
6. search-engine-optimization
7. app-marketing
8. content-marketing
9. ppc-paid-marketing

**All 50 Cities:** Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Noida, Gurgaon, Jaipur, and 40 more.

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] Service pages load (test 3-5 different combinations)
- [ ] Navigation works (header links)
- [ ] Contact form opens WhatsApp
- [ ] Floating buttons work (WhatsApp & Call)
- [ ] Footer links work
- [ ] Social media links open correctly

## Still Having Issues?

1. **Clear browser cache** - Old cached files can cause issues
2. **Check browser console** - Look for JavaScript errors
3. **Test API directly** - Visit `{BACKEND_URL}/api/service-city/website-design/delhi`
4. **Verify .env file** - Ensure REACT_APP_BACKEND_URL is set correctly

## Support

If pages are still blank after following these steps, check:
- Server logs for errors
- Backend API is running and accessible
- Database has the seeded data (services and cities)

## Database Verification

Run these commands to verify data:
```bash
curl https://localseo-master.preview.emergentagent.com/api/services
curl https://localseo-master.preview.emergentagent.com/api/cities
curl https://localseo-master.preview.emergentagent.com/api/service-city/website-design/delhi
```

All should return JSON data.
