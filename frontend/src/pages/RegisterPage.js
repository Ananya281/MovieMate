import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import backgroundImage from '../images/poster-background.jpeg';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const registerUser = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    axios.post('https://moviebackend-so5g.onrender.com/signup', {
        name:name,
        email: email,
        password: password
    })
    .then(function (response) {
         console.log(response);
         // Redirect to the Select Movies Page after successful registration
         navigate("/select-movies");
    })
    .catch(function (error) {
      console.log(error); // Log the entire error for debugging

      // Check if error.response exists before accessing its properties
      if (error.response) {
          if (error.response.status === 401) {
              alert("Invalid credentials");
          } else {
              alert("Something went wrong. Please try again.");
          }
      } else {
          // Handle other types of errors (network issues, etc.)
          alert("Network error or server is unreachable. Please try again later.");
      }
    });
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 text-white">
        <h2 className="text-center text-4xl font-bold">Register</h2>
        <form className="space-y-4" onSubmit={registerUser}>
        <input
            type="text"
            placeholder="Fullname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-white-700 text-black"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-white-700 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-white-700 text-black"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Register
          </button>
        </form>
        <div className="text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-red-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
