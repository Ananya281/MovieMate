import { useState } from "react";
import { useNavigate} from "react-router-dom";

// Import all the images
import actionPoster from '../images/movie-poster/action.avif';
import dramaPoster from '../images/movie-poster/drama.webp';
import adventurePoster from '../images/movie-poster/adventure.avif';
import biographyPoster from '../images/movie-poster/biography.jpeg';
import comedyPoster from '../images/movie-poster/comedy.jpg';
import crimePoster from '../images/movie-poster/crime.webp';
import familyPoster from '../images/movie-poster/family.webp';
import horrorPoster from '../images/movie-poster/horror.jpeg';
import mysteryPoster from '../images/movie-poster/mystery.jpg';
import musicalPoster from '../images/movie-poster/musical.jpg';
import romancePoster from '../images/movie-poster/romance.jpg';
import thrillerPoster from '../images/movie-poster/thriller.jpeg';

// Import other genre images similarly...

export default function SelectMoviesPage() {
  const navigate = useNavigate();

  // State to manage selected genres
  const [selectedGenres, setSelectedGenres] = useState([]);

  const genres = [
    { name: "Action", image: actionPoster },
    { name: "Drama", image: dramaPoster },
    { name: "Adventure", image: adventurePoster },
    { name: "Biography", image: biographyPoster },
    { name: "Comedy", image: comedyPoster },
    { name: "Crime", image: crimePoster },
    { name: "Family", image: familyPoster },
    { name: "Horror", image: horrorPoster },
    { name: "Mystery", image: mysteryPoster },
    { name: "Musical", image: musicalPoster },
    { name: "Romance", image: romancePoster },
    { name: "Thriller", image: thrillerPoster },
  ];

  // Handle genre selection
  const toggleGenreSelection = (genreName) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreName)
        ? prevSelected.filter((g) => g !== genreName)  // Remove if already selected
        : [...prevSelected, genreName]  // Add if not selected
    );
  };

  const handleNextClick = () => {
    console.log("Selected genres:", selectedGenres);
    navigate("/select-actors", { state: { selectedGenres } });  // Proceed to the next step
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-4 w-full">
        <h2 className="text-4xl font-bold text-white mb-8">Select Your Favorite Genres</h2>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4 md:px-8">
          {genres.map((genre) => (
            <div
              key={genre.name}
              className={`relative flex items-center justify-center h-40 bg-gray-200 text-xl font-semibold rounded-lg shadow-md cursor-pointer 
              ${selectedGenres.includes(genre.name) ? "ring-4 ring-blue-400" : ""}`}
              onClick={() => toggleGenreSelection(genre.name)}
              style={{
                backgroundImage: `url(${genre.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Translucent Red Layer */}
              <div className="absolute inset-0 bg-black-500 bg-opacity-50 rounded-lg"></div>
              
              {/* Genre Text Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-white">{genre.name}</span>
              </div>

              {/* Checkbox: Only visible when the genre is selected */}
              {selectedGenres.includes(genre.name) && (
                <input
                  type="checkbox"
                  className="absolute top-2 right-2 w-6 h-6"
                  checked
                  readOnly
                />
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-6 mt-8">
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Skip
          </button>
          <button
            onClick={handleNextClick}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
