import React from "react";

export default function Modal({ show, onClose, trailerUrl }) {
  if (!show) {
    return null;
  }

  const handleOpenInNewTab = () => {
    window.open(trailerUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black text-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-center font-bold">Trailer</h2>
        </div>
        <div className="w-full h-64 mb-4">
          <iframe
            className="w-full h-full"
            src={trailerUrl}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleOpenInNewTab}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Open in New Tab
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
