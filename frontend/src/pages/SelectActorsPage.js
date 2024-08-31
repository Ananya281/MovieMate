import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Import all the actor images
import aamirImage from '../images/movie-actors/aamir.jpeg';
import deepikaImage from '../images/movie-actors/deepika.jpg';
import amitabhImage from '../images/movie-actors/amitabh.jpeg';
import ajayImage from '../images/movie-actors/ajay.jpeg';
import kajolImage from '../images/movie-actors/kajol.jpg';
import anilImage from '../images/movie-actors/anil.jpeg';
import madhuriImage from '../images/movie-actors/madhuri.jpg';
import priyankaImage from '../images/movie-actors/priyanka.jpeg';
import salmanImage from '../images/movie-actors/salman.avif';
import dharmendraImage from '../images/movie-actors/dharmendra.jpeg';
import hemaImage from '../images/movie-actors/hema.jpg';

import akshayImage from '../images/movie-actors/akshay.jpeg';
export default function SelectActorsPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Access the location object

  // State to manage selected actors
  const [selectedActors, setSelectedActors] = useState([]);

  // Array of Bollywood actors with their corresponding images
  const bollywoodActors = [
    { name: "Aamir Khan", image: aamirImage },
    { name: "Deepika Padukone", image: deepikaImage },
    { name: "Amitabh Bachchan", image: amitabhImage },
    { name: "Ajay Devgan", image: ajayImage },
    { name: "Kajol", image: kajolImage },
    { name: "Anil Kapoor", image: anilImage },
    { name: "Madhuri Dikshit", image: madhuriImage },
    { name: "Priyanka Chopra", image: priyankaImage },
    { name: "Salman Khan", image: salmanImage },
    { name: "Dharmendra", image: dharmendraImage },
    { name: "Hema Malini", image: hemaImage },
    { name: "Akshay Kumar", image: akshayImage },
  ];

  // Handle actor selection
  const toggleActorSelection = (actorName) => {
    setSelectedActors((prevSelected) =>
      prevSelected.includes(actorName)
        ? prevSelected.filter((a) => a !== actorName) // Remove if already selected
        : [...prevSelected, actorName] // Add if not selected
    );
  };

  const handleNextClick = () => {
    console.log("Selected actors:", selectedActors);
    navigate("/home", {
      state: {
        selectedActors,
        selectedGenres: location.state?.selectedGenres || [], // Handle case where selectedGenres may be undefined
      },
    });
  };


  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-4 w-full">
        <h2 className="text-4xl font-bold text-white mb-8">Select Your Favorite Bollywood Actors/Actresses</h2>

        {/* Actor Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4 md:px-8">
          {bollywoodActors.map((actor) => (
            <div
              key={actor.name}
              className={`relative flex items-center justify-center bg-gray-800 text-xl font-semibold rounded-lg shadow-md cursor-pointer
                ${selectedActors.includes(actor.name) ? "ring-4 ring-blue-400" : ""} group`}
              onClick={() => toggleActorSelection(actor.name)}
              style={{
                height: '200px', // Adjust height as needed
                width: '100%', // Full width of the grid column
                overflow: 'hidden', // Ensure image doesn't overflow
              }}
            >
              {/* Background Image */}
              <img
                src={actor.image}
                alt={actor.name}
                className="absolute inset-0 object-cover w-full h-full"
              />

              {/* Translucent Black Layer */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

              {/* Actor Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg">{actor.name}</span>
              </div>

              {/* Checkbox: Only visible when the actor is selected */}
              {selectedActors.includes(actor.name) && (
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
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
