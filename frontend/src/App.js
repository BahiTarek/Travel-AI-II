import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Itinerary from './pages/Itinerary';
import Search from './pages/Search';
import About from './pages/About';

function App() {
  return (
    <Router basename="/">
      <div className="App" style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
        <Navbar />
        <main style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

