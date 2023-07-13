import React, { useContext, useState } from "react";
import { Handle } from "react-flow-renderer";
import "./CustomHandle.css";
import { ReactComponent as AlarmActiveIcon } from "../icons/alarmActive.svg";
import { ReactComponent as AlarmInactiveIcon } from "../icons/alarmInactive.svg";
import { ReactFlowContext } from "../context/ReactFlowContextProvider";

const LeftCustomHandle = React.memo(({ handle, topPos, nodeId }) => {
  const {
    inputName,
    initalValue,
    dataType,
    id,
    isTriggered,
    isReferenced,
    isActual,
  } = handle;
  const { handleInputTrigger } = useContext(ReactFlowContext);

  return (
    <div className="left-custom-handle" style={{ top: topPos }}>
      <div className="handle-name-left">{inputName}</div>
      <div className="left-handle-container">
        <div
          className="handle-publish-left"
          onClick={() => handleInputTrigger(nodeId, id, !isTriggered)}
          style={{
            backgroundColor: isTriggered ? "blue" : "whitesmoke",
            border: `1px solid ${isTriggered ? "blue" : "black"}`,
          }}
        ></div>
        <div
          className="left-handle-info"
          style={{
            marginBottom:
              initalValue === undefined || initalValue === false
                ? "8px"
                : "0px",
          }}
        >
          <span className="handle-data-type">{dataType}</span>
          <span className="handle-value-left">{initalValue}</span>
        </div>
        <Handle
          type="target"
          position="left"
          style={{ backgroundColor: "#fff" }}
          id={id}
        />
      </div>
    </div>
  );
});

const RightCustomHandle = React.memo(({ handle, topPos, nodeId }) => {
  const { outputName, dataType, id, isPublished, isAlarmOutput, isAlarmOn } =
    handle;
  const { handleAlarmTrigger, handleOutputPublish } =
    useContext(ReactFlowContext);

  return (
    <div className="right-custom-handle" style={{ top: topPos }}>
      <div className="handle-name-right">
        {isAlarmOutput ? (
          isAlarmOn ? (
            <div onClick={() => handleAlarmTrigger(nodeId, id, !isAlarmOn)}>
              <AlarmActiveIcon />
            </div>
          ) : (
            <div onClick={() => handleAlarmTrigger(nodeId, id, !isAlarmOn)}>
              <AlarmInactiveIcon />
            </div>
          )
        ) : (
          outputName
        )}
      </div>
      <div className="right-handle-container">
        {!isAlarmOutput && (
          <div
            className="handle-publish-right"
            onClick={() => handleOutputPublish(nodeId, id, !isPublished)}
            style={{
              backgroundColor: isPublished ? "blue" : "whitesmoke",
              border: `1px solid ${isPublished ? "blue" : "black"}`,
            }}
          ></div>
        )}
        <Handle
          type="source"
          position="right"
          style={{ backgroundColor: "#fff" }}
          id={id}
        />
        <div className="right-handle-info">
          <span className="right-handle-data-type">{dataType}</span>
          {/* <span className="handle-value-right">10</span> */}
        </div>
      </div>
    </div>
  );
});

export { LeftCustomHandle, RightCustomHandle };
