import React from "react";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import {
  selectCompanyIdForFields,
  selectCurrentFieldModule,
  selectFieldsMap,
  selectFieldsMngtStatus,
  selectNotesDefaultSection,
} from "../../../store/fieldsManagement/selectors";
import { CenteredLoadingDialog } from "../../common/RepnotesAlerts";
import FieldsModuleView from "./FieldsModuleView";
import FieldsAlertAndModal from "./FieldsAlertAndModal";
import EmptyMessage from "../shared/EmptyMessage";

const FieldsModuleSection = () => {
  const currentCompanyId = useSelector(selectCompanyIdForFields);
  const status = useSelector(selectFieldsMngtStatus);
  const notesDefaultSection = useSelector(selectNotesDefaultSection);
  const activeFieldModule = useSelector(selectCurrentFieldModule);
  const fieldsMap = useSelector(selectFieldsMap);

  if (status === "loading") return <CenteredLoadingDialog />;

  if (!currentCompanyId || currentCompanyId === "SUPERADMIN")
    return <EmptyMessage />;

  if (currentCompanyId && !notesDefaultSection && activeFieldModule === "NOTES")
    return <EmptyMessage message='Select a default field to show.' />;

  if (currentCompanyId && !fieldsMap && activeFieldModule === "NOTES")
    return <EmptyMessage message='No available field data.' />;

  return (
    <>
      <Box flex={1} display='flex' flexDirection='column' overflow='hidden'>
        <FieldsModuleView />
      </Box>
      <FieldsAlertAndModal />
    </>
  );
};

export default FieldsModuleSection;
