export const HANDLE_SPACING = 20;

//get random data type while creating function
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

//handeling the handles position
export const calculateHandlePosition = (handleIndex, totalHandles) => {
  const handleGapPercentage = 100 / (totalHandles + 1);
  const handlePositionPercentage = handleGapPercentage * (handleIndex + 1);
  return `${handlePositionPercentage}%`;
};

export const ASSET_TYPES = {
  OBJECT_TYPE: "aspectObject",
  FUNCTION_TYPE: "function",
};

export const DATA_TYPES = {
  INTEGER: "integer",
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  ARRAY_INTEGER: "array_integer",
  ARRAY_STRING: "array_string",
  ARRAY_BOOLEAN: "array_boolean",
  ARRAY_NUMBER: "array_number",
};

export const getDataType = (dataType) => {
  let dType;
  switch (dataType) {
    case DATA_TYPES.INTEGER:
      dType = "int";
      break;
    case DATA_TYPES.ARRAY_INTEGER:
      dType = "[int]";
      break;
    case DATA_TYPES.BOOLEAN:
      dType = "bool";
      break;
    case DATA_TYPES.STRING:
      dType = "str";
      break;
    case DATA_TYPES.NUMBER:
      dType = "num";
      break;
    case DATA_TYPES.ARRAY_STRING:
      dType = "[str]";
      break;
    case DATA_TYPES.ARRAY_NUMBER:
      dType = "[num]";
      break;
    case DATA_TYPES.ARRAY_BOOLEAN:
      dType = "[bool]";
      break;
    default:
      break;
  }
  return dType;
};
