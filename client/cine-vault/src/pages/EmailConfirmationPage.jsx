import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const EmailConfirmationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(`Error: ${error.message}`);
        return;
      }

      if (data.session?.user?.email_confirmed_at) {
        setMessage('Success!');
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
    <div className="min-h-screen relative flex flex-col items-center bg-gray-100 font-body">
      
      <div className="absolute inset-0 z-0">
        <div className="bg-blue-500 h-1/2 w-full"></div>
        <div className="bg-gray-100 h-1/2 w-full"></div>
      </div>

      <header className="absolute top-0 left-24 z-10 p-5">
        <div className="flex items-center space-x-6">
          <div className="bg-[url('assets/logo.svg')] bg-contain w-32 h-32"></div>
          <h1 className="text-3xl font-bold text-black">CineVault</h1>
        </div>
      </header>

      <div className="relative z-10 w-auto bg-gray-100 p-8 rounded-lg shadow-lg flex flex-col items-center max-w-2xl mx-auto mt-72 shadow-black border-2 border-black">

        <div className="rounded-full">
          <div className="bg-[url('assets/email.svg')] bg-contain w-24 h-24"></div>
        </div>

        <h1 className="text-2xl mt-4">Verify your email address</h1>
        <p className="text-center text-gray-600 mt-2 py-6">
          We've sent you an email that contains a link to complete your registration. Please check
          your spam inbox if you can't find the mail. If you still can't find it, we can resend it.
        </p>

        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600">
          Resend Email
        </button>

        <a href="/login" className="mt-4 text-black-500 hover:underline">
          &lt; Back To Login
        </a>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
