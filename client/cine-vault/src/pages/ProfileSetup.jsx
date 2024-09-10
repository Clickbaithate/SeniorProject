import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProfileSetup = () => {

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Check if user is logged in and get their data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn(sessionError);
        setLoading(false);
        return;
      }

      // Getting user data
      if (session) {
        const { data, error } = await supabase
          .from('Users')
          .select('username, bio, profile_picture')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.warn('Error fetching profile:', error);
        } else if (data) {
          setUsername(data.username);
          setBio(data.bio);
          setProfilePicture(data.profile_picture);
        }
      } else {
        // Redirect to root page is user is not logged in
        // Again, this shouldnt be technically possible but just in case
        navigate('/');
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  // Updating users profile info
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    setLoading(true);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.warn('Session error:', sessionError);
      setLoading(false);
      return;
    }

    // updating profile info
    try {
      const { error } = await supabase
        .from('Users')
        .upsert({
          user_id: session.user.id,
          email: session.user.email,
          username,
          bio,
          profile_picture: profilePicture,
        });

      if (error) throw error;

      setMessage('Profile updated successfully!');
      navigate('/homePage');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }

    setLoading(false);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Profile Setup</h1>
      <form onSubmit={handleProfileUpdate}>
        {/* Username textbox */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>
        {/* Bio textbox */}
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>
        {/* PFP textbox */}
        <div className="mb-4">
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
          <input
            id="profilePicture"
            type="url"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>
        {/* Save Profile Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Save Profile'}
          </button>
        </div>
        {/* Signout Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
        {message && <p className="text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default ProfileSetup;
