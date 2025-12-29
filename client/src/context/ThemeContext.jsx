import React, { createContext, useState, useEffect, useContext } from "react";

// Create context with default values
export const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => console.warn("ThemeProvider not found")
});

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem("theme");
    // Check system preference if nothing saved
    if (!saved) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return saved;
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      console.log("Theme toggled to:", newTheme);
      return newTheme;
    });
  };

  // Update document class and localStorage when theme changes
  useEffect(() => {
    console.log("Applying theme:", theme);
    
    // Update document class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Log current theme for debugging
    console.log("Current theme class on html:", document.documentElement.className);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easier usage
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};