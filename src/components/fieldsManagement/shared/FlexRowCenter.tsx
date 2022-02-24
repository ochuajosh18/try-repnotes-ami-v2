import React, { ReactNode } from "react";
import { styled } from "@material-ui/core/styles";

const StyledBox = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: (props: StyledBoxProps) => props.gap || "10px",
  margin: (props: StyledBoxProps) => props.margin,
  padding: (props: StyledBoxProps) => props.padding,
});

interface StyledBoxProps {
  gap?: string;
  margin?: string | "auto";
  padding?: string;
  children?: ReactNode;
}

const FlexRowCenter = React.forwardRef<HTMLDivElement, StyledBoxProps>(
  (props, ref) => {
    return (
      <StyledBox ref={ref} {...props}>
        {props.children}
      </StyledBox>
    );
  }
);

export default FlexRowCenter;
