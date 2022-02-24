import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import filter from "lodash/filter";
import forEach from "lodash/forEach";

import { useDispatch, useSelector } from "react-redux";
import {
  saveCustomerWithAddedFields,
  selectCustomerState,
  setCustomerState,
  setCustomerValidationState,
  updateCustomerWithAddedFields,
} from "../../../store/customerManagement/customer/actions";
import { selectSystemState, setRedirect } from "../../../store/system/actions";
import CircularProgress from "@material-ui/core/CircularProgress";

import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { RepnotesDefaultButton, RepnotesPrimaryButton } from "../../common/RepnotesButton";
import { LoadingDialog, RepnotesDialog } from "../../common/RepnotesAlerts";
import {
  selectFieldsByModuleName,
  selectFieldsMngtStatus,
} from "../../../store/fieldsManagement/selectors";

import RepnotesCustomerAdaptiveFields from "./fragments/RepnotesCustomerAdaptiveField";
import { FieldInputs } from "../../fieldsManagement/shared/constants";
import { useCustomerErrorMap, useCustomerLoader, useListMngtMap } from "../utils/hooks";
import useFetchFields from "../../fieldsManagement/hooks/useFetchFields";
import RepnotesFormTitleBar from "../../common/RepnotesFormTitleBar";
import { emailValidator, numberValidator, transformFileList, useDialog } from "../../../util/utils";
import { CustomerDetails } from "../../../store/report/marginReport/types";
import { Media } from "../../../store/customerManagement/customer/types";
import { openAlert } from "../../../store/alert/actions";

const RepnotesCustomerFormNew = () => {
  const dispatch = useDispatch();
  const system = useSelector(selectSystemState);
  const customerState = useSelector(selectCustomerState);
  const customerFields = useSelector(selectFieldsByModuleName("CUSTOMER"));
  const fieldsStatus = useSelector(selectFieldsMngtStatus);
  const { dialog, closeDialog, openConfirmSaveDialog } = useDialog();
  const fieldsLoading = fieldsStatus === "loading";

  // the field state for additional fields
  // this will be merged with the customer state before submit
  const [addedInputs, setAddedInputs] = useState<Record<string, any> | null>();
  const { id: paramsId } = useParams<{ id: string }>();

  // Computed States
  const { columnNumber: col, defaultFields, addedFields } = customerFields;
  const columns = Array.from({ length: col }, (v, k) => `column-${k + 1}`);
  const { modules } = system.session;
  const isAddingNew = paramsId === "new";
  const willRenderSaveBtn = modules.customer.edit || isAddingNew;
  const { loading, customer, selectedCompanyId, customerList } = customerState;
  const isDisabled = !modules.customer.edit && paramsId !== "new" ? true : false;

  const isGroupNameDisabled =
    !modules.customer.edit && paramsId !== "new"
      ? true
      : customer?.category === "Child"
      ? false
      : true;

  useFetchFields(selectedCompanyId);

  useEffect(() => {
    return () => {
      dispatch(setCustomerState({ customerList: [] }));
    };
  }, [dispatch]);
  // load initial values of added inputs
  useEffect(() => {
    if (!addedFields) return;
    const initialAddedInputValues = addedFields.reduce(
      (mapped, curr) => ({
        ...mapped,
        [curr.name]:
          curr.type === "Multimedia"
            ? []
            : (curr as any).defaultValue
            ? (curr as any).defaultValue
            : "",
      }),
      {}
    );

    setAddedInputs(initialAddedInputValues);
  }, [addedFields]);

  // load initial customer
  useCustomerLoader();

  const { listMngtMap, isListingsLoading } = useListMngtMap();

  const customerErrorMap = useCustomerErrorMap();

  if (!customer || !customerFields) return null;

  const okForEdit =
    !isAddingNew &&
    addedInputs &&
    Object.keys(addedInputs).every((key) => Object.keys(customer).includes(key));

  function handleCustomerInput(field: string, value: string | number | boolean | Array<string>) {
    const fieldValue = field === "isActive" ? (value === "true" ? true : false) : value;
    const newCustomer = { ...customer, [field]: fieldValue };
    dispatch(setCustomerState({ customer: newCustomer as CustomerDetails }));
  }

  function handleAddedInput(field: string, value: string | number | boolean | Array<string>) {
    setAddedInputs({ ...addedInputs, [field]: value });
  }

  function handleCustomerMedia(value: FileList | null, key: string, isMultiple: boolean) {
    if (customer && value) {
      const oldMedia = customer[key] as Array<Media>;
      const media = transformFileList(value, oldMedia, isMultiple);

      dispatch(
        setCustomerState({
          customer: {
            ...customer,
            [key]: media,
          } as typeof customer,
        })
      );
    }
  }

  function handleAddedMedia(value: FileList | null, key: string, isMultiple: boolean) {
    if (addedInputs && value) {
      const oldMedia = addedInputs[key] as Array<Media>;
      const media = transformFileList(value, oldMedia, isMultiple);

      setAddedInputs({
        ...addedInputs,
        [key]: media,
      });
    }
  }

  function handleDeleteMedia(type: string, name: string) {
    if (customer) {
      dispatch(
        setCustomerState({
          customer: {
            ...customer,
            [type]: filter(customer[type] as Array<Media>, (m) => m.name !== name),
          },
        })
      );
    }
  }

  function handleDeleteAddedMedia(propertyKey: string, name: string) {
    if (addedInputs) {
      setAddedInputs({
        ...addedInputs,
        [propertyKey]: filter(addedInputs[propertyKey] as Array<Media>, (m) => m.name !== name),
      });
    }
  }

  function handleDialogSaveClick() {
    closeDialog();
    handleSaveCustomer();
  }

  function handleSaveCustomer() {
    const data = !okForEdit ? { ...customer, ...addedInputs } : { ...customer };
    if (isAddingNew) {
      dispatch(saveCustomerWithAddedFields(data, selectedCompanyId));
    } else {
      dispatch(updateCustomerWithAddedFields(data));
    }
  }

  function handleSaveClick() {
    if (loading) return;

    if (customer) {
      const requiredFields = defaultFields
        .filter((f) => f.isRequired && f.name !== "status" && f.name !== "groupName")
        .map((f) => f.name);

      if (customer.category !== "Mother") requiredFields.push("groupName");

      let internal = 0;
      forEach(requiredFields, (item, index) => {
        if (customer[item] === "") dispatch(setCustomerValidationState({ validation: true }));
        if (customer[item] !== "") internal++;
        if (customer.category === "Mother") handleCustomerInput("groupName", "");
      });
      if (requiredFields.length === internal) {
        if (!numberValidator(customer.contactNo1)) {
          dispatch(openAlert("Invalid Contact Number - Contact No 1", "warning"));
        } else if (customer.email !== "" && !emailValidator(customer.email)) {
          dispatch(openAlert("Invalid Email", "warning"));
        } else if (customer.contactNo2 !== "" && !numberValidator(customer.contactNo2)) {
          dispatch(openAlert("Invalid Contact Number - Contact No 2", "warning"));
        } else {
          openConfirmSaveDialog(customer.name);
        }
      }
    }
  }

  return (
    <>
      <Box className='repnotes-content'>
        <RepnotesCustomerFormHead
          loading={loading && !fieldsLoading}
          willRenderSaveBtn={willRenderSaveBtn}
          onSaveClick={handleSaveClick}
        />
        <Grid className='repnotes-form' container spacing={1}>
          {fieldsLoading || !customer || !addedInputs || isListingsLoading ? (
            <LoadingDialog />
          ) : (
            <React.Fragment>
              <RepnotesFormTitleBar title='Customer Details' />
              {columns.map((column, colIdx) => (
                <Grid key={column} item xs={6}>
                  {defaultFields
                    .filter((field) => field.column === colIdx + 1)
                    .map((fieldItem) => {
                      const field = { ...fieldItem } as unknown as FieldInputs;
                      return (
                        <RepnotesCustomerAdaptiveFields
                          key={fieldItem.id}
                          field={field}
                          fieldDetails={customer}
                          customerList={customerList}
                          disabled={field.name === "groupName" ? isGroupNameDisabled : isDisabled}
                          listMngtMap={listMngtMap}
                          errorMap={customerErrorMap}
                          handleCustomerInput={handleCustomerInput}
                          handleCustomerMedia={handleCustomerMedia}
                          handleDeleteMedia={handleDeleteMedia}
                        />
                      );
                    })}
                </Grid>
              ))}
              {addedFields?.length > 0 && (
                <>
                  <RepnotesFormTitleBar title='Additional Details' marginTop='20px' />

                  {columns.map((column, colIdx) => (
                    <Grid key={column} item xs={6}>
                      {addedFields
                        .filter((field) => field.column === colIdx + 1)
                        .map((fieldItem) => {
                          const field = {
                            ...fieldItem,
                          } as unknown as FieldInputs;
                          const inputDetails = okForEdit ? customer : addedInputs;

                          return (
                            <RepnotesCustomerAdaptiveFields
                              key={fieldItem.id}
                              field={field}
                              fieldDetails={inputDetails}
                              disabled={isDisabled}
                              listMngtMap={listMngtMap}
                              isForAddedFields={true}
                              handleCustomerInput={
                                !okForEdit ? handleAddedInput : handleCustomerInput
                              }
                              handleCustomerMedia={
                                !okForEdit ? handleAddedMedia : handleCustomerMedia
                              }
                              handleDeleteMedia={
                                !okForEdit ? handleDeleteAddedMedia : handleDeleteMedia
                              }
                            />
                          );
                        })}
                    </Grid>
                  ))}
                </>
              )}
            </React.Fragment>
          )}
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

export default RepnotesCustomerFormNew;

interface RepnotesCustomerFormHeadProps {
  loading: boolean;
  willRenderSaveBtn: string | boolean;
  onSaveClick: () => void;
}

const RepnotesCustomerFormHead = (props: RepnotesCustomerFormHeadProps) => {
  const dispatch = useDispatch();
  const { loading, willRenderSaveBtn, onSaveClick } = props;

  function handleCancel() {
    dispatch(setRedirect({ shallRedirect: true, redirectTo: "/customer" }));
  }
  return (
    <>
      <Grid container>
        <Grid item xs={12} style={{ textAlign: "left", paddingTop: "10px 0px" }}>
          <RepnotesContentHeader moduleName='Customer Management' subModule='Customer' />
        </Grid>
      </Grid>
      <Grid
        container
        justify='flex-end'
        style={{ padding: "10px 0", position: "relative", right: -3 }}
      >
        <RepnotesDefaultButton onClick={handleCancel}>Cancel</RepnotesDefaultButton>
        {willRenderSaveBtn && (
          <RepnotesPrimaryButton className={loading ? "" : "no-margin-right"} onClick={onSaveClick}>
            {loading ? (
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
    </>
  );
};
