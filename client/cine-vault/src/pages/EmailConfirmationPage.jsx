import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const EmailConfirmationPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // If user has confirmed their email then they log in, user should be taken to customize their profile
  // This might change so user doesnt have to input their email and password again
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(`Error: ${error.message}`);
        return;
      }

      if (data.session?.user?.email_confirmed_at) {
        setMessage("Success!");
        setTimeout(() => {
          navigate('/profileSetup'); 
        }, 1000);
      } else {
        setError('Email not confirmed yet. Please check your email for the confirmation link.');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

      <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
      <p className="text-md">Almost there! We've sent a confirmation email. </p> 
      <p className="text-md mb-4">Once you've confirmed your email, please log in to get started.</p>

      <form onSubmit={handleLogin} className="space-y-4">
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
  );
};

export default EmailConfirmationPage;
