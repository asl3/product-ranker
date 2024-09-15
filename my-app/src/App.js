import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage_'; // The homepage component
import AboutPage from './AboutPage'; // The new page you want to add

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          {/* Navigation links */}
          <Link to="/">Home</Link>
          <Link to="/about">Search</Link>
        </nav>

        <Routes>
          {/* Define the routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;