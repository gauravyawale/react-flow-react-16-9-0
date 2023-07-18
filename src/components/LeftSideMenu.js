import React, { useContext, useEffect, useState } from "react";
import "./LeftSideMenu.css";
import { nanoid } from "nanoid";
import { HANDLE_SPACING, INHIBITS, getRandomDataType } from "./constants";
import { createNodes } from "./dumpNodes";
import { ReactFlowContext } from "../context/ReactFlowContextProvider";

const LeftSideMenu = React.memo(({ setIsModalOpen, isModalOpen }) => {
  const [inputCount, setInputCount] = useState(2);
  const [outputCount, setOutputCount] = useState(2);
  const [list, setList] = useState([]);
  const { handleDeleteNode, addNode } = useContext(ReactFlowContext);

  useEffect(() => {
    // Retrieve functionsList from localStorage when component mounts
    const functionsList = localStorage.getItem("functionsList");
    if (functionsList?.length) setList(JSON.parse(functionsList));
  }, []);

  useEffect(() => {
    // Store nodes and edges data in localStorage when it changes
    if (list.length)
      localStorage.setItem("functionsList", JSON.stringify(list));
  }, [list]);

  const handleListItemDelete = (nodeId) => {
    const filteredListItem = list.filter((node) => node.id !== nodeId);
    setList(filteredListItem);
    handleDeleteNode(nodeId);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveModal = () => {
    const customInputs = [];
    const customOutputs = [];

    for (let i = 0; i < inputCount; i++) {
      const randomDataType = getRandomDataType();
      customInputs.push({
        name: `Input${i}`,
        id: nanoid(),
        path: "",
        dataType: randomDataType,
        connected: false,
        defaultValue: undefined,
        isTriggered: false,
        mappingDetails: [],
      });
    }

    for (let i = 0; i < outputCount; i++) {
      const randomDataType = getRandomDataType();
      customOutputs.push({
        isAlarmOutput: i === 0 ? true : false,
        name: `Calculation${i}`,
        id: nanoid(),
        path: "",
        dataType: randomDataType,
        connected: false,
        isPublished: false,
      });
    }
    const newNode = {
      id: nanoid(),
      type: "customNode",

      data: {
        assetData: {
          inputs: customInputs,
          outputs: customOutputs,
          inhibits: [
            {
              name: "referenceValue",
              id: nanoid(),
              path: "",
              dataType: "boolean",
              connected: false,
              mappingDetails: [],
            },
            {
              name: "actualValue",
              id: nanoid(),
              path: "",
              dataType: "boolean",
              connected: false,
              mappingDetails: [],
            },
          ],
        },
        tempIdOutput: nanoid(),
        tempIdInput: nanoid(),
        label: "function " + (list.length + 1),
        isCollapsed: false,
      },
      style: {
        border: "1px solid #000",
        borderRadius: 8,
        padding: 10,
        width: "100px",
        height:
          Math.max(outputCount, inputCount + 2) * HANDLE_SPACING +
          HANDLE_SPACING,
        backgroundColor: "rgba(255, 255, 255)",
      },
      position: { x: 300, y: 50 },
    };
    setList([...list, newNode]);
    setInputCount(2);
    setOutputCount(2);
    handleCloseModal();
  };

  const handleAddNode = (node, isDump) => {
    addNode(node, isDump);
  };

  const handleDumpNodes = () => {
    const nodesData = createNodes();
    setList([...list, ...nodesData]);
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Create Function</button>
      <button onClick={handleDumpNodes}>Dump</button>
      <button onClick={() => handleAddNode(list, true)}>Add</button>
      <ul>
        {list.map((node, index) => (
          <li key={index}>
            <div>
              <span onClick={() => handleAddNode(node, false)}>
                Function {index + 1}
              </span>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => handleListItemDelete(node.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter number of inputs and outputs</h3>
            <label>
              Inputs:
              <input
                type="number"
                value={inputCount}
                onChange={(e) => setInputCount(parseInt(e.target.value))}
              />
            </label>
            <label>
              Outputs:
              <input
                type="number"
                value={outputCount}
                onChange={(e) => setOutputCount(parseInt(e.target.value))}
              />
            </label>
            <button onClick={handleSaveModal}>Save</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default LeftSideMenu;
