import React from "react";
import Grid from "@material-ui/core/Grid";
import NotesActLogTable from "./NotesActLogTable";
import SalesQuotesActLogTable from "./SalesQuotesActLogTable";
import MeetingsActLogTable from "./MeetingsActLogTable";
import CustomerInfoTable from "./CustomerInfoTable";

const ActivityLogTables = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={8}>
        <SalesQuotesActLogTable />
        <MeetingsActLogTable />
        <NotesActLogTable />
      </Grid>
      <Grid item xs={12} sm={4} style={{ marginTop: "64px" }}>
        <CustomerInfoTable />
      </Grid>
    </Grid>
  );
};

export default ActivityLogTables;
