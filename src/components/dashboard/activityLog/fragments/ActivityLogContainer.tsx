import React from "react";
import Box, { BoxProps } from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { appColors } from "../utils/constants";

const ActivityLogContainer = (props: BoxProps) => {
  return (
    <Box
      {...props}
      marginY='20px'
      padding='20px'
      border={appColors.border}
      borderRadius='3px'
      width='100%'
      textAlign='left'
      display='flex'
      flexDirection='column'
      gridRowGap='24px'
    >
      <Typography
        style={{ fontWeight: 600, fontSize: "18px", display: "inline" }}
      >
        Activity Log
      </Typography>
      {props.children}
    </Box>
  );
};

export default ActivityLogContainer;
