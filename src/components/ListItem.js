import React from "react";
import { useDrag } from "react-dnd";

const ListItem = ({ node, index, handleAddNode, handleListItemDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: "functionType", id: index, originalId: node.id, node: node },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 20,
        fontWeight: "bold",
        cursor: "move",
      }}
    >
      <li>
        <span onClick={() => handleAddNode(node, false)}>
          Function {index + 1}
        </span>
      </li>
    </div>
  );
};

export default ListItem;
