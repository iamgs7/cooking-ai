import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ isOn, handleToggle, label }) => {
  return (
    <div className="toggle-switch-container">
      <span className="toggle-label">{label}</span>
      <label className="switch">
        <input type="checkbox" checked={isOn} onChange={handleToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
