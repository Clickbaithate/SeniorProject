import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Try to login a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        // Email not confirmed, redirect to confirmation page
        // Unauthenticated user shouldnt technically be here but just in case
        navigate('/emailConfirmationPage');
      } else {
        // Email confirmed, redirect to home page
        navigate('/homePage');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email textbox */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 mb-1">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          {/* Password textbox */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 mb-1">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        
        <p className="mt-4 text-center text-blue-500 hover:underline">
          <a href="/signup">Don't have an account? Sign up here.</a>
        </p>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
