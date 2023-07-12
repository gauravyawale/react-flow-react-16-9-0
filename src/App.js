import { useState } from "react";
import LeftSideMenu from "./components/LeftSideMenu";
import Header from "./components/Header";
import ReactFlowComponent from "./components/ReactFlowComponent";
import "react-flow-renderer/dist/style.css";
import "./App.css";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleNodeOutputData = useCallback((nodeId, newData) => {
  //   setNodes((prevNodes) =>
  //     prevNodes.map((node) => {
  //       if (node.id === nodeId) {
  //         return { ...node, data: { ...node.data, output: newData } };
  //       }
  //       return node;
  //     })
  //   );
  // }, []);

  return (
    <div className="main-container">
      <Header />
      <div className="sub-container">
        <div className="left-side-menu-container">
          <LeftSideMenu
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
          />
        </div>
        <div className="flow-container">
          {!isModalOpen && <ReactFlowComponent />}
        </div>
      </div>
    </div>
  );
};

export default App;
