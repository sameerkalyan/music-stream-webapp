import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioError, setAudioError] = useState(null);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Load songs from JSON
  useEffect(() => {
    fetch('/songs.json')
      .then(response => response.json())
      .then(data => {
        setSongs(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load songs');
        setLoading(false);
      });
  }, []);

  // Get play count for a song
  const getPlayCount = (songId) => {
    const counts = JSON.parse(localStorage.getItem('playCounts') || '{}');
    return counts[songId] || 0;
  };

  // Save play count
  const incrementPlayCount = (songId) => {
    const counts = JSON.parse(localStorage.getItem('playCounts') || '{}');
    counts[songId] = (counts[songId] || 0) + 1;
    localStorage.setItem('playCounts', JSON.stringify(counts));
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();
    const handleError = (e) => {
      console.error('Audio error:', e);
      const errorMsg = audio.error ? `Error code: ${audio.error.code}` : 'Unknown error';
      setAudioError(`Failed to load audio. ${errorMsg}. Check if files are accessible.`);
      setIsPlaying(false);
    };
    const handleCanPlay = () => {
      setAudioError(null);
      console.log('Audio loaded successfully');
    };
    const handleLoadStart = () => {
      console.log('Loading audio from:', audio.currentSrc);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [currentSongIndex, isRepeat, isShuffle, songs]);

  // Play/Pause toggle
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            if (currentTime === 0 || currentTime < 1) {
              incrementPlayCount(songs[currentSongIndex].id);
            }
          })
          .catch(err => {
            console.error('Playback failed:', err);
            setAudioError('Playback failed. Try clicking play again.');
            setIsPlaying(false);
          });
      }
    }
  };

  // Next song
  const handleNext = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }

    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // Previous song
  const handlePrevious = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  // Seek
  const handleProgressClick = (e) => {
    const bounds = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  // Mute toggle
  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Play specific song
  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setCurrentTime(0);
    setAudioError(null);
  };

  // Auto-load and play when song changes
  useEffect(() => {
    if (songs.length > 0 && audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error('Auto-play error:', err);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentSongIndex, songs]);

  if (loading) {
    return <div className="loading">Loading music...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (songs.length === 0) {
    return <div className="error">No songs available. Please add songs to songs.json</div>;
  }

  const currentSong = songs[currentSongIndex];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Warduna Trayaksha</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      {/* Playlist */}
      <main className="playlist">
        <h2>Tracks</h2>
        {audioError && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid rgba(255, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ff4444',
            fontSize: '14px'
          }}>
            ⚠️ {audioError}
          </div>
        )}
        <div className="song-list">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={`song-item ${index === currentSongIndex ? 'active' : ''}`}
              onClick={() => playSong(index)}
            >
              <img
                src={song.albumArtFileId}
                alt={song.title}
                className="song-album-art"
                onError={(e) => {
                  console.error('Album art failed to load:', song.title, song.albumArtFileId);
                  e.target.style.display = 'none';
                }}
              />
              <div className="song-info">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist}</div>
              </div>
              <div className="song-play-count">
                <span className="icon-small">▶️</span>
                {getPlayCount(song.id)}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Audio Player */}
      <div className="player">
        <div className="player-main">
          {/* Now Playing Info */}
          <div className="player-info">
            <img
              src={currentSong.albumArtFileId}
              alt={currentSong.title}
              className="player-album-art"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="player-song-info">
              <div className="player-song-title">{currentSong.title}</div>
              <div className="player-song-artist">{currentSong.artist}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="player-controls">
            <button
              className={`control-btn ${isShuffle ? 'active' : ''}`}
              onClick={() => setIsShuffle(!isShuffle)}
              title="Shuffle"
            >
              <span className="icon">🔀</span>
            </button>
            <button className="control-btn" onClick={handlePrevious} title="Previous">
              <span className="icon">⏮️</span>
            </button>
            <button className="control-btn play-pause" onClick={togglePlayPause}>
              <span className="icon">{isPlaying ? '⏸️' : '▶️'}</span>
            </button>
            <button className="control-btn" onClick={handleNext} title="Next">
              <span className="icon">⏭️</span>
            </button>
            <button
              className={`control-btn ${isRepeat ? 'active' : ''}`}
              onClick={() => setIsRepeat(!isRepeat)}
              title="Repeat"
            >
              <span className="icon">🔁</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div
              className="progress-bar"
              ref={progressBarRef}
              onClick={handleProgressClick}
            >
              <div
                className="progress-fill"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
            <div className="progress-time">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="volume-control">
            <span className="volume-icon" onClick={toggleMute}>
              {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </span>
            <div className="volume-slider" onClick={handleVolumeChange}>
              <div
                className="volume-fill"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous">
        <source src={currentSong.audioFileId} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
