import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignUpPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Signing up a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setMessage('Sign-up successful! Please check your email for confirmation.');
      navigate('/emailConfirmationPage');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
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
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        
        <p className="mt-4 text-center text-blue-500 hover:underline">
          <a href="/login">Already have an account? Log in here.</a>
        </p>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default SignUpPage;
