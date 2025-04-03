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
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#F5F5F5] p-6">
      <h1 className="text-4xl font-bold text-[#229799] mb-6">Memory Matching Game</h1>

      <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-xl">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-lg shadow-md transition-all cursor-pointer 
              ${card.flipped || card.matched ? 'bg-[#48CFCB] text-white' : 'bg-gray-300 text-[#424242] hover:bg-gray-400'}`}
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
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-10 rounded-2xl shadow-2xl text-center w-96">
              <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 Well Done!</h2>
              <p className="text-[#424242] mb-4">You matched all the cards correctly.</p>
              <motion.button
                className="mt-4 px-6 py-3 bg-[#48CFCB] text-white rounded-lg hover:bg-[#229799] transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCards(shuffledEmojis.map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false })));
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

export default MemoryGame;
