import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Home from './components/home';
import HomePage from './pages/home';
import Library from './pages/library';
import Playlists from './pages/playlist';
import { MusicProvider } from './context/musiccontext';
import AddToPlaylistModal from './components/addtoplaylistmodel';

const App = () => {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <MusicProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {isAuthenticated ? (
              <Route path="/home" element={<Home />}>
                <Route index element={<HomePage />} />
                <Route path="library" element={<Library />} />
                <Route path="playlists" element={<Playlists />} />
              </Route>
            ) : (
              <Route path="/home/*" element={<Navigate to="/login" />} />
            )}
          </Routes>

          <AddToPlaylistModal />
        </div>
      </Router>
    </MusicProvider>
  );
};

export default App;

