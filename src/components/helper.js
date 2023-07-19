import { DATA_TYPES } from "./constants";
export const getAssetType = (value) => {
  const splitValue = value.split(".");
  return splitValue[splitValue.length - 1];
};

export const isValidConnection = (sourceDataType, targetDataType) => {
  let isValid = false;
  if (sourceDataType === targetDataType) {
    isValid = true;
  } else if (
    sourceDataType === DATA_TYPES.INTEGER &&
    targetDataType === DATA_TYPES.ARRAY_INTEGER
  ) {
    isValid = true;
  } else if (
    sourceDataType === DATA_TYPES.BOOLEAN &&
    targetDataType === DATA_TYPES.ARRAY_BOOLEAN
  ) {
    isValid = true;
  } else if (
    sourceDataType === DATA_TYPES.STRING &&
    targetDataType === DATA_TYPES.ARRAY_STRING
  ) {
    isValid = true;
  } else if (
    sourceDataType === DATA_TYPES.NUMBER &&
    targetDataType === DATA_TYPES.ARRAY_NUMBER
  ) {
    isValid = true;
  }
  return isValid;
};
