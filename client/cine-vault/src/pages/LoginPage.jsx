import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = 'hidden';

    // Cleanup function to re-enable scroll
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        navigate('/emailConfirmationPage');
      } else {
        navigate('/homePage');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-100">
      <nav className="bg-gray-100 p-4">
        <div className="flex container justify-start items-center mx-auto text-white">
          <div className="bg-[url('assets/logo.svg')] bg-contain w-32 h-32"></div>
          <h1 className="text-3xl font-bold text-black font-body p-5">CineVault</h1>
        </div>
      </nav>

      <div className="container mx-auto p-4 flex h-screen bg-gray-100">

        <div className="w-1/2 p-2 flex items-start justify-start py-48">
          <div className="bg-gray-100 p-4">
            <h1 className="text-3xl font-body text-start text-gray-800">Login</h1>
            <h1 className="text-start font-body text-gray-600 py-6 text-sm"> Don't have an account? <a href="/signUp" className="text-start font-body text-blue-500 py-4 text-sm"> Sign Up Here!</a></h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center">
                <label htmlFor="email" className="w-1/4 text-gray-700 font-body">Enter</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="font-body focus:outline-none placeholder-opacity-40 placeholder-gray-500 p-2 border border-gray-300 rounded-xl w-96 shadow-md shadow-black"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="password" className="w-1/4 text-gray-700 font-body">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="p-2 focus:outline-none font-body placeholder-opacity-40 placeholder-gray-500 border border-gray-300 rounded-xl w-96 shadow-md shadow-black"
                />
              </div>
              <div className="flex justify-center py-4">
                <button type="submit" className="w-1/3 bg-blue-500 text-white font-body py-2 rounded-xl hover:bg-blue-600">
                  Submit
                </button>
              </div>
            </form>
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            {message && <p className="mt-4 text-center text-green-500">{message}</p>}
          </div>
        </div>

        <div className="w-1/2 p-2 flex items-start justify-center py-20">
          <div className="bg-[url('assets/panda.svg')] bg-cover w-[560px] h-[560px]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
