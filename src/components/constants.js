export const HANDLE_SPACING = 20;

export const getRandomDataType = () => {
  const dataTypes = ["Int", "[Int]", "Bool", "Str", "Num"];
  let value;
  const randomIndex = Math.floor(Math.random() * dataTypes.length);

  switch (dataTypes[randomIndex]) {
    case "Int":
      value = 2;
      break;
    case "[Int]":
      value = [1, 2, 3];
      break;
    case "Bool":
      value = false;
      break;
    case "Str":
      value = "ABB";
      break;
    case "Num":
      value = undefined;
      break;
    default:
      break;
  }
  return { type: dataTypes[randomIndex], value };
};

export const IN_CONNECT_VALUES = {
  REFERENCE_VALUE: "referenceValue",
  ACTUAL_VALUE: "actualValue",
};
