import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plane, Building, Search, Calendar, MapPin, Users, Loader, ExternalLink } from 'lucide-react';
import axios from 'axios';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'flights');
  const [flightData, setFlightData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: '1'
  });
  const [hotelData, setHotelData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '2'
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFlightInputChange = (e) => {
    setFlightData({
      ...flightData,
      [e.target.name]: e.target.value
    });
  };

  const handleHotelInputChange = (e) => {
    setHotelData({
      ...hotelData,
      [e.target.name]: e.target.value
    });
  };

  const searchFlights = async (e) => {
    e.preventDefault();
    if (!flightData.origin || !flightData.destination || !flightData.departureDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await axios.get('http://localhost:5000/api/flights', {
        params: {
          origin: flightData.origin,
          destination: flightData.destination,
          departure_date: flightData.departureDate,
          return_date: flightData.returnDate || undefined,
          currency: 'USD'
        }
      });

      setResults(response.data);
    } catch (error) {
      console.error('Flight search error:', error);
      setError('Failed to search flights. Please make sure the backend server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchHotels = async (e) => {
    e.preventDefault();
    if (!hotelData.location || !hotelData.checkIn || !hotelData.checkOut) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await axios.get('http://localhost:5000/api/hotels', {
        params: {
          location: hotelData.location,
          check_in: hotelData.checkIn,
          check_out: hotelData.checkOut,
          currency: 'USD'
        }
      });

      setResults(response.data);
    } catch (error) {
      console.error('Hotel search error:', error);
      setError('Failed to search hotels. Please make sure the backend server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateBookingLink = (result, type) => {
    // Generate affiliate booking links (placeholder URLs)
    if (type === 'flight') {
      return `https://www.skyscanner.com/transport/flights/${flightData.origin}/${flightData.destination}/${flightData.departureDate}/?adults=${flightData.passengers}&children=0&adultsv2=${flightData.passengers}&childrenv2=&infants=0&cabinclass=economy&rtn=0&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=home`;
    } else {
      return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotelData.location)}&checkin=${hotelData.checkIn}&checkout=${hotelData.checkOut}&group_adults=${hotelData.guests}&no_rooms=1&group_children=0`;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Travel Search Engine
          </h1>
          <p className="text-xl text-gray-600">
            Find the best deals on flights and hotels
          </p>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('flights')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'flights'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <Plane className="inline h-5 w-5 mr-2" />
              Flights
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'hotels'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <Building className="inline h-5 w-5 mr-2" />
              Hotels
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'flights' ? (
              <form onSubmit={searchFlights} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      From *
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={flightData.origin}
                      onChange={handleFlightInputChange}
                      placeholder="e.g., NYC, London"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      To *
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={flightData.destination}
                      onChange={handleFlightInputChange}
                      placeholder="e.g., Paris, Tokyo"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Departure *
                    </label>
                    <input
                      type="date"
                      name="departureDate"
                      value={flightData.departureDate}
                      onChange={handleFlightInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Return
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={flightData.returnDate}
                      onChange={handleFlightInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="inline h-4 w-4 mr-1" />
                      Passengers
                    </label>
                    <select
                      name="passengers"
                      value={flightData.passengers}
                      onChange={handleFlightInputChange}
                      className="input-field"
                    >
                      <option value="1">1 Passenger</option>
                      <option value="2">2 Passengers</option>
                      <option value="3">3 Passengers</option>
                      <option value="4">4 Passengers</option>
                      <option value="5">5+ Passengers</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        <span>Search Flights</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={searchHotels} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Destination *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={hotelData.location}
                      onChange={handleHotelInputChange}
                      placeholder="e.g., Paris, New York"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Check-in *
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={hotelData.checkIn}
                      onChange={handleHotelInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Check-out *
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={hotelData.checkOut}
                      onChange={handleHotelInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="inline h-4 w-4 mr-1" />
                      Guests
                    </label>
                    <select
                      name="guests"
                      value={hotelData.guests}
                      onChange={handleHotelInputChange}
                      className="input-field"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        <span>Search Hotels</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results
              </h2>
              <p className="text-gray-600">
                {activeTab === 'flights' ? 'Flight' : 'Hotel'} options found
              </p>
            </div>

            {/* Demo Results (since APIs might not return real data) */}
            <div className="space-y-4">
              {activeTab === 'flights' ? (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Plane className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {flightData.origin} → {flightData.destination}
                        </h3>
                        <p className="text-gray-600">
                          {new Date(flightData.departureDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">$299</p>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p>Departure: 08:30 AM</p>
                      <p>Arrival: 02:45 PM</p>
                      <p>Duration: 6h 15m</p>
                    </div>
                    <a
                      href={generateBookingLink(null, 'flight')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent flex items-center space-x-2"
                    >
                      <span>Book Now</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Building className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Grand Hotel {hotelData.location}
                        </h3>
                        <p className="text-gray-600">
                          {new Date(hotelData.checkIn).toLocaleDateString()} - {new Date(hotelData.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">$129</p>
                      <p className="text-sm text-gray-600">per night</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p>★★★★☆ 4.2/5 rating</p>
                      <p>Free WiFi • Pool • Breakfast</p>
                      <p>City Center Location</p>
                    </div>
                    <a
                      href={generateBookingLink(null, 'hotel')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent flex items-center space-x-2"
                    >
                      <span>Book Now</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Additional demo results */}
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  This is a demo showing how search results would appear. 
                  In a production environment, real data would be fetched from the APIs.
                </p>
                <p className="text-sm text-gray-500">
                  The booking links will redirect to partner sites where you can complete your reservation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

