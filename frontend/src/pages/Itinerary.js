import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Sparkles, Clock, Sun, Cloud, CloudRain, Loader, ArrowRight, Star, Camera, Compass } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

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

  const tripDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-teal-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
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

          {/* Form Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        Where would you like to go? *
                      </div>
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="e.g., Paris, France or Tokyo, Japan"
                      className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder:text-slate-400"
                      required
                    />
                  </div>

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

      {/* Results Section */}
      {itinerary && (
        <motion.div 
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12"
        >
          {/* Destination Images */}
          {itinerary.images?.length > 0 && (
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative h-64 sm:h-80 lg:h-96 w-full">
                <img
                  src={itinerary.images[0].url || itinerary.images[0].preview}
                  alt={itinerary.images[0].tags || `Image of ${formData.destination}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-2">
                    Welcome to {itinerary.destination || formData.destination}
                  </h2>
                  <p className="text-lg opacity-90">
                    Your {tripDuration()}-day adventure starts here
                  </p>
                </div>
              </div>
              
              <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {itinerary.images.slice(1, 5).map((image, index) => (
                  <div 
                    key={index} 
                    className="aspect-square overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={image.url || image.preview}
                      alt={image.tags || `Image of ${formData.destination}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Weather Forecast */}
          {itinerary.weather && (
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Cloud className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Weather Forecast</h2>
                  <p className="text-gray-600">Plan your activities accordingly</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
                {itinerary.weather.forecast?.map((day, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 text-center hover:shadow-md transition-all"
                  >
                    <p className="font-medium text-gray-700 mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(day.day?.condition)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {day.day?.condition?.text || 'N/A'}
                    </p>
                    <div className="flex justify-center gap-2">
                      <span className="font-bold text-gray-900">
                        {day.day?.maxtemp_c ? Math.round(day.day.maxtemp_c) : 'N'}°
                      </span>
                      <span className="text-gray-500">
                        {day.day?.mintemp_c ? Math.round(day.day.mintemp_c) : 'N'}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Daily Itinerary */}
          {itinerary.itinerary?.days?.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Your Personalized Itinerary
                </h2>
                <p className="text-xl text-gray-600">
                  Carefully crafted experiences for each day
                </p>
              </div>
              
              <AnimatePresence>
                {itinerary.itinerary.days.map((day, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden"
                  >
                    <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                          Day {day.day}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {day.title}
                          </h3>
                          <p className="text-blue-600">
                            {formatDate(day.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {day.activities?.map((activity, actIndex) => (
                        <div key={actIndex} className="p-6 hover:bg-blue-50/50 transition-colors">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Clock className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                  {activity.time}
                                </span>
                                {activity.location && (
                                  <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                                    <MapPin className="h-4 w-4" />
                                    {activity.location}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-800 whitespace-pre-line">
                                {activity.activity}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Itinerary;