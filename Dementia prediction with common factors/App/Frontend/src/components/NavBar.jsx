import { Link } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">MyApp</h1>

        {/* Hamburger Icon */}
        <div className="lg:hidden" onClick={toggleMenu}>
          <button className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`lg:flex flex-col lg:flex-row gap-8 text-lg lg:static absolute bg-gray-900 w-full lg:w-auto lg:bg-transparent transition-all duration-300 ease-in-out ${
            isOpen ? "top-16" : "top-[-200px]"
          }`}
        >
          <li>
            <Link
              to="/"
              className="py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/prediction-form"
              className="py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Predictions
            </Link>
          </li>
          <li>
            <Link
              to="/tracker"
              className="py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Tracker
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
