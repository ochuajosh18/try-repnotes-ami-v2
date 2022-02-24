import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const RepnotesFormTitleBar = ({
  title,
  marginTop = "0px",
}: {
  title: string;
  marginTop?: string | number;
}) => {
  return (
    <Grid item xs={12} style={{ marginBottom: 15, marginTop }}>
      <Typography
        style={{
          textAlign: "left",
          color: "#272B75",
          fontSize: "1rem",
          fontWeight: 600,
          padding: "0px 10px 5px 10px",
          borderBottom: "1px solid #f4f4f4",
        }}
      >
        {title}
      </Typography>
    </Grid>
  );
};

export default RepnotesFormTitleBar;
