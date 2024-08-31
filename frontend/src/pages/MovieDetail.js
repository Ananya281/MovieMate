import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";

const YOUTUBE_API_KEY = "AIzaSyDF7STVtzqgx4F2Xi7QEA70IUGSvNGULEo";
const WIKIPEDIA_API_KEY = "7cfbc4ec4fmsh7de0c5c5538257dp1951f6jsn4034f4d06a2d"; // Your Wikipedia API key

const fetchTrailerUrl = async (title) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: "snippet",
        q: `${title} trailer`,
        type: "video",
        key: YOUTUBE_API_KEY,
        maxResults: 1,
      },
    });

    if (response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return `https://www.youtube.com/embed/${videoId}`;
    } else {
      throw new Error("No trailer found");
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    return null;
  }
};

const fetchWikipediaLink = async (title) => {
  try {
    const response = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "opensearch",
        search: title,
        limit: 1,
        format: "json",
        origin: "*",
        key: WIKIPEDIA_API_KEY,
      },
    });

    const results = response.data;
    if (results && results[3] && results[3].length > 0) {
      return results[3][0];
    } else {
      throw new Error("No Wikipedia page found");
    }
  } catch (error) {
    console.error("Error fetching Wikipedia link:", error);
    return null;
  }
};

export default function MovieDetail() {
  const { title } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(`http://localhost:5000/moviedetail/${encodeURIComponent(title)}`);
        const wikiLink = await fetchWikipediaLink(movieResponse.data.title);
        setMovie({ ...movieResponse.data, wiki: wikiLink });
        const trailer = await fetchTrailerUrl(movieResponse.data.title);
        setTrailerUrl(trailer);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("An error occurred while fetching movie details.");
      }
    };

    fetchData();
  }, [title]);

  const handleWatchTrailer = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-8 border-t-red-500 border-white-600 rounded-full animate-spin mb-4"></div>
        <p className="text-center text-white">Loading movie details...</p>
      </div>
    );
  }

  // const formattedActors = movie.actors
  //   ? movie.actors.trim().replace(/([a-z])([A-Z])/g, '$1 $2')
  //   : '';

    const formattedActors = movie.actors
  ? movie.actors
      .split(/\s*[,;]\s*|\s+and\s+/) // Split by comma, semicolon, or "and" with optional spaces
      .map(actor => actor.trim()) // Trim any extra spaces
      .filter(actor => actor) // Remove any empty entries
      .join(', ') // Join with a comma and a space
  : '';



  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      <Navbar />
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: `url(${movie.poster_path || 'https://via.placeholder.com/1920x1080'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-75 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold mb-6">{movie.title}</h1>
          <p className="text-2xl mb-4"><strong>IMDb Rating:</strong> {movie.imdb_rating}</p>
          <p className="text-2xl mb-4"><strong>Genres:</strong> {movie.genres}</p>
          <p className="text-2xl mb-4 mx-5"><strong>Actors:</strong> {formattedActors}</p>
          <p className="text-lg mx-10 mb-8"><strong>Overview:</strong> {movie.summary}</p>

          <div className="flex flex-col md:flex-row justify-center space-y-4 mx-10 md:space-y-0 md:space-x-4">
            <button
              onClick={handleWatchTrailer}
              className="bg-blue-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Watch Trailer
            </button>
            <a
              href={movie.wiki || '#'}
              className="bg-gray-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!movie.wiki) {
                  e.preventDefault();
                  alert("Wikipedia link not available for this movie.");
                }
              }}
            >
              More Info
            </a>
          </div>
        </div>
      </div>
      {trailerUrl && (
        <Modal show={showModal} onClose={handleCloseModal} trailerUrl={trailerUrl} />
      )}
    </div>
    </div>
  );
}
