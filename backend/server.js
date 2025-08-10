require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://travelai-frontend-0bp4.onrender.com', // Your live frontend
  'http://localhost:3000' // Local development
];

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
app.use(express.json());

// Improved header middleware
const setHeaders = (res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

// Additional headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  setHeaders(res);
  res.json({ 
    status: 'OK', 
    version: '1.0.0',
    services: {
      openrouter: !!process.env.OPENROUTER_API_KEY,
      tomtom: !!process.env.TOMTOM_API_KEY,
      pixabay: !!process.env.PIXABAY_API_KEY,
      weather: !!process.env.WEATHER_API_KEY
    }
  });
});

// Enhanced OpenRouter AI Chat endpoint (unchanged)
app.post('/api/chat', async (req, res) => {
  try {
    setHeaders(res);
    const { message, conversation = [] } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing message'
      });
    }

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful travel consultant AI assistant. Provide detailed, accurate travel advice, destination recommendations, and help users plan their trips. Be friendly, informative, and focus on practical travel information.'
        },
        ...conversation.filter(msg => 
          msg.role && ['system', 'user', 'assistant'].includes(msg.role) && 
          msg.content && typeof msg.content === 'string'
        ),
        { role: 'user', content: message }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000'
      },
      timeout: 10000
    });

    setHeaders(res);
    res.json({
      success: true,
      message: response.data.choices[0].message.content,
      usage: response.data.usage
    });
  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    setHeaders(res);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.error?.message || 'Failed to get AI response',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// TomTom Places Search endpoint (unchanged)
app.get('/api/attractions/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { limit = 10 } = req.query;
    
    const response = await axios.get(`https://api.tomtom.com/search/2/search/${encodeURIComponent(location)}.json`, {
      params: {
        key: process.env.TOMTOM_API_KEY,
        categorySet: '7318,7315,7317,7376,7377', // Tourist attractions, museums, monuments, etc.
        limit: limit,
        typeahead: false
      }
    });

    const attractions = response.data.results.map(result => ({
      id: result.id,
      name: result.poi?.name || result.address?.freeformAddress,
      address: result.address?.freeformAddress,
      position: result.position,
      categories: result.poi?.categories,
      phone: result.poi?.phone,
      url: result.poi?.url
    }));

    res.json({
      success: true,
      attractions: attractions
    });
  } catch (error) {
    console.error('TomTom API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attractions'
    });
  }
});

// Pixabay Images Search endpoint (unchanged)
app.get('/api/images/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { per_page = 9 } = req.query;
    
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        category: 'places,travel',
        min_width: 640,
        per_page: per_page,
        safesearch: 'true'
      }
    });

    const images = response.data.hits.map(hit => ({
      id: hit.id,
      url: hit.webformatURL,
      preview: hit.previewURL,
      tags: hit.tags,
      user: hit.user
    }));

    res.json({
      success: true,
      images: images
    });
  } catch (error) {
    console.error('Pixabay API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch images'
    });
  }
});

// WeatherAPI endpoint (unchanged)
app.get('/api/weather/:location', async (req, res) => {
  try {
    setHeaders(res);
    const { location } = req.params;
    const { days = 7 } = req.query;
    
    // Skip if no API key
    if (!process.env.WEATHER_API_KEY) {
      return res.json({
        success: true,
        weather: null,
        message: 'Weather service not configured'
      });
    }

    const response = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: location,
        days: days,
        aqi: 'no',
        alerts: 'no'
      },
      timeout: 5000 // 5 second timeout
    });

    const weather = {
      location: response.data.location,
      current: response.data.current,
      forecast: response.data.forecast.forecastday.map(day => ({
        date: day.date,
        day: {
          maxtemp_c: day.day.maxtemp_c,
          mintemp_c: day.day.mintemp_c,
          condition: day.day.condition,
          chance_of_rain: day.day.daily_chance_of_rain
        }
      }))
    };

    res.json({
      success: true,
      weather: weather
    });
  } catch (error) {
    console.error('WeatherAPI Error:', error.response?.data || error.message);
    setHeaders(res);
    // Return success even if weather fails
    res.json({
      success: true,
      weather: null,
      message: 'Weather data unavailable'
    });
  }
});

// Travelpayouts Flight Search endpoint (unchanged)
app.get('/api/flights', async (req, res) => {
  try {
    const { origin, destination, departure_date, return_date, currency = 'USD' } = req.query;
    
    if (!origin || !destination || !departure_date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: origin, destination, departure_date'
      });
    }

    const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates', {
      params: {
        origin: origin,
        destination: destination,
        departure_date: departure_date,
        return_date: return_date,
        currency: currency,
        token: process.env.TRAVELPAYOUTS_API_KEY
      }
    });

    res.json({
      success: true,
      flights: response.data
    });
  } catch (error) {
    console.error('Travelpayouts API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch flight data'
    });
  }
});

// Enhanced Itinerary Generator endpoint with CORS fixes
app.post('/api/generate-itinerary', async (req, res) => {  // Changed from '/generate-itinerary'
  try {
    setHeaders(res);
    const { destination, startDate, endDate, preferences } = req.body;
    
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Calculate trip duration
    const tripDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    
    // Fallback itinerary if APIs fail
    const fallbackItinerary = {
      days: Array.from({ length: tripDays }, (_, i) => ({
        day: i + 1,
        date: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + i)).toISOString().split('T')[0],
        title: `Day ${i + 1} in ${destination}`,
        activities: [
          { time: 'Morning', activity: 'Breakfast and morning exploration', location: 'City Center' },
          { time: 'Afternoon', activity: 'Local attractions visit', location: 'Various' },
          { time: 'Evening', activity: 'Dinner at recommended restaurant', location: 'Local cuisine' }
        ]
      })),
      attractions: [],
      images: [],
      weather: null
    };

    const getBaseUrl = () => {
      if (process.env.RENDER_EXTERNAL_URL) {
        return process.env.RENDER_EXTERNAL_URL;
      }
      return process.env.NODE_ENV === 'production' 
        ? 'https://travel-ai-ii.onrender.com' 
        : `http://localhost:${PORT}`;
    };

    const baseUrl = getBaseUrl();

    try {
      const [attractions, images, weather] = await Promise.allSettled([
        axios.get(`${baseUrl}/api/attractions/${encodeURIComponent(destination)}`, { 
          params: { limit: 15 },
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        }),
        axios.get(`${baseUrl}/api/images/${encodeURIComponent(destination)}`, { 
          params: { per_page: 12 },
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        }),
        axios.get(`${baseUrl}/api/weather/${encodeURIComponent(destination)}`, { 
          params: { days: tripDays },
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
      ]);

      // Process responses
      const itineraryData = {
        attractions: attractions.value?.data?.attractions || [],
        images: images.value?.data?.images || [],
        weather: weather.value?.data?.weather || null
      };

      res.json({
        success: true,
        ...fallbackItinerary,
        ...itineraryData
      });

    } catch (apiError) {
      console.error('Partial API failure:', apiError);
      res.json({
        success: true,
        ...fallbackItinerary
      });
    }

  } catch (error) {
    console.error('Itinerary generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate itinerary'
    });
  }
});

// Single server listener
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS configured for: ${allowedOrigins.join(', ')}`);
  console.log('Available services:');
  console.log(`- OpenRouter: ${!!process.env.OPENROUTER_API_KEY ? 'Enabled' : 'Disabled'}`);
  console.log(`- TomTom: ${!!process.env.TOMTOM_API_KEY ? 'Enabled' : 'Disabled'}`);
  console.log(`- Pixabay: ${!!process.env.PIXABAY_API_KEY ? 'Enabled' : 'Disabled'}`);
  console.log(`- WeatherAPI: ${!!process.env.WEATHER_API_KEY ? 'Enabled' : 'Disabled'}`);
});