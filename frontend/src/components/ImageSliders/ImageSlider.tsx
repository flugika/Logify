import { useState, useEffect, useRef } from "react";
import sliderImage1 from '../../img/slider1.jpg';
import sliderImage2 from '../../img/slider2.jpg';
import sliderImage3 from '../../img/slider3.jpg';
import sliderImage4 from '../../img/slider4.jpg';
import sliderImage5 from '../../img/slider5.jpg';
import sliderImage6 from '../../img/slider6.jpg';
import sliderImage7 from '../../img/slider7.jpg';
import sliderImage8 from '../../img/slider8.jpg';
import sliderImage9 from '../../img/slider9.jpg';
import sliderImage10 from '../../img/slider10.jpg';
import React from "react";

const slides = [
  { url: sliderImage1, title: 'Slider Image 1' },
  { url: sliderImage2, title: 'Slider Image 2' },
  { url: sliderImage3, title: 'Slider Image 3' },
  { url: sliderImage4, title: 'Slider Image 4' },
  { url: sliderImage5, title: 'Slider Image 5' },
  { url: sliderImage6, title: 'Slider Image 6' },
  { url: sliderImage7, title: 'Slider Image 7' },
  { url: sliderImage8, title: 'Slider Image 8' },
  { url: sliderImage9, title: 'Slider Image 9' },
  { url: sliderImage10, title: 'Slider Image 10' },
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]);

  const sliderStyles = {
    height: "100%",
    position: "relative",
    overflow: "hidden",
  } as const;

  const slideStyles = {
    width: "100%",
    height: "100%",
    backgroundPosition: "center",
    backgroundSize: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    transition: "opacity 0.8s",
    opacity: 1,
  } as const;

  const arrowStyles = {
    height: "48px",
    width: "48px",
    textAlign: "center",
    fontSize: "30px",
    color: "#FFFFFF",
    zIndex: 1,
    cursor: "pointer",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(22, 112, 47, 0.5)",
    borderRadius: "10%",
  } as const;

  const leftArrowStyles = {
    ...arrowStyles,
    left: "10px",
  } as const;

  const rightArrowStyles = {
    ...arrowStyles,
    right: "10px",
  } as const;

  const dotsContainerStyles = {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: "10px",
    width: "100%",
  } as const;

  const dotStyles = {
    margin: "0 3px",
    cursor: "pointer",
    fontSize: "20px",
    color: "#bbb",
  };

  const activeDotStyles = {
    ...dotStyles,
    color: "#fff",
  };

  return (
    <div style={sliderStyles}>
      <div style={leftArrowStyles} onClick={goToPrevious}>
        〈
      </div>
      <div style={rightArrowStyles} onClick={goToNext}>
        〉
      </div>
      {slides.map((slide, slideIndex) => (
        <div
          key={slideIndex}
          style={{
            ...slideStyles,
            opacity: slideIndex === currentIndex ? 1 : 0, // Apply fade effect by changing opacity
            backgroundImage: `url(${ slide.url })`,
          }}
        ></div>
      ))}
      <div style={dotsContainerStyles}>
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            style={slideIndex === currentIndex ? activeDotStyles : dotStyles}
            onClick={() => goToSlide(slideIndex)}
          >
            ●
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
