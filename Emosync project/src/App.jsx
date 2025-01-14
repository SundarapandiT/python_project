import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MusicPlayer from './components/MusicPlayer';
import GetEmotion from './components/GetEmotion';
import About from './components/About';
import './index.css'; // Import the external CSS file
import "./about.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Intro Page Route */}
        <Route
          path="/"
          element={
            <div>
              <header className="header">
                <div className="logo">
                  <img src="emosync_logo.png" alt="logo" />
                </div>
                <nav className="nav">
                  <ul className="nav-list">
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/songs">Songs</Link></li>
                    <li><Link to="#">Help</Link></li>
                  </ul>
                </nav>
                <div className="auth">
                  <Link to="#" className="auth-button">Let's Connect</Link>
                </div>
              </header>
              <main>
              <div className='container'>
              <h1>Music Recommendation System</h1>
              <h3>Let Your Emotions Choose the Music!</h3>
              <p>Our AI-powered system reads your emotions and recommends the perfect playlist to match your vibe.
              Discover the music that understands you. Sync your emotions with <b>Emosync!</b>
              </p>
              <Link to="/getemotion">
                <button>Get Started and Listening!</button>
              </Link>
              </div>
              <div className='picture'>
                <img src="emosync bg1.jpg" alt="emosync picture" />
              </div>
              </main>
            </div>
          }
        />

        {/* MusicPlayer Page Route */}
        <Route path="/getemotion" element={<GetEmotion />} />
        <Route path="/musicplayer" element={<MusicPlayer />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
