// src/pages/SlidingPuzzle.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const generateShuffledTiles = () => {
  let tiles = [...Array(15).keys()].map(n => n + 1);
  tiles.push(null);
  return tiles.sort(() => Math.random() - 0.5);
};

const isSolved = (tiles) => {
  return tiles.every((tile, index) => tile === (index < 15 ? index + 1 : null));
};

const SlidingPuzzle = () => {
  const [tiles, setTiles] = useState(generateShuffledTiles());
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (isSolved(tiles)) {
      setWon(true);
    }
  }, [tiles]);

  const handleTileClick = (index) => {
    const emptyIndex = tiles.indexOf(null);
    const validMoves = [
      emptyIndex - 1, emptyIndex + 1,
      emptyIndex - 4, emptyIndex + 4
    ];

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-6">Sliding Puzzle</h1>
      <div className="grid grid-cols-4 gap-2 bg-white p-4 rounded-lg shadow-lg">
        {tiles.map((tile, index) => (
          <motion.div 
            key={index} 
            onClick={() => handleTileClick(index)}
            className={`w-16 h-16 flex items-center justify-center font-bold text-xl rounded-md shadow-md transition-all cursor-pointer 
              ${tile ? 'bg-blue-600 text-white' : 'bg-transparent'}`}
            whileTap={{ scale: 0.9 }}
          >
            {tile}
          </motion.div>
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
                onClick={() => setTiles(generateShuffledTiles()) && setWon(false)}
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

export default SlidingPuzzle;
