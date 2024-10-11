import { useState } from 'react';

const HomePageCarousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prevSlide) =>
        prevSlide === images.length - 1 ? 0 : prevSlide + 1
      );
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prevSlide) =>
        prevSlide === 0 ? images.length - 1 : prevSlide - 1
      );
    }
  };

  const handleClick = (e) => {
    const clickPosition = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const halfWidth = e.currentTarget.clientWidth / 2;

    if (clickPosition < halfWidth) {
      handlePrev(); // Clicked on the left side
    } else {
      handleNext(); // Clicked on the right side
    }
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <div className="content-start">
      <div
        id="dynamic-carousel"
        className="relative w-full"
        data-carousel="slide"
        onClick={handleClick} // Click handler on the carousel
      >
        <div className="relative h-[400px] w-[740px] overflow-hidden rounded-[50px]">
          {images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              onTransitionEnd={handleTransitionEnd}
              data-carousel-item
            >
              <img
                src={image}
                className="absolute block w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageCarousel;
