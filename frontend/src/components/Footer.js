import React from 'react';
import { Plane, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  // Style constants
  const styles = {
    footer: {
      backgroundColor: '#f5f5f5ff',
      color: 'black',
      padding: '3rem 0 0',
      marginTop: 'auto'
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1.5rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
      '@media (max-width: 640px)': {
        gridTemplateColumns: '1fr'
      }
    },
    column: {
      padding: '0 1rem'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'black'
    },
    description: {
      color: '#000000ff',
      lineHeight: '1.6',
      maxWidth: '400px'
    },
    heading: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginBottom: '1.25rem',
      color: 'black'
    },
    linkList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    link: {
      color: '#000000ff',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      fontSize: '0.95rem',
      ':hover': {
        color: '#3049c6ff'
      }
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem',
      color: '#000000ff',
      fontSize: '0.95rem'
    },
    divider: {
      borderTop: '1px solid #374151',
      paddingTop: '2rem',
      marginTop: '2rem'
    },
    copyright: {
      textAlign: 'center',
      color: '#9ca3af',
      paddingBottom: '2rem'
    },
    icon: {
      color: '#ff6600',
      flexShrink: 0
    }
  };

  // Navigation links
  const links = [
    { name: 'Home', href: '/' },
    { name: 'AI Chat', href: '/chat' },
    { name: 'Itinerary', href: '/itinerary' },
    { name: 'Search', href: '/search' },
    { name: 'About', href: '/about' }
  ];

  // Contact information
  const contactInfo = [
    { icon: <Mail size={18} style={styles.icon} />, text: 'hello@travelai.com' },
    { icon: <Phone size={18} style={styles.icon} />, text: '+1 (555) 123-4567' },
    { icon: <MapPin size={18} style={styles.icon} />, text: 'San Francisco, CA' }
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Brand Column */}
          <div style={styles.column}>
            <div style={styles.logoContainer}>
              <Plane size={32} style={styles.icon} />
              <span style={styles.logoText}>TravelAI</span>
            </div>
            <p style={styles.description}>
              Your AI-powered travel consultant. Discover amazing destinations, 
              plan perfect itineraries, and find the best deals for your next adventure.
            </p>
          </div>

          {/* Links Column */}
          <div style={styles.column}>
            <h3 style={styles.heading}>Quick Links</h3>
            <div style={styles.linkList}>
              {links.map((link, index) => (
                <a key={index} href={link.href} style={styles.link}>
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div style={styles.column}>
            <h3 style={styles.heading}>Contact Us</h3>
            <div>
              {contactInfo.map((item, index) => (
                <div key={index} style={styles.contactItem}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={styles.divider}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} TravelAI. All rights reserved. 
            Built with AI-powered technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;