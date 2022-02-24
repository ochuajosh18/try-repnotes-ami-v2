import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const EmptyMessage = ({
  message = "No selected company. Please select one.",
}: {
  message?: string;
}) => {
  return (
    <Box padding='20px'>
      <Typography color='textSecondary' style={{ fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyMessage;
