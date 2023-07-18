import React, { useContext } from "react";
import "./Header.css";
import modelData from "../data/modelData.json";
import { ReactFlowContext } from "../context/ReactFlowContextProvider";
const Header = ({ name }) => {
  const { addAvailableModelData } = useContext(ReactFlowContext);
  return (
    <div className="header">
      <div className="header-name">Canvas View</div>
      <div className="header-buttons">
        <button
          className="header-button"
          onClick={() => addAvailableModelData(modelData)}
        >
          Use Available Model
        </button>
        <button className="header-button">Action 2</button>
      </div>
    </div>
  );
};

export default Header;
