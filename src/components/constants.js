export const HANDLE_SPACING = 20;

export const getRandomDataType = () => {
  const dataTypes = [
    "integer",
    "boolean",
    "string",
    "number",
    "array_integer",
    "array_string",
    "array_boolean",
    "array_number",
  ];
  const randomIndex = Math.floor(Math.random() * dataTypes.length);

  return dataTypes[randomIndex];
};

export const INHIBITS = {
  REFERENCE_VALUE: "referenceValue",
  ACTUAL_VALUE: "actualValue",
};

export const calculateHandlePosition = (handleIndex, totalHandles) => {
  const handleGapPercentage = 100 / (totalHandles + 1);
  const handlePositionPercentage = handleGapPercentage * (handleIndex + 1);
  return `${handlePositionPercentage}%`;
};

export const ASSET_TYPES = {
  OBJECT_TYPE: "aspectObject",
  FUNCTION_TYPE: "function",
};

export const getDataType = (dataType) => {
  let dType;
  switch (dataType) {
    case "integer":
      dType = "int";
      break;
    case "array_integer":
      dType = "[int]";
      break;
    case "boolean":
      dType = "bool";
      break;
    case "string":
      dType = "str";
      break;
    case "number":
      dType = "num";
      break;
    case "array_string":
      dType = "[str]";
      break;
    case "array_number":
      dType = "[num]";
      break;
    case "array_boolean":
      dType = "[bool]";
      break;
    default:
      break;
  }
  return dType;
};
