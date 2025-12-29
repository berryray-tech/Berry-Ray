import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const DebugTheme = () => {
  const context = useContext(ThemeContext);
  
  console.log("ThemeContext value:", context);
  console.log("Is ThemeContext undefined?", context === undefined);
  console.log("Is ThemeContext null?", context === null);
  
  return (
    <div style={{ padding: '10px', background: '#ffcccc', margin: '10px' }}>
      <h3>ThemeContext Debug</h3>
      <p>Context value: {JSON.stringify(context)}</p>
      <p>Is undefined: {context === undefined ? "YES" : "NO"}</p>
      <p>Is null: {context === null ? "YES" : "NO"}</p>
    </div>
  );
};

export default DebugTheme;