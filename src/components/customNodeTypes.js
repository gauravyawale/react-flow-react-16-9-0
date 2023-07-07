import { nanoid } from "nanoid";

export const customNodeTypes = [
  {
    type: "customNode1",
    inputs: [{ id: nanoid(), type: "target" }],
    outputs: [{ id: nanoid(), type: "source" }],
  },
  {
    type: "customNode2",
    inputs: [
      { id: nanoid(), type: "target" },
      { id: nanoid(), type: "target" },
    ],
    outputs: [{ id: nanoid(), type: "source" }],
  },
  // Add more custom node types as needed
];
