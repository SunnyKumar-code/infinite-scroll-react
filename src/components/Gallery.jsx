import React, { useReducer, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const initialState = {
  images: [],
  isLoading: false,
  query: "nature",
  page: 1,
  hasMore: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_IMAGES":
      return {
        ...state,
        images: [...state.images, ...action.payload],
        hasMore: action.payload.length === 20, 
      };
    case "SET_QUERY":
      return { ...state, query: action.payload, images: [], page: 1, hasMore: true };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

const Gallery = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  
  const fetchImages = async () => {
    if (state.isLoading || !state.hasMore) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: state.query,
          page: state.page,
          per_page: 20,
        },
        headers: {
          Authorization: "Client-ID puXbNMC-XSqzxWvpIeFJrcK4tGd7ZGLc3cBCyoyI6qs", 
        },
      });

      dispatch({ type: "SET_IMAGES", payload: response.data.results });
    } catch (error) {
      console.error("Error fetching images:", error);
    }

    dispatch({ type: "SET_LOADING", payload: false });
  };


  const handleScroll = () => {
    if (
      Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight
    ) {
      dispatch({ type: "SET_PAGE", payload: state.page + 1 });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state.page]);

 
  useEffect(() => {
    fetchImages();
  }, [state.page, state.query]);


  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.query.value.trim();
    if (query && query !== state.query) {
      dispatch({ type: "SET_QUERY", payload: query });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
     
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          name="query"
          placeholder="Search images..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>

     
      <div className="columns-3xs rounded-lg ">
        {state.images.map((image, index) => (
          <div
            key={image.id}
            className=" w-full  rounded-lg  shadow-lg border border-gray-200"
          >
            <Link to={`/image/${image.id}`}>
              <img
                src={image.urls.small}
                alt={image.alt_description}
                className="w-full object-cover"
              />
            </Link>
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-700 mb-2">
                {image.alt_description || "No description available"}
              </p>
            </div>
          </div>
        ))}
      </div>

  
      {state.isLoading && <p className="text-center mt-4">Loading...</p>}
      {!state.hasMore && <p className="text-center mt-4">No more images to load.</p>}
    </div>
  );
};

export default Gallery;
