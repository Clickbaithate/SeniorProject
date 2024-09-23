import { Link } from 'react-router-dom';
import React from 'react';
import Carousel from '../components/Carousel';

const LandingPage = () => {
  return (

    <div className="bg-[url('assets/background.svg')] bg-cover font-body h-screen overflow-hidden">

      {/*NavBar*/}
      <header className="text-black py-5">
        <div className="flex justify-between items-center w-full px-16">
          <div className="flex items-center space-x-6">
            <div className="bg-[url('assets/logo.svg')] bg-contain w-32 h-32"></div>
            <h1 className="text-2xl font-bold">CineVault</h1>
          </div>

          <nav className="space-x-12 mr-16">
            <Link className="text-gray-100 text-xl hover:border-b-2 border-gray-100 rounded-sm">About</Link>
            <Link className="text-gray-100 text-xl hover:border-b-2 border-gray-100 rounded-sm">Contact</Link>
          </nav>
        </div>
      </header>

      {/*NavBar*/}
      <main className="flex flex-col md:flex-row items-start justify-between md:px-20 py-20 h-full">
        
        <div className="text-center md:text-left md:w-1/3 space-y-9 py-20">
          <h2 className="text-6xl text-black">Easily organize, share, and discover new movies with friends!</h2>
          <p className="text-lg text-gray-600">The best way to track your movie journey!</p>
          <div className="space-x-4">
            <Link to="/signUp" className="px-9 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign Up</Link>
            <Link to="/login" className="px-9 py-2 text-black-600 rounded-lg hover:bg-blue-600 text-white [&:not(:hover)]:text-black ">Log In</Link>
          </div>
        </div>

        <Carousel images={[
          "https://www.solodev.com/core/fileparse.php/131/urlt/craft-beautiful-webdesign-image-1.jpg", 
          "https://mockupslib.com/wp-content/uploads/2017/09/Screen1-5.jpg",
          "https://deerdesigner.com/wp-content/uploads/15384-Infinity-Healthcare-Services-Website-mockup-2.png",
          "https://elementor.com/cdn-cgi/image/f=auto,w=1200,h=630/https://elementor.com/blog/wp-content/uploads/2022/03/2022_02_blog_showcase_January_blog-cover-1200X630.jpg"
        ]}></Carousel>

      </main>

    </div>
    
  );
}

export default LandingPage;
