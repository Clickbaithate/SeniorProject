import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const SwipingImageCarousel = () => {
  const images = [
    {
        src: 'https://images.squarespace-cdn.com/content/v1/5452d441e4b0c188b51fef1a/3065ca34-d0b0-4c7b-a4aa-b18a29c21dc6/Deadpool+and+wolverine.png',
        alt: 'Deadpool & Wolverine',
    },
    {
        src: 'https://deadline.com/wp-content/uploads/2024/09/MCDBEBE_WB027.jpg?w=800',
        alt: 'New Image',
    },
    {
        src: 'https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/10/five-nights-at-freddys.jpg',
        alt: 'new Image',
    }
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation={{
        nextEl: '.custom-next',
        prevEl: '.custom-prev',
      }}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      className="mySwiper"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image.src} alt={image.alt} className="carousel-image" />
        </SwiperSlide>
      ))}
      <button className="custom-prev">‹</button>
      <button className="custom-next">›</button>
    </Swiper>
  );
};

export default SwipingImageCarousel;
