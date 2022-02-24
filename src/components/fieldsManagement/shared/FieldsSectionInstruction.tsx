import React from "react";
import Typography from "@material-ui/core/Typography";
import { styled } from "@material-ui/core/styles";
import { appColors } from "./constants";

const StyledText = styled(Typography)({
  fontSize: "12px",
  color: appColors.lightGray,
  width: "max-content",
  textAlign: "left",
  margin: "10px 0",
});

export default function FieldsSectionInstruction() {
  return (
    <StyledText>
      Drag or reposition the elements here to make changes.
    </StyledText>
  );
}
