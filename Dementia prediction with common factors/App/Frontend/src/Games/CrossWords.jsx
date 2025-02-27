// src/pages/Crossword.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const wordsList = ["BRAIN", "MEMORY", "HEALTH", "NEURON", "COGNITION"];
const gridSize = 10;
const createEmptyGrid = () => Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

const Crossword = () => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [foundWords, setFoundWords] = useState([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (foundWords.length === wordsList.length) {
      setWon(true);
    }
  }, [foundWords]);

  const checkWord = (word) => {
    if (wordsList.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-6">Crossword Puzzle</h1>
      <div className="flex gap-6">
        <div className="grid grid-cols-10 border border-gray-600">
          {grid.flat().map((cell, index) => (
            <div key={index} className="w-10 h-10 border border-gray-400 flex items-center justify-center text-lg font-bold bg-white">
              {cell}
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg w-64">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Found Words</h2>
          <ul className="text-gray-600">
            {foundWords.map((word, index) => (
              <li key={index} className="text-green-600 font-semibold">{word}</li>
            ))}
          </ul>
        </div>
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
              <p className="text-lg text-gray-700">You found all the words!</p>
              <motion.button 
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFoundWords([]) && setWon(false)}
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

export default Crossword;
