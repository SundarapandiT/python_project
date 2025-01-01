const playlist = [
  {
    type: 'Happy',
    songs: [
      { title: 'Pala Palakura', artist: 'Artist 1', url:'path/to/song1.mp3' },
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
      { title: 'Valayapatti thavilu', artist: 'Artist 1', url: 'path/to/song12.mp3' },
      { title: 'Vaada Maaplila', artist: 'Artist 2', url: 'path/to/song13.mp3' },
      { title: 'Bhoomi Enna Suthuthe', artist: 'Artist 3', url: 'path/to/song14.mp3' },
      { title: 'Selfie Pulla', artist: 'Artist 4', url: 'path/to/song15.mp3' }
    ]
  }
];

function MusicPlayer({ emotion }) {
  const filteredPlaylist = playlist.find((mylist) => mylist.type === emotion);

  return (
    <div>
      <h2>Recommended Songs for "{emotion}" Emotion</h2>
      {filteredPlaylist ? (
        <ul>
          {filteredPlaylist.songs.map((song, index) => (
            <li key={index}>
              <p><strong>Title:</strong> {song.title}</p>
              <p><strong>Artist:</strong> {song.artist}</p>
              <audio controls>
                <source src={song.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </li>
          ))}
        </ul>
      ) : (
        <p>No songs available for the detected emotion.</p>
      )}
    </div>
  );
}

export default MusicPlayer;
