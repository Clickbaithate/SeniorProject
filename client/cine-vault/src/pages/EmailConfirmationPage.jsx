import supabase from '../config/supabaseClient';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const EmailConfirmationPage = () => {

  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const handleResend = async () => {
    const { error: e } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })
    if (e) {
      setError(e);
    } else {
      setMessage("Email Resent!");
      setTimeout(() => {
        setMessage("");
      }, 3000)
    }
  }

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
          your spam inbox if you can't find the email. If you still can't find it, we can resend it!
          Log in after confirming!
        </p>

        <button onClick={() => handleResend()} className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600">
          Resend Email
        </button>

        <a href="/signup" className="mt-4 text-black-500 hover:underline">
          &lt; Back To Signup
        </a>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {message && <p className="mt-4 text-green-500">{message}</p>}

      </div>
    </div>
  );
};

export default EmailConfirmationPage;
