import React, { createContext, useCallback, useRef, useState } from "react";
import { ASSET_TYPES, HANDLE_SPACING } from "../components/constants";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge,
} from "react-flow-renderer";
import { getAssetType, isValidConnection } from "../components/helper";

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
    (changes) => {
      console.log("On Nodes Change");
      return setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => {
      console.log("On Edges Change");
      return setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  //get available nodes positions
  const getAvailablePosition = useCallback(
    (x, y) => {
      console.log("Get Available Position: ", "x-", x, ", y-", y);
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

  //once the node dragging stops handle the overlap
  const onNodeDragStop = useCallback(
    (event, node) => {
      console.log("On Node Dragging Stopped", event);
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

  //on connecting the output and input, handle a connect by checking data type
  const onConnect = useCallback(
    (params) => {
      console.log("On Connecting the edges/input/output pair");

      const { source, target, sourceHandle, targetHandle } = params;
      const sourceNodeId = source;
      const targetNodeId = target;

      const sourceNode = nodes.find((node) => node.id === sourceNodeId);
      const targetNode = nodes.find((node) => node.id === targetNodeId);

      if (sourceNode && targetNode) {
        const sourceEdge = sourceNode?.data?.assetData?.outputs?.find(
          (edge) => edge.id === sourceHandle
        );
        const targetEdge = targetNode?.data?.assetData?.inputs?.find(
          (edge) => edge.id === targetHandle
        );
        const sourceDataType = sourceEdge?.dataType;
        const targetDataType = targetEdge?.dataType;

        if (isValidConnection(sourceDataType, targetDataType)) {
          // Data types match, allow the connection
          setEdges((eds) =>
            addEdge(
              {
                ...params,
                data: {
                  actualTargetId: params.targetHandle,
                  actualSourceId: params.sourceHandle,
                },
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

  //handle adding nodes to react flow components on dragging or selecting
  const addNode = useCallback(
    (newNode, isDumpData) => {
      console.log("on adding node to the flow component");
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

  // handle edge update when we select conencted edge and drag it out
  const onEdgeUpdateStart = useCallback(() => {
    console.log("on selecting the edge to update the connection status");
    edgeUpdateSuccessful.current = false;
  }, []);

  //handle the dragged edge update when it gets connected to another input
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      console.log("on updating the edge connection status");

      const sourceNode = nodes.find((node) => node.id === newConnection.source);
      const targetNode = nodes.find((node) => node.id === newConnection.target);

      if (sourceNode && targetNode) {
        const sourceEdge = sourceNode.data?.assetData?.outputs?.find(
          (edge) => edge.id === newConnection.sourceHandle
        );
        const targetEdge = targetNode.data?.assetData?.inputs?.find(
          (edge) => edge.id === newConnection.targetHandle
        );
        const sourceDataType = sourceEdge?.dataType;
        const targetDataType = targetEdge?.dataType;

        if (isValidConnection(sourceDataType, targetDataType)) {
          if (oldEdge.targetHandle !== newConnection.targetHandle) {
            const updatedNodes = getNodeTriggerUpdate(oldEdge);
            if (updatedNodes?.isinputTriggred) {
              setNodes(updatedNodes.nodes);
            }
            setEdges((eds) =>
              updateEdge(
                {
                  ...oldEdge,
                  style: {
                    stroke: "",
                    strokeWidth: 1,
                  },
                  animated: false,
                },
                {
                  ...newConnection,
                  style: {
                    stroke: "",
                    strokeWidth: 1,
                  },
                  animated: false,
                  data: {
                    actualTargetId: newConnection.targetHandle,
                    actualSourceId: newConnection.sourceHandle,
                  },
                },
                eds
              )
            );
          }
          // Data types match, update the edge

          edgeUpdateSuccessful.current = true;
        } else {
          //if the old input is triggered then update the input

          const updatedNodes = getNodeTriggerUpdate(nodes, oldEdge);
          if (updatedNodes?.isinputTriggred) {
            setNodes(updatedNodes.nodes);
          }
          // Data types don't match, prevent the edge update
          console.log("Data types do not match. Edge update not allowed.");
          edgeUpdateSuccessful.current = false;
        }
      }
    },
    [nodes]
  );
  //check if the node input is triggered, if it is then un trigger it

  const getNodeTriggerUpdate = (oldEdge) => {
    console.log("while updating the edge, check the trigger status");
    let isinputTriggred = false;
    const checkTriggerNode = nodes.map((node) => {
      if (node.id === oldEdge.target) {
        const newData = { ...node.data };
        const updatedInputs = newData?.assetData?.inputs?.map((input) => {
          if (input.id === oldEdge.targetHandle && input.isTriggered) {
            isinputTriggred = true;
            return { ...input, isTriggered: false };
          }
          return input;
        });
        newData.assetData.inputs = updatedInputs;
        return { ...node, data: newData };
      }
      return node;
    });

    return {
      nodes: checkTriggerNode,
      isinputTriggred,
    };
  };

  // handle the case once edge is dropped
  const onEdgeUpdateEnd = useCallback(
    (oldEdge, newEdge) => {
      console.log("on dropping the edges connection");
      if (!edgeUpdateSuccessful.current) {
        // Data types don't match, remove the updated edge
        const updateNodeTrigger = getNodeTriggerUpdate(newEdge);
        setNodes(updateNodeTrigger.nodes);
        setEdges((eds) => eds.filter((edge) => edge.id !== newEdge.id));
      }

      edgeUpdateSuccessful.current = true;
    },
    [nodes, edges]
  );

  // handle deleting the node
  const handleDeleteNode = useCallback((nodeId) => {
    console.log("on deleting the node from flow component", nodeId);
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
  }, []);

  // handle input triggering
  const handleInputTrigger = useCallback(
    (nodeId, targetId, isTriggered, strokeColor) => {
      console.log("on triggering the input trigger", isTriggered);
      let isConnected = false;
      const updateEdgesWithAnimation = edges.map((edge) => {
        if (targetId === edge.targetHandle) {
          isConnected = true;
          return {
            ...edge,
            animated: isTriggered ? true : false,
            style: { stroke: isTriggered ? strokeColor : "", strokeWidth: 1 },
          };
        } else {
          return edge;
        }
      });

      if (isConnected) {
        const updatedNodes = nodes.map((node) => {
          if (node.id === nodeId) {
            const newData = { ...node.data };
            const updatedInputs = newData?.assetData?.inputs?.map((input) => {
              if (input.id === targetId) {
                return { ...input, isTriggered: isTriggered };
              }
              return input;
            });
            newData.assetData.inputs = updatedInputs;
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

  // handle output publishing
  const handleOutputPublish = useCallback(
    (nodeId, sourceId, isPublished) => {
      console.log("on publishing the the output", isPublished);
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeId) {
          const newData = { ...node.data };
          const updatedOutputs = newData?.assetData?.outputs.map((output) => {
            if (output.id === sourceId) {
              return { ...output, isPublished: isPublished };
            }
            return output;
          });
          newData.assetData.outputs = updatedOutputs;
          return { ...node, data: newData };
        }
        return node;
      });
      setNodes(updatedNodes);
    },
    [nodes]
  );

  // handle alarm output publish
  const handleAlarmTrigger = useCallback(
    (nodeId, handleId, isAlarmOn) => {
      console.log("on publishing the the alarm output", isAlarmOn);
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeId) {
          const newData = { ...node.data };
          const updatedOutputs = newData?.assetData?.outputs?.map((output) => {
            if (output.id === handleId) {
              return { ...output, isPublished: isAlarmOn };
            }
            return output;
          });
          newData.assetData.outputs = updatedOutputs;
          return { ...node, data: newData };
        }
        return node;
      });
      setNodes(updatedNodes);
    },
    [nodes]
  );

  //handle the node collapsing and exapnding

  const handleCollapseExapnd = useCallback(
    (nodeId, isCollapsed, isObject) => {
      console.log(
        "handle collapse and expand functionality: isCollapsed-",
        isCollapsed
      );
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
              targetHandle: collapsedNode?.data?.tempIdInput,
            };
          } else if (nodeId === edge.source) {
            return {
              ...edge,
              sourceHandle: collapsedNode?.data?.tempIdOutput,
            };
          } else {
            return edge;
          }
        } else {
          if (nodeId === edge.target) {
            return {
              ...edge,
              targetHandle: edge.data.actualTargetId,
            };
          } else if (nodeId === edge.source) {
            return {
              ...edge,
              sourceHandle: edge.data.actualSourceId,
            };
          } else {
            return edge;
          }
        }
      });
      setNodes(updatedNodes);
      setEdges(updatedEdges);
    },
    [nodes, edges]
  );

  //pre-feed the data in react flow component
  const addAvailableModelData = useCallback(
    (modelData) => {
      console.log(
        "on adding the existing model to the flow component",
        modelData
      );
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
              isTriggered: false,
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
              actualTargetId: connection?.input?.circleData?.id,
              actualSourceId: connection?.output?.circleData?.id,
            },
          };
        }
      );
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
