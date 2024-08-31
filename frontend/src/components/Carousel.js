import { useEffect, useRef } from "react";
import MovieCard from "./MovieCard"; // Import your MovieCard component

const Carousel = ({ movies }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      let scrollAmount = 0;
      const scrollStep = 2; // Adjust scrolling speed here
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;

      const scroll = () => {
        if (scrollAmount < maxScroll) {
          scrollAmount += scrollStep;
          carousel.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
          });
        } else {
          scrollAmount = 0;
          carousel.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      };

      const interval = setInterval(scroll, 30); // Adjust the interval for scrolling speed

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [movies]);

  return (
    <div className="overflow-hidden relative">
      <div
        ref={carouselRef}
        className="flex space-x-4 transition-transform duration-500 ease-in-out"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} title={movie.title} /> // Pass movie title or other props
        ))}
      </div>
    </div>
  );
};

export default Carousel;
