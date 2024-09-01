import { useState } from "react";
import backgroundImage from '../images/poster-background.jpeg';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const logInUser = (event) => {
    event.preventDefault();  // Prevent page reload on form submission
    
    if (email.length === 0) {
      alert("Email has left Blank!");
    } else if (password.length === 0) {
      alert("Password has left Blank!");
    } else {
      // Send login request to the Flask backend
      axios.post('https://moviebackend-so5g.onrender.com/login', {
        email: email,
        password: password
      })
      .then(function (response) {
        // Check for a successful response
        if (response.status === 200) {  
          console.log(response.data.message);  // Optional: log success message
          navigate("/home");  // Redirect to the home page on success
        }
      })
      .catch(function (error) {
        // Handle login errors
        console.log(error, 'error');
        if (error.response && error.response.status === 401) {
          alert("Invalid credentials");
        } else {
          alert("An error occurred. Please try again.");
        }
      });
    }
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 text-white">
        <h2 className="text-center text-4xl font-bold">Login</h2>
        <form className="space-y-4" onSubmit={logInUser}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-white-700 text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded bg-white-700 text-black"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Login
          </button>
        </form>
        <div className="text-center">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-red-500 hover:underline">
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
