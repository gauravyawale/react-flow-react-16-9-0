import { nanoid } from "nanoid";
import {
  HANDLE_SPACING,
  IN_CONNECT_VALUES,
  getRandomDataType,
} from "./constants";

export const createNodes = () => {
  const nodes = [];

  for (let i = 0; i < 10; i++) {
    const connectionData = getRandomDataType();
    const inputs = [];
    const outputs = [];

    for (let j = 0; j < 100; j++) {
      const input = {
        id: nanoid(),
        type: "target",
        position: "left",
        dataType: connectionData.type,
        initialValue: connectionData.value,
        isTriggered: false,
        isReferenced: j < 2,
        isActual: j < 2,
        inputName:
          j === 0
            ? IN_CONNECT_VALUES.REFERENCE_VALUE
            : j === 1
            ? IN_CONNECT_VALUES.ACTUAL_VALUE
            : connectionData.type,
      };
      inputs.push(input);

      const output = {
        id: nanoid(),
        type: "source",
        position: "right",
        dataType: connectionData.type,
        isPublished: false,
        isAlarmOutput: false,
        isAlarmOn: false,
        outputName: connectionData.type,
      };
      outputs.push(output);
    }

    let overlap = true;
    let newX;
    let newY;
    const nodeSize = 150; // Adjust this value based on your node size
    const padding = 20; // Adjust this value based on desired padding

    while (overlap) {
      newX = Math.floor(Math.random() * 1000); // Adjust the range as needed
      newY = Math.floor(Math.random() * 1000); // Adjust the range as needed

      overlap = nodes.some((node) => {
        const nodeX = node.position.x;
        const nodeY = node.position.y;

        if (
          newX + nodeSize + padding > nodeX &&
          newX < nodeX + nodeSize + padding &&
          newY + nodeSize + padding > nodeY &&
          newY < nodeY + nodeSize + padding
        ) {
          return true;
        }
        return false;
      });
    }

    const newNode = {
      id: nanoid(),
      type: "customNode",
      data: {
        input: inputs,
        output: outputs,
        label: `function ${i + 1}`,
        isCollapsed: false,
        collapsedData: null,
      },
      style: {
        border: "1px solid #000",
        borderRadius: 8,
        padding: 10,
        width: "100px",
        height: 100 * HANDLE_SPACING + HANDLE_SPACING,
        backgroundColor: "rgba(255, 255, 255)",
      },
      position: { x: newX, y: newY },
    };

    nodes.push(newNode);
  }

  return nodes;
};
