import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Sparkles, Clock, Sun, Cloud, CloudRain, Loader, ArrowRight, Star, Camera } from 'lucide-react';
import axios from 'axios';
import '../itinerary.css';

const Itinerary = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    destination: searchParams.get('destination') || '',
    startDate: '',
    endDate: '',
    travelers: '2',
    preferences: ''
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    setFormData(prev => ({
      ...prev,
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0]
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchDestinationData = async () => {
    try {
      setLoading(true);
      setError('');

      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

     const apiBaseUrl = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const response = await axios.post(
  `${apiBaseUrl}/api/generate-itinerary`,  // Now properly formatted
  {
    destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          preferences: formData.preferences,
          duration: duration
        }
      );

      let processedItinerary = response.data;
      
      if (typeof processedItinerary.itinerary === 'string') {
        try {
          processedItinerary.itinerary = JSON.parse(processedItinerary.itinerary);
        } catch (e) {
          console.warn('Could not parse AI response as JSON');
        }
      }

      if (processedItinerary.itinerary?.days) {
        processedItinerary.itinerary.days = processedItinerary.itinerary.days.map((day, index) => ({
          ...day,
          dayNumber: index + 1,
          date: day.date || getDateByIndex(formData.startDate, index),
          activities: day.activities || day.itinerary || []
        }));
      }

      setItinerary(processedItinerary);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  const getDateByIndex = (startDate, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }
    await fetchDestinationData();
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="weather-icon" size={18} />;
    const text = condition.text?.toLowerCase() || condition.toLowerCase();
    if (text.includes('sun') || text.includes('clear')) return <Sun className="weather-icon sunny" size={18} />;
    if (text.includes('rain')) return <CloudRain className="weather-icon rainy" size={18} />;
    if (text.includes('cloud')) return <Cloud className="weather-icon cloudy" size={18} />;
    return <Cloud className="weather-icon" size={18} />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    if (typeof address === 'string') return address;
    if (address.freeformAddress) return address.freeformAddress;
    return [
      address.streetName,
      address.municipality,
      address.postalCode,
      address.country
    ].filter(Boolean).join(', ');
  };

  return (
    <div className="itinerary-container">
      <div className="itinerary-header">
        <h1>AI Travel Itinerary Generator</h1>
        <p>Create your perfect travel plan with AI assistance</p>
      </div>

      <form onSubmit={handleSubmit} className="itinerary-form">
        <div className="form-group">
          <label>
            <MapPin className="input-icon" />
            Destination
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            placeholder="Enter your destination"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <Calendar className="input-icon" />
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Calendar className="input-icon" />
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <Users className="input-icon" />
            Travelers
          </label>
          <select
            name="travelers"
            value={formData.travelers}
            onChange={handleInputChange}
          >
            {[1, 2, 3, 4, 5, '6+'].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Traveler' : 'Travelers'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            <Sparkles className="input-icon" />
            Preferences
          </label>
          <textarea
            name="preferences"
            value={formData.preferences}
            onChange={handleInputChange}
            placeholder="What kind of activities do you enjoy? (e.g., museums, hiking, beaches)"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="generate-button">
          {loading ? (
            <>
              <Loader className="loading-icon" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles />
              Generate Itinerary
              <ArrowRight />
            </>
          )}
        </button>
      </form>

      {itinerary && (
        <div className="itinerary-results">
          {itinerary.images?.length > 0 && (
            <div className="destination-highlights">
              <h2>
                <Camera size={20} />
                Discover {formData.destination}
              </h2>
              <div className="highlight-images">
                {itinerary.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="highlight-image">
                    <img src={image.url || image.webformatURL} alt={image.tags} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {itinerary.itinerary?.days?.map((day, dayIndex) => (
            <div key={day.date || dayIndex} className="day-card">
              <div className="day-header">
                <h2>Day {day.dayNumber || dayIndex + 1} in {formData.destination}</h2>
                <div className="day-divider">──────────────────────────────</div>
                
                {day.weather && (
                  <div className="weather-banner">
                    {getWeatherIcon(day.weather.condition)}
                    <span className="weather-condition">
                      {day.weather.condition?.text || day.weather.condition || 'Partly Cloudy'}
                    </span>
                    <span className="weather-temp">
                      H: {Math.round(day.weather.maxtemp_c || day.weather.high || 25)}°C
                    </span>
                    <span className="weather-temp">
                      L: {Math.round(day.weather.mintemp_c || day.weather.low || 18)}°C
                    </span>
                  </div>
                )}
                
                {day.date && (
                  <p className="day-date">{formatDate(day.date)}</p>
                )}
              </div>

              <div className="activities">
                {day.activities?.map((activity, i) => (
                  <div key={i} className="activity">
                    <div className="activity-time">
                      {activity.time || `${8 + i * 2}:00`}
                    </div>
                    
                    <div className="activity-details">
                      <h3 className="activity-title">
                        {activity.activity || activity.name || activity.title}
                      </h3>
                      
                      {(activity.image || activity.image_query) && (
                        <div className="activity-image-wrapper">
                          {activity.image ? (
                            <img 
                              src={activity.image} 
                              alt={activity.activity}
                              className="activity-image" 
                            />
                          ) : (
                            <div className="image-placeholder">
                              <Camera size={24} />
                            </div>
                          )}
                          <p className="image-caption">
                            [Image of {activity.image_query || activity.activity?.toLowerCase() || 'location'}]
                          </p>
                        </div>
                      )}

                      {activity.description && (
                        <p className="activity-description">{activity.description}</p>
                      )}

                      {(activity.map_link || activity.location) && (
                        <a 
                          href={activity.map_link || `https://maps.google.com/?q=${encodeURIComponent(activity.location + ', ' + formData.destination)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-link"
                        >
                          View on Map →
                        </a>
                      )}

                      {activity.duration && (
                        <p className="activity-duration">Duration: ~{activity.duration}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {itinerary.attractions?.length > 0 && (
            <div className="recommended-attractions">
              <h2>
                <Star size={20} />
                Recommended Attractions
              </h2>
              <div className="attractions-grid">
                {itinerary.attractions.slice(0, 6).map((attraction, index) => (
                  <div key={index} className="attraction-card">
                    <h3>{attraction.name || attraction.poi?.name}</h3>
                    <p className="attraction-address">
                      {formatAddress(attraction.address)}
                    </p>
                    {attraction.categories && (
                      <div className="categories">
                        {attraction.categories.slice(0, 2).map((category, i) => (
                          <span key={i}>{category}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Itinerary;