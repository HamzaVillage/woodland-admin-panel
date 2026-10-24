# 🌲 Woodland Admin Studio — React Web Application

A fully functional, ultra-modern Web Admin Panel built with **React**, **Vite**, **Firebase Firestore**, and **Cloudinary** that mirrors and expands upon the Woodland mobile application admin capabilities.

---

## 🚀 Key Features

### 1. 📊 Executive Dashboard
- **Live Real-time Metrics**: Total Users, Total Books, Published vs. Draft Items, E-books count, Audiobooks count, Collections, and Active Sessions.
- **Engagement & User Growth Analytics**: Interactive 7-day, 30-day, and all-time growth visualizer.
- **Live Activity Feed**: Real-time stream of recent changes in books and user accounts.
- **Quick Action Triggers**: One-click modal launchers for books, folders, media, and games.

### 2. 📚 Books & Collections Management
- **Format Support**:
  - **E-Books**: Digital reading text content, PDF file upload via Cloudinary, reading time calculation, pricing, and language.
  - **Audiobooks**: Multi-chapter audio playlist builder, stream URLs, listen time, and cover art.
- **Collections & Series (Folders)**: Create and edit folder collections with multi-book selection.
- **Drag-and-Drop Reordering**: Interactive drag-and-drop handles and up/down position buttons with live Firestore sort order synchronization.
- **Search & Filters**: Instant keyword search, Category taxonomy dropdown, and quick filter pills (*All, Published, Draft, E-Books, Audiobooks, Folders*).
- **Inspection & Playback Modal**: In-browser audiobook preview player and PDF document viewer.

### 3. 👥 User Directory
- Direct real-time connection to the `users` Firestore collection.
- Search users by name, email, or phone number.
- Filter by Admins vs. Standard Users.
- Instant role promotion and demotion (*User ↔ Admin*).
- Detailed profile inspector and user deletion with confirmation safeguards.

### 4. 🎬 Media Modules
- **YouTube Videos (`youtube_videos`)**: Add videos by YouTube ID or link, automatic thumbnail generator, in-browser embedded iframe video player.
- **MP3 Audios (`mp3`)**: Direct audio stream library, Cloudinary MP3 upload, in-browser audio player with play/pause.

### 5. 📝 Blogs, 🎮 Games & ❓ Quizzes
- **Blogs & Articles (`blogs`)**: Rich article authoring with Cloudinary banner upload.
- **Games Studio (`games`)**: Unity / HTML5 WebGL game registry with playable in-modal iframe player.
- **Interactive Quizzes (`quizzes`)**: Dynamic multi-choice quiz builder with questions, 4 options, and correct answer selector.

---

## 🔐 Authentication

- **Firebase Authentication**: Direct integration with Firebase Authentication (`glennverse-3cf94`).
- Administrators sign in with their registered Firebase email and password. Session states are preserved automatically with Firestore role validation.

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Vanilla Modern CSS Tokens, Glassmorphism, Dark Mode Palette (`#12181d`, `#1c262e`, `#67FFBB` mint green, `#891FFF` purple)
- **Database & Auth**: Firebase Firestore & Firebase Auth (`glennverse-3cf94`)
- **Media Uploads**: Cloudinary Direct Upload (`dn9cspqmi` / `ml_default`)
- **Icons**: Lucide React

---

## 💻 Running Locally

```bash
# Navigate to web admin directory
cd woodland-web-admin

# Install dependencies (already installed)
npm install

# Start local Vite development server
npm run dev

# Build production bundle
npm run build
```

---

## 🌐 Deployed Services
- **Dev Server**: `http://localhost:5173/`
