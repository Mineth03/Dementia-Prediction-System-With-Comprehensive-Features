import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const login = async (email_or_username, password) => {
    try {
      console.log("DEBUG: Sending login request with:", { email_or_username, password });

      if (!email_or_username || !password) {
        console.error("DEBUG: Email/Username or password is missing in login request");
        return;
      }

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_or_username, password }), // Send correct field name
      });

      const data = await response.json();
      console.log("DEBUG: Received response:", data);

      if (response.ok) {
        setUser(data.user); // Correctly store user object
        setToken(data.token); // Store token
      } else {
        console.error("Login failed:", data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const sendToBot = async (message) => {
    // Instead of using useAuth() here, just access the user state directly
    await fetch("http://localhost:5005/webhooks/rest/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: user?.username,  // Access user state directly
        message: message
      })
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, sendToBot }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
