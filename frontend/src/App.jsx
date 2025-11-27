import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import MedicineApp from "./MedicineApp";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showSignup, setShowSignup] = useState(false);
  useEffect(() => {
    // Force dark theme globally (adds Tailwind 'dark' class to <html>)
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  if (loggedIn) {
    return <MedicineApp onLogout={() => setLoggedIn(false)} />;
  }

  return showSignup ? (
    <Signup onSignup={() => setShowSignup(false)} />
  ) : (
    <Login
      onLogin={() => setLoggedIn(true)}
      onShowSignup={() => setShowSignup(true)}
    />
  );
}

export default App;
