const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Travel Consultant API is running' });
});

// OpenRouter AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation } = req.body;
    
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful travel consultant AI assistant. Provide detailed, accurate travel advice, destination recommendations, and help users plan their trips. Be friendly, informative, and focus on practical travel information.'
        },
        ...conversation,
        { role: 'user', content: message }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      message: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response'
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

    res.json({
      success: true,
      weather: weather
    });
  } catch (error) {
    console.error('WeatherAPI Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data'
    });
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

// Travelpayouts Hotel Search endpoint
app.get('/api/hotels', async (req, res) => {
  try {
    const { location, check_in, check_out, currency = 'USD' } = req.query;
    
    if (!location || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: location, check_in, check_out'
      });
    }

    const response = await axios.get('https://engine.hotellook.com/api/v2/cache.json', {
      params: {
        location: location,
        currency: currency,
        checkIn: check_in,
        checkOut: check_out,
        limit: 10,
        token: process.env.TRAVELPAYOUTS_API_KEY
      }
    });

    res.json({
      success: true,
      hotels: response.data
    });
  } catch (error) {
    console.error('Travelpayouts Hotels API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hotel data'
    });
  }
});

// Generate Itinerary endpoint
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const { destination, startDate, endDate, preferences } = req.body;
    
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: destination, startDate, endDate'
      });
    }

    // Get attractions from TomTom
    const attractionsResponse = await axios.get(`http://localhost:${PORT}/api/attractions/${destination}`, {
      params: { limit: 15 }
    });

    // Get images from Pixabay
    const imagesResponse = await axios.get(`http://localhost:${PORT}/api/images/${destination}`, {
      params: { per_page: 12 }
    });

    // Get weather forecast
    const weatherResponse = await axios.get(`http://localhost:${PORT}/api/weather/${destination}`, {
      params: { days: 7 }
    });

    // Generate AI-powered itinerary
    const itineraryPrompt = `Create a detailed ${Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} day travel itinerary for ${destination} from ${startDate} to ${endDate}. 
    
    Available attractions: ${attractionsResponse.data.attractions.map(a => a.name).join(', ')}
    
    Preferences: ${preferences || 'General sightseeing'}
    
    Please provide a day-by-day itinerary with:
    - Morning, afternoon, and evening activities
    - Recommended restaurants and local cuisine
    - Transportation tips
    - Cultural insights and tips
    
    Format as JSON with this structure:
    {
      "days": [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "title": "Day title",
          "activities": [
            {
              "time": "Morning",
              "activity": "Activity description",
              "location": "Location name"
            }
          ]
        }
      ]
    }`;

    const aiResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a travel expert. Respond only with valid JSON.' },
        { role: 'user', content: itineraryPrompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    let itinerary;
    try {
      itinerary = JSON.parse(aiResponse.data.choices[0].message.content);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      itinerary = {
        days: [{
          day: 1,
          date: startDate,
          title: `Explore ${destination}`,
          activities: [
            { time: 'Morning', activity: 'Arrival and check-in', location: destination },
            { time: 'Afternoon', activity: 'City exploration', location: destination },
            { time: 'Evening', activity: 'Local dining experience', location: destination }
          ]
        }]
      };
    }

    res.json({
      success: true,
      itinerary: itinerary,
      attractions: attractionsResponse.data.attractions,
      images: imagesResponse.data.images,
      weather: weatherResponse.data.weather
    });

  } catch (error) {
    console.error('Itinerary Generation Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate itinerary'
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Travel Consultant API server running on port ${PORT}`);
});

