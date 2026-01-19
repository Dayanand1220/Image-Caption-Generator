# 🚀 Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository: `Dayanand1220/Image-Caption-Generator`
5. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Click "Deploy"

### Step 2: Configure Environment Variables in Vercel
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - `REACT_APP_API_URL` = `https://your-backend-url.railway.app`

## Backend Deployment (Railway)

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository: `Dayanand1220/Image-Caption-Generator`
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `python app_production.py`

### Step 2: Configure Environment Variables in Railway
1. Go to your project dashboard
2. Click "Variables" tab
3. Add:
   - `PORT` = `5123`
   - `FLASK_ENV` = `production`
   - `GEMINI_API_KEY` = `your_api_key_here` (optional)

### Step 3: Update Frontend with Backend URL
1. Copy your Railway backend URL (e.g., `https://your-app.railway.app`)
2. Update the `REACT_APP_API_URL` in Vercel environment variables
3. Redeploy frontend

## Testing Your Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend**: Visit your Railway URL - should show API info
3. **Full Test**: Upload an image and generate a caption

## Troubleshooting

### Common Issues:
- **CORS Error**: Check backend CORS configuration
- **API Not Found**: Verify `REACT_APP_API_URL` is correct
- **Build Failed**: Check Node.js version (use 18.x)

### Quick Fixes:
```bash
# Test locally first
cd frontend && npm run build
cd backend && python app_production.py
```

## Free Tier Limits
- **Vercel**: Unlimited static sites
- **Railway**: 500 hours/month free
- **Total Cost**: $0 for personal projects! 🎉