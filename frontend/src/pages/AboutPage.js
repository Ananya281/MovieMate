import React from "react";
import backgroundImage from '../images/poster-background.jpeg'; // Replace with your actual background image
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-6">About Us</h1>

        <p className="text-lg text-white max-w-3xl mb-6">
          Welcome to Movie Recommender! Our mission is to help you discover movies that match your taste. We believe that movies have the power to inspire, entertain, and bring people together. Our platform leverages advanced algorithms to provide personalized recommendations tailored to your preferences.
        </p>

        <p className="text-lg text-white max-w-3xl mb-6">
          Whether you are looking for the latest blockbusters or hidden gems, our team is dedicated to enhancing your movie-watching experience. We are a passionate group of movie enthusiasts who are committed to delivering the best service possible.
        </p>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
