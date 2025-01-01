import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MusicPlayer from './components/MusicPlayer';
import GetEmotion from './components/GetEmotion';

function App() {
  return (
    <Router>
      <Routes>
        {/* Intro Page Route */ }
        <Route path="/" element={
          <div>
            <h1>Music Recommendation System</h1>
            <h3>Let Your Emotions Choose the Music!</h3>
            <p>Our AI-powered system reads your emotions and recommends the perfect playlist to match your vibe.</p>
            <Link to="/getemotion">
              <button>Get Started and Listening!</button>
            </Link>
          </div>
        } />

        {/* MusicPlayer Page Route */}
        <Route path="/getemotion" element={<GetEmotion />} />
      </Routes>
    </Router>
  );
}

export default App;
