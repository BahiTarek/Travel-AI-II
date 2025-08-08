# TravelAI - AI-Powered Travel Consultant

A complete full-stack travel consultant website with AI-powered features including chat assistant, itinerary generator, and travel search engine.

## 🚀 Features

- **AI Travel Assistant**: Chat with an intelligent AI that can answer travel questions and provide recommendations
- **Itinerary Generator**: Create personalized travel itineraries with attractions, images, and weather forecasts
- **Travel Search Engine**: Find the best deals on flights and hotels with affiliate booking links
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional design with smooth animations

## 🛠 Tech Stack

### Frontend
- **React** - Modern JavaScript framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### APIs Integrated
- **OpenRouter.ai** - AI chat functionality
- **TomTom API** - Attractions and places data
- **Pixabay API** - Royalty-free images
- **WeatherAPI** - Weather forecasts
- **Travelpayouts API** - Flight and hotel search

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- API keys for the integrated services (see Setup section)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd travel-consultant-ai
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 3. Environment Configuration

Create `.env` files in both backend and frontend directories:

#### Backend `.env` file:
```env
PORT=5000
NODE_ENV=development

# AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_API_BASE=https://openrouter.ai/api/v1

# TomTom API (for attractions)
TOMTOM_API_KEY=your_tomtom_api_key_here

# Pixabay API (for images)
PIXABAY_API_KEY=your_pixabay_api_key_here

# WeatherAPI (for weather forecasts)
WEATHER_API_KEY=your_weather_api_key_here

# Travelpayouts API (for flights and hotels)
TRAVELPAYOUTS_API_KEY=your_travelpayouts_api_key_here
TRAVELPAYOUTS_AFFILIATE_ID=your_affiliate_id_here
```

#### Frontend `.env` file:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 4. Get API Keys

#### OpenRouter.ai (AI Chat)
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Generate an API key
4. Add to backend `.env` file

#### TomTom API (Attractions)
1. Visit [TomTom Developer Portal](https://developer.tomtom.com)
2. Create a free account
3. Generate an API key
4. Add to backend `.env` file

#### Pixabay API (Images)
1. Visit [Pixabay API](https://pixabay.com/api/docs/)
2. Create a free account
3. Get your API key
4. Add to backend `.env` file

#### WeatherAPI (Weather)
1. Visit [WeatherAPI](https://www.weatherapi.com)
2. Sign up for a free account
3. Get your API key
4. Add to backend `.env` file

#### Travelpayouts API (Flights & Hotels)
1. Visit [Travelpayouts](https://www.travelpayouts.com)
2. Sign up for an affiliate account
3. Get your API key and affiliate ID
4. Add to backend `.env` file

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Production Server
```bash
cd backend
NODE_ENV=production npm start
```

## 📁 Project Structure

```
travel-consultant-ai/
├── backend/
│   ├── server.js              # Express server setup
│   ├── package.json           # Backend dependencies
│   └── .env                   # Backend environment variables
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.js      # Navigation component
│   │   │   └── Footer.js      # Footer component
│   │   ├── pages/             # Page components
│   │   │   ├── Home.js        # Landing page
│   │   │   ├── Chat.js        # AI chat interface
│   │   │   ├── Itinerary.js   # Itinerary generator
│   │   │   ├── Search.js      # Travel search engine
│   │   │   └── About.js       # About page
│   │   ├── utils/
│   │   │   └── api.js         # API utility functions
│   │   ├── App.js             # Main app component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies
│   └── .env                   # Frontend environment variables
├── README.md                  # This file
└── todo.md                    # Development progress tracker
```

## 🌐 Deployment

### Deploy to Render

#### Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Add all backend environment variables

#### Frontend Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Environment**: Add frontend environment variables

### Deploy to Other Platforms

The application is configured to work with any hosting platform that supports Node.js:

- **Heroku**: Use the provided `package.json` scripts
- **Vercel**: Deploy frontend as static site, backend as serverless functions
- **Netlify**: Deploy frontend as static site
- **DigitalOcean**: Use App Platform or Droplets

## 🔌 API Endpoints

### Backend API Routes

#### Health Check
- **GET** `/api/health` - Check server status

#### AI Chat
- **POST** `/api/chat` - Send message to AI assistant
  ```json
  {
    "message": "I want to visit Paris"
  }
  ```

#### Itinerary Generation
- **POST** `/api/itinerary` - Generate travel itinerary
  ```json
  {
    "destination": "Paris, France",
    "startDate": "2024-06-01",
    "endDate": "2024-06-05",
    "travelers": 2,
    "preferences": "museums, local cuisine"
  }
  ```

#### Travel Search
- **POST** `/api/search/flights` - Search for flights
- **POST** `/api/search/hotels` - Search for hotels

## 🎨 Design System

### Brand Colors
- **Primary**: #004aad (Blue)
- **Accent**: #ff6600 (Orange)
- **Background**: #f4f4f4 (Light Gray)

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Home page loads correctly
- [ ] Navigation works between all pages
- [ ] AI chat responds to messages
- [ ] Itinerary generator creates itineraries
- [ ] Search engine displays results
- [ ] Mobile responsiveness works
- [ ] All API integrations function

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if implemented)
cd backend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact support at hello@travelai.com

## 🙏 Acknowledgments

- OpenRouter.ai for AI capabilities
- TomTom for location data
- Pixabay for royalty-free images
- WeatherAPI for weather data
- Travelpayouts for travel booking integration
- React community for excellent documentation
- All contributors who helped build this project

---

**Built with ❤️ by the TravelAI Team**

