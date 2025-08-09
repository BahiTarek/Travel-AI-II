import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Sparkles, Clock, Sun, Cloud, CloudRain, Loader } from 'lucide-react';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';


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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

const response = await axios.post(`${baseUrl}/api/generate-itinerary`, {        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        preferences: formData.preferences
      });

      setItinerary(response.data);
    } catch (error) {
      console.error('Itinerary generation error:', error);
      setError('Failed to generate itinerary. Please make sure the backend server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    if (condition?.text?.toLowerCase().includes('sun') || condition?.text?.toLowerCase().includes('clear')) {
      return <Sun className="h-5 w-5 text-yellow-500" />;
    } else if (condition?.text?.toLowerCase().includes('rain')) {
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    } else {
      return <Cloud className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            Create your perfect travel itinerary with AI-powered recommendations
          </p>
        </div>

        {/* Form */}
        <div className="card p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Number of Travelers
                </label>
                <select
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="1">1 Traveler</option>
                  <option value="2">2 Travelers</option>
                  <option value="3">3 Travelers</option>
                  <option value="4">4 Travelers</option>
                  <option value="5+">5+ Travelers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

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
                className="input-field"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Generating Your Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Itinerary</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Itinerary */}
        {itinerary && (
          <div className="space-y-8">
            {/* Destination Images */}
            {itinerary.images && itinerary.images.length > 0 && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Discover {formData.destination}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {itinerary.images.slice(0, 6).map((image, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.tags}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-2 left-2">
                        <p className="text-white text-sm font-medium">
                          {image.tags.split(',')[0]}
                        </p>
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
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {itinerary.weather.forecast.map((day, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(day.day.condition)}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{day.day.condition?.text}</p>
                      <p className="text-sm font-semibold">
                        {Math.round(day.day.maxtemp_c)}°/{Math.round(day.day.mintemp_c)}°C
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Itinerary */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Daily Itinerary
              </h2>
              
              {itinerary.itinerary.days?.map((day, index) => (
                <div key={index} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-gray-600">{formatDate(day.date)}</p>
                    </div>
                    {itinerary.weather?.forecast[index] && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {getWeatherIcon(itinerary.weather.forecast[index].day.condition)}
                        <span>{Math.round(itinerary.weather.forecast[index].day.maxtemp_c)}°C</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {day.activities?.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-primary mt-1" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-primary">
                              {activity.time}
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-600">
                              {activity.location}
                            </span>
                          </div>
                          <p className="text-gray-900">{activity.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Attractions */}
            {itinerary.attractions && itinerary.attractions.length > 0 && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Popular Attractions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itinerary.attractions.slice(0, 9).map((attraction, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {attraction.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {attraction.address}
                      </p>
                      {attraction.categories && (
                        <div className="flex flex-wrap gap-1">
                          {attraction.categories.slice(0, 2).map((category, catIndex) => (
                            <span
                              key={catIndex}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
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

