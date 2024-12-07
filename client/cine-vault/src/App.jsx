import { useState, useEffect, useReducer } from 'react';
import supabase from './config/supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';
import LoginPage from './pages/LoginPage';
import DiscoverPage from './pages/DiscoverPage';
import SettingsPage from './pages/SettingsPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import ChallengesPage from './pages/ChallengesPage.jsx';
import PlaylistsPage from './pages/PlaylistsPage.jsx';
import MovieCategories from './pages/GenrePage.jsx';
import MoviePage from './pages/moviePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import WatchedPage from './pages/WatchedPage.jsx';
import Challenge from './pages/Challenge.jsx';
import Playlist from './pages/Playlist.jsx';
import ShowPage from './pages/ShowPage.jsx';
import UserProfile from './pages/UserProfile.jsx';
import GenrePage from './pages/GenrePage.jsx';

function App() {
  const [session, setSession] = useState(null);
  const [id, setId] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error(error);

        if (session) {
          setId(session.user.id);
          setSession(session);

          const { data, error: userError } = await supabase
            .from("Users")
            .select()
            .eq("user_id", session.user.id);

          if (userError) console.error(userError);
          else setUserExists(data && data.length > 0);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setIsAppReady(true);
      }
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (!isAppReady) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={session ? <Navigate to="/homePage" /> : <LandingPage />} />
        <Route path="/signUp" element={session ? <Navigate to="/homePage" /> : <SignUpPage />} />
        <Route path="/login" element={session ? <Navigate to="/homePage" /> : <LoginPage />} />
        <Route path="/emailConfirmationPage" element={session ? <HomePage /> : <EmailConfirmationPage />} />

        {/* Authenticated Routes */}
        <Route path="/homePage" element={session ? (userExists ? <HomePage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/friends" element={session ? (userExists ? <FriendsPage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/searchPage/:query" element={session ? (userExists ? <SearchPage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/movie/:id" element={session ? (userExists ? <MoviePage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/show/:id" element={session ? (userExists ? <ShowPage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/user/:id" element={session ? (userExists ? <UserProfile /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/playlist/:id" element={session ? (userExists ? <Playlist /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/discover" element={session ? (userExists ? <DiscoverPage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/settings" element={session ? <SettingsPage /> : <Navigate to="/" />} />
        <Route path="/genre/:genre" element={session ? (userExists ? <GenrePage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/challenges" element={session ? (userExists ? <ChallengesPage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/challenges/:id" element={session ? (userExists ? <Challenge /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/playlists" element={session ? (userExists ? <PlaylistsPage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />
        <Route path="/watched" element={session ? (userExists ? <WatchedPage /> : <Navigate to="/settings" />) : <Navigate to="/" />} />

        {/* Redirect if route doesn't exist */}
        <Route path="*" element={session ? <Navigate to="/homePage" /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
