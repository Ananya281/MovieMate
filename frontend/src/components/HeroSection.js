import { useState } from "react";
import axios from "axios";
import backgroundImage from '../images/poster-background.jpeg';
import Loader from "./Loader";
import MovieCard from './MovieCard';

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setHasSearched(true);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/recommend_by_query', { query });
      console.log("Recommendations data:", response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setRecommendations(response.data);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-full bg-cover bg-center text-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 text-white p-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to Your Movie Recommender</h1>
        <p className="text-lg mb-6">Get personalized movie recommendations!</p>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies..."
            className="px-4 py-2 rounded-lg text-black w-96"
          />
        </div>

        {/* Recommendation Button */}
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Recommendations
        </button>

        {/* Movie Recommendations */}
        <div className="flex flex-col items-center justify-center w-full my-10">
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <Loader />
            </div>
          ) : (
            hasSearched && (
              recommendations.length > 0 ? (
                <div className="grid grid-cols-5 gap-4">
                  {recommendations.map((movie, index) => (
                    <MovieCard key={index} movie={{
                      title: movie[0],
                      imdb_rating: movie[1],
                      poster_path: movie[2]
                    }} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center">No recommendations available</p>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
