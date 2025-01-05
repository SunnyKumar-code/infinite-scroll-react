import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ImageDetail = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
        headers: { Authorization: "Client-ID puXbNMC-XSqzxWvpIeFJrcK4tGd7ZGLc3cBCyoyI6qs" },
      });
      setImage(response.data);
    };

    fetchImage();
  }, [id]);

  if (!image) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <img
        src={image.urls.regular}
        alt={image.alt_description}
        className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
      />
      <h1 className="mt-6 text-2xl font-semibold text-gray-800">
        {image.alt_description || "No description available"}
      </h1>
      <p className="mt-4 text-gray-600">
        <span className="font-medium text-gray-800">Photographer:</span> {image.user.name}
      </p>
      <a
        href={image.links.download}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        Download
      </a>
    </div>
  );
};

export default ImageDetail;
