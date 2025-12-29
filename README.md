# 🎵 Warduna Trayaksha - Music Streaming Web App

A minimalist, mobile-first music streaming web application built with React. Users can listen to music without requiring any account or authentication - just visit and play.

**Live Demo:** [https://sameerkalyan.github.io/music-stream-webapp/](https://sameerkalyan.github.io/music-stream-webapp/)

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Local Setup](#local-setup)
6. [Configuration](#configuration)
7. [Adding Music](#adding-music)
8. [Deployment](#deployment)
9. [Architecture & Code Explanation](#architecture--code-explanation)
10. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### User Features
- 🎧 **No Authentication Required** - Just visit and listen
- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🎨 **Dual Theme Support** - Dark mode (default) and Light mode
- ▶️ **Full Player Controls**
  - Play/Pause
  - Previous/Next track
  - Progress bar with seek functionality
  - Volume control with mute
  - Shuffle mode
  - Repeat mode
- 📊 **Play Count Analytics** - Tracks play counts per device (localStorage)
- 🎵 **Album Art Display** - Shows album artwork for each track
- ⏱️ **Track Duration** - Real-time progress and total duration display
- 🔄 **Smooth Transitions** - Seamless track switching

### Technical Features
- ⚡ **Fast Loading** - Optimized React build
- 🌐 **CDN Audio Hosting** - Uses Cloudflare R2 for fast, reliable streaming
- 📱 **Progressive Web App Ready** - Works offline-capable
- 🎯 **CORS Configured** - Proper cross-origin resource sharing
- 🚀 **GitHub Pages Deployment** - Free, fast hosting

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Styling with CSS variables for theming
- **HTML5 Audio API** - Native audio playback

### Storage & Hosting
- **Cloudflare R2** - Audio and image file storage (S3-compatible, free tier)
- **GitHub Pages** - Static site hosting
- **LocalStorage** - Client-side play count tracking

### Development Tools
- **Create React App** - Project bootstrapping
- **npm** - Package management
- **Git & GitHub** - Version control
- **gh-pages** - Deployment automation

---

## 📁 Project Structure

```
music-stream-webapp/
├── public/
│   ├── index.html              # HTML template
│   ├── songs.json              # Music metadata (titles, URLs)
│   └── manifest.json           # PWA manifest
├── src/
│   ├── App.js                  # Main React component (all logic)
│   ├── App.css                 # Styles (themes, responsive design)
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 📦 Prerequisites

Before setting up the project, ensure you have:

1. **Node.js** (v14 or higher)
   - Download: [https://nodejs.org/](https://nodejs.org/)
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git**
   - Download: [https://git-scm.com/](https://git-scm.com/)
   - Verify: `git --version`

4. **GitHub Account**
   - Sign up: [https://github.com/](https://github.com/)

5. **Cloudflare Account** (for audio hosting)
   - Sign up: [https://cloudflare.com/](https://cloudflare.com/)

---

## 🚀 Local Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/sameerkalyan/music-stream-webapp.git
cd music-stream-webapp
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- React and React DOM
- React Scripts (build tools)
- All required dependencies

### Step 3: Run Development Server

```bash
npm start
```

The app will open at: **http://localhost:3000**

### Development Commands

```bash
npm start          # Start development server (http://localhost:3000)
npm run build      # Create production build
npm test           # Run tests (if any)
npm run deploy     # Deploy to GitHub Pages
```

---

## ⚙️ Configuration

### 1. Setting Up Cloudflare R2 (Audio Hosting)

#### Create R2 Bucket

1. Log in to **Cloudflare Dashboard**
2. Navigate to **R2** in the sidebar
3. Click **Create Bucket**
4. Name your bucket (e.g., `music-files`)
5. Click **Create Bucket**

#### Enable Public Access

1. Click on your bucket name
2. Go to **Settings** tab
3. Find **Public Development URL** section
4. Click **Enable**
5. Type "allow" to confirm
6. Copy the public URL (e.g., `https://pub-abc123.r2.dev`)

#### Configure CORS

1. In bucket **Settings** tab
2. Scroll to **CORS Policy**
3. Click **Add CORS policy**
4. Paste this JSON:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length"],
    "MaxAgeSeconds": 3600
  }
]
```

5. Click **Save**

#### Upload Files

1. Go to bucket **Objects** tab
2. Click **Upload**
3. Upload your MP3 files and album art images
4. Files are now accessible at: `https://pub-abc123.r2.dev/filename.mp3`

### 2. Configuring songs.json

Edit `public/songs.json`:

```json
[
  {
    "id": 1,
    "title": "Song Title",
    "artist": "Warduna Trayaksha",
    "audioFileId": "https://pub-YOUR-BUCKET-ID.r2.dev/song-file.mp3",
    "albumArtFileId": "https://pub-YOUR-BUCKET-ID.r2.dev/album-art.jpg"
  },
  {
    "id": 2,
    "title": "Another Song",
    "artist": "Warduna Trayaksha",
    "audioFileId": "https://pub-YOUR-BUCKET-ID.r2.dev/song2.mp3",
    "albumArtFileId": "https://pub-YOUR-BUCKET-ID.r2.dev/album-art2.jpg"
  }
]
```

**Important:**
- Each song needs a unique `id` (incrementing numbers)
- URLs must be complete Cloudflare R2 URLs
- Artist name is currently hardcoded as "Warduna Trayaksha"

### 3. Updating package.json

For deployment, ensure these fields are set:

```json
{
  "name": "music-stream-webapp",
  "version": "1.0.0",
  "homepage": "https://YOUR_USERNAME.github.io/music-stream-webapp",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 🎵 Adding Music

### Step-by-Step Process

1. **Prepare Audio Files**
   - Format: MP3, FLAC, or WAV
   - Recommended: MP3 (320kbps for quality, smaller file size)
   - Naming: Use lowercase with hyphens (e.g., `song-name.mp3`)

2. **Prepare Album Art**
   - Format: JPG or PNG
   - Recommended size: 400x400px to 1000x1000px
   - Keep file size under 500KB for fast loading

3. **Upload to Cloudflare R2**
   - Open your R2 bucket
   - Click **Upload**
   - Upload audio and image files
   - Note the filenames

4. **Update songs.json**
   - Add new entry with incremented ID
   - Use complete R2 URLs
   - Format:
   ```json
   {
     "id": 3,
     "title": "New Song Title",
     "artist": "Warduna Trayaksha",
     "audioFileId": "https://pub-YOUR-ID.r2.dev/new-song.mp3",
     "albumArtFileId": "https://pub-YOUR-ID.r2.dev/new-art.jpg"
   }
   ```

5. **Test Locally**
   ```bash
   npm start
   ```
   - Verify song loads and plays
   - Check album art displays

6. **Deploy**
   ```bash
   npm run deploy
   ```

---

## 🌐 Deployment

### Initial Deployment

#### Step 1: Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### Step 2: Update package.json

Add/verify these fields:

```json
{
  "homepage": "https://sameerkalyan.github.io/music-stream-webapp",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### Step 3: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"+"** → **"New repository"**
3. Name: `music-stream-webapp`
4. Make it **Public**
5. Don't initialize with README
6. Click **Create repository**

#### Step 4: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/music-stream-webapp.git
git branch -M main
git push -u origin main
```

#### Step 5: Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
1. Run `npm run build` (creates optimized production build)
2. Create/update `gh-pages` branch
3. Push build folder to that branch
4. GitHub Pages serves from `gh-pages` branch

#### Step 6: Enable GitHub Pages

1. Go to repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**: Should show `gh-pages` branch
4. Wait 2-3 minutes
5. Site will be live at: `https://YOUR_USERNAME.github.io/music-stream-webapp`

### Updating Deployed Site

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push origin main
npm run deploy
```

Wait 1-2 minutes for changes to go live.

---

## 🏗️ Architecture & Code Explanation

### Overview

The app is a **Single Page Application (SPA)** built with React. All logic resides in `App.js` with styling in `App.css`.

### Key Components & Logic

#### 1. State Management (React Hooks)

```javascript
const [songs, setSongs] = useState([]);              // Array of song objects
const [currentSongIndex, setCurrentSongIndex] = useState(0); // Currently playing song
const [isPlaying, setIsPlaying] = useState(false);   // Play/pause state
const [currentTime, setCurrentTime] = useState(0);   // Current playback position
const [duration, setDuration] = useState(0);         // Total song duration
const [volume, setVolume] = useState(1);             // Volume level (0-1)
const [isMuted, setIsMuted] = useState(false);       // Mute state
const [isRepeat, setIsRepeat] = useState(false);     // Repeat mode
const [isShuffle, setIsShuffle] = useState(false);   // Shuffle mode
const [theme, setTheme] = useState('dark');          // Theme (dark/light)
```

#### 2. Audio Element Reference

```javascript
const audioRef = useRef(null);  // Reference to <audio> DOM element
```

React's `useRef` creates a reference to the HTML5 audio element, allowing direct manipulation of playback.

#### 3. Loading Songs

```javascript
useEffect(() => {
  fetch(`${process.env.PUBLIC_URL}/songs.json`)
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
```

**How it works:**
- `useEffect` runs once on component mount (empty dependency array `[]`)
- `process.env.PUBLIC_URL` provides correct path for GitHub Pages
- Fetches `songs.json` from public folder
- Parses JSON and stores in state
- Handles errors gracefully

#### 4. Audio Event Listeners

```javascript
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const updateTime = () => setCurrentTime(audio.currentTime);
  const updateDuration = () => setDuration(audio.duration);
  const handleEnded = () => handleNext();
  const handleError = (e) => { /* error handling */ };
  const handleCanPlay = () => { /* success handling */ };

  audio.addEventListener('timeupdate', updateTime);
  audio.addEventListener('loadedmetadata', updateDuration);
  audio.addEventListener('ended', handleEnded);
  audio.addEventListener('error', handleError);
  audio.addEventListener('canplay', handleCanPlay);

  return () => {
    // Cleanup: remove event listeners
    audio.removeEventListener('timeupdate', updateTime);
    // ... other removals
  };
}, [currentSongIndex, songs]);
```

**Event Types:**
- `timeupdate` - Fires continuously during playback (updates progress bar)
- `loadedmetadata` - Fires when audio metadata loads (gets duration)
- `ended` - Fires when song finishes (triggers next song)
- `error` - Fires on playback errors (CORS, 404, etc.)
- `canplay` - Fires when audio is ready to play

#### 5. Play/Pause Logic

```javascript
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
```

**How it works:**
- `audio.play()` returns a Promise (modern browsers)
- Handles promise resolution/rejection
- Increments play count on first play
- Catches autoplay policy errors

#### 6. Next/Previous Song Logic

```javascript
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
```

**Logic:**
- Repeat mode: Restart current song
- Shuffle mode: Random index
- Normal mode: Sequential with wraparound (modulo operator)

#### 7. Progress Bar Seek

```javascript
const handleProgressClick = (e) => {
  const bounds = progressBarRef.current.getBoundingClientRect();
  const percent = (e.clientX - bounds.left) / bounds.width;
  const newTime = percent * duration;
  audioRef.current.currentTime = newTime;
  setCurrentTime(newTime);
};
```

**How it works:**
- Gets click position relative to progress bar
- Calculates percentage of bar clicked
- Converts to time position
- Updates audio playback position

#### 8. Volume Control

```javascript
const handleVolumeChange = (e) => {
  const bounds = e.currentTarget.getBoundingClientRect();
  const percent = (e.clientX - bounds.left) / bounds.width;
  const newVolume = Math.max(0, Math.min(1, percent));
  setVolume(newVolume);
  audioRef.current.volume = newVolume;
  setIsMuted(newVolume === 0);
};
```

**How it works:**
- Click position on volume slider → percentage
- Clamped between 0 and 1
- Updates both UI state and audio element volume

#### 9. Theme System

```javascript
const toggleTheme = () => {
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
};
```

**CSS Variables (App.css):**
```css
:root {
  --bg-primary: #000000;
  --text-primary: #ffffff;
  /* ... */
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  /* ... */
}
```

**How it works:**
- Theme stored in localStorage (persists across sessions)
- `data-theme` attribute on HTML element
- CSS variables switch based on attribute
- All colors reference CSS variables

#### 10. Play Count Analytics

```javascript
const getPlayCount = (songId) => {
  const counts = JSON.parse(localStorage.getItem('playCounts') || '{}');
  return counts[songId] || 0;
};

const incrementPlayCount = (songId) => {
  const counts = JSON.parse(localStorage.getItem('playCounts') || '{}');
  counts[songId] = (counts[songId] || 0) + 1;
  localStorage.setItem('playCounts', JSON.stringify(counts));
};
```

**Storage Format:**
```json
{
  "1": 5,
  "2": 12,
  "3": 3
}
```

**Note:** Play counts are per-device (localStorage is browser-specific)

#### 11. Auto-play on Song Change

```javascript
useEffect(() => {
  if (songs.length > 0 && audioRef.current) {
    audioRef.current.load();  // Load new audio source
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
```

**How it works:**
- Triggers when `currentSongIndex` or `songs` changes
- Loads new audio file
- If already playing, starts new song automatically
- Handles autoplay policy errors

### CSS Architecture

#### Responsive Design

```css
@media (max-width: 768px) {
  .header h1 {
    font-size: 20px;
  }
  .song-album-art {
    width: 48px;
    height: 48px;
  }
  /* Mobile-specific styles */
}
```

**Breakpoints:**
- Desktop: > 768px
- Mobile: ≤ 768px

#### CSS Custom Properties (Variables)

**Benefits:**
- Centralized theme management
- Easy theme switching
- Consistent colors across app

**Usage:**
```css
.header {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

#### Flexbox Layout

```css
.player {
  display: flex;
  flex-direction: column;
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
}
```

**Why Flexbox:**
- Easy centering
- Responsive without media queries
- Flexible spacing

---

## 🐛 Troubleshooting

### Issue: Songs not loading

**Symptoms:** "Failed to load songs" error

**Solutions:**
1. Check `songs.json` is in `public/` folder
2. Verify JSON syntax (use jsonlint.com)
3. Ensure `fetch` uses `${process.env.PUBLIC_URL}/songs.json`
4. Check browser console for fetch errors

### Issue: Audio not playing

**Symptoms:** "Audio loaded successfully" but no sound

**Solutions:**
1. Check system/browser volume
2. Check volume slider in app isn't at 0
3. Try clicking play button twice
4. Check browser console for autoplay policy errors
5. Verify R2 CORS is configured correctly
6. Test R2 URL directly in browser

### Issue: Album art not showing

**Symptoms:** Broken image icons

**Solutions:**
1. Verify image URLs in `songs.json` are correct
2. Test image URLs directly in browser
3. Check R2 bucket public access is enabled
4. Verify image file formats (JPG, PNG, WEBP)
5. Check browser console for 404 errors

### Issue: CORS errors

**Symptoms:** "blocked by CORS policy" in console

**Solutions:**
1. Add CORS policy to R2 bucket (see Configuration section)
2. Verify `AllowedOrigins` includes your domain
3. Wait 30 seconds after updating CORS
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: 404 on GitHub Pages

**Symptoms:** Site shows 404 or blank page

**Solutions:**
1. Check Settings → Pages is set to `gh-pages` branch
2. Wait 2-5 minutes after first deploy
3. Verify `homepage` in `package.json` matches GitHub URL
4. Check `gh-pages` branch exists in repository
5. Redeploy: `npm run deploy`

### Issue: Build warnings (React Hooks)

**Symptoms:**
```
React Hook useEffect has a missing dependency
```

**Solution:**
These are warnings, not errors. App works fine. To fix:
- Add missing dependencies to useEffect array, OR
- Add `// eslint-disable-next-line` above the line

### Issue: Large file sizes

**Symptoms:** Slow loading on mobile

**Solutions:**
1. Compress MP3 files to 192kbps or 256kbps
2. Optimize images (use tinypng.com)
3. Convert WAV/FLAC to MP3
4. Keep album art under 500KB

---

## 📊 Performance Optimization

### Current Optimizations

1. **React Production Build**
   - Minified JavaScript
   - Dead code elimination
   - Optimized bundle size

2. **Audio Preloading**
   ```html
   <audio preload="metadata">
   ```
   - Loads metadata only, not full audio
   - Faster initial load

3. **Image Lazy Loading**
   - Browser-native lazy loading
   - Only loads visible images

4. **CDN Audio Hosting**
   - Cloudflare R2 global network
   - Fast delivery worldwide

### Future Improvements

1. **Service Worker**
   - Enable PWA functionality
   - Offline playback
   - Install to home screen

2. **Audio Caching**
   - Cache played songs
   - Reduce bandwidth usage

3. **Image Optimization**
   - WebP format with JPEG fallback
   - Responsive images (srcset)

---

## 🔐 Security Considerations

### Current Security

1. **No Backend** - No server-side vulnerabilities
2. **Static Hosting** - GitHub Pages is secure
3. **CORS Configured** - Prevents unauthorized embedding
4. **No User Data** - LocalStorage only for play counts

### Recommendations

1. **Rate Limiting** - Consider if bandwidth becomes an issue
2. **Content Protection** - R2 files are publicly accessible
3. **Analytics Privacy** - Consider GDPR if tracking users

---

## 📈 Scaling Considerations

### Current Limits

**Cloudflare R2 Free Tier:**
- 10 GB storage
- 10 million Class A operations/month
- Unlimited egress (bandwidth)

**GitHub Pages:**
- 1 GB repository size
- 100 GB bandwidth/month
- 10 builds per hour

### Scaling Strategies

**For more songs (>100):**
1. Organize R2 into folders
2. Implement pagination or filtering
3. Consider database for song metadata

**For high traffic:**
1. Upgrade Cloudflare R2 (paid tier)
2. Add analytics to monitor usage
3. Implement caching strategies

**For multiple artists:**
1. Add artist filtering
2. Organize by albums
3. Add search functionality

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

**To suggest improvements:**
1. Open an issue on GitHub
2. Describe the enhancement
3. Provide examples if possible

---

## 📜 License

This project is open source and available for personal use.

---

## 👨‍💻 Developer

**Sameer Kalyan**
- GitHub: [@sameerkalyan](https://github.com/sameerkalyan)
- Project: [music-stream-webapp](https://github.com/sameerkalyan/music-stream-webapp)

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Cloudflare** - For free R2 hosting
- **GitHub** - For free Pages hosting
- **Apple Music & Tidal** - Design inspiration

---

## 📝 Version History

### v1.0.0 (December 29, 2025)
- Initial release
- Basic music playback
- Dark/Light theme
- Mobile-responsive design
- Cloudflare R2 integration
- GitHub Pages deployment

---

## 🔮 Future Roadmap

- [ ] Playlist creation
- [ ] Search functionality
- [ ] Keyboard shortcuts
- [ ] Equalizer visualization
- [ ] Share song links
- [ ] PWA installation
- [ ] Offline playback
- [ ] Multiple artists support
- [ ] Album organization
- [ ] Backend analytics (optional)

---

**Built with ❤️ for music lovers**
