import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import axios from "axios"; // ADDED: To communicate with Flask backend
import { useAuth } from "../context/AuthContext";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ADDED: Track if bot is "thinking"
  const messagesEndRef = useRef(null); // ADDED: Reference for auto-scrolling
  const { user } = useAuth();

  // ADDED: Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  try {
    const response = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
      sender: user?.username || "guest",  // ✅ ensure real username is sent
      message: input,
    });

    console.log("BOT RESPONSE:", response.data); // <-- inspect structure

    // response.data is usually an array like: [{ text: "..."}]
    const rasaReply = response.data?.[0]?.text || "Sorry, I didn’t get that.";

    // Try parsing JSON from custom actions
    let formattedMessage;
    try {
      const parsedData = JSON.parse(rasaReply);
      if (parsedData.reports) {
        formattedMessage = (
          <div>
            <p>📂 <strong>{parsedData.message}</strong></p>
            <ul className="mt-2">
              {parsedData.reports.map((report, index) => (
                <li key={index} className="mb-2">
                  📅 <strong>{new Date(report.date).toLocaleString()}</strong> - 
                  <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-[#229799] hover:underline ml-2">
                    🔗 View Report
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      } else {
        formattedMessage = rasaReply;
      }
    } catch (error) {
      formattedMessage = rasaReply;
    }

    setMessages((prev) => [...prev, { sender: "bot", text: formattedMessage }]);
  } catch (error) {
    console.error("Chatbot error:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Sorry, I'm having trouble responding right now." },
    ]);
  } finally {
    setIsLoading(false);
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
          className="bg-[#229799] text-white p-4 rounded-full shadow-lg hover:bg-[#424242] focus:outline-none"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
        >
          <FaRobot size={30} />
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
          <div className="bg-[#424242] text-white p-3 flex justify-between items-center">
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
                    ? "bg-[#229799] text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {typeof msg.text === "string" ? (
                  msg.text
                ) : (
                  msg.text  
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
              className="bg-[#229799] text-white p-2 rounded-lg ml-2 hover:bg-[#48CFCB]"
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
