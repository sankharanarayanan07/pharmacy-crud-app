import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import MedicineApp from "./MedicineApp";
import Home from "./Home";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showSignup, setShowSignup] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentPage("home");
  };

  if (!loggedIn) {
    return showSignup ? (
      <Signup onSignup={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={() => setLoggedIn(true)}
        onShowSignup={() => setShowSignup(true)}
      />
    );
  }

  return currentPage === "home" ? (
    <Home onNavigate={setCurrentPage} onLogout={handleLogout} />
  ) : (
    <MedicineApp onLogout={handleLogout} onNavigate={setCurrentPage} />
  );
}

export default App;
