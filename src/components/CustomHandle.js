import React, { useContext, useState } from "react";
import { Handle } from "react-flow-renderer";
import "./CustomHandle.css";
import { ReactComponent as AlarmActiveIcon } from "../icons/alarmActive.svg";
import { ReactComponent as AlarmInactiveIcon } from "../icons/alarmInactive.svg";
import { ReactFlowContext } from "../context/ReactFlowContextProvider";
import { INHIBITS, getDataType } from "./constants";

const LeftCustomHandle = React.memo(({ handle, topPos, nodeId }) => {
  const { name, defaultValue, dataType, id, isTriggered } = handle;
  const { handleInputTrigger } = useContext(ReactFlowContext);

  const handleInputTriggerClick = () => {
    const strokeColor =
      (name === INHIBITS?.ACTUAL_VALUE || name === INHIBITS?.REFERENCE_VALUE) &&
      !isTriggered
        ? "orange"
        : "blue";
    handleInputTrigger(nodeId, id, !isTriggered, strokeColor);
  };

  return (
    <div className="left-custom-handle" style={{ top: topPos }}>
      <div className="handle-name-left">{name}</div>
      <div className="left-handle-container">
        <div
          className="line"
          style={{
            borderTop: `1px solid ${
              name === INHIBITS?.ACTUAL_VALUE ||
              name === INHIBITS?.REFERENCE_VALUE
                ? "orange"
                : "#888"
            }`,
            top: `${
              name === INHIBITS?.ACTUAL_VALUE ||
              name === INHIBITS?.REFERENCE_VALUE
                ? "8.2px"
                : "8px"
            }`,
          }}
        ></div>
        <div
          className="handle-publish-left"
          onClick={handleInputTriggerClick}
          style={{
            backgroundColor:
              (name === INHIBITS?.ACTUAL_VALUE ||
                name === INHIBITS?.REFERENCE_VALUE) &&
              isTriggered
                ? "orange"
                : isTriggered
                ? "blue"
                : "whitesmoke",
            border: `1px solid ${
              name === INHIBITS?.ACTUAL_VALUE ||
              name === INHIBITS?.REFERENCE_VALUE
                ? "orange"
                : isTriggered
                ? "blue"
                : "black"
            }`,
          }}
        ></div>
        <div
          className="left-handle-info"
          style={{
            marginBottom:
              defaultValue === undefined || defaultValue === false
                ? "8px"
                : "0px",
          }}
        >
          <span className="handle-data-type">{getDataType(dataType)}</span>
          <span className="handle-value-left">{defaultValue}</span>
        </div>
        <Handle
          type="target"
          position="left"
          style={{
            backgroundColor: "#fff",
            borderColor: `${
              name === INHIBITS?.ACTUAL_VALUE ||
              name === INHIBITS?.REFERENCE_VALUE
                ? "orange"
                : "#888"
            }`,
          }}
          id={id}
        />
      </div>
    </div>
  );
});

const RightCustomHandle = React.memo(({ handle, topPos, nodeId }) => {
  const { name, dataType, id, isPublished, isAlarmOutput } = handle;
  const { handleAlarmTrigger, handleOutputPublish } =
    useContext(ReactFlowContext);

  return (
    <div className="right-custom-handle" style={{ top: topPos }}>
      <div className="handle-name-right">
        {isAlarmOutput ? (
          isPublished ? (
            <div
              onClick={() => handleAlarmTrigger(nodeId, id, !isPublished)}
              style={{ cursor: "pointer" }}
            >
              <AlarmActiveIcon />
            </div>
          ) : (
            <div
              onClick={() => handleAlarmTrigger(nodeId, id, !isPublished)}
              style={{ cursor: "pointer" }}
            >
              <AlarmInactiveIcon />
            </div>
          )
        ) : (
          name
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
          isConnectable={isAlarmOutput ? false : true}
        />
        <div className="right-handle-info">
          {!isAlarmOutput && (
            <span className="right-handle-data-type">
              {getDataType(dataType)}
            </span>
          )}
          {/* <span className="handle-value-right">10</span> */}
        </div>
      </div>
    </div>
  );
});

export { LeftCustomHandle, RightCustomHandle };
