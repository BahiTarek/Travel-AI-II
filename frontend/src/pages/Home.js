import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Sparkles, Globe, Clock, Shield } from 'lucide-react';

const Home = () => {
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      navigate(`/itinerary?destination=${encodeURIComponent(destination)}`);
    }
  };

  const features = [
    {
      icon: <Sparkles size={32} color="#ff6600" />,
      title: 'AI-Powered Planning',
      description: 'Get personalized travel recommendations powered by advanced AI technology.'
    },
    {
      icon: <Globe size={32} color="#ff6600" />,
      title: 'Global Destinations',
      description: 'Explore thousands of destinations worldwide with detailed insights and tips.'
    },
    {
      icon: <Clock size={32} color="#ff6600" />,
      title: 'Instant Itineraries',
      description: 'Generate complete travel itineraries in seconds, tailored to your preferences.'
    },
    {
      icon: <Shield size={32} color="#ff6600" />,
      title: 'Best Price Guarantee',
      description: 'Find the best deals on flights and hotels with our price comparison engine.'
    }
  ];

  const popularDestinations = [
    { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?=400&h=300&fit=crop' },
    { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
    { name: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
    { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop' },
    { name: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop' },
    { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' }
  ];

  const heroStyle = {
    position: 'relative',
    background: 'linear-gradient(135deg, #004aad, rgba(0, 74, 173, 0.8))',
    color: 'white',
    padding: '5rem 0 8rem 0',
    textAlign: 'center'
  };

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem'
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    maxWidth: '48rem',
    margin: '0 auto 2rem auto',
    opacity: 0.9
  };

  const searchFormStyle = {
    maxWidth: '32rem',
    margin: '0 auto 2rem auto'
  };

 const searchContainerStyle = {
  display: 'flex',
  alignItems: 'center', // Vertical align
  gap: '0', // No extra gap
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(8px)',
  borderRadius: '0.5rem',
  padding: '0.25rem', // Small padding instead of 1rem
  width: '100%',
  flexWrap: 'nowrap', // Prevent stacking
};


const inputContainerStyle = {
  flex: 1, // Takes available space
  position: 'relative',
  minWidth: '200px', // Prevent squeezing
  marginTop: '0.9rem'
};

const inputStyle = {
  flex: '1',
  height: '48px',
  padding: '0 1rem 0 2.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '0.5rem 0 0 0.5rem', // Rounded left only
  color: 'white',
  outline: 'none',
  boxSizing: 'border-box'
};

  const iconStyle = {
    position: 'absolute',
    left: '0.75rem',
    top: '40%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.7)'
  };

  // Update the button style (add this new style object)
const searchButtonStyle = {
  height: '48px',
  padding: '0 1.5rem',
  borderRadius: '0 0.5rem 0.5rem 0', // Rounded right only
  backgroundColor: '#ff6600',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  flexShrink: 0,
  marginBottom: '0.5rem'
};


  const sectionStyle = {
    padding: '5rem 0'
  };

  const sectionTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
    textAlign: 'center'
  };

  const sectionSubtitleStyle = {
    fontSize: '1.25rem',
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: '48rem',
    margin: '0 auto 4rem auto'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    textAlign: 'center',
    transition: 'transform 0.3s',
    cursor: 'pointer'
  };

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.75rem'
  };

  const cardDescStyle = {
    color: '#6b7280'
  };

  const destinationCardStyle = {
    ...cardStyle,
    padding: 0,
    overflow: 'hidden'
  };

  const destinationImageStyle = {
    width: '100%',
    height: '12rem',
    objectFit: 'cover'
  };

  const destinationOverlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
    padding: '1rem'
  };

  const destinationNameStyle = {
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: '600'
  };

  const ctaSectionStyle = {
    ...sectionStyle,
    backgroundColor: '#004aad',
    color: 'white',
    textAlign: 'center'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  // For the tags below (Flexible Dates, etc.)
const tagsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
  marginTop: '1.5rem',  // Increased margin for better spacing
  width: '100%'
};


const tagStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '9999px',
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
};

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={containerStyle}>
          <h1 style={titleStyle}>
            Your AI Travel Consultant
          </h1>
          <p style={subtitleStyle}>
            Discover amazing destinations, plan perfect itineraries, and find the best deals 
            for your next adventure with the power of AI.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ ...searchFormStyle, width: '100%' }}>
            <div style={searchContainerStyle}>
              <div style={inputContainerStyle}>
                <MapPin style={iconStyle} size={20} />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={inputStyle}
                />
              </div>
             <button
  type="submit"
  className="btn-accent"
  style={searchButtonStyle}
>
  <Search size={20} />
  <span>Start Planning</span>
</button>
            </div>
          </form>

         <div style={tagsContainerStyle}>
  <div style={tagStyle}>
    <Calendar size={16} />
    <span>Flexible Dates</span>
  </div>
   <div style={tagStyle}>
    <Users size={16} />
    <span>Any Group Size</span>
  </div>
  <div style={tagStyle}>
    <Sparkles size={16} />
    <span>AI Powered</span>
  </div>
</div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ ...sectionStyle, backgroundColor: 'white' }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={sectionTitleStyle}>
              Why Choose TravelAI?
            </h2>
            <p style={sectionSubtitleStyle}>
              Experience the future of travel planning with our AI-powered platform 
              that makes every journey extraordinary.
            </p>
          </div>

          <div style={gridStyle}>
            {features.map((feature, index) => (
              <div key={index} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 style={cardTitleStyle}>
                  {feature.title}
                </h3>
                <p style={cardDescStyle}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section style={{ ...sectionStyle, backgroundColor: '#f4f4f4' }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={sectionTitleStyle}>
              Popular Destinations
            </h2>
            <p style={sectionSubtitleStyle}>
              Discover the world's most amazing places
            </p>
          </div>

          <div style={gridStyle}>
            {popularDestinations.map((destination, index) => (
              <div 
                key={index} 
                style={destinationCardStyle}
                onClick={() => navigate(`/itinerary?destination=${encodeURIComponent(destination.name)}`)}
              >
                <div style={{ position: 'relative', height: '12rem' }}>
                  <img
                    src={destination.image}
                    alt={destination.name}
                    style={destinationImageStyle}
                  />
                  <div style={destinationOverlayStyle}>
                    <h3 style={destinationNameStyle}>
                      {destination.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSectionStyle}>
        <div style={containerStyle}>
          <h2 style={{ ...sectionTitleStyle, color: 'white' }}>
            Ready to Start Your Adventure?
          </h2>
          <p style={{ ...sectionSubtitleStyle, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '2rem' }}>
            Join thousands of travelers who trust TravelAI to plan their perfect trips.
          </p>
          <div style={buttonContainerStyle}>
            <button 
              onClick={() => navigate('/chat')}
              className="btn-accent"
              style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}
            >
              Chat with AI Assistant
            </button>
            <button 
              onClick={() => navigate('/itinerary')}
              className="btn-secondary"
              style={{ 
                padding: '1rem 2rem', 
                fontSize: '1.125rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}
            >
              Create Itinerary
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

