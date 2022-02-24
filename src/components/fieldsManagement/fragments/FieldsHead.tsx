import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import FieldsControlsBar from "./FieldsControlsBar";

function FieldsHead() {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='start'
      paddingTop='20px'
      gridRowGap='20px'
    >
      <Typography variant='h6' style={{ fontWeight: 550 }}>
        Fields Management
      </Typography>
      <FieldsControlsBar />
    </Box>
  );
}

// FlexRowCenter padding='20px 0 0 0'

export default FieldsHead;
