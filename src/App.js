import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Rules from "./pages/Rules";
import Bank from "./pages/Bank";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import "./style.css";
import logo from "./Logo.png";
import Footer from "./pages/Footer";  


function App() {
  return (
    <Router>
      <div className="container min-h-screen flex flex-col">
        <nav className="navbar">
        <img src={logo} alt="Monopoly Logo" className="logo-img" />
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rules">Rules</Link></li>
            <li><Link to="/bank">Game Dashboard</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
          </ul>
        </nav>
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/bank" element={<Bank />} />
            <Route path="/about" element={<About />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
