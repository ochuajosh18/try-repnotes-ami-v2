import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  useListMngtMap,
  useProductErrorMap,
  useProductLoader,
} from "../utils/hooks";
import {
  selectFieldsByModuleName,
  selectFieldsMngtStatus,
} from "../../../store/fieldsManagement/selectors";
import { FieldInputs } from "../../fieldsManagement/shared/constants";
import useFetchFields from "../../fieldsManagement/hooks/useFetchFields";
import {
  saveProductWithAddedFields,
  selectProductState,
  setProductState,
  setProductValidationState,
  updateProductWithAddedFields,
} from "../../../store/productManagement/product/actions";
import { selectSystemState, setRedirect } from "../../../store/system/actions";

import { Media } from "../../../store/productManagement/product/types";
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import {
  RepnotesDefaultButton,
  RepnotesPrimaryButton,
} from "../../common/RepnotesButton";
import { LoadingDialog, RepnotesDialog } from "../../common/RepnotesAlerts";
import filter from "lodash/filter";
import forEach from "lodash/forEach";
import RepnotesProductAdaptiveFields from "./fragments/RepnotesProductAdaptiveFields";
import { transformFileList, useDialog } from "../../../util/utils";

import RepnotesProductFeatureSection from "./RepnotesProductFeatureSection";
import RepnotesFormTitleBar from "../../common/RepnotesFormTitleBar";

const RepnotesProductFormNew = () => {
  // App States
  const dispatch = useDispatch();
  const system = useSelector(selectSystemState);
  const productState = useSelector(selectProductState);
  const productFields = useSelector(selectFieldsByModuleName("PRODUCT"));
  const fieldsStatus = useSelector(selectFieldsMngtStatus);
  // const dialog = useSelector(selectDialogState);
  const fieldsLoading = fieldsStatus === "loading";
  const { dialog, openConfirmSaveDialog, closeDialog } = useDialog();

  const { id: paramsId } = useParams<{ id: string }>();
  const isAddingNew = paramsId === "new";

  // the field state for additional fields
  // this will be merged with the product state before submit
  const [addedInputs, setAddedInputs] = useState<Record<string, any> | null>();

  // Computed States
  const { columnNumber: col, defaultFields, addedFields } = productFields;
  const columns = Array.from({ length: col }, (v, k) => `column-${k + 1}`);

  const { modules } = system.session;
  const willRenderSaveBtn = modules.product.edit || isAddingNew;
  const isDisabled = !modules.product.edit && paramsId !== "new" ? true : false;
  const isFeaturesControlsShown = modules.product.edit || isAddingNew;

  const { selectedCompanyId, product, loading } = productState;
  const { listMngtMap, isListingsLoading } = useListMngtMap();

  useFetchFields(selectedCompanyId);

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

  useProductLoader();

  const productErrorMap = useProductErrorMap();

  if (!product || !productFields) return null;

  const okForEdit =
    !isAddingNew &&
    addedInputs &&
    Object.keys(addedInputs).every((key) => Object.keys(product).includes(key));

  function handleProductInput(
    field: string,
    value: string | number | boolean | Array<string>
  ) {
    const fieldValue =
      field === "isActive" ? (value === "true" ? true : false) : value;
    const newProduct = { ...product, [field]: fieldValue };
    dispatch(setProductState({ product: newProduct }));
  }

  function handleAddedInput(
    field: string,
    value: string | number | boolean | Array<string>
  ) {
    setAddedInputs({ ...addedInputs, [field]: value });
  }

  function handleProductMedia(
    value: FileList | null,
    key: string,
    isMultiple: boolean
  ) {
    if (product && value) {
      const oldMedia = product[key] as Array<Media>;
      const media = transformFileList(value, oldMedia, isMultiple);

      dispatch(
        setProductState({
          product: {
            ...product,
            [key]: media,
          } as typeof product,
        })
      );
    }
  }

  function handleAddedMedia(
    value: FileList | null,
    key: string,
    isMultiple: boolean
  ) {
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
    if (product) {
      dispatch(
        setProductState({
          product: {
            ...product,
            [type]: filter(
              product[type] as Array<Media>,
              (m) => m.name !== name
            ),
          },
        })
      );
    }
  }

  function handleDeleteAddedMedia(propertyKey: string, name: string) {
    if (addedInputs) {
      setAddedInputs({
        ...addedInputs,
        [propertyKey]: filter(
          addedInputs[propertyKey] as Array<Media>,
          (m) => m.name !== name
        ),
      });
    }
  }

  function handleDialogSaveClick() {
    closeDialog();
    handleSaveProduct();
  }

  function handleSaveProduct() {
    const data = !okForEdit ? { ...product, ...addedInputs } : { ...product };

    if (isAddingNew) {
      dispatch(saveProductWithAddedFields(data, selectedCompanyId));
    } else {
      dispatch(updateProductWithAddedFields(data));
    }
  }

  function handleSaveClick() {
    if (loading) return;

    // validate product fields
    let requiredFieldCount = 0;
    if (product) {
      const requiredFields = [
        ...defaultFields
          .filter((f) => f.isRequired && f.name !== "isActive")
          .map((f) => f.name),
        "price",
      ];

      forEach(requiredFields, (item, index) => {
        if (product[item] === "") {
          dispatch(setProductValidationState({ validation: true }));
          requiredFieldCount++;
        }
      });
      if (requiredFieldCount === 0) openConfirmSaveDialog(product.modelName);
    }
  }

  return (
    <>
      <Box className='repnotes-content'>
        <RepnotesProductFormHead
          loading={loading && !fieldsLoading}
          willRenderSaveBtn={willRenderSaveBtn}
          onSaveClick={handleSaveClick}
        />
        <Grid className='repnotes-form' container justify='center' spacing={1}>
          {fieldsLoading || !product || !addedInputs || isListingsLoading ? (
            <LoadingDialog />
          ) : (
            <React.Fragment>
              <RepnotesFormTitleBar title='Model Details' />
              {columns.map((column, colIdx) => (
                <Grid key={column} item xs={6}>
                  {defaultFields
                    .filter((field) => field.column === colIdx + 1)
                    .map((fieldItem) => {
                      const field = { ...fieldItem } as unknown as FieldInputs;
                      return (
                        <RepnotesProductAdaptiveFields
                          key={fieldItem.id}
                          field={field}
                          fieldDetails={product}
                          disabled={isDisabled}
                          listMngtMap={listMngtMap}
                          errorMap={productErrorMap}
                          handleProductInput={handleProductInput}
                          handleProductMedia={handleProductMedia}
                          handleDeleteMedia={handleDeleteMedia}
                        />
                      );
                    })}
                </Grid>
              ))}
              {addedFields?.length > 0 && (
                <>
                  <RepnotesFormTitleBar
                    title='Additional Details'
                    marginTop='20px'
                  />

                  {columns.map((column, colIdx) => (
                    <Grid key={column} item xs={6}>
                      {addedFields
                        .filter((field) => field.column === colIdx + 1)
                        .map((fieldItem) => {
                          const field = {
                            ...fieldItem,
                          } as unknown as FieldInputs;
                          const inputDetails = okForEdit
                            ? product
                            : addedInputs;
                          return (
                            <RepnotesProductAdaptiveFields
                              key={fieldItem.id}
                              field={field}
                              fieldDetails={inputDetails}
                              disabled={isDisabled}
                              listMngtMap={listMngtMap}
                              isForAddedFields={true}
                              handleProductInput={
                                !okForEdit
                                  ? handleAddedInput
                                  : handleProductInput
                              }
                              handleProductMedia={
                                !okForEdit
                                  ? handleAddedMedia
                                  : handleProductMedia
                              }
                              handleDeleteMedia={
                                !okForEdit
                                  ? handleDeleteAddedMedia
                                  : handleDeleteMedia
                              }
                            />
                          );
                        })}
                    </Grid>
                  ))}
                </>
              )}
              <RepnotesProductFeatureSection
                showControls={isFeaturesControlsShown}
                tabsDisabled={isDisabled}
                formDisabled={isDisabled}
              />
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

export default RepnotesProductFormNew;

interface RepnotesProductFormHeadProps {
  loading: boolean;
  willRenderSaveBtn: string | boolean;
  onSaveClick: () => void;
}

const RepnotesProductFormHead = (props: RepnotesProductFormHeadProps) => {
  const dispatch = useDispatch();
  const { loading, willRenderSaveBtn, onSaveClick } = props;

  function handleCancel() {
    dispatch(setRedirect({ shallRedirect: true, redirectTo: "/product" }));
  }
  return (
    <>
      <Grid container>
        <Grid
          item
          xs={12}
          style={{ textAlign: "left", paddingTop: "10px 0px" }}
        >
          <RepnotesContentHeader
            moduleName='Product Management'
            subModule='Product'
          />
        </Grid>
      </Grid>
      <Grid
        container
        justify='flex-end'
        style={{ padding: "10px 0", position: "relative", right: -3 }}
      >
        <RepnotesDefaultButton onClick={handleCancel}>
          Cancel
        </RepnotesDefaultButton>
        {willRenderSaveBtn && (
          <RepnotesPrimaryButton
            className={loading ? "" : "no-margin-right"}
            onClick={onSaveClick}
          >
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
