import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const wordsList = ["BRAIN", "MEMORY", "HEALTH", "NEURON", "COGNITION"];
const gridSize = 15;

// Function to create an empty grid
const createEmptyGrid = () => Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

// Function to generate a random letter (A-Z)
const getRandomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

// Function to place words and fill empty spaces with random letters
const placeWordsInGrid = (grid, words) => {
  let newGrid = grid.map(row => [...row]);
  let wordPositions = {}; // Store positions for highlighting

  words.forEach(word => {
    let placed = false;

    while (!placed) {
      let direction = Math.random() < 0.5 ? "H" : "V";
      let row, col;

      if (direction === "H") {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * (gridSize - word.length));

        if (newGrid[row].slice(col, col + word.length).every(cell => cell === "")) {
          wordPositions[word] = [];
          for (let i = 0; i < word.length; i++) {
            newGrid[row][col + i] = word[i];
            wordPositions[word].push([row, col + i]);
          }
          placed = true;
        }
      } else {
        row = Math.floor(Math.random() * (gridSize - word.length));
        col = Math.floor(Math.random() * gridSize);

        if (Array.from({ length: word.length }, (_, i) => newGrid[row + i][col]).every(cell => cell === "")) {
          wordPositions[word] = [];
          for (let i = 0; i < word.length; i++) {
            newGrid[row + i][col] = word[i];
            wordPositions[word].push([row + i, col]);
          }
          placed = true;
        }
      }
    }
  });

  // Fill empty spaces with random letters
  newGrid = newGrid.map(row => row.map(cell => (cell === "" ? getRandomLetter() : cell)));

  return { grid: newGrid, wordPositions };
};

const Crossword = () => {
  const [{ grid, wordPositions }, setGridData] = useState({ grid: createEmptyGrid(), wordPositions: {} });
  const [foundWords, setFoundWords] = useState([]);
  const [won, setWon] = useState(false);
  const [selection, setSelection] = useState([]); // Stores selected cells
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    setGridData(placeWordsInGrid(createEmptyGrid(), wordsList));
  }, []);

  useEffect(() => {
    if (foundWords.length === wordsList.length) {
      setWon(true);
    }
  }, [foundWords]);

  // Function to start selection
  const handleMouseDown = (row, col) => {
    setMouseDown(true);
    setSelection([[row, col]]);
  };

  // Function to update selection while dragging
  const handleMouseEnter = (row, col) => {
    if (mouseDown) {
      setSelection(prevSelection => [...prevSelection, [row, col]]);
    }
  };

  // Function to finish selection and check if a word is found
  const handleMouseUp = () => {
    setMouseDown(false);
    checkSelectedWord();
  };

  // Check if the selected cells match any word
  const checkSelectedWord = () => {
    for (const word in wordPositions) {
      const positions = wordPositions[word];

      if (arraysEqual(selection, positions) && !foundWords.includes(word)) {
        setFoundWords([...foundWords, word]); // Add found word
      }
    }
    setSelection([]); // Reset selection
  };

  // Utility function to compare selected cells with word positions
  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => JSON.stringify(val) === JSON.stringify(arr2[index]));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-6">Crossword Puzzle</h1>
      <div className="flex gap-6">
        <div 
          className="border border-gray-600"
          style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)" }}
          onMouseLeave={() => setMouseDown(false)} // Reset on leaving the grid
        >
          {grid.flatMap((row, rowIndex) => 
            row.map((cell, colIndex) => {
              const isSelected = selection.some(([r, c]) => r === rowIndex && c === colIndex);
              const isHighlighted = foundWords.some(word => wordPositions[word].some(([r, c]) => r === rowIndex && c === colIndex));

              return (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className={`w-8 h-8 border border-gray-400 flex items-center justify-center text-lg font-bold
                    ${isHighlighted ? "bg-green-400 text-white" : isSelected ? "bg-yellow-200" : "bg-white"}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                >
                  {cell}
                </div>
              );
            })
          )}
        </div>

        {/* Found Words List */}
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
                onClick={() => {
                  setFoundWords([]);
                  setWon(false);
                  setGridData(placeWordsInGrid(createEmptyGrid(), wordsList));
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

export default Crossword;
