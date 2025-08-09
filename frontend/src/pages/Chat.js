import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';


const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI travel consultant. I can help you with destination recommendations, travel planning, flight and hotel searches, and creating custom itineraries. What would you like to know about your next trip?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Check if user is asking for specific services
      const message = inputMessage.toLowerCase();
      
      if (message.includes('hotel') && (message.includes('search') || message.includes('find'))) {
        // Redirect to hotel search
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'I\'d be happy to help you find hotels! Let me redirect you to our hotel search where you can specify your destination, check-in and check-out dates, and I\'ll find the best deals for you.',
          action: 'redirect',
          redirectTo: '/search?type=hotels'
        };
        setMessages(prev => [...prev, botResponse]);
        setTimeout(() => {
          window.location.href = '/search?type=hotels';
        }, 2000);
        return;
      }

      if (message.includes('flight') && (message.includes('search') || message.includes('find'))) {
        // Redirect to flight search
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'I\'ll help you find the best flights! Let me take you to our flight search where you can enter your departure and destination cities, travel dates, and I\'ll show you the cheapest options.',
          action: 'redirect',
          redirectTo: '/search?type=flights'
        };
        setMessages(prev => [...prev, botResponse]);
        setTimeout(() => {
          window.location.href = '/search?type=flights';
        }, 2000);
        return;
      }

      if (message.includes('itinerary') || message.includes('plan') || message.includes('trip')) {
        // Redirect to itinerary generator
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'I\'d love to help you create a detailed itinerary! Let me take you to our itinerary generator where you can specify your destination, travel dates, and preferences, and I\'ll create a complete day-by-day plan for you.',
          action: 'redirect',
          redirectTo: '/itinerary'
        };
        setMessages(prev => [...prev, botResponse]);
        setTimeout(() => {
          window.location.href = '/itinerary';
        }, 2000);
        return;
      }

        const baseUrl = API_BASE_URL.endsWith('/')
  ? API_BASE_URL.slice(0, -1)
  : API_BASE_URL;

      // Regular AI chat
  const response = await axios.post(`${baseUrl}/api/chat`, {
        message: inputMessage,
        conversation: messages.filter(msg => msg.type !== 'system').map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      });

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.message
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I\'m having trouble connecting right now. Please make sure the backend server is running and try again. In the meantime, you can explore our itinerary generator or search for flights and hotels directly!'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { text: 'Find flights for me', action: () => window.location.href = '/search?type=flights' },
    { text: 'Search for hotels', action: () => window.location.href = '/search?type=hotels' },
    { text: 'Create an itinerary', action: () => window.location.href = '/itinerary' },
    { text: 'Recommend destinations', action: () => setInputMessage('Can you recommend some popular travel destinations?') }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-6">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">AI Travel Assistant</h1>
                <p className="opacity-90">Your personal travel consultant</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-gray-50 border-b">
            <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-primary' : 'bg-accent'}`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${message.type === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-6 border-t bg-gray-50">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about travel..."
                className="flex-1 input-field"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

