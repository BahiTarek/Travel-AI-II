import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI travel consultant. I can help you with destination recommendations, travel planning, flight and hotel searches, and creating custom itineraries. What would you like to know about your next trip?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }
};

useEffect(() => {
  // Only scroll if it's a new bot message or the user is at/near the bottom
  if (messages.length > 0 && (messages[messages.length - 1].type === 'bot' || isNearBottom())) {
    scrollToBottom();
  }
}, [messages]);

const isNearBottom = () => {
  const container = messagesEndRef.current?.parentElement;
  if (!container) return false;
  return container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
};

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const message = inputMessage.toLowerCase();
      
      if (message.includes('hotel') && (message.includes('search') || message.includes('find'))) {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'I\'d be happy to help you find hotels! Let me redirect you to our hotel search where you can specify your destination, check-in and check-out dates, and I\'ll find the best deals for you.',
          action: 'redirect',
          redirectTo: '/search?type=hotels',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
        setTimeout(() => {
          window.location.href = '/search?type=hotels';
        }, 2000);
        return;
      }

      // Other redirect checks remain the same...

      const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
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
        content: response.data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I\'m having trouble connecting right now. Please make sure the backend server is running and try again. In the meantime, you can explore our itinerary generator or search for flights and hotels directly!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBotResponse = (text) => {
  // Convert numbered lists to proper HTML
  text = text.replace(/(Day \d+:.*?)(?=Day \d+:|$)/gs, (match) => {
    return `<div class="day-section"><strong>${match.split(':')[0]}:</strong> ${match.split(':').slice(1).join(':').trim()}</div>`;
  });
  
  // Convert line breaks to paragraphs
  text = text.replace(/\n\n+/g, '</p><p>');
  text = `<p>${text}</p>`;
  
  // Convert dashes or asterisks to bullet points
  text = text.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
  
  return text;
};

  const quickActions = [
    { text: 'Find flights', action: () => window.location.href = '/search?type=flights' },
    { text: 'Search hotels', action: () => window.location.href = '/search?type=hotels' },
    { text: 'Plan itinerary', action: () => window.location.href = '/itinerary' },
    { text: 'Destinations', action: () => setInputMessage('Can you recommend some popular travel destinations?') }
  ];

  return (
  <div className="chat-container">
    {/* Header */}
    <div className="chat-header">
      <div className="chat-header-icon">
        <Bot size={20} />
      </div>
      <div className="chat-header-text">
        <h1>Travel Assistant</h1>
        <p>AI-powered travel consultant</p>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="quick-actions">
      <p>QUICK ACTIONS</p>
      <div>
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="quick-action-btn"
          >
            {action.text}
          </button>
        ))}
      </div>
    </div>

    {/* Main Chat Area */}
    <div className="chat-main-area">
      {/* Messages Container - This will scroll */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.type === 'bot' && (
              <div className="message-avatar">
                <Bot size={16} />
              </div>
            )}
            <div className="message-content">
              {message.type === 'bot' && typeof message.content === 'string' ? (
                <div dangerouslySetInnerHTML={{
                  __html: formatBotResponse(message.content)
                }} />
              ) : (
                message.content
              )}
              <div className="message-timestamp">
                {message.timestamp}
              </div>
            </div>
            {message.type === 'user' && (
              <div className="message-avatar">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message bot-message">
            <div className="message-avatar">
              <Bot size={16} />
            </div>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="chat-input-area">
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about flights, hotels, or destinations..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="send-btn"
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>

    {/* Footer */}
    <div className="chat-footer">
      AI Assistant may produce inaccurate information
    </div>
  </div>
);
};

export default Chat;