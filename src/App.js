import React, { useState, useEffect, useRef } from "react";
import "./App.css";

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
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // NEW: Loading animation state

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Load songs from JSON with image preloading
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/songs.json`)
      .then((response) => response.json())
      .then((data) => {
        setSongs(data);
        setLoading(false);

        // Preload album art images
        const imagePromises = data.map((song) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = song.albumArtFileId;
          });
        });

        // Wait for images, then show vinyl for 5 seconds
        Promise.all(imagePromises).then(() => {
          setTimeout(() => {
            setIsInitialLoading(false); // This will trigger CSS fade-out
          }, 3000); // 5 seconds
        });
      })
      .catch((err) => {
        setError("Failed to load songs");
        setLoading(false);
        setIsInitialLoading(false);
      });
  }, []);

  const getPlayCount = (songId) => {
    const counts = JSON.parse(localStorage.getItem("playCounts") || "{}");
    return counts[songId] || 0;
  };

  const incrementPlayCount = (songId) => {
    const counts = JSON.parse(localStorage.getItem("playCounts") || "{}");
    counts[songId] = (counts[songId] || 0) + 1;
    localStorage.setItem("playCounts", JSON.stringify(counts));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();
    const handleError = (e) => {
      console.error("Audio error:", e);
      setAudioError(
        "Unable to play audio. Make sure your files are accessible."
      );
      setIsPlaying(false);
    };
    const handleCanPlay = () => {
      setAudioError(null);
      console.log("Audio loaded successfully");
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentSongIndex, isRepeat, isShuffle, songs]);

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
          .catch((err) => {
            console.error("Playback failed:", err);
            setAudioError("Playback failed. Try clicking play again.");
            setIsPlaying(false);
          });
      }
    }
  };

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

  const handlePrevious = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      const prevIndex =
        currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const handleProgressClick = (e) => {
    const bounds = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setCurrentTime(0);
    setAudioError(null);
  };

  useEffect(() => {
    if (songs.length > 0 && audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error("Auto-play error:", err);
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
    return (
      <div className="error">
        No songs available. Please add songs to songs.json
      </div>
    );
  }

  const currentSong = songs[currentSongIndex];

  return (
    <div className="app">
      {/* Vinyl Loading Screen */}
      {isInitialLoading && (
        <div className="loading-screen">
          <div style={{ position: "relative" }}>
            <div className="vinyl-disc">
              <div className="vinyl-grooves"></div>
            </div>
            <div className="tonearm"></div>
          </div>
          <div className="loading-text">Loading Music</div>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <h1>tryza mixes</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* Playlist */}
      <main className="playlist">
        <h2>Tracks</h2>
        {audioError && (
          <div
            style={{
              padding: "12px",
              marginBottom: "16px",
              backgroundColor: "rgba(255, 68, 68, 0.1)",
              border: "1px solid rgba(255, 68, 68, 0.3)",
              borderRadius: "8px",
              color: "#ff4444",
              fontSize: "14px",
            }}
          >
            ⚠️ {audioError}
          </div>
        )}
        <div className="song-list">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={`song-item ${
                index === currentSongIndex ? "active" : ""
              }`}
              onClick={() => playSong(index)}
            >
              <img
                src={song.albumArtFileId}
                alt={song.title}
                className="song-album-art"
                onError={(e) => {
                  console.error("Album art failed to load:", song.title);
                  e.target.style.display = "none";
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

      {/* Mini Player (Bottom Bar) */}
      <div className="player" onClick={() => setIsExpanded(true)}>
        <div className="player-main">
          <div className="player-info">
            <img
              src={currentSong.albumArtFileId}
              alt={currentSong.title}
              className="player-album-art"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="player-song-info">
              <div className="player-song-title">{currentSong.title}</div>
              <div className="player-song-artist">{currentSong.artist}</div>
            </div>
          </div>

          <div className="player-controls">
            <button
              className={`control-btn ${isShuffle ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsShuffle(!isShuffle);
              }}
              title="Shuffle"
            >
              <span className="icon">🔀</span>
            </button>
            <button
              className="control-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              title="Previous"
            >
              <span className="icon">⏮️</span>
            </button>
            <button
              className="control-btn play-pause"
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
            >
              <span className="icon">{isPlaying ? "⏸️" : "▶️"}</span>
            </button>
            <button
              className="control-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              title="Next"
            >
              <span className="icon">⏭️</span>
            </button>
            <button
              className={`control-btn ${isRepeat ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsRepeat(!isRepeat);
              }}
              title="Repeat"
            >
              <span className="icon">🔁</span>
            </button>
          </div>

          <div className="progress-container">
            <div
              className="progress-bar"
              ref={progressBarRef}
              onClick={(e) => {
                e.stopPropagation();
                handleProgressClick(e);
              }}
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

          <div className="volume-control">
            <span
              className="volume-icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
            >
              {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
            </span>
            <div
              className="volume-slider"
              onClick={(e) => {
                e.stopPropagation();
                handleVolumeChange(e);
              }}
            >
              <div
                className="volume-fill"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Full-Screen Player */}
      {isExpanded && (
        <div className={`expanded-player ${isExpanded ? "visible" : ""}`}>
          <div className="expanded-header">
            <button className="close-btn" onClick={() => setIsExpanded(false)}>
              <span className="icon">▼</span>
            </button>
            <div className="expanded-title">Now Playing</div>
            <div className="expanded-placeholder"></div>
          </div>

          <div className="expanded-content">
            <div className="expanded-album-art-container">
              <img
                src={currentSong.albumArtFileId}
                alt={currentSong.title}
                className="expanded-album-art"
                onError={(e) => {
                  e.target.style.backgroundColor = "var(--bg-tertiary)";
                }}
              />
            </div>

            <div className="expanded-song-info">
              <div className="expanded-song-title">{currentSong.title}</div>
              <div className="expanded-song-artist">{currentSong.artist}</div>
            </div>

            <div className="expanded-progress-container">
              <div
                className="expanded-progress-bar"
                onClick={handleProgressClick}
                ref={progressBarRef}
              >
                <div
                  className="expanded-progress-fill"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                />
                <div
                  className="expanded-progress-thumb"
                  style={{ left: `${(currentTime / duration) * 100 || 0}%` }}
                />
              </div>
              <div className="expanded-progress-time">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="expanded-controls">
              <button
                className={`expanded-control-btn ${isShuffle ? "active" : ""}`}
                onClick={() => setIsShuffle(!isShuffle)}
              >
                <span className="icon">🔀</span>
              </button>
              <button className="expanded-control-btn" onClick={handlePrevious}>
                <span className="icon-large">⏮️</span>
              </button>
              <button
                className="expanded-control-btn-play"
                onClick={togglePlayPause}
              >
                <span className="icon-xlarge">{isPlaying ? "⏸️" : "▶️"}</span>
              </button>
              <button className="expanded-control-btn" onClick={handleNext}>
                <span className="icon-large">⏭️</span>
              </button>
              <button
                className={`expanded-control-btn ${isRepeat ? "active" : ""}`}
                onClick={() => setIsRepeat(!isRepeat)}
              >
                <span className="icon">🔁</span>
              </button>
            </div>

            <div className="expanded-volume-control">
              <span className="volume-icon" onClick={toggleMute}>
                {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
              </span>
              <div
                className="expanded-volume-slider"
                onClick={handleVolumeChange}
              >
                <div
                  className="expanded-volume-fill"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
              <span className="volume-percentage">
                {Math.round(isMuted ? 0 : volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} preload="metadata">
        <source src={currentSong.audioFileId} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
