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

const nodeTypes = {
  customFunctionNode: CustomFunctionNode,
  customObjectNode: CustomObjectNode,
};

const ReactFlowComponent = () => {
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
  );
};

export default ReactFlowComponent;
