import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  // Get theme context safely
  const themeContext = useContext(ThemeContext);
  
  // Provide defaults if context is not available
  const theme = themeContext?.theme || "dark";
  const toggleTheme = themeContext?.toggleTheme || (() => {
    console.log("Theme toggle clicked, but no ThemeProvider found");
  });
  
  const [open, setOpen] = useState(false);

  // Handle logo image - use public folder for images
  const logoPath = "/LOGO 2.png"; // Image should be in public folder

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="brand">
          <img 
            src={logoPath} 
            alt="BerryRay Technologies Logo" 
            className="logo"
            onError={(e) => {
              e.target.style.display = 'none';
              console.log("Logo not found at:", logoPath);
            }}
          />
          <span className="brand-text">BerryRay Technologies</span>
        </Link>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/services" onClick={() => setOpen(false)}>Services</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link to="/admin/login" onClick={() => setOpen(false)} className="admin-link">
            Admin
          </Link>
        </div>

        <div className="nav-actions">
          <button 
            className="theme-btn" 
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>

          <button 
            className="menu-btn" 
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;