import { Link } from 'react-router-dom';
import React from 'react';

const LandingPage = () => {
  return (
    <div className="font-sans antialiased">
      {/* Header with signup and login buttons */}
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CineVault</h1>
          <nav className="space-x-4">
          <Link to="/signUp" className="hover:text-gray-400">Sign Up</Link>
          <Link to="/login" className="hover:text-gray-400">Login</Link>
          </nav>
        </div>
      </header>

      {/* Temporary, but this would be like screenshots of the product */}
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to CineVault</h2>
          <p className="text-lg mb-8">Your ultimate movie tracker.</p>
          <Link to="/homePage" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600">Get Started</Link>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
