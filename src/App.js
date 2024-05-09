import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [artist, setArtist] = useState('');
  const [track, setTrack] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const searchVideo = async (artist, track) => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyAtiTVWTRIMfo_YdKUlUxi83psSQjOxMN0',
          part: 'snippet',
          q: `${artist} ${track} official video`,
          type: 'video'
        }
      });

      const videoId = response.data.items[0].id.videoId;
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        setVideoUrl(embedUrl);
      } else {
        console.log('Vídeo não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar vídeo do YouTube:', error);
    }
  };

  useEffect(() => {
    if (artist && track) {
      searchLyrics(artist, track);
    }
  }, [artist, track]);

  const searchLyrics = async (artist, track) => {
    try {
      const response = await axios.post('http://localhost:3001/search', { artist, track })
      const lyrics = response.data;
      setLyrics(lyrics);
      searchVideo(artist, track);
    } catch (error) {
      console.error('Erro ao buscar letra da música:', error);
    }
  };

  const handleSearch = () => {
    if (!artist || !track) {
      alert('Por favor, insira o nome do artista e da música.');
      return;
    }
    searchLyrics(artist, track);
  };

  return (
    <main className='App'>
      <div className="container">
        <h1>Letra de Música</h1>
        <div className="form-group">
          <label htmlFor="artist">Artista:</label>
          <input
            type="text"
            id="artist"
            placeholder="Nome do artista"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="track">Música:</label>
          <input
            type="text"
            id="track"
            placeholder="Nome da música"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
          />
        </div>
        {lyrics && (
          <div id="lyricsContainer">
            {lyrics.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
        {videoUrl && (
          <div id="videoContainer">
            <iframe
              title="Video"
              src={videoUrl}
              width="560"
              height="315"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
