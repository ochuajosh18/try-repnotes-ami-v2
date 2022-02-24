import React from "react";

import Box from "@material-ui/core/Box";
import FieldsHead from "./fragments/FieldsHead";
import FieldsTabs from "./shared/FieldsTabs";
import FieldsModuleSection from "./fragments/FieldsModuleSection";
import useFetchFields from "./hooks/useFetchFields";

function FieldsManagement() {
  useFetchFields();

  return (
    <React.Fragment>
      <Box
        marginTop='60px'
        padding='10px 30px'
        width='100%'
        height='calc(100vh - 60px)'
        boxSizing='border-box'
        display='flex'
        flexDirection='column'
      >
        <FieldsHead />
        <FieldsTabs />
        <FieldsModuleSection />
      </Box>
    </React.Fragment>
  );
}

export default FieldsManagement;
