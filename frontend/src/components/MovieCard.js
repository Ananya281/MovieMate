import React from "react";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  if (!movie || !movie.title) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <p className="p-4 text-gray-400">Movie data unavailable</p>
      </div>
    );
  }

  console.log("Rendering MovieCard for:", movie.title); // Debugging output

  const handleClick = () => {
    navigate(`/moviedetail/${encodeURIComponent(movie.title)}`);
  };

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={movie.poster_path || 'https://via.placeholder.com/150'}
        alt={movie.title || 'Movie'}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{movie.title || 'Movie Title'}</h3>
        <p className="text-gray-400">IMDb Rating: {movie.imdb_rating || 'N/A'}</p>
      </div>
    </div>
  );
}
