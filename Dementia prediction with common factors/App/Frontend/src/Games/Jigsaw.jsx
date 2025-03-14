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

  const shuffleArray = (array) => {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const draggedPiece = parseInt(e.dataTransfer.getData("piece"), 10);
    const isFromTray = e.dataTransfer.getData("fromTray") === "true";

    let newGrid = [...gridPieces];

    if (isFromTray) {
      if (newGrid[index] === null) {
        setTrayPieces(trayPieces.filter(piece => piece !== draggedPiece));
        newGrid[index] = draggedPiece;
      }
    } else {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-6">Jigsaw Puzzle</h1>

      <div className="mb-4">
        <label className="text-white font-bold">Select Image: </label>
        <select
          className="ml-2 p-2 rounded"
          onChange={(e) => setSelectedImage(images[parseInt(e.target.value, 10)])}
        >
          {images.map((img, index) => (
            <option key={index} value={index}>{`Image ${index + 1}`}</option>
          ))}
        </select>
      </div>

      <div className="flex space-x-8 items-start">
        {/* Full Image Preview */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <img src={selectedImage} alt="Full Preview" className="w-80 h-80 object-cover rounded" />
        </div>

        {/* Puzzle Grid */}
        <div
          className="grid grid-cols-4 grid-rows-4 bg-white rounded-lg shadow-lg"
          style={{ width: '320px', height: '320px' }}
        >
          {gridPieces.map((piece, index) => (
            <div
              key={index}
              className="w-full h-full flex items-center justify-center border"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
              style={{ padding: 0, margin: 0 }}
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
      <div className="grid grid-cols-8 gap-2 bg-white p-4 rounded-lg shadow-lg mt-6">
        {trayPieces.map((piece) => (
          <div
            key={piece}
            className="w-16 h-16 cursor-grab"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, piece, true)}
          >
            <img src={imagePieces[piece]} alt={`Piece ${piece}`} className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JigsawPuzzle;