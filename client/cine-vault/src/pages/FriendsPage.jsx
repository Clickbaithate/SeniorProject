import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';

const FriendsPage = () => {

  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [isToggled, setIsToggled] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // fetching user data
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
          console.log(data.profile_picture);
          setIsToggled(data.theme_settings);
          setTheme(data.theme_settings ? 'dark' : 'light');
        }
      }
    };

    fetchProfile();
  }, []);

  // so sidebar theme matches since it uses plain css
  useEffect(() => {
    const theme = isToggled ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); 
  }, [isToggled]);

  // mock data
  const messages = [
    { id: 1, sender: 'Alice', text: "Hey Bob, how's it going?", isOutgoing: false },
    { id: 2, sender: 'Bob', text: "I'm doing great! Thanks for asking.", isOutgoing: true },
    { id: 3, sender: 'Alice', text: "Have you seen the latest episode of our favorite show?", isOutgoing: false },
    { id: 4, sender: 'Bob', text: "Yes, it was amazing! I can't believe that happened!", isOutgoing: true },
    { id: 5, sender: 'Alice', text: "I know, right? I was on the edge of my seat!", isOutgoing: false },
    { id: 6, sender: 'Bob', text: "Same here! Do you want to watch it together next time?", isOutgoing: true },
    { id: 7, sender: 'Alice', text: "Absolutely! That sounds like a plan.", isOutgoing: false },
    { id: 8, sender: 'Bob', text: "Awesome! What day works for you?", isOutgoing: true },
    { id: 9, sender: 'Alice', text: "How about Saturday?", isOutgoing: false },
    { id: 10, sender: 'Bob', text: "Saturday works! Looking forward to it.", isOutgoing: true },
    { id: 11, sender: 'Alice', text: "Great! Do you want to order pizza?", isOutgoing: false },
    { id: 12, sender: 'Bob', text: "Yes, pizza sounds perfect!", isOutgoing: true },
    { id: 13, sender: 'Alice', text: "I’ll get the toppings sorted out.", isOutgoing: false },
    { id: 14, sender: 'Bob', text: "Awesome, I trust your judgment!", isOutgoing: true },
    { id: 15, sender: 'Alice', text: "Thanks! I'll make sure to pick the best ones.", isOutgoing: false },
    { id: 16, sender: 'Bob', text: "Looking forward to it! It's going to be fun.", isOutgoing: true },
    { id: 17, sender: 'Alice', text: "Definitely! Can't wait to hang out.", isOutgoing: false },
    { id: 18, sender: 'Bob', text: "Same here! See you on Saturday.", isOutgoing: true },
    { id: 19, sender: 'Alice', text: "See you!", isOutgoing: false },
    { id: 20, sender: 'Bob', text: "Bye!", isOutgoing: true },
  ];

  const contacts = [
    { id: 1, sender: 'Alice', text: "Oh ay moe", pfp: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/69d79c77-7a14-4d6e-a6e4-6aadb16f4fdb/dg0fvry-5596c210-24b6-44b7-b55d-5a1c6215e54c.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY5ZDc5Yzc3LTdhMTQtNGQ2ZS1hNmU0LTZhYWRiMTZmNGZkYlwvZGcwZnZyeS01NTk2YzIxMC0yNGI2LTQ0YjctYjU1ZC01YTFjNjIxNWU1NGMuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.3zDLUnQEcBcrq-uHAd60LkqBHlA5feyeIMTkPDsJdSM' },
    { id: 2, sender: 'Charlie', text: "I'm good, just busy with work. How about you?", pfp: 'https://avatarfiles.alphacoders.com/328/328939.jpg' },
    { id: 3, sender: 'Sarah', text: "Did you watch the new movie last night?", pfp: 'https://avatarfiles.alphacoders.com/304/304855.jpg' },
    { id: 4, sender: 'Jake', text: "Yeah, it was amazing! Can't believe the twist at the end.", pfp: 'https://wallpapers-clan.com/wp-content/uploads/2022/07/ghostface-pfp-2.jpg' },
    { id: 5, sender: 'Emma', text: "Hey, let's plan for a trip next weekend!", pfp: 'https://i.pinimg.com/736x/31/7c/58/317c584c8fb56b6353622053126ab606.jpg' },
    { id: 6, sender: 'Mike', text: "Sounds great! I'm in. Let's figure out the details.", pfp: 'https://i.redd.it/ms4veit5nsh91.png' },
    { id: 7, sender: 'Lily', text: "Can you send me the files from the last meeting?", pfp: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/69d79c77-7a14-4d6e-a6e4-6aadb16f4fdb/dfyts5a-befb4a6c-e651-4361-91c0-ac23a65905d9.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY5ZDc5Yzc3LTdhMTQtNGQ2ZS1hNmU0LTZhYWRiMTZmNGZkYlwvZGZ5dHM1YS1iZWZiNGE2Yy1lNjUxLTQzNjEtOTFjMC1hYzIzYTY1OTA1ZDkuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.3UNn4hJRbj7ZpHhKF6S0ZM0o20r6exs5ujm3SK7sgvg' },
    { id: 8, sender: 'Oscar', text: "Sure, I'll email them right away.", pfp: 'https://avatarfiles.alphacoders.com/172/172286.jpg' },
    { id: 9, sender: 'Sophia', text: "Hey, are we still on for dinner tomorrow?", pfp: 'https://assets1.ignimgs.com/thumbs/userUploaded/2020/4/7/sonicthumb-1586305184345.jpg' },
    { id: 10, sender: 'Ben', text: "Yes! Looking forward to it.", pfp: 'https://avatarfiles.alphacoders.com/326/326622.jpg' },
    { id: 11, sender: 'Lucy', text: "Thanks for the recommendation! The book was fantastic.", pfp: 'https://hypixel.net/attachments/1928357/' },
    { id: 12, sender: 'Dylan', text: "I'm glad you liked it! Let me know if you need more suggestions.", pfp: 'https://i.pinimg.com/originals/ee/61/37/ee61374e60f036d0d605c37b3a7bee8a.jpg' },
    { id: 13, sender: 'Nina', text: "Are you coming to the event next week?", pfp: 'https://cdn.pfps.gg/pfps/2495-itachi-uchiwa.png' },
    { id: 14, sender: 'Tom', text: "Definitely, I'll be there!", pfp: 'https://preview.redd.it/kw6bprayksr61.jpg?width=640&crop=smart&auto=webp&s=571dd121365ee8728e42dd83d268acb44759663f' },
    { id: 15, sender: 'Grace', text: "We need to catch up soon! It's been too long.", pfp: 'https://i.pinimg.com/1200x/04/aa/eb/04aaeb7d8576685dcb3f6e99b88c882d.jpg' },
    { id: 16, sender: 'Eli', text: "For sure, let's grab coffee sometime this week.", pfp: 'https://p16-va.lemon8cdn.com/tos-maliva-v-ac5634-us/be3aaeab8135414fb76c92b7c16020d5~tplv-tej9nj120t-origin.webp' },
    { id: 17, sender: 'Chloe', text: "Hey, do you have any movie suggestions for tonight?", pfp: 'https://64.media.tumblr.com/ab16d16be0939f42c89bde2b3b0681ee/766f4953e9638ac7-9d/s540x810/789ad05a40c084cb771ccb425c2aaa3db0863a08.jpg' },
    { id: 18, sender: 'Leo', text: "How about that new thriller everyone’s talking about?", pfp: 'https://img.wattpad.com/2bb05a242e1e965bfa7079e1de71ac30841c022d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f353231474a776345485f417553413d3d2d37302e3136656161623265313064623966336135313035313433333132302e6a7067?s=fit&w=720&h=720' },
    { id: 19, sender: 'Mia', text: "Can you help me with this project? I'm stuck.", pfp: 'https://wallpapers-clan.com/wp-content/uploads/2022/12/deadpool-pfp-1.jpg' },
    { id: 20, sender: 'Jack', text: "Sure, I'll walk you through it. Let's schedule a call.", pfp: 'https://c4.wallpaperflare.com/wallpaper/105/575/743/comics-nova-marvel-comics-nova-marvel-comics-wallpaper-preview.jpg' },
  ];
  

  return (
    <div className={`max-h-screen ${theme === 'light' ? 'bg-[#FFFFFF]' : 'bg-[#2D2E39]'} flex`}>
      {/* Sidebar */}
      <Sidebar />
      <div className={`w-1/4 ${theme === 'light' ? 'bg-[#FFFFFF]' : 'bg-[#25262F]'} ml-[100px]`}>
        {/* Sidebar Header */}
        <header className={`p-4 flex items-center ${theme === 'light' ? 'bg-[#E4E4E4]' : 'bg-[#25262F]'}`}>
          <input
            type="text"
            placeholder="Search messages..."
            className={`w-full p-2 rounded-md border border-black border-1 shadow-xl focus:outline-none focus:border-blue-500 ${theme === 'light' ? 'bg-[#E4E4E4] text-black' : 'bg-[#2D2E39] text-white'}`}
          />
        </header>
        
        {/* Contact List */}
        <div className={`${theme === 'light' ? 'bg-[#E4E4E4]' : 'bg-[#25262F]'} overflow-y-auto h-[calc(100vh-75px)]`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {contacts.map((contact) => (
            <div className={`flex items-center mb-4 cursor-pointer ${theme === 'light' ? 'hover:bg-[#E4E4E4]' : "hover:bg-[#3c3f54]"} p-2 rounded-md`} key={contact.id}>
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                <img src={contact.pfp || `https://placehold.co/200x/ffa8e4/ffffff.svg?text=${contact.sender[0]}`} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
              </div>
              <div className="flex-1 min-w-0"> {/* Ensures it can shrink to fit without overflowing */}
                <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>{contact.sender}</h2>
                <p className={`pr-6 text-gray-600 ${theme === 'light' ? 'text-black' : 'text-white'} overflow-hidden whitespace-nowrap overflow-ellipsis`} style={{ maxHeight: '1.2em', lineHeight: '1.2em' }}>
                  {contact.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className={`${theme === 'light' ? 'bg-[#E4E4E4]' : 'bg-[#25262F]'} p-4 flex items-center`}>
          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src="https://p16-va.lemon8cdn.com/tos-maliva-v-ac5634-us/ok1rSbbAiUcl9DuAP4BXiA7JiY4jAIgEQZBA7~tplv-tej9nj120t-origin.webp" 
              alt="Alice's Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className={`text-2xl font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>Peter Parker</h1>
        </header>

        {/* Chat Messages */}
        <div className="h-screen overflow-y-auto p-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex mb-4 cursor-pointer ${msg.isOutgoing ? 'justify-end' : ''}`}>
              {!msg.isOutgoing && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                  <img src="https://p16-va.lemon8cdn.com/tos-maliva-v-ac5634-us/ok1rSbbAiUcl9DuAP4BXiA7JiY4jAIgEQZBA7~tplv-tej9nj120t-origin.webp" alt="User Avatar" className="w-8 h-8 rounded-full" />
                </div>
              )}
              <div className={`flex max-w-96 ${msg.isOutgoing ? (theme === 'light' ? 'bg-[#E4E4E4] rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl ' : 'bg-[#25262F] rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl') : (theme === 'light' ? 'bg-[#E4E4E4] rounded-tr-3xl rounded-tl-3xl rounded-br-3xl' : 'bg-[#25262F] rounded-tr-3xl rounded-tl-3xl rounded-br-3xl')} p-3 gap-3`}>
                <p className={`${msg.isOutgoing ? (theme === 'light' ? 'text-black' : 'text-white') : (theme === 'light' ? 'text-black' : 'text-white')}`}>{msg.text}</p>
              </div>
              {msg.isOutgoing && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                  <img src={user ? user.profile_picture : ""} alt="My Avatar" className="w-8 h-8 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Chat Input */}
        <footer className={`${theme === 'light' ? 'bg-[#E4E4E4]' : 'bg-[#25262F]'} p-4`}>
          <div className="flex items-center">
            <input type="text" placeholder="Type a message..." className={` ${theme === 'light' ? "bg-[#FFFFFF] border-black" : "bg-[#3c3f54] border-black"} text-black w-full p-2 rounded-md border-2 focus:outline-none focus:border-blue-500`} />
            <button className={`px-4 py-2 rounded-md ml-2 ${theme === 'light' ? 'bg-[#FFFFFF] text-black' : 'bg-[#3c3f54] text-white'}`}>Send</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FriendsPage;