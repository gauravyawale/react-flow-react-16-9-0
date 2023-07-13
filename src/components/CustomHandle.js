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

  const handleInputTriggerClick = () => {
    const strokeColor =
      (isReferenced || isActual) && !isTriggered ? "orange" : "blue";
    handleInputTrigger(nodeId, id, !isTriggered, strokeColor);
  };

  return (
    <div className="left-custom-handle" style={{ top: topPos }}>
      <div className="handle-name-left">{inputName}</div>
      <div className="left-handle-container">
        <div
          className="line"
          style={{
            borderTop: `1px solid ${
              isReferenced || isActual ? "orange" : "#888"
            }`,
            top: `${isReferenced || isActual ? "8.2px" : "8px"}`,
          }}
        ></div>
        <div
          className="handle-publish-left"
          onClick={handleInputTriggerClick}
          style={{
            backgroundColor:
              (isReferenced || isActual) && isTriggered
                ? "orange"
                : isTriggered
                ? "blue"
                : "whitesmoke",
            border: `1px solid ${
              isReferenced || isActual
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
          style={{
            backgroundColor: "#fff",
            borderColor: `${isReferenced || isActual ? "orange" : "#888"}`,
          }}
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
            <div
              onClick={() => handleAlarmTrigger(nodeId, id, !isAlarmOn)}
              style={{ cursor: "pointer" }}
            >
              <AlarmActiveIcon />
            </div>
          ) : (
            <div
              onClick={() => handleAlarmTrigger(nodeId, id, !isAlarmOn)}
              style={{ cursor: "pointer" }}
            >
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
          isConnectable={isAlarmOutput ? false : true}
        />
        <div className="right-handle-info">
          {!isAlarmOutput && (
            <span className="right-handle-data-type">{dataType}</span>
          )}
          {/* <span className="handle-value-right">10</span> */}
        </div>
      </div>
    </div>
  );
});

export { LeftCustomHandle, RightCustomHandle };
