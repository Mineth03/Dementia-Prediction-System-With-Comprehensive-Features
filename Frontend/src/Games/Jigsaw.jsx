import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import image1 from '../assets/puzzle1.jpg';
import image2 from '../assets/puzzle2.jpg';
import image3 from '../assets/puzzle3.jpg';
import image4 from '../assets/puzzle4.jpg';

const images = [image1, image2, image3, image4];
const gridSize = 4;
const totalPieces = gridSize * gridSize;

const sliceImage = (imageSrc, callback) => {
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => {
    const pieceWidth = img.width / gridSize;
    const pieceHeight = img.height / gridSize;
    const pieces = [];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = pieceWidth;
    canvas.height = pieceHeight;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        ctx.clearRect(0, 0, pieceWidth, pieceHeight);
        ctx.drawImage(img, col * -pieceWidth, row * -pieceHeight, img.width, img.height);
        pieces.push(canvas.toDataURL());
      }
    }
    callback(pieces);
  };
};

const JigsawPuzzle = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [imagePieces, setImagePieces] = useState([]);
  const [trayPieces, setTrayPieces] = useState([]);
  const [gridPieces, setGridPieces] = useState(Array(totalPieces).fill(null));
  const [won, setWon] = useState(false);

  useEffect(() => {
    sliceImage(selectedImage, (pieces) => {
      setImagePieces(pieces);
      setTrayPieces(shuffleArray([...Array(totalPieces).keys()]));
      setGridPieces(Array(totalPieces).fill(null));
      setWon(false);
    });
  }, [selectedImage]);

  const shuffleArray = (array) =>
    array.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

  const handleDrop = (e, index) => {
    e.preventDefault();
    const draggedPiece = parseInt(e.dataTransfer.getData("piece"), 10);
    const isFromTray = e.dataTransfer.getData("fromTray") === "true";
    const newGrid = [...gridPieces];

    if (isFromTray && newGrid[index] === null) {
      setTrayPieces(trayPieces.filter(piece => piece !== draggedPiece));
      newGrid[index] = draggedPiece;
    } else if (!isFromTray) {
      const draggedIndex = newGrid.indexOf(draggedPiece);
      [newGrid[index], newGrid[draggedIndex]] = [newGrid[draggedIndex], newGrid[index]];
    }

    setGridPieces(newGrid);

    if (newGrid.every((piece, idx) => piece === idx)) {
      setWon(true);
    }
  };

  const handleDragStart = (e, index, fromTray) => {
    e.dataTransfer.setData("piece", index);
    e.dataTransfer.setData("fromTray", fromTray);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#F5F5F5] p-6">
      <h1 className="text-4xl font-bold text-[#229799] mb-4">Jigsaw Puzzle</h1>

      {/* Image Selector */}
      <div className="mb-6">
        <label className="text-[#424242] font-semibold">Select Image:</label>
        <select
          className="ml-2 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-[#48CFCB] focus:border-[#48CFCB]"
          onChange={(e) => setSelectedImage(images[parseInt(e.target.value, 10)])}
        >
          {images.map((img, index) => (
            <option key={index} value={index}>{`Image ${index + 1}`}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Full Image Preview */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <img src={selectedImage} alt="Full Preview" className="w-80 h-80 object-cover rounded-lg" />
        </div>

        {/* Puzzle Grid */}
        <div
          className="grid grid-cols-4 grid-rows-4 bg-white rounded-xl shadow-lg"
          style={{ width: '320px', height: '320px' }}
        >
          {gridPieces.map((piece, index) => (
            <div
              key={index}
              className="w-full h-full flex items-center justify-center border"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
            >
              {piece !== null && (
                <img
                  src={imagePieces[piece]}
                  alt={`Piece ${piece}`}
                  className="w-full h-full cursor-grab"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, piece, false)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tray for Pieces */}
      <div className="grid grid-cols-8 gap-2 bg-white p-4 rounded-xl shadow-lg mt-8">
        {trayPieces.map((piece) => (
          <div
            key={piece}
            className="w-16 h-16 cursor-grab"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, piece, true)}
          >
            <img src={imagePieces[piece]} alt={`Piece ${piece}`} className="w-full h-full rounded" />
          </div>
        ))}
      </div>

      {/* Winning Modal */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-10 rounded-2xl shadow-2xl text-center w-96">
              <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 Puzzle Completed!</h2>
              <p className="text-[#424242] mb-4">Awesome! You completed the jigsaw puzzle.</p>
              <motion.button
                className="mt-4 px-6 py-3 bg-[#48CFCB] text-white rounded-lg hover:bg-[#229799] transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sliceImage(selectedImage, (pieces) => {
                    setImagePieces(pieces);
                    setTrayPieces(shuffleArray([...Array(totalPieces).keys()]));
                    setGridPieces(Array(totalPieces).fill(null));
                    setWon(false);
                  });
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

export default JigsawPuzzle;
