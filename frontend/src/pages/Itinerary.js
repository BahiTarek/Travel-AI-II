import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Sparkles, Clock, Sun, Cloud, CloudRain, Loader } from 'lucide-react';
import api from '../utils/api';

// --- Centralized Style Objects ---
const containerStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '2.5rem 1rem'
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '1.25rem',
  boxShadow: '0 2px 12px rgba(60, 80, 180, 0.09)',
  border: '1px solid #e5e7eb',
  padding: '2.5rem 2rem',
  marginBottom: '2rem'
};

const sectionTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '1rem',
  textAlign: 'center'
};

const subtitleStyle = {
  fontSize: '1.25rem',
  color: '#6b7280',
  textAlign: 'center',
  marginBottom: '2rem'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem',
  marginBottom: '2rem'
};

const labelStyle = {
  fontWeight: '500',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  border: '1px solid #d1d5db',
  background: '#f9fafb',
  fontSize: '1rem',
  marginBottom: '1rem'
};

const buttonStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '0.75rem',
  background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
  color: '#fff',
  fontWeight: '600',
  fontSize: '1.1rem',
  border: 'none',
  cursor: 'pointer',
  marginTop: '1rem'
};

const errorStyle = {
  background: '#fef2f2',
  color: '#b91c1c',
  borderRadius: '0.5rem',
  marginBottom: '1rem',
  padding: '1rem'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1.5rem'
};

const gridStyleMd = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem'
};

const gridStyleLg = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '1.5rem'
};

// --- Responsive helper ---
const useResponsiveGrid = () => {
  const [style, setStyle] = useState(gridStyle);
  useEffect(() => {
    const updateStyle = () => {
      if (window.innerWidth >= 1024) setStyle(gridStyleLg);
      else if (window.innerWidth >= 600) setStyle(gridStyleMd);
      else setStyle(gridStyle);
    };
    updateStyle();
    window.addEventListener('resize', updateStyle);
    return () => window.removeEventListener('resize', updateStyle);
  }, []);
  return style;
};

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
  const gridResponsive = useResponsiveGrid();

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
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/generate-itinerary', {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        preferences: formData.preferences
      });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to generate itinerary');
      }
      setItinerary(response.data.data || response.data);
    } catch (error) {
      let errorMessage = 'Failed to generate itinerary. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.error ||
          error.response.statusText ||
          `Server error (${error.response.status})`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud size={20} color="#64748b" />;
    const text = condition.text.toLowerCase();
    if (text.includes('sun') || text.includes('clear')) {
      return <Sun size={20} color="#facc15" />;
    } else if (text.includes('rain')) {
      return <CloudRain size={20} color="#38bdf8" />;
    }
    return <Cloud size={20} color="#64748b" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tripDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={cardStyle}>
        <h1 style={sectionTitleStyle}>AI Itinerary Generator</h1>
        <p style={subtitleStyle}>
          Create your perfect {tripDuration()}-day trip to {formData.destination || 'your destination'}
        </p>
        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <div>
              <label style={labelStyle}>
                <MapPin style={{ marginRight: '0.5rem' }} />
                Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g., Paris, France"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Users style={{ marginRight: '0.5rem' }} />
                Number of Travelers
              </label>
              <select
                name="travelers"
                value={formData.travelers}
                onChange={handleInputChange}
                style={inputStyle}
              >
                {[1, 2, 3, 4, 5, '6+'].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>
                <Calendar style={{ marginRight: '0.5rem' }} />
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Calendar style={{ marginRight: '0.5rem' }} />
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                min={formData.startDate}
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>
              <Sparkles style={{ marginRight: '0.5rem' }} />
              Travel Preferences
            </label>
            <textarea
              name="preferences"
              value={formData.preferences}
              onChange={handleInputChange}
              placeholder="e.g., Museums, local cuisine, nightlife, outdoor activities, budget-friendly options..."
              rows="3"
              style={inputStyle}
            />
          </div>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader style={{ marginRight: '0.5rem' }} />
                Generating Your Itinerary...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles style={{ marginRight: '0.5rem' }} />
                Generate Itinerary
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {itinerary && (
        <div style={cardStyle}>
          {/* Destination Images */}
          {itinerary.images?.length > 0 && (
            <>
              <h2 style={sectionTitleStyle}>
                Discover {itinerary.destination || formData.destination}
              </h2>
              <div style={gridResponsive}>
                {itinerary.images.slice(0, 6).map((image, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(60,80,180,0.07)'
                  }}>
                    <img
                      src={image.url || image.preview}
                      alt={image.tags || `Image of ${formData.destination}`}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        transition: 'transform 0.3s'
                      }}
                      loading="lazy"
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      color: 'white'
                    }}>
                      <p style={{ fontWeight: '500' }}>{image.tags?.split(',')[0] || 'Travel Image'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Weather Forecast */}
          {itinerary.weather && (
            <>
              <h2 style={sectionTitleStyle}>Weather Forecast</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                {itinerary.weather.forecast?.map((day, index) => (
                  <div key={index} style={{
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <div style={{ margin: '0.5rem 0' }}>
                      {getWeatherIcon(day.day?.condition)}
                    </div>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {day.day?.condition?.text || 'N/A'}
                    </p>
                    <p style={{ fontWeight: '600' }}>
                      {day.day?.maxtemp_c ? Math.round(day.day.maxtemp_c) : 'N'}°/
                      {day.day?.mintemp_c ? Math.round(day.day.mintemp_c) : 'N'}°C
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Daily Itinerary */}
          {itinerary.itinerary?.days?.length > 0 && (
            <>
              <h2 style={sectionTitleStyle}>Your Daily Itinerary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {itinerary.itinerary.days.map((day, index) => (
                  <div key={index} style={cardStyle}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                        Day {day.day}: {day.title}
                      </h3>
                      <p>{formatDate(day.date)}</p>
                      {itinerary.weather?.forecast?.[index] && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: '#f3f4f6',
                          padding: '0.5rem 1rem',
                          borderRadius: '999px',
                          fontSize: '0.95rem',
                          fontWeight: '500'
                        }}>
                          {getWeatherIcon(itinerary.weather.forecast[index].day?.condition)}
                          <span>
                            {itinerary.weather.forecast[index].day?.maxtemp_c
                              ? Math.round(itinerary.weather.forecast[index].day.maxtemp_c)
                              : 'N'}°C
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {day.activities?.map((activity, actIndex) => (
                        <div key={actIndex} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          background: '#f9fafb',
                          borderRadius: '0.75rem',
                          padding: '1rem'
                        }}>
                          <Clock size={20} color="#2563eb" style={{ marginTop: '0.2rem' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '0.3rem'
                            }}>
                              <span style={{ color: '#2563eb', fontWeight: '500' }}>
                                {activity.time}
                              </span>
                              {activity.location && (
                                <>
                                  <span style={{ color: '#94a3b8' }}>•</span>
                                  <span style={{ color: '#64748b' }}>
                                    {activity.location}
                                  </span>
                                </>
                              )}
                            </div>
                            <p style={{ whiteSpace: 'pre-line' }}>
                              {activity.activity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Attractions */}
          {itinerary.attractions?.length > 0 && (
            <>
              <h2 style={sectionTitleStyle}>Recommended Attractions</h2>
              <div style={gridResponsive}>
                {itinerary.attractions.slice(0, 9).map((attraction, index) => (
                  <div key={index} style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1rem',
                    padding: '1rem',
                    boxShadow: '0 2px 8px rgba(60,80,180,0.07)'
                  }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                      {attraction.name}
                    </h3>
                    {attraction.address && (
                      <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#64748b' }}>
                        {attraction.address}
                      </p>
                    )}
                    {attraction.categories?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>