import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plane,
  Building,
  Search,
  Calendar,
  MapPin,
  Users,
  Loader,
  ExternalLink,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  // Then create a clean base URL function:
const getApiUrl = (endpoint) => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("type") || "flights"
  );

  const [flightData, setFlightData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
  });

 const [hotelData, setHotelData] = useState({
  location: "",
  checkIn: "",
  checkOut: "",
  adults: "2",
  children: "0",
  rooms: "1",
});

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Input handlers
  const handleFlightInputChange = (e) => {
    setFlightData({ ...flightData, [e.target.name]: e.target.value });
  };
  const handleHotelInputChange = (e) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value });
  };

  // Fetch flights
  // Fetch flights - UPDATED VERSION
const searchFlights = async (e) => {
  e.preventDefault();
  if (!flightData.origin || !flightData.destination || !flightData.departureDate) {
    setError("Please fill in all required fields");
    return;
  }

  setLoading(true);
  setError("");
  setResults([]);

  try {
    const response = await axios.get(getApiUrl('/api/flights'), {
      params: {
        origin: flightData.origin.toUpperCase(),
        destination: flightData.destination.toUpperCase(),
        departure_date: flightData.departureDate,
        return_date: flightData.returnDate || undefined,
        currency: "USD",
      },
    });

    console.log("Flight API response:", response.data);

    // Check if the response indicates success
    if (!response.data.success) {
      setError(response.data.error || "Flight search failed");
      return;
    }

    // Extract data from the correct response structure
    let data = response.data.flights?.data || [];
    if (typeof data === "object" && !Array.isArray(data)) {
      data = Object.values(data);
    }
    
    if (data.length === 0) {
      setError("No flights found for your search criteria. Try different dates or routes.");
    } else {
      setResults(data);
    }
  } catch (err) {
    console.error("Flight search error:", err);
    if (err.response?.data?.error) {
      setError(err.response.data.error);
    } else if (err.response?.status === 500) {
      setError("Server error. Please try again later.");
    } else if (err.request) {
      setError("Cannot connect to the server. Please check your internet connection.");
    } else {
      setError("Failed to search flights. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  // Fetch hotels
const searchHotels = async (e) => {
  e.preventDefault();
  if (!hotelData.location || !hotelData.checkIn || !hotelData.checkOut) {
    setError("Please fill in all required fields");
    return;
  }

  setLoading(true);
  setError("");
  setResults([]);

  try {
    console.log("Making hotel search request...");
    const response = await axios.get(getApiUrl('/api/hotels'), {
  params: {
    city: hotelData.location,
    check_in: hotelData.checkIn,
    check_out: hotelData.checkOut,
    currency: "USD",
    adults: hotelData.adults,
    children: hotelData.children,
    rooms: hotelData.rooms,
  },
});

    console.log("Hotel API response:", response.data);

    // Check if the response indicates success
    if (!response.data.success) {
      // Handle specific error cases with better messages
      if (response.data.alternativeLocations) {
        const alternatives = response.data.alternativeLocations.map(loc => 
          `${loc.name} (${loc.country})`
        ).join(', ');
        setError(`${response.data.error} Try these alternatives: ${alternatives}`);
      } else if (response.data.suggestions) {
        setError(`${response.data.error} ${response.data.suggestions.join('. ')}`);
      } else {
        setError(response.data.error || "Hotel search failed");
      }
      return;
    }

    let data = response.data?.hotels || [];
    if (typeof data === "object" && !Array.isArray(data)) {
      data = Object.values(data);
    }
    
    if (data.length === 0) {
      setError(response.data.message || "No hotels found for your search criteria. Try different dates or location.");
    } else {
      setResults(data);
      // Show success message with location info if available
      if (response.data.locationInfo) {
        console.log(`Found hotels in ${response.data.locationInfo.name}, ${response.data.locationInfo.country}`);
      }
    }
  } catch (err) {
    console.error("Hotel search error:", err);
    
    if (err.response?.status === 404) {
      if (err.response.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Location not found. Try using a major city name like 'Paris', 'London', or 'New York'");
      }
    } else if (err.response?.status === 500) {
      setError("Server error. Please try again later.");
    } else if (err.request) {
      setError("Cannot connect to the server. Please check your internet connection.");
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};



const generateBookingLink = (result, type) => {
   if (type === "flight") {
    // Clean and format the parameters
    const origin = (result.origin || "").toUpperCase().trim();
    const destination = (result.destination || "").toUpperCase().trim();
    const departureDate = result.departure_at ? new Date(result.departure_at).toISOString().split('T')[0] : "";
    
    // Validate required parameters
    if (!origin || !destination || !departureDate) {
      console.error("Missing flight parameters:", { origin, destination, departureDate });
      return "#"; // Fallback to prevent broken links
    }

    // Construct the Aviasales URL with proper formatting
    return `https://www.aviasales.com/search/${origin}${departureDate.replace(/-/g, '')}${destination}1?adults=${flightData.passengers || 1}&currency=USD`;

  } else {
    // Try to get the hotel ID from different possible response structures
    const hotelId = result.hotelId || result.id || result.hotel_id;
    const hotelName = result.hotelName || result.name || result.hotel_name;
    
    if (hotelId) {
      // If we have a hotel ID, create a direct deep link
      return `https://search.hotellook.com/hotels?hotelId=${hotelId}&checkIn=${hotelData.checkIn}&checkOut=${hotelData.checkOut}&adults=${hotelData.adults}&children=${hotelData.children}`;
    } else if (hotelName) {
      // If no ID but we have a name, try to search for that specific hotel
      return `https://search.hotellook.com/?city=${encodeURIComponent(hotelData.location)}&checkIn=${hotelData.checkIn}&checkOut=${hotelData.checkOut}&adults=${hotelData.adults}&children=${hotelData.children}&search=${encodeURIComponent(hotelName)}`;
    } else {
      // Fallback to generic search
      return `https://search.hotellook.com/?city=${encodeURIComponent(hotelData.location)}&checkIn=${hotelData.checkIn}&checkOut=${hotelData.checkOut}&adults=${hotelData.adults}&children=${hotelData.children}`;
    }
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
              onClick={() => setActiveTab("flights")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "flights"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Plane className="inline h-5 w-5 mr-2" />
              Flights
            </button>
            <button
              onClick={() => setActiveTab("hotels")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "hotels"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Building className="inline h-5 w-5 mr-2" />
              Hotels
            </button>
          </div>

          <div className="p-6">
            {/* Flight Form */}
            {activeTab === "flights" && (
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
                      placeholder="e.g., NYC"
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
                      placeholder="e.g., Paris"
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
                      {[...Array(5)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1} Passenger{i > 0 ? "s" : ""}
                        </option>
                      ))}
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
            )}

           {/* Hotel Form */}
{activeTab === "hotels" && (
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
          placeholder="e.g., Paris"
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

      {/* Adults */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="inline h-4 w-4 mr-1" />
          Adults
        </label>
        <select
          name="adults"
          value={hotelData.adults}
          onChange={handleHotelInputChange}
          className="input-field"
        >
          {[...Array(5)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} Adult{i > 0 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Children */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Children
        </label>
        <select
          name="children"
          value={hotelData.children}
          onChange={handleHotelInputChange}
          className="input-field"
        >
          {[...Array(5)].map((_, i) => (
            <option key={i} value={i}>
              {i} Child{i > 1 ? "ren" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Rooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rooms
        </label>
        <select
          name="rooms"
          value={hotelData.rooms}
          onChange={handleHotelInputChange}
          className="input-field"
        >
          {[...Array(5)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} Room{i > 0 ? "s" : ""}
            </option>
          ))}
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>

            {activeTab === "flights" ? results.map((flight, idx) => (
  <div key={idx} className="card p-6">
    <div className="flex justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {flight.origin} → {flight.destination}
        </h3>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p><strong>Departure:</strong> {new Date(flight.departure_at).toLocaleDateString()} at {new Date(flight.departure_at).toLocaleTimeString()}</p>
          {flight.return_at && (
            <p><strong>Return:</strong> {new Date(flight.return_at).toLocaleDateString()} at {new Date(flight.return_at).toLocaleTimeString()}</p>
          )}
          <p><strong>Airline:</strong> {flight.airline} | <strong>Flight:</strong> {flight.flight_number}</p>
          <p><strong>Transfers:</strong> {flight.transfers || 0} | <strong>Duration:</strong> {flight.duration} min</p>
        </div>
      </div>
      <div className="text-right ml-4">
        <p className="text-2xl font-bold text-primary">
          ${flight.price} USD
        </p>
        <a
          href={generateBookingLink(flight, "flight")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-accent flex items-center space-x-2 mt-2"
        >
          <span>Book Now</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  </div>
)) :  results.map((hotel, idx) => {
  // Extract hotel information with fallbacks for different API response structures
  const hotelName = hotel.hotelName || hotel.name || hotel.hotel_name || "Hotel";
  const price = hotel.price_from || hotel.priceAvg || hotel.price || "N/A";
  const stars = hotel.stars || hotel.star_rating || "";
  const address = hotel.address || hotel.location?.name || hotelData.location;
  const currency = hotel.currency || "USD";
  
  return (
    <div key={idx} className="card p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {hotelName}
          </h3>
          <p className="text-gray-600">
            {stars ? `${stars}★` : ""} – {address}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {price} {currency}
          </p>
          <a
            href={generateBookingLink(hotel, "hotel")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent flex items-center space-x-2 mt-2"
          >
            <span>Book Now</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
})}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;