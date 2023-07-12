import React, { useContext } from "react";
// import { NodeResizer } from "react-flow-renderer";
import "./CustomNode.css";
import { LeftCustomHandle, RightCustomHandle } from "./CustomHandle";
import { calculateHandlePosition } from "./constants";
import { ReactComponent as SettingsIcon } from "../icons/settings.svg";
import { ReactComponent as UpdateIcon } from "../icons/update.svg";
import { ReactComponent as CollapseIcon } from "../icons/collapse.svg";
import { ReactComponent as ExpandIcon } from "../icons/expand.svg";
import { Handle } from "react-flow-renderer";
import { ReactFlowContext } from "../context/ReactFlowContextProvider";

const CustomNode = React.memo((props) => {
  const { data, id } = props;
  const { handleCollapseExapnd } = useContext(ReactFlowContext);
  return (
    <>
      {/* <NodeResizer
        style={controlStyle}
        color="#000"
        isVisible={selected}
        minWidth={100}
        minHeight={
          Math.max(data?.input?.length, data?.output?.length) * HANDLE_SPACING +
          HANDLE_SPACING
        }
      /> */}
      {/* Input handles */}
      {data?.isCollapsed ? (
        <Handle
          type="target"
          position="left"
          style={{
            backgroundColor: "#fff",
            borderRadius: 50,
            borderColor: "orange",
          }}
          id={data?.tempIdInput}
        />
      ) : (
        data?.input.map((input, idx) => {
          return (
            <LeftCustomHandle
              handle={input}
              key={input.id}
              topPos={calculateHandlePosition(idx, data?.input?.length)}
            />
          );
        })
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: "-12px",
        }}
      >
        <div
          style={{
            fontSize: "8px",
          }}
        >
          {data?.label}
        </div>
        <SettingsIcon />
        <div
          onClick={() => handleCollapseExapnd(id, !data?.isCollapsed)}
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
          type="target"
          position="right"
          style={{
            backgroundColor: "#fff",
            borderRadius: 50,
            borderColor: "orange",
          }}
          id={data?.tempIdOutput}
        />
      ) : (
        data?.output.map((output, idx) => {
          return (
            <RightCustomHandle
              handle={output}
              key={output.id}
              nodeId={id}
              topPos={calculateHandlePosition(idx, data?.output?.length)}
            />
          );
        })
      )}
    </>
  );
});

export default CustomNode;
