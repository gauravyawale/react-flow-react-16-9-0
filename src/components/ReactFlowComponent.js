import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from "react-flow-renderer";
import CustomFunctionNode from "./CustomFunctionNode";
import CustomObjectNode from "./CustomObjectNode";
import { useContext } from "react";
import { ReactFlowContext } from "../context/ReactFlowContextProvider";
import { useDrop } from "react-dnd";
const nodeTypes = {
  customFunctionNode: CustomFunctionNode,
  customObjectNode: CustomObjectNode,
};

const ReactFlowComponent = () => {
  const { addNode } = useContext(ReactFlowContext);
  const [, drop] = useDrop({
    accept: "functionType",
    canDrop: () => true,
    //on droping the function/object to reactflow, call the add node function which will create the node
    drop(nodeData) {
      addNode(nodeData.node);
    },
  });
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeDragStop,
    onConnect,
    onEdgeUpdateStart,
    onEdgeUpdate,
    onEdgeUpdateEnd,
  } = useContext(ReactFlowContext);
  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onEdgeUpdate={onEdgeUpdate}
        fitView
        attributionPosition="bottom-left"
        onNodeDragStop={onNodeDragStop}
        onEdgeUpdateStart={onEdgeUpdateStart}
        
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={18} size={0.7} />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowComponent;
