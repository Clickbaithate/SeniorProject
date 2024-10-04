import { useState, useEffect } from 'react';
import supabase from './config/supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import Sidebar from './pages/Sidebar.jsx';
import ProfileSetup from './pages/profileSetup';
import EmailConfirmationPage from './pages/EmailConfirmationPage';
import LoginPage from './pages/LoginPage';
import DiscoverPage from './pages/DiscoverPage'; 
import SettingsPage from './pages/SettingsPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import MoviePage from './pages/moviePage.jsx';

function App() {

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the website loads, we check if the user is logged in or not
  useEffect(() => {

    // Getting user's session through supabase, basically a cookie but not really
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    // Listening for any change in a user's session, signed in, signed out, etc
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // While we get user's session state...
  if (loading) return <div>Loading...</div>;

  // Establishing routes
  // If a user is not logged in, redirect them accordingly
  return (
    <Router>
      <Routes> 
        <Route path="/" element={session ? <Navigate to="/homePage" /> : <LandingPage />} />

        <Route path="/signUp" element={session ? <Navigate to="/homePage" /> : <SignUpPage /> } />
        <Route path="/login" element={session ? <Navigate to="/homePage" /> : <LoginPage /> } />
        
        <Route path="/homePage" element={session ? <HomePage /> : <Navigate to="/" />} />
        <Route path="/profileSetup" element={session ? <ProfileSetup /> : <Navigate to="/" />} />
        <Route path="/emailConfirmationPage" element={session ? <HomePage/> : <EmailConfirmationPage /> } />
        <Route path="/friendsPage" element={session ? <FriendsPage /> : <Navigate to="/" />} />

        <Route path="/movie/:id" element={session ? <MoviePage /> : <Navigate to="/" />} />
        <Route path="/discover" element={session ? <DiscoverPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={session ? <SettingsPage /> : <Navigate to="/" />} />

        <Route path="*" element={session ? <Navigate to="/homePage" /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
