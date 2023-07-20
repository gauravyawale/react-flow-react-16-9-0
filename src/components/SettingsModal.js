import React from "react";

const SettingsModal = ({ onClose }) => {
  // Your modal content and logic here

  return (
    <div
      style={{
        position: "absolute",
        top: "20%",
        left: "10%",
        width: "80%",
        height: "80%",
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "16px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "12px",
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: "absolute",
            top: "-12px", // Adjust the distance from the top as needed
            left: "58%", // Centered horizontally
            width: 0,
            height: 0,
            borderTop: "none",
            borderRight: "8px solid transparent",
            borderLeft: "8px solid transparent",
            borderBottom: "16px solid #fff", // Color to match the background of the modal container
          }}
        ></div>
        Close Settings
      </div>
    </div>
  );
};

export default SettingsModal;
