import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { RepnotesDefaultButton, RepnotesPrimaryButton } from "../../common/RepnotesButton";
import { RepnotesInput } from "../../common/RepnotesInput";
import { STATUS_ARRAY } from "../../../util/constants";
import { openAlert } from "../../../store/alert/actions";
import {
  selectBranchById,
  selectBranchState,
} from "../../../store/listManagement/branch/selectors";
import { useListPermission } from "./hooks";
import { createBranch, editBranch } from "../../../store/listManagement/branch/actions";
import { RepnotesDialog } from "../../common/RepnotesAlerts";
import { useDialog } from "../../../util/utils";

interface BranchInput {
  name: string;
  isActive: boolean;
}

interface IParams {
  id: string;
}

const RepnotesBranchForm = () => {
  const history = useHistory();
  const { id } = useParams<IParams>();
  const dispatch = useDispatch();
  const [branch, setBranch] = useState<BranchInput>({ name: "", isActive: true });
  const [error, setError] = useState(false);
  const branchtoEdit = useSelector(selectBranchById(id));
  const { status } = useSelector(selectBranchState);

  const { dialog, closeDialog, openConfirmSaveDialog } = useDialog();
  const { canEdit } = useListPermission();

  const isAdding = id === "new";
  const isSaveBtnShown = canEdit || isAdding;
  const inputDisabled = !canEdit && !isAdding;

  const isLoading = status === "loading";

  useEffect(() => {
    if (isAdding || !branchtoEdit) return;
    setBranch({ name: branchtoEdit.name, isActive: branchtoEdit.isActive });
  }, [branchtoEdit, isAdding]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(false);
    setBranch({ ...branch, name: e.target.value });
  };

  const handleIsActiveChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setBranch({ ...branch, isActive: e.target.value === "true" ? true : false });
  };

  const handleCancel = () => history.push("/branch");

  const handleSave = () => {
    if (!branch.name) {
      setError(true);
      return dispatch(openAlert("Please check required field.", "error"));
    }

    openConfirmSaveDialog(branch.name);
  };

  const handleDialogSaveClick = () => {
    const successCb = () => history.push("/branch");
    if (isAdding) dispatch(createBranch(branch, successCb));
    else dispatch(editBranch(id, branch, successCb));
  };

  return (
    <>
      <Box className='repnotes-content'>
        <Box style={{ textAlign: "left", paddingTop: "10px 0px" }}>
          <RepnotesContentHeader moduleName='List Management' subModule='Branch' />
        </Box>
        <Grid container style={{ paddingTop: "20px" }}>
          <Grid
            container
            justify='flex-end'
            style={{ padding: "10px 0", position: "relative", right: -3 }}
          >
            <RepnotesDefaultButton onClick={handleCancel}>Cancel</RepnotesDefaultButton>
            {isSaveBtnShown && (
              <RepnotesPrimaryButton className='no-margin-right' onClick={handleSave}>
                {isLoading ? (
                  <CircularProgress
                    style={{
                      display: "flex",
                      width: 20,
                      height: 20,
                      color: "#fff",
                      padding: 3,
                    }}
                  />
                ) : (
                  "Save"
                )}
              </RepnotesPrimaryButton>
            )}
          </Grid>
        </Grid>
        <Grid className='repnotes-form' container spacing={1}>
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={7}>
              <RepnotesInput
                id='repnotes-branch-name'
                type='text'
                placeholder='Branch name'
                label='Name'
                labelPosition='left'
                disabled={inputDisabled}
                error={error}
                value={branch.name}
                onChange={handleNameChange}
              />
              <RepnotesInput
                id='repnotes-branch-status'
                type='select'
                label='Status'
                labelPosition='left'
                value={branch.isActive}
                options={STATUS_ARRAY}
                disabled={inputDisabled}
                onSelectChange={handleIsActiveChange}
              />
            </Grid>
            <Grid item xs={4} />
          </Grid>
        </Grid>
      </Box>
      <RepnotesDialog
        label={dialog.dialogLabel}
        open={dialog.dialogOpen}
        severity={dialog.dialogType}
        onClick={handleDialogSaveClick}
        onClear={closeDialog}
      />
    </>
  );
};

export default RepnotesBranchForm;
