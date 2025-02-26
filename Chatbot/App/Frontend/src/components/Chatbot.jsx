import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulated bot response for demo
    setTimeout(() => {
      const botResponse = { sender: "bot", text: "I'm just a demo bot for now!" };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.button
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
        >
          <FaRobot size={24} />
        </motion.button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-[450px] h-[500px] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <span className="font-bold">Chatbot</span>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-3 h-[400px] overflow-y-auto flex flex-col space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-3/4 ${
                  msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex items-center p-3 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-2 rounded-lg ml-2 hover:bg-blue-700"
            >
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
