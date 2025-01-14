import React, { useState, useRef, useEffect } from 'react';
// Import the external CSS

const playlist = [
  {
    type: 'Happy',
    songs: [
      { title: 'Pala Palakura', artist: 'Artist 1', url: 'path/to/song1.mp3' },
      { title: 'Po Indru Neeyaga', artist: 'Artist 2', url: 'path/to/song2.mp3' },
      { title: 'Aathadi Aathadi', artist: 'Artist 3', url: 'path/to/song3.mp3' },
      { title: 'Manasilaayo', artist: 'Artist 4', url: 'path/to/song4.mp3' },
      { title: 'Arabic Kuthu', artist: 'Artist 5', url: 'path/to/song5.mp3' }
    ]
  },
  {
    type: 'Sad',
    songs: [
      { title: 'Kanave Kanave', artist: 'Artist 1', url: 'path/to/song6.mp3' },
      { title: 'Ennodu Nee Irunthal', artist: 'Artist 2', url: 'path/to/song7.mp3' },
      { title: 'Po Nee Po', artist: 'Artist 3', url: 'path/to/song8.mp3' },
      { title: 'Shoot the Kuruvi', artist: 'Artist 4', url: 'path/to/song9.mp3' },
      { title: 'Yamma Yamma', artist: 'Artist 5', url: 'path/to/song10.mp3' },
      { title: 'Ava Enna', artist: 'Artist 6', url: 'path/to/song11.mp3' }
    ]
  },
  {
    type: 'Neutral',
    songs: [
      { title: 'Valayapatti Thavilu', artist: 'Artist 1', url: 'path/to/song12.mp3' },
      { title: 'Vaada Maaplila', artist: 'Artist 2', url: 'path/to/song13.mp3' },
      { title: 'Bhoomi Enna Suthuthe', artist: 'Artist 3', url: 'path/to/song14.mp3' },
      { title: 'Selfie Pulla', artist: 'Artist 4', url: 'path/to/song15.mp3' }
    ]
  }
];

function MusicPlayer({ emotion }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // Update the progress bar as the song plays
  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    if (duration) {
      setProgress((currentTime / duration) * 100);
    }
  };

  // Reset the progress bar when a new song is selected
  useEffect(() => {
    if (audioRef.current) {
      setProgress(0);
    }
  }, [currentSong]);

  const filteredPlaylist = playlist.find((mylist) => mylist.type === emotion);

  return (
    <div className="music-player-container">
      <h2>Recommended Songs for "{emotion}" Emotion</h2>

      {filteredPlaylist ? (
        <div className="playlist">
          {filteredPlaylist.songs.map((song, index) => (
            <div
              key={index}
              className={`song-card ${currentSong?.title === song.title ? 'active' : ''}`}
              onClick={() => setCurrentSong(song)}
            >
              <div className="song-info">
                <p><strong>{song.title}</strong></p>
                <p>{song.artist}</p>
              </div>
              <button className="play-button">▶️</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No songs available for the detected emotion.</p>
      )}

      {currentSong && (
        <div className="sticky-player">
          <p><strong>Now Playing:</strong> {currentSong.title} by {currentSong.artist}</p>
          <audio
            ref={audioRef}
            src={currentSong.url}
            controls
            onTimeUpdate={handleTimeUpdate}
            autoPlay
          ></audio>
          <progress className="progress-bar" value={progress} max="100"></progress>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
