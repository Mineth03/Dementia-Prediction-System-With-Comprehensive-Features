import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBrain } from "react-icons/fa";

const Header = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning!");
    } else if (hour < 18) {
      setGreeting("Good afternoon!");
    } else {
      setGreeting("Good evening!");
    }
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 text-center shadow-md flex items-center justify-between px-8"
    >
      {/* Logo & App Name */}
      <div className="flex items-center space-x-3">
        <FaBrain className="text-3xl text-white" />
        <h1 className="text-2xl font-bold tracking-wide">SafeMind</h1>
      </div>

      {/* Greeting */}
      <p className="text-lg font-medium">{greeting}</p>
    </motion.header>
  );
};

export default Header;
