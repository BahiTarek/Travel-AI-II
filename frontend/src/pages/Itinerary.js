import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Sparkles, Clock, Sun, Cloud, CloudRain, Loader, ArrowRight, Star, Camera, Compass } from 'lucide-react';
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
      const response = await api.post('/api/generate-itinerary', {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
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
    if (!condition) return <Cloud className="h-5 w-5 text-slate-500" />;
    
    const text = condition.text.toLowerCase();
    if (text.includes('sun') || text.includes('clear')) {
      return <Sun className="h-5 w-5 text-amber-500" />;
    } else if (text.includes('rain')) {
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    }
    return <Cloud className="h-5 w-5 text-slate-500" />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Section Title Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 bg-blue-50 rounded-2xl px-6 py-4 shadow border border-blue-100">
          <Compass className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-700">Plan Your Trip</span>
        </div>
      </div>

      {/* Hero Section with Enhanced Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-teal-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Header with Enhanced Typography */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 mb-6">
              <Compass className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">AI-Powered Travel Planning</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
              Craft Your Perfect
              <br />
              <span className="text-blue-600">Travel Experience</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Create your personalized {tripDuration()}-day adventure to{' '}
              <span className="font-semibold text-slate-800">
                {formData.destination || 'your dream destination'}
              </span>
            </p>
          </div>

          {/* Enhanced Form Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 lg:p-12 mb-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Destination Field with Icon */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        Where would you like to go? *
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="e.g., Paris, France or Tokyo, Japan"
                        className="w-full pl-12 pr-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder:text-slate-400"
                        required
                      />
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                    </div>
                  </div>

                  {/* Date Fields with Enhanced Design */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        Departure Date *
                      </div>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-100 rounded-lg">
                          <Calendar className="h-4 w-4 text-orange-600" />
                        </div>
                        Return Date *
                      </div>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      required
                      min={formData.startDate}
                    />
                  </div>

                  {/* Travelers Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 rounded-lg">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        Number of Travelers
                      </div>
                    </label>
                    <select
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    >
                      {[1, 2, 3, 4, 5, '6+'].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Traveler' : 'Travelers'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferences Field */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-pink-100 rounded-lg">
                          <Sparkles className="h-4 w-4 text-pink-600" />
                        </div>
                        What interests you most?
                      </div>
                    </label>
                    <textarea
                      name="preferences"
                      value={formData.preferences}
                      onChange={handleInputChange}
                      placeholder="Tell us about your travel style: museums, local cuisine, nightlife, outdoor adventures, cultural experiences, budget-friendly options..."
                      rows="4"
                      className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder:text-slate-400 resize-none"
                    />
                  </div>
                </div>

                {/* Enhanced Error Display */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 p-2 bg-red-100 rounded-full">
                        <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-red-800 font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-6 px-8 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader className="h-6 w-6 animate-spin" />
                      <span>Crafting Your Perfect Itinerary...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Sparkles className="h-6 w-6" />
                      <span>Generate My Itinerary</span>
                      <ArrowRight className="h-6 w-6" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-12 border-t-2 border-blue-100 rounded-full" />

      {/* Results Section with Enhanced Design and Animation */}
      {itinerary && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
          {/* Destination Images with Enhanced Gallery */}
          {itinerary.images?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Discover {itinerary.destination || formData.destination}
                  </h2>
                  <p className="text-slate-600 mt-1">Visual highlights of your destination</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {itinerary.images.slice(0, 6).map((image, index) => (
                  <div key={index} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                    <img
                      src={image.url || image.preview}
                      alt={image.tags || `Image of ${formData.destination}`}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="font-semibold text-lg leading-tight">{image.tags?.split(',')[0] || 'Travel Destination'}</p>
                      <div className="flex items-center gap-1 mt-2 opacity-90">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm">Featured Location</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Weather Forecast */}
          {itinerary.weather && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Sun className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Weather Forecast</h2>
                  <p className="text-slate-600 mt-1">Plan your activities with confidence</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
                {itinerary.weather.forecast?.map((day, index) => (
                  <div key={index} className="flex flex-col items-center p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                    <p className="text-sm font-semibold text-slate-700 mb-3">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <div className="mb-3 p-2 bg-white rounded-full shadow-sm">
                      {getWeatherIcon(day.day?.condition)}
                    </div>
                    <p className="text-xs text-slate-600 mb-3 text-center leading-tight">
                      {day.day?.condition?.text || 'N/A'}
                    </p>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900">
                        {day.day?.maxtemp_c ? Math.round(day.day.maxtemp_c) : 'N'}°
                      </p>
                      <p className="text-sm text-slate-500">
                        {day.day?.mintemp_c ? Math.round(day.day.mintemp_c) : 'N'}°
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Daily Itinerary */}
          {itinerary.itinerary?.days?.length > 0 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Your Daily Adventure</h2>
                <p className="text-xl text-slate-600">Carefully curated experiences for each day</p>
              </div>
              
              {itinerary.itinerary.days.map((day, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 lg:p-12 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {day.day}
                      </div>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                          {day.title}
                        </h3>
                        <p className="text-slate-600 text-lg mt-1">{formatDate(day.date)}</p>
                      </div>
                    </div>
                    
                    {itinerary.weather?.forecast?.[index] && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-3 rounded-2xl border border-slate-200/50">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          {getWeatherIcon(itinerary.weather.forecast[index].day?.condition)}
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-slate-900">
                            {itinerary.weather.forecast[index].day?.maxtemp_c 
                              ? Math.round(itinerary.weather.forecast[index].day.maxtemp_c) 
                              : 'N'}°C
                          </p>
                          <p className="text-xs text-slate-600">
                            {itinerary.weather.forecast[index].day?.condition?.text || 'Weather'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {day.activities?.map((activity, actIndex) => (
                      <div key={actIndex} className="group flex items-start gap-6 p-6 bg-gradient-to-r from-slate-50/50 to-blue-50/30 rounded-2xl border border-slate-200/30 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300">
                        <div className="flex-shrink-0 pt-1">
                          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                              {activity.time}
                            </span>
                            {activity.location && (
                              <span className="inline-flex items-center gap-1 text-slate-600 text-sm">
                                <MapPin className="h-4 w-4" />
                                {activity.location}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-line">
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

          {/* Enhanced Attractions */}
          {itinerary.attractions?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Must-Visit Attractions</h2>
                  <p className="text-slate-600 mt-1">Handpicked destinations for your journey</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {itinerary.attractions.slice(0, 9).map((attraction, index) => (
                  <div key={index} className="group p-6 border-2 border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300">
                        {attraction.name}
                      </h3>
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    
                    {attraction.address && (
                      <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                        {attraction.address}
                      </p>
                    )}
                    
                    {attraction.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {attraction.categories.slice(0, 3).map((category, catIndex) => (
                          <span
                            key={catIndex}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300"
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
  );
};

export default Itinerary;