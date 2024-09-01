import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [thrillerMovies, setThrillerMovies] = useState([]);

  const location = useLocation();

  useEffect(() => {
    // Fetch recommended movies and top action movies in parallel
    const fetchRecommendations = async () => {
      try {
        const { selectedGenres, selectedActors } = location.state || {};
        const [recommendedResponse, actionResponse, comedyResponse, romanceResponse, thrillerResponse] = await Promise.all([
          axios.post("https://moviebackend-so5g.onrender.com/recommend", {
            genres: selectedGenres,
            actors: selectedActors
          }),
          axios.get("https://moviebackend-so5g.onrender.com/top_action_movies"),
          axios.get("https://moviebackend-so5g.onrender.com/top_comedy_movies"),
          axios.get("https://moviebackend-so5g.onrender.com/top_romance_movies"),
          axios.get("https://moviebackend-so5g.onrender.com/top_thriller_movies"),
        ]);
        console.log("Recommended Movies:", recommendedResponse.data);  // Check data here
        console.log("Top Action Movies:", actionResponse.data);  // Check data here
        console.log("Top Comedy Movies:", comedyResponse.data);  // Check data here
        console.log("Top Romance Movies:", romanceResponse.data);  // Check data here
        console.log("Top Thriller Movies:", thrillerResponse.data);  // Check data here

        setMovies(recommendedResponse.data);
        setActionMovies(actionResponse.data);
        setComedyMovies(comedyResponse.data);
        setRomanceMovies(romanceResponse.data);
        setThrillerMovies(thrillerResponse.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [location.state]);

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex-1 ml-16"> {/* Add padding-top to prevent content overlap */}
        <HeroSection />
        <div className="movie-sections space-y-8 p-8">
          {/* Recommended Movies Section */}
          <h2>Recommended Movies</h2>
          {movies.length > 0 ? (
            <div className="grid grid-cols-5 gap-4">
              {movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
          ) : (
            <p>No recommended movies to show</p>
          )}

          {/* Top Action Movies Section */}
          <h2>Top 5 Action Movies</h2>
          {actionMovies.length > 0 ? (
            <div className="grid grid-cols-5 gap-4">
              {actionMovies.map(([title, imdb_rating, poster_path], index) => (
                <MovieCard key={index} movie={{ title, imdb_rating, poster_path }} />
              ))}
            </div>
          ) : (
            <p>No top action movies to show</p>
          )}

          {/* Top Comedy Movies Section */}
          <h2>Top 5 Comedy Movies</h2>
          {comedyMovies.length > 0 ? (
            <div className="grid grid-cols-5 gap-4">
              {comedyMovies.map(([title, imdb_rating, poster_path], index) => (
                <MovieCard key={index} movie={{ title, imdb_rating, poster_path }} />
              ))}
            </div>
          ) : (
            <p>No top comedy movies to show</p>
          )}

          {/* Top Romance Movies Section */}
          <h2>Top 5 Romance Movies</h2>
          {romanceMovies.length > 0 ? (
            <div className="grid grid-cols-5 gap-4">
              {romanceMovies.map(([title, imdb_rating, poster_path], index) => (
                <MovieCard key={index} movie={{ title, imdb_rating, poster_path }} />
              ))}
            </div>
          ) : (
            <p>No top romance movies to show</p>
          )}

          {/* Top Thriller Movies Section */}
          <h2>Top 5 Thriller Movies</h2>
          {thrillerMovies.length > 0 ? (
            <div className="grid grid-cols-5 gap-4">
              {thrillerMovies.map(([title, imdb_rating, poster_path], index) => (
                <MovieCard key={index} movie={{ title, imdb_rating, poster_path }} />
              ))}
            </div>
          ) : (
            <p>No top thriller movies to show</p>
          )}
          {/* ... other sections */}
        </div>
        <Footer />
      </div>
    </div>
  );
}
