import { styled } from "@material-ui/core/styles";

const FieldSectionContainer = styled("div")({
  flex: 1,
  display: "flex",
  height: "calc(100% - 50px)",
  maxHeight: "calc(100% - 50px)",
  gridColumnGap: "10px",
});

export const FieldSectionList = styled("div")({
  flex: 1,
  width: "600px",
  display: "flex",
  flexDirection: "column",
  gridRowGap: "8px",
  overflow: "auto",
});

export const FieldElementsContainer = styled("div")({
  width: "420px",
  display: "flex",
  flexDirection: "column",
});

export const FieldElementsList = styled("div")({
  flex: 1,
  display: "flex",
  maxHeight: "calc(100% - 120px)",
  flexDirection: "column",
  overflow: "auto",
  padding: "5px 10px 10px",
  boxSizing: "border-box",
  overflowX: "hidden",
});

export const FieldList = styled("div")({
  display: "flex",
  flexDirection: "column",
  gridRowGap: "3px",
  marginRight: "20px",
});

export default FieldSectionContainer;
