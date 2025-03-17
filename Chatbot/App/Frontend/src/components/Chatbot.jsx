import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import axios from "axios"; // ADDED: To communicate with Flask backend

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ADDED: Track if bot is "thinking"
  const messagesEndRef = useRef(null); // ADDED: Reference for auto-scrolling

  // ADDED: Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true); // ADDED: Show "thinking" animation

    try {
      // ADDED: Send user message to Flask backend
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
      });

      const botMessage = response.data.response;

      // NEW: CHECK IF RESPONSE CONTAINS REPORTS (JSON PARSING)
      let formattedMessage;
      try {
        const parsedData = JSON.parse(botMessage);
        if (parsedData.reports) {
          formattedMessage = (
            <div>
              <p>📂 <strong>{parsedData.message}</strong></p>
              <ul className="mt-2">
                {parsedData.reports.map((report, index) => (
                  <li key={index} className="mb-2">
                    📅 <strong>{report.date}</strong> -
                    <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                      🔗 View Report
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        } else {
          formattedMessage = botMessage;
        }
      } catch (error) {
        formattedMessage = botMessage;
      }

      // NEW: ADD FORMATTED MESSAGE TO CHAT
      setMessages((prev) => [...prev, { sender: "bot", text: formattedMessage }]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I'm having trouble responding right now." },
      ]);
    } finally {
      setIsLoading(false); // ADDED: Hide "thinking" animation when response arrives
    }
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
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {typeof msg.text === "string" ? (
                  msg.text
                ) : (
                  msg.text  // ✅ RENDER HTML WHEN REPORT JSON IS DETECTED
                )}
              </div>
            ))}

            {/* ADDED: Dots animation while bot is processing */}
            {isLoading && (
              <div className="self-start bg-gray-200 text-gray-800 p-2 rounded-lg">
                <motion.span
                  animate={{ opacity: [1, 1, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  ● ● ●
                </motion.span>
              </div>
            )}

            {/* ADDED: Invisible div to force auto-scroll to bottom */}
            <div ref={messagesEndRef} />
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
