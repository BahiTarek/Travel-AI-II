import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane } from 'lucide-react';
import '../index.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'AI Chat', href: '/chat' },
    { name: 'Itinerary', href: '/itinerary' },
    { name: 'Search', href: '/search' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  const navbarStyle = {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  };

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const flexStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    height: '4rem'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none'
  };

  const logoTextStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#004aad'
  };

  const desktopNavStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  };

  const linkStyle = (active) => ({
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s',
    color: active ? '#004aad' : '#374151',
    backgroundColor: active ? 'rgba(0, 74, 173, 0.1)' : 'transparent'
  });

  const mobileButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    color: '#374151',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  };

  const mobileMenuStyle = {
    display: isOpen ? 'block' : 'none',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '0.5rem'
  };

  const mobileLinkStyle = (active) => ({
    display: 'block',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: 'none',
    color: active ? '#004aad' : '#374151',
    backgroundColor: active ? 'rgba(0, 74, 173, 0.1)' : 'transparent',
    marginBottom: '0.25rem'
  });

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        <div style={flexStyle}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={logoStyle}>
              <Plane size={32} color="#004aad" />
              <span style={logoTextStyle}>TravelAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div style={{ ...desktopNavStyle, '@media (max-width: 768px)': { display: 'none' } }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={linkStyle(isActive(item.href))}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={mobileButtonStyle}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div style={mobileMenuStyle}>
        <div style={{ padding: '0.5rem 0' }}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              style={mobileLinkStyle(isActive(item.href))}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

