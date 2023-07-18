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

const CustomFunctionNode = React.memo((props) => {
  const { data, id } = props;
  const { handleCollapseExapnd } = useContext(ReactFlowContext);
  const inputData = [...data?.assetData?.inhibits, ...data?.assetData?.inputs];
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
        inputData?.map((input, idx) => {
          return (
            <LeftCustomHandle
              handle={input}
              key={input.id}
              nodeId={id}
              topPos={calculateHandlePosition(idx, inputData?.length)}
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
        {!data?.isCollapsed && <SettingsIcon />}
        <div
          onClick={() => handleCollapseExapnd(id, !data?.isCollapsed, false)}
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
            />
          );
        })
      )}
    </>
  );
});

export default CustomFunctionNode;
