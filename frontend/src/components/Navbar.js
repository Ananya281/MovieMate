import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaList, FaSearch, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== "") {
      const url = `/moviedetail/${encodeURIComponent(trimmedQuery)}`;
      console.log("Request URL:", `/moviedetail/${encodeURIComponent(trimmedQuery)}`);
      console.log("Navigating to:", url);
      navigate(url);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col items-center py-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg z-50 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex flex-col items-center mb-6 w-full px-4">
        {isOpen ? (
          <form onSubmit={handleSearchSubmit} className="w-full">
            <input
              type="text"
              placeholder="Search Movie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 py-2 w-full rounded bg-white text-black focus:outline-none"
            />
          </form>
        ) : (
          <FaSearch size={24} className="text-white" />
        )}
      </div>

      <Link
        to="/home"
        className="flex items-center space-x-4 mb-6 text-white transition-opacity duration-300"
      >
        <FaHome size={24} />
        {isOpen && <span className="text-xl">Home</span>}
      </Link>

      <Link
        to="/about"
        className="flex items-center space-x-4 mb-6 text-white transition-opacity duration-300"
      >
        <FaUser size={24} />
        {isOpen && <span className="text-xl">About</span>}
      </Link>

      <Link
        to="/categories"
        className="flex items-center space-x-4 mb-6 text-white transition-opacity duration-300"
      >
        <FaList size={24} />
        {isOpen && <span className="text-xl">Categories</span>}
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-4 mb-6 text-white transition-opacity duration-300"
      >
        <FaSignOutAlt size={24} />
        {isOpen && <span className="text-xl">Logout</span>}
      </button>
    </div>
  );
}
