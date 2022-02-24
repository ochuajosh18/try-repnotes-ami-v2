import React from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import { appColors } from "../utils/constants";

const StyledButton = styled(Button)({
  backgroundColor: appColors.primary.main,
  opacity: 0.8,
  borderRadius: 0,
  textTransform: "capitalize",
  color: appColors.white,
  height: "31px",

  "&:hover": {
    backgroundColor: appColors.primary.main,
    opacity: 1,
  },
});

const MoreButton = (props: ButtonProps) => {
  return (
    <StyledButton fullWidth {...props}>
      More
    </StyledButton>
  );
};

export default MoreButton;
