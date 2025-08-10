import React from 'react';
import { Plane, Mail, Phone, MapPin } from 'lucide-react';
import '../index.css';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold">TravelAI</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your AI-powered travel consultant. Discover amazing destinations, 
              plan perfect itineraries, and find the best deals for your next adventure.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-accent transition-colors">Home</a></li>
              <li><a href="/chat" className="text-gray-300 hover:text-accent transition-colors">AI Chat</a></li>
              <li><a href="/itinerary" className="text-gray-300 hover:text-accent transition-colors">Itinerary</a></li>
              <li><a href="/search" className="text-gray-300 hover:text-accent transition-colors">Search</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-accent transition-colors">About</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-gray-300">hello@travelai.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-gray-300">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 TravelAI. All rights reserved. Built with AI-powered technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

