import React, { ReactNode } from "react";
import Grid from "@material-ui/core/Grid";

import { FieldList } from "./FieldSectionContainer";

interface FieldDataViewProps {
  children?: ReactNode;
  numOfFields: number;
}
const FieldDataView = (props: FieldDataViewProps) => {
  const { children } = props;
  return (
    <FieldList>
      <Grid container spacing={2} style={{ margin: "2px 1px 0 0" }}>
        {children}
      </Grid>
    </FieldList>
  );
};

export default FieldDataView;
