import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ASSET_TYPES, HANDLE_SPACING } from "../components/constants";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge,
} from "react-flow-renderer";
import { getAssetType } from "../components/helper";
import { nanoid } from "nanoid";

// Create the context
export const ReactFlowContext = createContext();

// Create a provider component
export const ReactFlowContextProvider = ({ children }) => {
  // Define the initial state
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

  const getAvailablePosition = useCallback(
    (x, y) => {
      // Function to calculate available position for a new node
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
    },
    [nodes]
  );

  //on dragging node handle the overlap
  const onNodeDragStop = useCallback(
    (event, node) => {
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
      }

      // Update the node's position in the state
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === node.id ? { ...n, position: { x: newX, y: newY } } : n
        )
      );
    },
    [nodes, getAvailablePosition]
  );

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
          console.log(params, "params", edges);
          setEdges((eds) => addEdge(params, eds));
        } else {
          // Data types don't match, prevent the connection
          console.log("Data types do not match. Connection not allowed.");
        }
      }
    },
    [nodes, edges]
  );

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
    [setNodes, getAvailablePosition]
  );

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

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
  }, []);

  const handleInputTrigger = useCallback(
    (nodeId, targetId, isTriggered, strokeColor) => {
      let isConnected = false;
      const updateEdgesWithAnimation = edges.map((edge) => {
        if (targetId === edge.targetHandle) {
          isConnected = true;
          if (isTriggered) {
            return {
              ...edge,
              animated: true,
              style: { stroke: strokeColor, strokeWidth: 1 },
            };
          } else {
            return {
              ...edge,
              animated: false,
              style: { stroke: "", strokeWidth: 1 },
            };
          }
        } else {
          return edge;
        }
      });

      if (isConnected) {
        const updatedNodes = nodes.map((node) => {
          if (node.id === nodeId) {
            const newData = { ...node.data };
            const updatedInputs = newData?.input.map((input) => {
              if (input.id === targetId) {
                return { ...input, isTriggered: isTriggered };
              }
              return input;
            });
            newData.input = updatedInputs;
            return { ...node, data: newData };
          }
          return node;
        });
        setNodes(updatedNodes);
      }

      setEdges(updateEdgesWithAnimation);
    },
    [edges, nodes]
  );

  const handleOutputPublish = useCallback(
    (nodeId, sourceId, isPublished) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeId) {
          const newData = { ...node.data };
          const updatedOutputs = newData?.output.map((output) => {
            if (output.id === sourceId) {
              return { ...output, isPublished: isPublished };
            }
            return output;
          });
          newData.output = updatedOutputs;
          return { ...node, data: newData };
        }
        return node;
      });
      setNodes(updatedNodes);
    },
    [nodes]
  );

  const handleAlarmTrigger = useCallback(
    (nodeId, handleId, isAlarmOn) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeId) {
          const newData = { ...node.data };
          const updatedOutputs = newData?.output.map((output) => {
            if (output.id === handleId) {
              return { ...output, isAlarmOn: isAlarmOn };
            }
            return output;
          });
          newData.output = updatedOutputs;
          return { ...node, data: newData };
        }
        return node;
      });
      setNodes(updatedNodes);
    },
    [nodes]
  );

  const handleCollapseExapnd = useCallback(
    (nodeId, isCollapsed, isObject) => {
      let collapsedNode;
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeId) {
          collapsedNode = {
            ...node,
            data: {
              ...node.data,
              isCollapsed: isCollapsed,
            },
            style: {
              ...node.style,
              height: isCollapsed
                ? "20px"
                : isObject
                ? node?.data?.assetData?.outputs?.length * HANDLE_SPACING +
                  HANDLE_SPACING
                : Math.max(
                    node?.data?.assetData?.inputs?.length + 2,
                    node?.data?.assetData?.outputs?.length
                  ) *
                    HANDLE_SPACING +
                  HANDLE_SPACING,
            },
          };
          return collapsedNode;
        } else {
          return node;
        }
      });

      const updatedEdges = edges.map((edge) => {
        if (isCollapsed) {
          if (nodeId === edge.target) {
            return {
              ...edge,
              data: { ...edge.data, actualTragetId: edge.targetHandle },
              targetHandle: collapsedNode?.data?.tempIdInput,
            };
          } else if (nodeId === edge.source) {
            return {
              ...edge,
              data: { ...edge.data, actualSourceId: edge.sourceHandle },
              sourceHandle: collapsedNode?.data?.tempIdOutput,
            };
          } else {
            return { ...edge, data: edge.data };
          }
        } else {
          if (nodeId === edge.target) {
            return {
              ...edge,
              targetHandle: edge.data.actualTragetId,
              data: edge.data,
            };
          } else if (nodeId === edge.source) {
            return {
              ...edge,
              sourceHandle: edge.data.actualSourceId,
              data: edge.data,
            };
          } else {
            return { ...edge, data: edge.data };
          }
        }
      });
      console.log(edges, "edges", updatedEdges);
      setNodes(updatedNodes);
      setEdges(updatedEdges);
    },
    [nodes, edges]
  );

  //pre-feed the data in react flow graph
  const addAvailableModelData = useCallback(
    (modelData) => {
      console.log("reached here model dat", modelData);

      const updateNodesModelData = modelData?.assetData?.map((asset) => {
        if (getAssetType(asset?.assetType) === ASSET_TYPES?.FUNCTION_TYPE) {
          const functionNodeHeight =
            Math.max(asset?.inputs?.length + 2, asset?.outputs?.length) *
              HANDLE_SPACING +
            HANDLE_SPACING;
          return {
            id: asset?.nodeId,
            type: "customFunctionNode",
            data: {
              assetData: asset,
              tempIdOutput: "DNkgLBvtLfwJPiAsTmecL",
              tempIdInput: "ez09XAeCodVc5JOokUOis",
              label: asset?.assetName,
              isCollapsed: false,
            },
            style: {
              border: "1px solid #000",
              borderRadius: 8,
              padding: 10,
              width: "150px",
              height: functionNodeHeight,
              backgroundColor: "rgba(255, 255, 255)",
            },
            position: {
              x: asset?.position?.x,
              y: asset?.position?.y,
            },
          };
        }
        const objectNodeHeight =
          asset?.outputs?.length * HANDLE_SPACING + HANDLE_SPACING;
        return {
          id: asset?.nodeId,
          type: "customObjectNode",
          data: {
            assetData: asset,
            tempIdOutput: "DNkgLBvtLfwJPiAsTmecL",
            tempIdInput: "ez09XAeCodVc5JOokUOis",
            label: asset?.assetName,
            isCollapsed: false,
          },
          style: {
            border: "1px solid #000",
            borderRadius: 2,
            padding: 10,
            width: "100px",
            height: objectNodeHeight,
            backgroundColor: "rgba(255, 255, 255)",
          },
          position: {
            x: asset?.position?.x,
            y: asset?.position?.y,
          },
        };
      });

      const updateEdgesModelData = modelData?.connectionData?.map(
        (connection) => {
          return {
            // id: `reactflow__edge-${connection?.output?.asset?.nodeId}${connection?.output?.circleData?.id}-${connection?.input?.asset?.nodeId}${connection?.input?.circleData?.id}`,
            source: connection?.output?.asset?.nodeId,
            sourceHandle: connection?.output?.circleData?.id,
            target: connection?.input?.asset?.nodeId,
            targetHandle: connection?.input?.circleData?.id,
            data: {
              connection: connection,
            },
          };
        }
      );
      console.log("reached here edges", updateEdgesModelData);
      setEdges(updateEdgesModelData);
      setNodes(updateNodesModelData);
    },
    [edges, nodes]
  );
  // Provide the context values
  const contextValues = {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeDragStop,
    onConnect,
    addNode,
    onEdgeUpdateStart,
    onEdgeUpdate,
    onEdgeUpdateEnd,
    handleDeleteNode,
    handleCollapseExapnd,
    handleInputTrigger,
    handleAlarmTrigger,
    handleOutputPublish,
    addAvailableModelData,
  };

  return (
    <ReactFlowContext.Provider value={contextValues}>
      {children}
    </ReactFlowContext.Provider>
  );
};
