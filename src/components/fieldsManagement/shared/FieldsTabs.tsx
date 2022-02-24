import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import { appColors } from "./constants";
import { useDispatch } from "react-redux";
import { setActiveFieldModule } from "../../../store/fieldsManagement/actions";

const StyledTabs = withStyles({
  root: {
    borderBottom: appColors.border,
  },
  indicator: {
    height: "3px",
    backgroundColor: appColors.theme.primary.main,
  },
})(Tabs);

const StyledTab = withStyles({
  root: {
    color: appColors.gray,
    fontWeight: 600,
  },
  selected: {
    color: appColors.theme.primary.main,
  },
})(Tab);

function FieldsTabs() {
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveFieldModule("CUSTOMER"));
  }, [dispatch]);

  return (
    <Box>
      <StyledTabs
        aria-label='fields mngt tabs'
        value={currentTabIndex}
        onChange={(e, t) => {
          setCurrentTabIndex(t);
        }}
      >
        <StyledTab
          label='Customer Management'
          onClick={() => dispatch(setActiveFieldModule("CUSTOMER"))}
        />
        <StyledTab
          label='Product Management'
          onClick={() => dispatch(setActiveFieldModule("PRODUCT"))}
        />
        <StyledTab
          label='Notes Management'
          onClick={() => dispatch(setActiveFieldModule("NOTES"))}
        />
      </StyledTabs>
    </Box>
  );
}

export default FieldsTabs;
