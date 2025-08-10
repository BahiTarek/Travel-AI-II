import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Sparkles, Clock, Sun, Cloud, CloudRain, Loader } from 'lucide-react';
import api from '../utils/api'; // Use the centralized API utility

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

  // Set default dates (today + 7 days)
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
    
    // Validate required fields
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate date range
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/generate-itinerary', {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        preferences: formData.preferences
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to generate itinerary');
      }

      setItinerary(response.data.data || response.data); // Handle both response formats
    } catch (error) {
      console.error('Itinerary generation error:', error);
      
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
    if (!condition) return <Cloud className="h-5 w-5 text-gray-500" />;
    
    const text = condition.text.toLowerCase();
    if (text.includes('sun') || text.includes('clear')) {
      return <Sun className="h-5 w-5 text-yellow-500" />;
    } else if (text.includes('rain')) {
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    }
    return <Cloud className="h-5 w-5 text-gray-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate trip duration in days
  const tripDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            AI Itinerary Generator
          </h1>
          <p className="text-xl text-gray-600">
            Create your perfect {tripDuration()}-day trip to {formData.destination || 'your destination'}
          </p>
        </div>

        {/* Form Section */}
        <div className="card p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Destination *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="e.g., Paris, France"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Travelers Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Number of Travelers
                </label>
                <select
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, '6+'].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Traveler' : 'Travelers'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Fields */}
              {['startDate', 'endDate'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    {field === 'startDate' ? 'Start Date *' : 'End Date *'}
                  </label>
                  <input
                    type="date"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={field === 'endDate' ? formData.startDate : undefined}
                  />
                </div>
              ))}
            </div>

            {/* Preferences Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Sparkles className="inline h-4 w-4 mr-1" />
                Travel Preferences
              </label>
              <textarea
                name="preferences"
                value={formData.preferences}
                onChange={handleInputChange}
                placeholder="e.g., Museums, local cuisine, nightlife, outdoor activities, budget-friendly options..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader className="h-5 w-5 animate-spin mr-2" />
                  Generating Your Itinerary...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Itinerary
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {itinerary && (
          <div className="space-y-8 animate-fadeIn">
            {/* Destination Images */}
            {itinerary.images?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Discover {itinerary.destination || formData.destination}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itinerary.images.slice(0, 6).map((image, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <img
                        src={image.url || image.preview}
                        alt={image.tags || `Image of ${formData.destination}`}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-medium">{image.tags?.split(',')[0] || 'Travel Image'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weather Forecast */}
            {itinerary.weather && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Weather Forecast
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                  {itinerary.weather.forecast?.map((day, index) => (
                    <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <div className="my-2">
                        {getWeatherIcon(day.day?.condition)}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {day.day?.condition?.text || 'N/A'}
                      </p>
                      <p className="text-sm font-semibold">
                        {day.day?.maxtemp_c ? Math.round(day.day.maxtemp_c) : 'N'}°/
                        {day.day?.mintemp_c ? Math.round(day.day.mintemp_c) : 'N'}°C
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Itinerary */}
            {itinerary.itinerary?.days?.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Daily Itinerary
                </h2>
                
                {itinerary.itinerary.days.map((day, index) => (
                  <div key={index} className="card p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Day {day.day}: {day.title}
                        </h3>
                        <p className="text-gray-600">{formatDate(day.date)}</p>
                      </div>
                      {itinerary.weather?.forecast?.[index] && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {getWeatherIcon(itinerary.weather.forecast[index].day?.condition)}
                          <span>
                            {itinerary.weather.forecast[index].day?.maxtemp_c 
                              ? Math.round(itinerary.weather.forecast[index].day.maxtemp_c) 
                              : 'N'}°C
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {day.activities?.map((activity, actIndex) => (
                        <div key={actIndex} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-shrink-0 pt-1">
                            <Clock className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <span className="text-sm font-medium text-blue-600">
                                {activity.time}
                              </span>
                              {activity.location && (
                                <>
                                  <span className="hidden sm:block text-sm text-gray-400">•</span>
                                  <span className="text-sm text-gray-600 truncate">
                                    {activity.location}
                                  </span>
                                </>
                              )}
                            </div>
                            <p className="text-gray-900 whitespace-pre-line">
                              {activity.activity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Attractions */}
            {itinerary.attractions?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Recommended Attractions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itinerary.attractions.slice(0, 9).map((attraction, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">
                        {attraction.name}
                      </h3>
                      {attraction.address && (
                        <p className="text-sm text-gray-600 mb-2 truncate">
                          {attraction.address}
                        </p>
                      )}
                      {attraction.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {attraction.categories.slice(0, 3).map((category, catIndex) => (
                            <span
                              key={catIndex}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {category}
                            </span>
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
    </div>
  );
};

export default Itinerary;