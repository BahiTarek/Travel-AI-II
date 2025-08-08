import React from 'react';
import { Sparkles, Globe, Users, Shield, Mail, Phone, MapPin } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Sparkles className="h-12 w-12 text-accent" />,
      title: 'AI-Powered Intelligence',
      description: 'Our advanced AI technology analyzes millions of data points to provide personalized travel recommendations tailored to your preferences and budget.'
    },
    {
      icon: <Globe className="h-12 w-12 text-accent" />,
      title: 'Global Coverage',
      description: 'Access information about thousands of destinations worldwide, from popular tourist spots to hidden gems waiting to be discovered.'
    },
    {
      icon: <Users className="h-12 w-12 text-accent" />,
      title: 'Expert Curation',
      description: 'Our travel experts work alongside AI to ensure every recommendation meets the highest standards of quality and authenticity.'
    },
    {
      icon: <Shield className="h-12 w-12 text-accent" />,
      title: 'Trusted Partners',
      description: 'We partner with leading travel providers to offer you the best deals and secure booking experiences for flights and accommodations.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      description: 'Former travel industry executive with 15+ years of experience in digital innovation.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description: 'AI researcher and software engineer specializing in machine learning and natural language processing.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Travel',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      description: 'Travel expert and former tour guide with extensive knowledge of global destinations.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            About TravelAI
          </h1>
          <p className="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto">
            We're revolutionizing travel planning with AI-powered technology that makes 
            discovering and planning your perfect trip effortless and enjoyable.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At TravelAI, we believe that everyone deserves to experience the world's 
                wonders without the stress of complex planning. Our mission is to democratize 
                travel planning by making it accessible, intelligent, and personalized for every traveler.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We combine cutting-edge artificial intelligence with deep travel expertise 
                to create itineraries that are not just efficient, but truly memorable. 
                Whether you're a solo adventurer, a family on vacation, or a business traveler, 
                we're here to make your journey extraordinary.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">50K+</p>
                  <p className="text-sm text-gray-600">Happy Travelers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">200+</p>
                  <p className="text-sm text-gray-600">Countries Covered</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">1M+</p>
                  <p className="text-sm text-gray-600">Itineraries Created</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"
                alt="Travel planning"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 rounded-xl shadow-lg">
                <p className="text-2xl font-bold">AI-Powered</p>
                <p className="text-sm opacity-90">Smart Travel Planning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another travel booking site. We're your intelligent travel companion 
              that understands your unique preferences and creates experiences tailored just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind TravelAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card p-8 text-center hover:scale-105 transition-transform duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-xl opacity-90">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="opacity-90">hello@travelai.com</p>
              <p className="opacity-90">support@travelai.com</p>
            </div>

            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="opacity-90">+1 (555) 123-4567</p>
              <p className="opacity-90">Mon-Fri 9AM-6PM PST</p>
            </div>

            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="opacity-90">123 Innovation Drive</p>
              <p className="opacity-90">San Francisco, CA 94105</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg opacity-90 mb-6">
              Ready to start planning your next adventure?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/chat"
                className="btn-accent px-8 py-3 text-lg inline-block"
              >
                Chat with AI Assistant
              </a>
              <a
                href="/itinerary"
                className="btn-secondary px-8 py-3 text-lg bg-white/10 border-white/30 text-white hover:bg-white/20 inline-block"
              >
                Create Itinerary
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

