import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const themeContext = useContext(ThemeContext);
  
  // Check if context exists
  if (!themeContext) {
    console.warn("ThemeToggle: ThemeContext not found");
    return null;
  }
  
  const { theme, toggleTheme } = themeContext;

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <FaMoon className="icon" />
      ) : (
        <FaSun className="icon" />
      )}
      <span className="sr-only">
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;