# Deployment Guide

This guide covers deploying the TravelAI application to various hosting platforms.

## 🚀 Quick Deploy Options

### Option 1: Render (Recommended)

Render provides free hosting for both frontend and backend with automatic deployments.

#### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure all environment variables are documented in `.env.example` files

#### Step 2: Deploy Backend
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `travelai-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

#### Step 3: Set Environment Variables
Add these environment variables in Render dashboard:
```
NODE_ENV=production
PORT=10000
OPENROUTER_API_KEY=your_key_here
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
TOMTOM_API_KEY=your_key_here
PIXABAY_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
TRAVELPAYOUTS_API_KEY=your_key_here
TRAVELPAYOUTS_AFFILIATE_ID=your_id_here
```

#### Step 4: Deploy Frontend
1. Create another service: "New +" → "Static Site"
2. Connect same repository
3. Configure:
   - **Name**: `travelai-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

#### Step 5: Update Frontend Environment
Set frontend environment variable:
```
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### Option 2: Heroku

#### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh
```

#### Step 2: Login and Create App
```bash
heroku login
heroku create your-app-name
```

#### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set OPENROUTER_API_KEY=your_key_here
heroku config:set OPENROUTER_API_BASE=https://openrouter.ai/api/v1
heroku config:set TOMTOM_API_KEY=your_key_here
heroku config:set PIXABAY_API_KEY=your_key_here
heroku config:set WEATHER_API_KEY=your_key_here
heroku config:set TRAVELPAYOUTS_API_KEY=your_key_here
heroku config:set TRAVELPAYOUTS_AFFILIATE_ID=your_id_here
```

#### Step 4: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 3: Vercel

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Deploy Frontend
```bash
cd frontend
vercel --prod
```

#### Step 3: Deploy Backend as Serverless Functions
Create `api/` directory in root and move backend routes to serverless functions.

### Option 4: Netlify

#### Step 1: Build Frontend
```bash
cd frontend
npm run build
```

#### Step 2: Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Drag and drop the `build` folder
3. Or connect GitHub repository

## 🔧 Environment Configuration

### Required API Keys

#### 1. OpenRouter.ai (AI Chat)
- **Website**: https://openrouter.ai
- **Free Tier**: Yes, with usage limits
- **Setup**: 
  1. Create account
  2. Generate API key
  3. Add to `OPENROUTER_API_KEY`

#### 2. TomTom API (Attractions)
- **Website**: https://developer.tomtom.com
- **Free Tier**: 2,500 requests/day
- **Setup**:
  1. Create developer account
  2. Create new app
  3. Copy API key to `TOMTOM_API_KEY`

#### 3. Pixabay API (Images)
- **Website**: https://pixabay.com/api/docs/
- **Free Tier**: 5,000 requests/hour
- **Setup**:
  1. Create Pixabay account
  2. Get API key from account settings
  3. Add to `PIXABAY_API_KEY`

#### 4. WeatherAPI (Weather)
- **Website**: https://www.weatherapi.com
- **Free Tier**: 1 million calls/month
- **Setup**:
  1. Sign up for free account
  2. Get API key from dashboard
  3. Add to `WEATHER_API_KEY`

#### 5. Travelpayouts API (Flights & Hotels)
- **Website**: https://www.travelpayouts.com
- **Free Tier**: Yes, commission-based
- **Setup**:
  1. Sign up as affiliate
  2. Get API key and affiliate ID
  3. Add to `TRAVELPAYOUTS_API_KEY` and `TRAVELPAYOUTS_AFFILIATE_ID`

## 🔒 Security Best Practices

### Environment Variables
- Never commit `.env` files to version control
- Use different API keys for development and production
- Rotate API keys regularly
- Monitor API usage and set up alerts

### CORS Configuration
```javascript
// In production, restrict CORS to your domain
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000']
}));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 📊 Monitoring & Analytics

### Health Checks
The application includes a health check endpoint at `/api/health` for monitoring services.

### Error Tracking
Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for user analytics

### Performance Monitoring
- Use **Lighthouse** for performance audits
- Monitor **Core Web Vitals**
- Set up **uptime monitoring**

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        cd backend && npm install
        cd ../frontend && npm install
        
    - name: Run tests
      run: |
        cd frontend && npm test -- --coverage --watchAll=false
        
    - name: Build frontend
      run: cd frontend && npm run build
      
    - name: Deploy to Render
      # Add deployment steps here
```

## 🚨 Troubleshooting

### Common Issues

#### 1. CORS Errors
- Check that backend CORS is configured for your frontend domain
- Verify API base URL in frontend environment variables

#### 2. API Key Issues
- Ensure all required API keys are set
- Check API key permissions and quotas
- Verify API key format (some require prefixes)

#### 3. Build Failures
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

#### 4. Environment Variables Not Loading
- Verify `.env` file location
- Check environment variable names (case-sensitive)
- Restart server after changing environment variables

### Debug Commands
```bash
# Check environment variables
node -e "console.log(process.env)"

# Test API endpoints
curl -X GET http://localhost:5000/api/health

# Check build output
npm run build 2>&1 | tee build.log
```

## 📈 Scaling Considerations

### Database Integration
For production use, consider adding:
- **PostgreSQL** for user data and itineraries
- **Redis** for caching API responses
- **MongoDB** for storing chat history

### CDN Integration
- Use **Cloudflare** or **AWS CloudFront** for static assets
- Optimize images with **ImageKit** or **Cloudinary**

### Load Balancing
- Use **NGINX** for reverse proxy
- Implement **PM2** for process management
- Consider **Docker** containerization

## 🎯 Performance Optimization

### Frontend Optimization
- Implement code splitting with React.lazy()
- Use React.memo for expensive components
- Optimize bundle size with webpack-bundle-analyzer

### Backend Optimization
- Implement response caching
- Use compression middleware
- Optimize database queries

### API Optimization
- Cache API responses
- Implement request batching
- Use API response compression

---

**Need help with deployment? Contact support at hello@travelai.com**

