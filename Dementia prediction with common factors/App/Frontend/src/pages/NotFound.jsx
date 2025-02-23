// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl mt-2">Page Not Found</h2>
      <p className="mt-4">
        Sorry, the page you're looking for does not exist. <br />
        <Link to="/" className="text-blue-500">Go back to Home</Link>
      </p>
    </div>
  );
};

export default NotFound;
