import React from "react";
import { useNavigate } from "react-router-dom";

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

export default function CategoriesPage() {
  const navigate = useNavigate();

  const categories = [
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

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-4 w-full">
        <h2 className="text-4xl font-bold text-white mb-8">Select on the basis of Genre</h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4 md:px-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative flex items-center justify-center h-40 bg-gray-200 text-xl font-semibold rounded-lg shadow-md cursor-pointer"
              // onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Translucent Red Layer */}
              <div className="absolute inset-0 bg-black-500 bg-opacity-50 rounded-lg"></div>
              
              {/* Category Text Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-white">{category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
