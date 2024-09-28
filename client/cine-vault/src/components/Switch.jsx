// Switch.jsx
import React from "react";
import "./Switch.css";

const Switch = ({ isToggled, onToggled }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={isToggled} onChange={onToggled} />
      <span className="slider" />
    </label>
  );
};

export default Switch;
