import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";
import { appColors } from "./constants";

const StyledBox = styled(Box)({
  display: "flex",
  height: "42px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "3px",
  border: appColors.border,
  borderColor: appColors.gray,
  padding: "6px 8px",
  marginTop: "8px",
  boxSizing: "border-box",
  fontSize: "12px",
  color: appColors.lightGray,
  borderStyle: "dashed",
  userSelect: "none",
});

export default function NoFieldItem({
  text = "Drop here to place field",
}: {
  text?: string;
}) {
  return <StyledBox>{text}</StyledBox>;
}
