import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import { io } from 'socket.io-client';
import './theme.css';

const socket = io("https://senior-project-vt8z.onrender.com/");

const FriendsPage = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const processedMessageIds = new Set();

  const fetchFriendsList = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('Friends')
        .select('friend_id, user_id')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (error) throw error;

      const friendIds = data.map((row) => (row.friend_id === userId ? row.user_id : row.friend_id));
      const { data: friends, error: friendError } = await supabase
        .from('Users')
        .select('user_id, username, profile_picture')
        .in('user_id', friendIds);

      if (friendError) throw friendError;
      return friends || [];
    } catch (err) {
      console.error('Error fetching friends list:', err.message);
      return [];
    }
  };


  const fetchChatHistory = async (friendId) => {
    setLoading(true);
    try {
      const { data: senderMessages, error: senderError } = await supabase
        .from("Messages")
        .select("*")
        .eq("sender_id", user.user_id)
        .eq("receiver_id", friendId)
        .order("timestamp", { ascending: false })
        .limit(10);
  
      if (senderError) throw senderError;
  
      const { data: receiverMessages, error: receiverError } = await supabase
        .from("Messages")
        .select("*")
        .eq("sender_id", friendId)
        .eq("receiver_id", user.user_id)
        .order("timestamp", { ascending: false })
        .limit(10);
  
      if (receiverError) throw receiverError;
      const combinedMessages = [...(senderMessages || []), ...(receiverMessages || [])].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
  
      setMessages(combinedMessages);
    } catch (err) {
      console.error("Error fetching chat history:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn(sessionError);
        return;
      }

      if (session) {
        const { data, error } = await supabase
          .from('Users')
          .select()
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.warn('Error fetching profile:', error);
        } else if (data) {
          setUser(data);
          const friendsList = await fetchFriendsList(data.user_id);
          setFriends(friendsList);
        }
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      if (!processedMessageIds.has(message.id)) {
        processedMessageIds.add(message.id);

        if (
          (message.sender_id === user.user_id && message.receiver_id === activeChat) ||
          (message.sender_id === activeChat && message.receiver_id === user.user_id)
        ) {
          setMessages((prevMessages) => {
            return prevMessages.filter((msg) => msg.id !== message.id).concat(message);
          });
        }
      }
    });

    return () => socket.off("receiveMessage");
  }, [activeChat, user]);


  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const tempId = Date.now();
    const message = {
      id: tempId,
      sender_id: user.user_id,
      receiver_id: activeChat,
      message_body: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, { ...message, isOutgoing: true }]);

    socket.emit("sendMessage", message);

    setNewMessage("");
  };

  const handleFriendClick = (friendId) => {
    setActiveChat(friendId);
    fetchChatHistory(friendId);
  };

  return (
    <div className={`max-h-screen flex bg-theme `}>
      {/* Sidebar */}
      <Sidebar />
      <div className={`w-1/4 ml-[100px] accent `}>
        {/* Sidebar Header */}
        <header className={`p-4 flex items-center `}>
          <input
            type="text"
            placeholder="Search friends..."
            className={`w-full p-2 rounded-md border-opacity-50 border-2 bg-theme text-theme border-black shadow-xl focus:outline-none `}
          />
        </header>

        {/* Contact List */}
        <div
          className={`overflow-y-auto h-[calc(100vh-75px)]`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {friends.map((friend) => (
            <div
              className={`flex items-center mb-4 cursor-pointer p-2 rounded-md`}
              key={friend.user_id}
              onClick={() => handleFriendClick(friend.user_id)}
            >
              <div className="w-12 h-12 rounded-full mr-3">
                <img
                  src={
                    friend.profile_picture ||
                    `https://placehold.co/200x/ffa8e4/ffffff.svg?text=${friend.username[0]}`
                  }
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={`text-lg font-semibold text-theme `}>{friend.username}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col ">
        {/* Chat Header */}
        <header className={`accent p-4 flex items-center`}>
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img
              src={friends.find((friend) => friend.user_id === activeChat)?.profile_picture || ''}
              alt="Friend's Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className={`text-2xl font-semibold`}>
            {friends.find((friend) => friend.user_id === activeChat)?.username || 'Select a friend'}
          </h1>
        </header>

        {/* Chat Messages */}
        <div
          className="h-screen overflow-y-auto p-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-4 cursor-pointer ${
                  msg.sender_id === user.user_id ? 'justify-end' : ''
                }`}
              >
                {msg.sender_id !== user.user_id && (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                    <img
                      src={
                        friends.find((friend) => friend.user_id === msg.sender_id)?.profile_picture ||
                        ''
                      }
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}
                <div
                  className={`accent p-2 rounded-lg max-w-96 ${
                    msg.sender_id === user.user_id ? 'bg-[rgb(0,120,254)] text-white' : 'bg-gray-200'
                  }`}
                >
                  {msg.message_body}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Input */}
        <footer className={`accent p-4`}>
          <div className="flex items-center ">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={`shadow-[rgba(0,0,15,0.5)_5px_5px_4px_0px] text-theme accent w-full p-2 rounded-md border-2 border-opacity-25 border-black focus:outline-none `}
            />
            <button
              onClick={sendMessage}
              className={`px-4 py-2 rounded-md ml-2 bg-theme transform hover:scale-105 `}
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FriendsPage;
