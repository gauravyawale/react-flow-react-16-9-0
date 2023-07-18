export const getAssetType = (value) => {
  const splitValue = value.split(".");
  return splitValue[splitValue.length - 1];
};
