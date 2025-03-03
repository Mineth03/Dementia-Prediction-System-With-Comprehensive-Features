// src/pages/JigsawPuzzle.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import image1 from '../assets/puzzle1.jpg';
import image2 from '../assets/puzzle2.jpg';
import image3 from '../assets/puzzle3.jpg';
import image4 from '../assets/puzzle4.jpg';

const images = [
  image1,
  image2,
  image3,
  image4
];

const gridSize = 4;
const totalPieces = gridSize * gridSize;

const shuffleArray = (array) => {
  return array.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const JigsawPuzzle = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [pieces, setPieces] = useState([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const tempPieces = Array.from({ length: totalPieces }, (_, i) => i);
    setPieces(shuffleArray(tempPieces));
    setWon(false);
  }, [selectedImage]);

  const handleDrop = (e, index) => {
    const draggedPiece = parseInt(e.dataTransfer.getData("piece"));
    const newPieces = [...pieces];
    [newPieces[index], newPieces[draggedPiece]] = [newPieces[draggedPiece], newPieces[index]];
    setPieces(newPieces);

    if (newPieces.every((piece, idx) => piece === idx)) {
      setWon(true);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("piece", index);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-6">Jigsaw Puzzle</h1>
      <div className="mb-4">
        <label className="text-white font-bold">Select Image: </label>
        <select className="ml-2 p-2 rounded" onChange={(e) => setSelectedImage(e.target.value)}>
          {images.map((img, index) => (
            <option key={index} value={img}>{`Image ${index + 1}`}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-4 gap-2 bg-white p-4 rounded-lg shadow-lg">
        {pieces.map((piece, index) => (
          <div 
            key={index} 
            className="w-16 h-16 bg-gray-300 border" 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={(e) => handleDrop(e, index)}
          >
            <img 
              src={selectedImage} 
              alt="puzzle-piece" 
              draggable 
              onDragStart={(e) => handleDragStart(e, index)}
              className="w-full h-full object-cover cursor-pointer"
              style={{ clipPath: `polygon(${(index % gridSize) * (100 / gridSize)}% ${(Math.floor(index / gridSize)) * (100 / gridSize)}%, 
                                           ${(index % gridSize + 1) * (100 / gridSize)}% ${(Math.floor(index / gridSize)) * (100 / gridSize)}%, 
                                           ${(index % gridSize + 1) * (100 / gridSize)}% ${(Math.floor(index / gridSize) + 1) * (100 / gridSize)}%, 
                                           ${(index % gridSize) * (100 / gridSize)}% ${(Math.floor(index / gridSize) + 1) * (100 / gridSize)}%)` }}
            />
          </div>
        ))}
      </div>
      
      <AnimatePresence>
        {won && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
              <h2 className="text-4xl font-bold text-green-600 mb-4">Congratulations!</h2>
              <p className="text-lg text-gray-700">You solved the puzzle!</p>
              <motion.button 
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPieces(shuffleArray(Array.from({ length: totalPieces }, (_, i) => i))) && setWon(false)}
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JigsawPuzzle;
