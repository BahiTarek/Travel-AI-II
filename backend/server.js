require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path'); 

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

// Enhanced OpenRouter AI Chat endpoint
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

// TomTom Places Search endpoint
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

// Pixabay Images Search endpoint
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

// WeatherAPI endpoint
app.get('/api/weather/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { days = 7 } = req.query;
    
    const response = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: location,
        days: days,
        aqi: 'no',
        alerts: 'no'
      }
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

    res.json({ success: true, weather });
  } catch (error) {
    console.error('WeatherAPI Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch weather data' });
  }
});

// Travelpayouts Flight Search endpoint
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

// Helper function to create basic itinerary structure
function createBasicItinerary(destination, startDate, duration, attractions) {
  const days = [];
  const baseDate = new Date(startDate);

  for (let i = 0; i < duration; i++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + i);
    
    const dayActivities = [
      {
        time: "09:00",
        activity: `Explore ${attractions[i % attractions.length]?.name || 'city center'}`,
        location: attractions[i % attractions.length]?.name || destination,
        duration: "2 hours",
        image_query: destination + " tourist attraction"
      },
      {
        time: "12:00",
        activity: "Local lunch experience",
        location: "City center",
        duration: "1.5 hours",
        image_query: destination + " local food"
      },
      {
        time: "15:00",
        activity: `Visit ${attractions[(i + 1) % attractions.length]?.name || 'local landmark'}`,
        location: attractions[(i + 1) % attractions.length]?.name || destination,
        duration: "2.5 hours",
        image_query: destination + " landmark"
      }
    ];

    days.push({
      dayNumber: i + 1,
      date: currentDate.toISOString().split('T')[0],
      activities: dayActivities
    });
  }

  return {
    destination,
    days
  };
}

// Enhanced Itinerary Generator endpoint
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const { destination, startDate, endDate, preferences, duration } = req.body;
    
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Calculate trip duration if not provided
    const start = new Date(startDate);
    const end = new Date(endDate);
    const tripDuration = duration || Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    console.log(`Generating ${tripDuration}-day itinerary for ${destination}`);

    // 1. Get location coordinates
    const geoResponse = await axios.get(
      `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(destination)}.json`,
      { params: { key: process.env.TOMTOM_API_KEY } }
    );
    
    if (!geoResponse.data.results.length) {
      throw new Error('Location not found');
    }
    
    const { lat, lon } = geoResponse.data.results[0].position;

    // 2. Fetch all data in parallel
    const [weather, attractions, images] = await Promise.all([
      axios.get('http://api.weatherapi.com/v1/forecast.json', {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: `${lat},${lon}`,
          days: Math.min(tripDuration, 10) // API limit is 10 days
        }
      }).catch(err => {
        console.error('Weather API Error:', err.message);
        return { data: { forecast: { forecastday: [] } } };
      }),
      
      axios.get(`https://api.tomtom.com/search/2/search/${encodeURIComponent(destination)}.json`, {
        params: {
          key: process.env.TOMTOM_API_KEY,
          limit: 20,
          categorySet: '7318,7315,7317,7376,7377,9361,9362,9376' // Tourist attractions, restaurants
        }
      }).catch(err => {
        console.error('TomTom API Error:', err.message);
        return { data: { results: [] } };
      }),
      
      axios.get('https://pixabay.com/api/', {
        params: {
          key: process.env.PIXABAY_API_KEY,
          q: destination + ' travel tourism',
          per_page: 20,
          category: 'places,travel',
          image_type: 'photo',
          orientation: 'horizontal'
        }
      }).catch(err => {
        console.error('Pixabay API Error:', err.message);
        return { data: { hits: [] } };
      })
    ]);

    // 3. Create structured data
    const attractionsList = attractions.data.results
      .filter(a => a.poi?.name)
      .slice(0, 15)
      .map(a => ({
        name: a.poi.name,
        category: a.poi.categories?.[0] || 'attraction',
        coordinates: `${a.position.lat},${a.position.lon}`
      }));

    const weatherData = weather.data.forecast.forecastday.map(day => ({
      date: day.date,
      condition: day.day.condition.text,
      high: Math.round(day.day.maxtemp_c),
      low: Math.round(day.day.mintemp_c)
    }));

    // 4. Generate AI itinerary with enhanced prompt
    const enhancedPrompt = `Create a detailed ${tripDuration}-day itinerary for ${destination} from ${startDate} to ${endDate}.

REQUIREMENTS:
1. Format as JSON with this EXACT structure:
{
  "destination": "${destination}",
  "days": [
    {
      "dayNumber": 1,
      "date": "${startDate}",
      "activities": [
        {
          "time": "08:00",
          "activity": "Activity name",
          "description": "Brief description",
          "location": "Specific location name",
          "duration": "2 hours",
          "image_query": "search term for image"
        }
      ]
    }
  ]
}

2. Include 4-6 activities per day with specific times (format: "HH:MM")
3. Each activity must have: time, activity name, location, duration, and image_query
4. Use these available attractions: ${attractionsList.map(a => a.name).join(', ')}
5. Include variety: sightseeing, dining, culture, relaxation
6. Consider weather: ${weatherData.map(w => `${w.date}: ${w.condition}`).join(', ')}
7. Preferences: ${preferences || 'General tourism'}
8. Make realistic time allocations and logical geographic flow

IMPORTANT: Return ONLY valid JSON, no additional text.`;

    let itineraryData;
    
    try {
      const aiResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'anthropic/claude-3-haiku',
          messages: [{
            role: 'user',
            content: enhancedPrompt
          }],
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      // 5. Process AI response
      const aiContent = aiResponse.data.choices[0].message.content;
      // Clean the response - remove any markdown formatting
      const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      itineraryData = JSON.parse(cleanContent);
      
    } catch (parseError) {
      console.error('Failed to parse AI response or call AI API:', parseError);
      // Fallback: create basic structure
      itineraryData = createBasicItinerary(destination, startDate, tripDuration, attractionsList);
    }

    // 6. Enhance itinerary with real data
    if (itineraryData.days) {
      itineraryData.days.forEach((day, dayIndex) => {
        // Add weather data
        const dayWeather = weatherData[dayIndex];
        if (dayWeather) {
          day.weather = {
            condition: { text: dayWeather.condition },
            maxtemp_c: dayWeather.high,
            mintemp_c: dayWeather.low
          };
        }

        // Enhance activities
        day.activities?.forEach(activity => {
          // Find matching attraction for coordinates
          const matchingAttraction = attractionsList.find(attr => 
            attr.name.toLowerCase().includes(activity.location?.toLowerCase() || '') ||
            activity.activity?.toLowerCase().includes(attr.name.toLowerCase())
          );

          if (matchingAttraction) {
            activity.map_link = `https://maps.google.com/?q=${matchingAttraction.coordinates}`;
          }

          // Find matching image
          const matchingImage = images.data.hits.find(img => 
            img.tags.toLowerCase().includes(activity.image_query?.split(' ')[0]?.toLowerCase() || 'travel')
          );

          if (matchingImage) {
            activity.image = matchingImage.webformatURL;
          }
        });
      });
    }

    // 7. Prepare final response
    const response = {
      success: true,
      itinerary: itineraryData,
      attractions: attractions.data.results.slice(0, 10),
      images: images.data.hits.slice(0, 8),
      weather: weatherData,
      metadata: {
        destination,
        duration: tripDuration,
        generated_at: new Date().toISOString()
      }
    };

    console.log('Itinerary generated successfully');
    res.json(response);

  } catch (error) {
    console.error('Itinerary Generation Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate itinerary',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// Serve static files from React build
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
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