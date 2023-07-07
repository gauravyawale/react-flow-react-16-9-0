import React from "react";
import "./Header.css";

const Header = ({ name }) => {
  return (
    <div className="header">
      <div className="header-name">Canvas View</div>
      <div className="header-buttons">
        <button className="header-button">Action 1</button>
        <button className="header-button">Action 2</button>
      </div>
    </div>
  );
};

export default Header;
