import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge,
  BackgroundVariant,
} from "react-flow-renderer";
import "react-flow-renderer/dist/style.css";
import "./App.css";
import LeftSideMenu from "./components/LeftSideMenu";
import Header from "./components/Header";
import CustomNode from "./components/CustomNode";
import { HANDLE_SPACING } from "./components/constants";

const nodeTypes = { customNode: CustomNode };

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const edgeUpdateSuccessful = useRef(true);

  // useEffect(() => {
  //   // Retrieve nodes and edges data from localStorage when component mounts
  //   const nodesData = localStorage.getItem("nodesData");
  //   const edgesData = localStorage.getItem("edgesData");
  //   if (nodesData?.length) setNodes(JSON.parse(nodesData));
  //   if (edgesData?.length) setEdges(JSON.parse(edgesData));
  // }, []);

  // useEffect(() => {
  //   // Store nodes and edges data in localStorage when it changes
  //   if (nodes?.length) localStorage.setItem("nodesData", JSON.stringify(nodes));
  //   if (edges?.length) localStorage.setItem("edgesData", JSON.stringify(edges));
  // }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const getAvailablePosition = (x, y) => {
    const nodeSize = 145; // Adjust this value based on your node size
    const padding = 10; // Adjust this value based on desired padding

    let newX = x;
    let newY = y;

    // Check if the new position overlaps with any existing nodes
    let overlap = false;
    nodes.forEach((node) => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      const width = nodeSize;
      const height =
        node.data?.output?.length * HANDLE_SPACING + HANDLE_SPACING;

      if (
        newX + nodeSize + padding > nodeX &&
        newX < nodeX + width + padding &&
        newY + height + padding > nodeY &&
        newY < nodeY + height + padding
      ) {
        overlap = true;
      }
    });

    // If overlap, find a new position
    while (overlap) {
      newX += nodeSize + padding;

      overlap = false;
      // eslint-disable-next-line no-loop-func
      nodes.forEach((node) => {
        const nodeX = node.position.x;
        const nodeY = node.position.y;
        const width = nodeSize;
        const height =
          node.data?.output?.length * HANDLE_SPACING + HANDLE_SPACING;

        if (
          newX + nodeSize + padding > nodeX &&
          newX < nodeX + width + padding &&
          newY + height + padding > nodeY &&
          newY < nodeY + height + padding
        ) {
          overlap = true;
        }
      });
    }

    return { x: newX, y: newY };
  };

  const addNode = useCallback(
    (newNode, isDumpData) => {
      if (isDumpData) {
        setNodes((prevNodes) => [...newNode]);
      } else {
        const newPosition = getAvailablePosition(
          newNode.position.x,
          newNode.position.y
        );
        newNode.position = newPosition;
        setNodes((prevNodes) => [...prevNodes, newNode]);
      }
    },
    [setNodes, nodes.length]
  );
  //on connecting edges, check the type of egdes, connect only if type is matching
  const onConnect = useCallback(
    (params) => {
      const { source, target, sourceHandle, targetHandle } = params;
      const sourceNodeId = source;
      const targetNodeId = target;

      const sourceNode = nodes.find((node) => node.id === sourceNodeId);
      const targetNode = nodes.find((node) => node.id === targetNodeId);

      if (sourceNode && targetNode) {
        const sourceEdge = sourceNode?.data?.output?.find(
          (edge) => edge.id === sourceHandle
        );
        const targetEdge = targetNode?.data?.input?.find(
          (edge) => edge.id === targetHandle
        );
        const sourceDataType = sourceEdge?.dataType;
        const targetDataType = targetEdge?.dataType;

        if (sourceDataType === targetDataType) {
          // Data types match, allow the connection
          setEdges((eds) =>
            addEdge(
              {
                ...params,
                animated: true,
                style: { stroke: "blue", strokeWidth: 1 },
              },
              eds
            )
          );
        } else {
          // Data types don't match, prevent the connection
          console.log("Data types do not match. Connection not allowed.");
        }
      }
    },
    [nodes, edges]
  );

  //update the edges
  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      const sourceNode = nodes.find((node) => node.id === newConnection.source);
      const targetNode = nodes.find((node) => node.id === newConnection.target);

      if (sourceNode && targetNode) {
        const sourceEdge = sourceNode.data?.output?.find(
          (edge) => edge.id === newConnection.sourceHandle
        );
        const targetEdge = targetNode.data?.input?.find(
          (edge) => edge.id === newConnection.targetHandle
        );
        const sourceDataType = sourceEdge?.dataType;
        const targetDataType = targetEdge?.dataType;

        if (sourceDataType === targetDataType) {
          // Data types match, update the edge
          setEdges((eds) => updateEdge(oldEdge, newConnection, eds));
          edgeUpdateSuccessful.current = true;
        } else {
          // Data types don't match, prevent the edge update
          console.log("Data types do not match. Edge update not allowed.");
          edgeUpdateSuccessful.current = false;
        }
      }
    },
    [nodes]
  );

  const onEdgeUpdateEnd = useCallback((oldEdge, newEdge) => {
    if (!edgeUpdateSuccessful.current) {
      // Data types don't match, remove the updated edge
      setEdges((eds) => eds.filter((edge) => edge.id !== newEdge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  //avoid overlap on node movement
  const onNodeDragStop = (event, node) => {
    const { x, y } = node.position;
    const nodeSize = 145; // Adjust this value based on your node size
    const padding = 10; // Adjust this value based on desired padding

    let newX = x;
    let newY = y;

    // Check if the dragged node overlaps with any other nodes
    let overlap = false;
    nodes.forEach((otherNode) => {
      if (otherNode.id !== node.id) {
        const nodeX = otherNode.position.x;
        const nodeY = otherNode.position.y;
        const width = nodeSize;
        const height =
          otherNode.data?.output?.length * HANDLE_SPACING + HANDLE_SPACING;

        if (
          newX + nodeSize + padding > nodeX &&
          newX < nodeX + width + padding &&
          newY + height + padding > nodeY &&
          newY < nodeY + height + padding
        ) {
          overlap = true;
        }
      }
    });

    // If overlap, find a new position for the node
    if (overlap) {
      const availablePosition = getAvailablePosition(x, y);
      newX = availablePosition.x;
      newY = availablePosition.y;

      // Update the node's position in the state
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === node.id ? { ...n, position: { x: newX, y: newY } } : n
        )
      );
    }
  };

  const handleDeleteNode = (nodeId) => {
    const filteredNodes = nodes.filter((node) => node.id !== nodeId);
    setNodes(filteredNodes);
  };

  return (
    <div className="main-container">
      <Header />
      <div className="sub-container">
        <div className="left-side-menu-container">
          <LeftSideMenu
            addNode={addNode}
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            handleDeleteNode={handleDeleteNode}
          />
        </div>
        <div className="flow-container">
          {!isModalOpen && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              // onConnect={onConnect}
              nodeTypes={nodeTypes}
              // edgeTypes={edgeTypes}
              onEdgeUpdateEnd={onEdgeUpdateEnd}
              onEdgeUpdate={onEdgeUpdate}
              fitView
              attributionPosition="bottom-left"
              onConnect={onConnect}
              onNodeDragStop={onNodeDragStop}
              onEdgeUpdateStart={onEdgeUpdateStart}
            >
              <Controls />
              <MiniMap />
              <Background
                variant={BackgroundVariant.Dots}
                gap={18}
                size={0.7}
              />
            </ReactFlow>
          )}
          {/* <button onClick={addNode}>Add Node</button> */}
        </div>
      </div>
    </div>
  );
};

export default App;
