import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import FieldsButton from "../shared/FieldsButton";
import { RepnotesInput } from "../../common/RepnotesInput";
import {
  saveFieldModules,
  setNotesDefaultSection,
} from "../../../store/fieldsManagement/actions";
import useSelectedCompanyData from "../hooks/useSelectedCompanyData";
import {
  selectNotesDefaultSection,
  selectNotesFieldsDefaultSections,
} from "../../../store/fieldsManagement/selectors";
import useToggle from "../hooks/useToggle";
import FieldsConfirmSaveModal from "./FieldsConfirmSaveModal";
import { selectCurrentUserRole } from "../../../store/system/actions";
import useFieldsPermission from "../hooks/useFieldsPermission";

function FieldsControlsBar() {
  const dispatch = useDispatch();
  const notesSectionOptions = useSelector(selectNotesFieldsDefaultSections);
  const notesDefault = useSelector(selectNotesDefaultSection);
  const userRole = useSelector(selectCurrentUserRole);
  const isSuperAdmin = userRole === "SUPER ADMIN";
  const {
    selectedCompany,
    currentFieldModule,
    fieldModuleId,
    noCompanySelected,
    companySelectOptions,
    handleCompanyChange,
    isButtonDisabled,
  } = useSelectedCompanyData();

  const { canAdd, canEdit, canDelete } = useFieldsPermission();

  const saveButtonShown = canAdd || canEdit || canDelete;

  const [isConfirmOpen, openConfirm, closeConfirm] = useToggle();

  function handleSave() {
    if (noCompanySelected) return;
    dispatch(saveFieldModules(fieldModuleId as string));

    closeConfirm();
  }

  function handleNotesOptionsChange(
    e: React.ChangeEvent<HTMLInputElement | any>
  ) {
    const moduleId = e.target.value;
    if (!moduleId) return;

    // update store
    dispatch(setNotesDefaultSection(moduleId));
  }

  return (
    <>
      <Grid container direction='row' spacing={2} style={{ minHeight: "80px" }}>
        {isSuperAdmin && (
          <Grid item xs={2}>
            <RepnotesInput
              id='fields-mngt-company-list'
              type='select'
              label='Company Name'
              labelPosition='top'
              options={companySelectOptions}
              value={selectedCompany}
              onSelectChange={handleCompanyChange}
            />
          </Grid>
        )}
        {currentFieldModule === "NOTES" && (
          <Grid item xs={3}>
            <RepnotesInput
              id='notes-default-fields-section-list'
              type='select'
              label='Select Default Fields to Show'
              labelPosition='top'
              options={notesSectionOptions || []}
              value={notesDefault || ""}
              onSelectChange={handleNotesOptionsChange}
              disabled={noCompanySelected && isSuperAdmin}
            />
          </Grid>
        )}
        {saveButtonShown && (
          <FieldsButton
            style={{
              alignSelf: "end",
              marginBottom: "5px",
              marginLeft: "auto",
            }}
            onClick={openConfirm}
            disabled={isButtonDisabled}
            btnColor={isButtonDisabled ? "secondary" : "primary"}
          >
            Save
          </FieldsButton>
        )}
      </Grid>
      <FieldsConfirmSaveModal
        open={isConfirmOpen}
        onConfirm={handleSave}
        onClose={closeConfirm}
      />
    </>
  );
}

export default FieldsControlsBar;
