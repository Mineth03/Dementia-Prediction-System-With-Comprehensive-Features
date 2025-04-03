import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const wordsList = ["BRAIN", "MEMORY", "HEALTH", "NEURON", "COGNITION"];
const gridSize = 15;

const createEmptyGrid = () => Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
const getRandomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

const placeWordsInGrid = (grid, words) => {
  let newGrid = grid.map(row => [...row]);
  let wordPositions = {};

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

  newGrid = newGrid.map(row => row.map(cell => (cell === "" ? getRandomLetter() : cell)));
  return { grid: newGrid, wordPositions };
};

const Crossword = () => {
  const [{ grid, wordPositions }, setGridData] = useState({ grid: createEmptyGrid(), wordPositions: {} });
  const [foundWords, setFoundWords] = useState([]);
  const [won, setWon] = useState(false);
  const [selection, setSelection] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    setGridData(placeWordsInGrid(createEmptyGrid(), wordsList));
  }, []);

  useEffect(() => {
    if (foundWords.length === wordsList.length) {
      setWon(true);
    }
  }, [foundWords]);

  const handleMouseDown = (row, col) => {
    setMouseDown(true);
    setSelection([[row, col]]);
  };

  const handleMouseEnter = (row, col) => {
    if (mouseDown) {
      setSelection(prev => [...prev, [row, col]]);
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    checkSelectedWord();
  };

  const checkSelectedWord = () => {
    for (const word in wordPositions) {
      const positions = wordPositions[word];
      if (arraysEqual(selection, positions) && !foundWords.includes(word)) {
        setFoundWords([...foundWords, word]);
      }
    }
    setSelection([]);
  };

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, idx) => JSON.stringify(val) === JSON.stringify(arr2[idx]));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] p-8">
      <h1 className="text-4xl font-bold text-[#229799] mb-8">Cognitive Crossword Puzzle</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Puzzle Grid */}
        <div 
          className="border-2 border-[#48CFCB] rounded-xl p-2 bg-white shadow-lg"
          style={{ display: "grid", gridTemplateColumns: "repeat(15, 2.5rem)", cursor: "pointer" }}
          onMouseLeave={() => setMouseDown(false)}
        >
          {grid.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected = selection.some(([r, c]) => r === rowIndex && c === colIndex);
              const isHighlighted = foundWords.some(word =>
                wordPositions[word].some(([r, c]) => r === rowIndex && c === colIndex)
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-10 h-10 border text-lg font-bold flex items-center justify-center
                    ${isHighlighted ? "bg-[#48CFCB] text-white" :
                      isSelected ? "bg-yellow-200 text-[#424242]" : "bg-white text-[#424242]"} border-gray-300`}
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

        {/* Word List */}
        <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-xs">
          <h2 className="text-xl font-bold text-[#229799] mb-4">Words to Find</h2>
          <ul className="text-[#424242] space-y-2">
            {wordsList.map((word, i) => (
              <li
                key={i}
                className={foundWords.includes(word) ? "text-green-600 font-semibold" : ""}
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-96">
              <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 Great Job!</h2>
              <p className="text-[#424242] mb-4">You found all the cognitive words!</p>
              <motion.button
                onClick={() => {
                  setFoundWords([]);
                  setWon(false);
                  setGridData(placeWordsInGrid(createEmptyGrid(), wordsList));
                }}
                className="mt-4 px-6 py-2 bg-[#48CFCB] text-white rounded-lg hover:bg-[#229799] transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
