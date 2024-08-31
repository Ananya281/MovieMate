import { useNavigate } from "react-router-dom";
import introLogo from '../images/intro-logo.png'; // Import the logo image
import backgroundImage from '../images/poster-background.jpeg'; // Import the background image

export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center mt-[-220px]">
        <img src={introLogo} alt="Logo" className="w-150 h-100 mb-1" /> {/* Reduced margin-bottom of logo */}
        <h1 className="text-6xl font-bold text-white mb-6 mt-[-80px]">Welcome to Movie Recommender</h1> {/* Reduced margin-bottom of heading */}
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
