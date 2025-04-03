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

  const goalTiles = [...Array(15).keys()].map(n => n + 1).concat(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#F5F5F5] p-6">
      <h1 className="text-4xl font-bold text-[#229799] mb-4">Sliding Puzzle</h1>

      <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
        {/* Puzzle Grid */}
        <div>
          <h2 className="text-lg font-semibold text-[#424242] mb-3">Your Puzzle</h2>
          <div className="grid grid-cols-4 gap-3 bg-white p-6 rounded-2xl shadow-xl">
            {tiles.map((tile, index) => (
              <motion.div
                key={index}
                onClick={() => handleTileClick(index)}
                className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-lg transition-all cursor-pointer shadow-md 
                ${tile ? 'bg-[#48CFCB] text-white hover:bg-[#229799]' : 'bg-transparent'}`}
                whileTap={{ scale: 0.92 }}
              >
                {tile}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Goal State */}
        <div>
          <h2 className="text-lg font-semibold text-[#424242] mb-3">Goal State</h2>
          <div className="grid grid-cols-4 gap-3 bg-gray-100 p-6 rounded-2xl shadow-lg">
            {goalTiles.map((tile, index) => (
              <div
                key={`goal-${index}`}
                className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-lg 
                ${tile ? 'bg-[#48CFCB] text-white' : 'bg-transparent'}`}
              >
                {tile}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Winning Modal */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-10 rounded-2xl shadow-2xl text-center w-96">
              <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 Puzzle Solved!</h2>
              <p className="text-[#424242] mb-4">You've successfully completed the sliding puzzle.</p>
              <motion.button
                className="mt-4 px-6 py-3 bg-[#48CFCB] text-white rounded-lg hover:bg-[#229799] transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTiles(generateShuffledTiles());
                  setWon(false);
                }}
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
