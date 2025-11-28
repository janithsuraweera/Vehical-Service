# Vercel Deployment Guide

This guide explains how to deploy both the frontend and backend to Vercel.

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas account (or your MongoDB connection string)
3. OpenAI API key (for vehicle error analysis feature)

## Backend Deployment

### Step 1: Prepare Backend

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Step 2: Deploy to Vercel

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the backend:
   ```bash
   cd Backend
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name: **vehicle-service-backend** (or your preferred name)
   - Directory: **./**
   - Override settings? **No**

### Step 3: Configure Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   PORT=5000
   API_BASE_URL=https://your-backend-url.vercel.app
   ```

4. Redeploy after adding environment variables:
   ```bash
   vercel --prod
   ```

## Frontend Deployment

### Step 1: Prepare Frontend

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend/emergency
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (or set in Vercel):
   ```
   VITE_API_BASE_URL=https://your-backend-url.vercel.app
   ```

### Step 2: Deploy to Vercel

1. Deploy the frontend:
   ```bash
   cd Frontend/emergency
   vercel
   ```

2. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name: **vehicle-service-frontend** (or your preferred name)
   - Directory: **./**
   - Override settings? **No**

### Step 3: Configure Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

   ```
   VITE_API_BASE_URL=https://your-backend-url.vercel.app
   ```

4. Redeploy after adding environment variables:
   ```bash
   vercel --prod
   ```

## Important Notes

### File Uploads

⚠️ **Important**: Vercel serverless functions have a 4.5MB request body limit and files are stored in `/tmp` which is ephemeral. For production, you should:

1. **Use a cloud storage service** (AWS S3, Cloudinary, etc.) for file uploads
2. Update the multer configuration to upload directly to cloud storage
3. Store only the URLs in MongoDB

### Database Connection

The database connection is optimized for serverless environments with connection caching. Make sure your MongoDB Atlas connection string allows connections from anywhere (or add Vercel IP ranges).

### CORS Configuration

The backend CORS is configured to allow all origins. For production, update `server.js` to allow only your frontend domain:

```javascript
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app'
}));
```

## Troubleshooting

### Backend Issues

- **Module not found errors**: Make sure all dependencies are in `package.json`
- **Database connection errors**: Check your MongoDB URI and network access
- **Timeout errors**: Vercel functions have a 10s timeout (60s for Pro plan)

### Frontend Issues

- **API calls failing**: Check that `VITE_API_BASE_URL` is set correctly
- **Build errors**: Make sure all imports are correct and dependencies are installed

## Alternative: Deploy Backend Separately

If you prefer to keep the backend on a traditional server (like Railway, Render, or Heroku), you can:

1. Deploy backend to your preferred platform
2. Update `VITE_API_BASE_URL` in frontend to point to your backend URL
3. Deploy frontend to Vercel

This approach is better for file uploads and long-running processes.

