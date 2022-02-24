import React from "react";
import Grid, { GridProps } from "@material-ui/core/Grid";
import Box, { BoxProps } from "@material-ui/core/Box";
import map from "lodash/map";
import { SubFeature } from "../../../store/productManagement/product/types";
import RepnotesFeatureGetTemplateButton from "./fragments/RepnotesFeatureGetTemplateButton";
import RepnotesFeatureImportButton from "./fragments/RepnotesFeatureImportButton";
import { RepnotesFeaturePopoverButton } from "./RepnotesFeaturePopover";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductDialog,
  deleteOptionalFeature,
  deleteOptionalFeatureImage,
  deleteStandardFeature,
  deleteStandardFeatureImage,
  importProductFeature,
  loadFeatureDetails,
  saveOptionalMachineFeature,
  saveStandardMachineFeature,
  selectProductState,
  setProductDialogOpen,
  setProductState,
} from "../../../store/productManagement/product/actions";
import {
  EMPTY_OPTIONAL_FEATURE,
  EMPTY_STANDARD_FEATURE,
} from "../../../util/constants";
import { RepnotesProductFeatureTabs } from "./RepnotesProductFeatureTabs";
import { RepnotesFeatureForm } from "./RepnotesFeatureForm";
import { openAlert } from "../../../store/alert/actions";
import { transformFileList } from "../../../util/utils";

interface RepnotesProductFeatureSectionProps {
  showControls: string | boolean;
  tabsDisabled: boolean;
  formDisabled: boolean;
}

const RepnotesProductFeatureSection = (
  props: RepnotesProductFeatureSectionProps
) => {
  const dispatch = useDispatch();
  const productState = useSelector(selectProductState);

  if (!productState || !productState.product) return null;

  const {
    product,
    dialogOpen,
    dialogOption,
    standardMachineFeature,
    optionalMachineFeature,
  } = productState;
  const { showControls, tabsDisabled, formDisabled } = props;

  const hasDialogMedia =
    dialogOption === "standard"
      ? Boolean(standardMachineFeature && standardMachineFeature.image)
      : Boolean(optionalMachineFeature && optionalMachineFeature.image);
  const standardMachineFeatureImage =
    standardMachineFeature && standardMachineFeature.image.name
      ? [standardMachineFeature.image]
      : [];
  const optionalMachineFeatureImage =
    optionalMachineFeature && optionalMachineFeature.image.name
      ? [optionalMachineFeature.image]
      : [];

  function openProductDialog(option: string) {
    dispatch(
      setProductState({
        standardMachineFeature: {
          ...EMPTY_STANDARD_FEATURE,
          subFeature: [],
        },
        optionalMachineFeature: {
          ...EMPTY_OPTIONAL_FEATURE,
          subFeature: [],
        },
      })
    );
    dispatch(setProductDialogOpen(option));
  }

  function handleTriggerImportClick(
    option: "standard" | "optional",
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (e.target.files) {
      dispatch(importProductFeature(e.target.files[0], option));
    }
  }

  function handleEditFeature(id: string, type: string) {
    dispatch(loadFeatureDetails(id, product, type));
    dispatch(setProductDialogOpen(type));
  }
  function handleDeleteFeature(id: string, type: string) {
    if (type === "standard") {
      dispatch(deleteStandardFeature(product, id));
    } else {
      dispatch(deleteOptionalFeature(product, id));
    }
  }

  function featureStandardInput(
    field: string,
    value: string | number | boolean | Array<string>
  ) {
    const newFeature = { ...standardMachineFeature, [field]: value };
    dispatch(setProductState({ standardMachineFeature: newFeature }));
  }

  function featureOptionalInput(
    field: string,
    value: string | number | boolean | Array<string>
  ) {
    const newFeature = { ...optionalMachineFeature, [field]: value };
    dispatch(setProductState({ optionalMachineFeature: newFeature }));
  }

  function handleClearProductDialog() {
    dispatch(clearProductDialog());
  }

  function handleAlertOpen(msg: string, type: string) {
    dispatch(openAlert(msg, type));
  }

  function setFeatureMedia(value: FileList | null, type: string) {
    if ((standardMachineFeature || optionalMachineFeature) && value) {
      const feature =
        type === "standardMachineFeature"
          ? standardMachineFeature
          : optionalMachineFeature;
      const media = transformFileList(value, [], false);
      dispatch(setProductState({ [type]: { ...feature, image: media[0] } }));
    }
  }

  function handleDeleteFeatureImage(type: string) {
    if (type === "standard") {
      dispatch(deleteStandardFeatureImage(standardMachineFeature));
    } else {
      dispatch(deleteOptionalFeatureImage(optionalMachineFeature));
    }
  }

  function handleSubFeatureInput(
    field: string,
    value: string | number | Array<SubFeature> | Array<string>,
    type: string
  ) {
    const newStandardFeature = { ...standardMachineFeature, [field]: value };
    const newOptionalFeature = { ...optionalMachineFeature, [field]: value };
    dispatch(
      setProductState({
        [type]:
          type === "standardMachineFeature"
            ? newStandardFeature
            : newOptionalFeature,
      })
    );
  }

  function handleSaveFeature(type: string) {
    if (type === "standard") {
      dispatch(saveStandardMachineFeature(product, standardMachineFeature));
    } else {
      dispatch(saveOptionalMachineFeature(product, optionalMachineFeature));
    }
  }

  return (
    <>
      <FeatureSectionContainer>
        <FeatureSectionBox>
          {showControls && (
            <React.Fragment>
              {product.id && (
                <React.Fragment>
                  <RepnotesFeatureGetTemplateButton />
                  <RepnotesFeatureImportButton
                    onTriggerImportClick={handleTriggerImportClick}
                  />
                </React.Fragment>
              )}
              <RepnotesFeaturePopoverButton onDialogOpen={openProductDialog} />
            </React.Fragment>
          )}
        </FeatureSectionBox>
        <RepnotesProductFeatureTabs
          onClickEdit={handleEditFeature}
          onClickDelete={handleDeleteFeature}
          standardMachineFeature={map(
            product.standardMachineFeature,
            (data) => ({
              ...data,
            })
          )}
          optionalMachineFeature={map(
            product.optionalMachineFeature,
            (data: any) => ({
              ...data,
            })
          )}
          disabled={tabsDisabled}
        />
      </FeatureSectionContainer>

      <RepnotesFeatureForm
        label={dialogOption}
        open={dialogOpen}
        onClear={handleClearProductDialog}
        onAlertOpen={handleAlertOpen}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (dialogOption === "standard")
            featureStandardInput("name", e.target.value);
          else featureOptionalInput("name", e.target.value);
        }}
        hasMedia={hasDialogMedia}
        media={
          dialogOption === "standard"
            ? standardMachineFeatureImage
            : optionalMachineFeatureImage
        }
        onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (dialogOption === "standard")
            setFeatureMedia(e.target.files, "standardMachineFeature");
          else setFeatureMedia(e.target.files, "optionalMachineFeature");
        }}
        onDeleteMediaClick={() => {
          if (dialogOption === "standard") {
            handleDeleteFeatureImage("standard");
          } else {
            handleDeleteFeatureImage("optional");
          }
        }}
        name={
          dialogOption === "standard"
            ? standardMachineFeature?.name
            : optionalMachineFeature?.name
        }
        onSubfeatureInput={handleSubFeatureInput}
        standardMachineFeature={standardMachineFeature}
        optionalMachineFeature={optionalMachineFeature}
        onSaveFeature={handleSaveFeature}
        disabled={formDisabled}
      />
    </>
  );
};

export default RepnotesProductFeatureSection;

const FeatureSectionContainer = (props: GridProps) => {
  return (
    <Grid item xs={12} style={{ marginTop: 20, position: "relative" }}>
      {props.children}
    </Grid>
  );
};

const FeatureSectionBox = (props: BoxProps) => {
  return (
    <Box
      p={0}
      style={{
        display: "flex",
        position: "absolute",
        zIndex: 999,
        right: 0,
        top: 8,
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
      {props.children}
    </Box>
  );
};
