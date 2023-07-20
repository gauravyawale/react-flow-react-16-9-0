import React, { useContext, useState } from "react";
import "./CustomNode.css";
import { RightCustomHandle } from "./CustomHandle";
import { calculateHandlePosition } from "./constants";
import { ReactComponent as SettingsIcon } from "../icons/settings.svg";
import { ReactComponent as UpdateIcon } from "../icons/update.svg";
import { ReactComponent as CollapseIcon } from "../icons/collapse.svg";
import { ReactComponent as ExpandIcon } from "../icons/expand.svg";
import { ReactComponent as CrossIcon } from "../icons/cross.svg";
import { Handle } from "react-flow-renderer";
import { ReactFlowContext } from "../context/ReactFlowContextProvider";
import SettingsModal from "./SettingsModal";

const CustomObjectNode = React.memo((props) => {
  const { data, id } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleCollapseExapnd, handleDeleteNode } =
    useContext(ReactFlowContext);
  return (
    <>
      {props.selected && (
        <div
          onClick={() => handleDeleteNode(id)}
          style={{
            position: "absolute",
            right: "-8px",
            top: "-8px",
            cursor: "pointer",
          }}
        >
          <CrossIcon />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: "-8px",
          height: "4px",
          padding: "4px",
        }}
      >
        <div
          style={{
            fontSize: "8px",
          }}
        >
          {data?.label}
        </div>
        {!data?.isCollapsed && (
          <div
            onClick={() => setIsModalOpen(true)} // Set the state to open the modal
            style={{ cursor: "pointer" }}
          >
            <SettingsIcon />
          </div>
        )}
        <div
          onClick={() => handleCollapseExapnd(id, !data?.isCollapsed, true)}
          style={{ cursor: "pointer" }}
        >
          {data?.isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
        </div>
      </div>
      {false && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "6px",
          }}
        >
          <UpdateIcon />
        </div>
      )}
      {/* Output handle */}
      {data?.isCollapsed ? (
        <Handle
          type="source"
          position="right"
          style={{
            backgroundColor: "#fff",
            borderRadius: 50,
            borderColor: "orange",
          }}
          id={data?.tempIdOutput}
          isConnectable={false}
        />
      ) : (
        data?.assetData?.outputs?.map((output, idx) => {
          return (
            <RightCustomHandle
              handle={output}
              key={output.id}
              nodeId={id}
              topPos={calculateHandlePosition(
                idx,
                data?.assetData?.outputs?.length
              )}
              isObject={true}
            />
          );
        })
      )}{" "}
      {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
});

export default CustomObjectNode;
