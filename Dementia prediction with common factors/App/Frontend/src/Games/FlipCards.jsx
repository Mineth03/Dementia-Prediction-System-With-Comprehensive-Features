// src/pages/MemoryGame.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emojis = ['🐶', '🐱', '🦊', '🐻', '🐼', '🐯', '🐵', '🐸'];
const shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

const MemoryGame = () => {
  const [cards, setCards] = useState(shuffledEmojis.map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false })));
  const [selected, setSelected] = useState([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (cards.every(card => card.matched)) {
      setWon(true);
    }
  }, [cards]);

  const handleCardClick = (index) => {
    if (selected.length === 2 || cards[index].flipped) return;

    const newCards = cards.map((card, i) => i === index ? { ...card, flipped: true } : card);
    setCards(newCards);
    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setTimeout(() => {
        const [first, second] = newSelected;
        if (cards[first].emoji === cards[second].emoji) {
          setCards(cards.map((card, i) => (i === first || i === second) ? { ...card, matched: true } : card));
        } else {
          setCards(cards.map((card, i) => (i === first || i === second) ? { ...card, flipped: false } : card));
        }
        setSelected([]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-6">Memory Matching Game</h1>
      <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-lg">
        {cards.map((card, index) => (
          <motion.div 
            key={card.id} 
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 flex items-center justify-center font-bold text-2xl rounded-md shadow-md transition-all cursor-pointer 
              ${card.flipped || card.matched ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
            whileTap={{ scale: 0.9 }}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
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
              <p className="text-lg text-gray-700">You matched all the cards!</p>
              <motion.button 
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCards(shuffledEmojis.map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }))) && setWon(false)}
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

export default MemoryGame;
