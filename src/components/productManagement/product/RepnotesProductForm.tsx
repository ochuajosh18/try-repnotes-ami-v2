import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, match } from "react-router-dom";
import { AppState } from "../../../store";
// import { AlertState } from '../../../store/alert/types';
import { DialogState } from "../../../store/dialog/types";
import { SystemState } from "../../../store/system/types";
import { ProductFamilyState } from "../../../store/listManagement/productFamily/types";
import {
  Media,
  OptionalMachineFeature,
  ProductDetails,
  ProductState,
  StandardMachineFeature,
  SubFeature,
} from "../../../store/productManagement/product/types";
import { CategoryState } from "../../../store/listManagement/category/types";
import { MakeState } from "../../../store/listManagement/make/types";
import {
  clearProductDialog,
  deleteProductImage,
  deleteProductVideo,
  loadProductDetails,
  setProductDialogOpen,
  setProductState,
  saveStandardMachineFeature,
  saveOptionalMachineFeature,
  loadFeatureDetails,
  deleteStandardFeatureImage,
  deleteOptionalFeatureImage,
  deleteStandardFeature,
  deleteOptionalFeature,
  setProductValidationState,
  saveProduct,
  updateProduct,
  importProductFeature,
  saveProductFeature,
} from "../../../store/productManagement/product/actions";
import { getMakeList } from "../../../store/listManagement/make/actions";
import { getCategoryList } from "../../../store/listManagement/category/actions";
import { getProductFamilyList } from "../../../store/listManagement/productFamily/actions";
import { clearDialog, setDialogOpen } from "../../../store/dialog/actions";
import { setRedirect } from "../../../store/system/actions";
import { openAlert } from "../../../store/alert/actions";
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { RepnotesInput } from "../../common/RepnotesInput";
import {
  RepnotesDefaultButton,
  RepnotesPrimaryButton,
} from "../../common/RepnotesButton";
import {
  LoadingDialog,
  // RepnotesAlert,
  RepnotesDialog,
} from "../../common/RepnotesAlerts";
import { RepnotesProductFeatureTabs } from "./RepnotesProductFeatureTabs";
import { RepnotesFeatureForm } from "./RepnotesFeatureForm";
import { RepnotesFeaturePopoverButton } from "./RepnotesFeaturePopover";
// import { RepnotesMediaList } from '../../common/RepnotesMediaList';
import RepnotesMediaPreview from "../../common/RepnotesMediaPreview";

// material
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

// utils
import forEach from "lodash/forEach";
import map from "lodash/map";
import filter from "lodash/filter";
import RepnotesFeatureGetTemplateButton from "./fragments/RepnotesFeatureGetTemplateButton";
import RepnotesFeatureImportButton from "./fragments/RepnotesFeatureImportButton";
import RepnotesFeatureImport from "./fragments/RepnotesFeatureImport";

interface MatchParams {
  params: { id: string };
}

interface RouteParams extends RouteComponentProps {
  match: match & MatchParams;
}

interface RepnotesProductFormProps {
  getProductFamilyList: typeof getProductFamilyList;
  getMakeList: typeof getMakeList;
  getCategoryList: typeof getCategoryList;
  saveProduct: typeof saveProduct;
  setProductState: typeof setProductState;
  updateProduct: typeof updateProduct;
  setProductValidationState: typeof setProductValidationState;
  loadProductDetails: typeof loadProductDetails;
  deleteProductImage: typeof deleteProductImage;
  deleteProductVideo: typeof deleteProductVideo;
  saveStandardMachineFeature: typeof saveStandardMachineFeature;
  saveOptionalMachineFeature: typeof saveOptionalMachineFeature;
  loadFeatureDetails: typeof loadFeatureDetails;
  deleteStandardFeature: typeof deleteStandardFeature;
  deleteOptionalFeature: typeof deleteOptionalFeature;
  deleteStandardFeatureImage: typeof deleteStandardFeatureImage;
  deleteOptionalFeatureImage: typeof deleteOptionalFeatureImage;
  setProductDialogOpen: typeof setProductDialogOpen;
  clearProductDialog: typeof clearProductDialog;
  openAlert: typeof openAlert;
  setRedirect: typeof setRedirect;
  setDialogOpen: typeof setDialogOpen;
  clearDialog: typeof clearDialog;
  importProductFeature: typeof importProductFeature;
  saveProductFeature: typeof saveProductFeature;
  system: SystemState;
  productState: ProductState;
  productFamilyState: ProductFamilyState;
  categoryState: CategoryState;
  makeState: MakeState;
  // alert: AlertState;
  dialog: DialogState;
}

const STATUS_ARRAY = [
  { id: "true", name: "Active" },
  { id: "false", name: "Inactive" },
];

const EMPTY_PRODUCT = {
  companyId: "",
  modelName: "",
  categoryId: "",
  description: "",
  productFamilyId: "",
  keyFeatures: "",
  makeId: "",
  price: "",
  image: [],
  video: [],
  standardMachineFeature: [],
  optionalMachineFeature: [],
  isActive: true,
  id: "",
} as ProductDetails;

const EMPTY_STANDARD_FEATURE = {
  id: "",
  name: "",
  image: {
    name: "",
    path: "",
    size: 0,
    type: "",
  },
  subFeature: [],
} as StandardMachineFeature;

const EMPTY_OPTIONAL_FEATURE = {
  id: "",
  name: "",
  image: {
    name: "",
    path: "",
    size: 0,
    type: "",
  },
  subFeature: [],
} as OptionalMachineFeature;

class RepnotesProductForm extends Component<
  RepnotesProductFormProps & RouteParams
> {
  componentDidMount = () => {
    if (this.props.match.params.id === "new") {
      this.props.setProductState({
        product: {
          ...EMPTY_PRODUCT,
          companyId: this.props.productState.selectedCompanyId,
        },
        standardMachineFeature: EMPTY_STANDARD_FEATURE,
        optionalMachineFeature: EMPTY_OPTIONAL_FEATURE,
      });
    } else {
      this.props.loadProductDetails(
        this.props.match.params.id,
        this.props.system.session.token
      );
    }
    this._loadQuery();
  };

  _loadQuery = () => {
    this.props.getProductFamilyList(
      this.props.system,
      this.props.productState.selectedCompanyId
    );
    this.props.getMakeList(
      this.props.system,
      this.props.productState.selectedCompanyId
    );
    this.props.getCategoryList(
      this.props.system,
      this.props.productState.selectedCompanyId
    );
  };

  _onOpenDialog = () => {
    this.props.setDialogOpen({
      dialogOpen: true,
      dialogLabel: this.props.productState.product
        ? this.props.productState.product.modelName
        : "",
      dialogType: "save",
      docId: "",
    });
  };

  _onEditFeature = (id: string, type: string) => {
    this.props.loadFeatureDetails(
      id,
      this.props.productState.product as ProductDetails,
      type
    );
    this.props.setProductDialogOpen(type);
  };

  _onDeleteFeature = (id: string, type: string) => {
    if (type === "standard") {
      this.props.deleteStandardFeature(
        this.props.productState.product as ProductDetails,
        id
      );
    } else {
      this.props.deleteOptionalFeature(
        this.props.productState.product as ProductDetails,
        id
      );
    }
  };

  _onProductDialogOpen = (option: string) => {
    this.props.setProductState({
      standardMachineFeature: { ...EMPTY_STANDARD_FEATURE, subFeature: [] },
      optionalMachineFeature: { ...EMPTY_OPTIONAL_FEATURE, subFeature: [] },
    });
    this.props.setProductDialogOpen(option);
  };

  _onClearProductDialog = () => {
    this.props.clearProductDialog();
  };

  _onCloseDialog = () => {
    this.props.clearDialog();
    this._onsaveProduct();
  };

  _onAlertOpen = (msg: string, type: string) => {
    this.props.openAlert(msg, type);
  };

  _onsaveProduct = () => {
    if (this.props.match.params.id === "new") {
      this.props.saveProduct(
        this.props.productState.product as ProductDetails,
        this.props.system,
        this.props.productState.selectedCompanyId
      );
    } else {
      this.props.updateProduct(
        this.props.productState.product,
        this.props.system
      );
    }
  };

  _onClickSave = () => {
    const { product } = this.props.productState;
    if (product) {
      let required = [
        "modelName",
        "price",
        "productFamilyId",
        "categoryId",
        "makeId",
      ];
      let requiredFieldCount = 0;
      forEach(required, (item, index) => {
        if (product[item] === "") {
          this.props.setProductValidationState({ validation: true });
          requiredFieldCount++;
        }
      });
      if (requiredFieldCount === 0) this._onOpenDialog();
    }
  };

  _productInput = (
    field: string,
    value: string | number | boolean | Array<string>
  ) => {
    const { product } = this.props.productState;
    const newProduct = { ...product, [field]: value };
    this.props.setProductState({ product: newProduct });
  };

  _featureStandardInput = (
    field: string,
    value: string | number | boolean | Array<string>
  ) => {
    const { standardMachineFeature } = this.props.productState;
    const newFeature = { ...standardMachineFeature, [field]: value };
    this.props.setProductState({ standardMachineFeature: newFeature });
  };

  _featureOptionalInput = (
    field: string,
    value: string | number | boolean | Array<string>
  ) => {
    const { optionalMachineFeature } = this.props.productState;
    const newFeature = { ...optionalMachineFeature, [field]: value };
    this.props.setProductState({ optionalMachineFeature: newFeature });
  };

  _subFeatureInput = (
    field: string,
    value: string | number | Array<SubFeature> | Array<string>,
    type: string
  ) => {
    const { optionalMachineFeature, standardMachineFeature } =
      this.props.productState;
    const newStandardFeature = { ...standardMachineFeature, [field]: value };
    const newOptionalFeature = { ...optionalMachineFeature, [field]: value };
    this.props.setProductState({
      [type]:
        type === "standardMachineFeature"
          ? newStandardFeature
          : newOptionalFeature,
    });
  };

  _saveFeature = (type: string) => {
    if (type === "standard") {
      this.props.saveStandardMachineFeature(
        this.props.productState.product as ProductDetails,
        this.props.productState.standardMachineFeature
      );
    } else {
      this.props.saveOptionalMachineFeature(
        this.props.productState.product as ProductDetails,
        this.props.productState.optionalMachineFeature
      );
    }
  };

  _setProductMedia = (value: FileList | null, type: string) => {
    const { product } = this.props.productState;
    if (product && value) {
      let media: Array<Media> = [];
      for (const v of value)
        media = [
          ...media,
          {
            path: "",
            name: (v as File).name,
            size: (v as File).size,
            type: (v as File).type,
            file: v as File,
          },
        ];
      this.props.setProductState({
        product: {
          ...product,
          [type]: [...(product[type] as Array<Media>), ...media],
        } as typeof product,
      });
    }
  };

  _setFeatureMedia = (value: FileList | null, type: string) => {
    const { standardMachineFeature, optionalMachineFeature } =
      this.props.productState;
    if ((standardMachineFeature || optionalMachineFeature) && value) {
      const feature =
        type === "standardMachineFeature"
          ? standardMachineFeature
          : optionalMachineFeature;
      let media: Array<Media> = [];
      for (const v of value)
        media = [
          ...media,
          {
            path: "",
            name: (v as File).name,
            size: (v as File).size,
            type: (v as File).type,
            file: v as File,
          },
        ];
      this.props.setProductState({ [type]: { ...feature, image: media[0] } });
    }
  };

  _onDeleteMedia = (type: string, name: string) => {
    const { product } = this.props.productState;
    if (product) {
      this.props.setProductState({
        product: {
          ...product,
          [type]: filter(product[type] as Array<Media>, (m) => m.name !== name),
        },
      });
    }
  };

  _onDeleteProductImage = (name?: string) => {
    const { product } = this.props.productState;
    this.props.deleteProductImage(product, name);
  };

  _onDeleteProductVideo = (name?: string) => {
    const { product } = this.props.productState;
    this.props.deleteProductVideo(product, name);
  };

  _onDeleteFeatureImage = (type: string) => {
    const { standardMachineFeature, optionalMachineFeature } =
      this.props.productState;
    if (type === "standard") {
      this.props.deleteStandardFeatureImage(standardMachineFeature);
    } else {
      this.props.deleteOptionalFeatureImage(optionalMachineFeature);
    }
  };

  render() {
    const { modules } = this.props.system.session;
    const {
      product,
      validation,
      loading,
      dialogOpen,
      dialogOption,
      standardMachineFeature,
      featureImportType,
      optionalMachineFeature,
      featureImportDialogOpen,
      importFeatureList,
      importLoading,
    } = this.props.productState;
    const { productFamilyList } = this.props.productFamilyState;
    const { makeList } = this.props.makeState;
    const { categoryList } = this.props.categoryState;
    let filteredProductFamilyList = productFamilyList.filter(
      (item) => item.isActive
    );
    let filteredMakeList = makeList.filter((item) => item.isActive);
    let filteredCategoryList = categoryList.filter((item) => item.isActive);
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
    return (
      <Box className='repnotes-content'>
        {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
        <RepnotesFeatureImport
          open={featureImportDialogOpen}
          loading={importLoading}
          importData={importFeatureList}
          onClear={() =>
            this.props.setProductState({
              featureImportDialogOpen: false,
              importFeatureList: [],
            })
          }
          onSave={() => this.props.saveProductFeature()}
          type={featureImportType}
        />
        <RepnotesDialog
          label={this.props.dialog.dialogLabel}
          open={this.props.dialog.dialogOpen}
          severity={this.props.dialog.dialogType}
          onClick={this._onCloseDialog.bind(this)}
          onClear={this.props.clearDialog}
        />
        <RepnotesFeatureForm
          label={dialogOption}
          open={dialogOpen}
          onClear={this._onClearProductDialog}
          onAlertOpen={this._onAlertOpen}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (dialogOption === "standard")
              this._featureStandardInput("name", e.target.value);
            else this._featureOptionalInput("name", e.target.value);
          }}
          hasMedia={hasDialogMedia}
          media={
            dialogOption === "standard"
              ? standardMachineFeatureImage
              : optionalMachineFeatureImage
          }
          onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (dialogOption === "standard")
              this._setFeatureMedia(e.target.files, "standardMachineFeature");
            else
              this._setFeatureMedia(e.target.files, "optionalMachineFeature");
          }}
          onDeleteMediaClick={() => {
            if (dialogOption === "standard") {
              this._onDeleteFeatureImage("standard");
            } else {
              this._onDeleteFeatureImage("optional");
            }
          }}
          name={
            dialogOption === "standard"
              ? standardMachineFeature?.name
              : optionalMachineFeature?.name
          }
          onSubfeatureInput={this._subFeatureInput}
          standardMachineFeature={
            standardMachineFeature as StandardMachineFeature
          }
          optionalMachineFeature={
            optionalMachineFeature as OptionalMachineFeature
          }
          onSaveFeature={this._saveFeature}
          disabled={
            !modules.product.edit && this.props.match.params.id !== "new"
              ? true
              : false
          }
        />
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
          <RepnotesDefaultButton
            onClick={() =>
              this.props.setRedirect({
                shallRedirect: true,
                redirectTo: "/product",
              })
            }
          >
            Cancel
          </RepnotesDefaultButton>
          {(modules.product.edit || this.props.match.params.id === "new") && (
            <>
              {loading ? (
                <RepnotesPrimaryButton>
                  <CircularProgress
                    style={{
                      display: "flex",
                      width: 20,
                      height: 20,
                      color: "#fff",
                      padding: 3,
                    }}
                  />
                </RepnotesPrimaryButton>
              ) : (
                <RepnotesPrimaryButton
                  className='no-margin-right'
                  onClick={this._onClickSave.bind(this)}
                >
                  Save
                </RepnotesPrimaryButton>
              )}
            </>
          )}
        </Grid>
        <Grid className='repnotes-form' container justify='center' spacing={1}>
          {product ? (
            <Grid container>
              <Grid item xs={12} style={{ marginBottom: 15 }}>
                <Typography
                  style={{
                    textAlign: "left",
                    color: "#272B75",
                    fontSize: "1rem",
                    fontWeight: 600,
                    padding: "0px 10px 5px 10px",
                    borderBottom: "1px solid #f4f4f4",
                  }}
                >
                  Model Details
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <RepnotesInput
                  id='repnotes-product-model-name'
                  type='text'
                  placeholder='Model Name'
                  label='Model Name'
                  labelPosition='left'
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && product.modelName === ""
                      ? true
                      : false
                  }
                  value={product.modelName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._productInput("modelName", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-product-product-family'
                  type='searchabledropdown'
                  label='Product Family'
                  labelPosition='left'
                  autocompleteOptions={map(filteredProductFamilyList, (f) => ({
                    label: f.name,
                    value: f.id,
                  }))}
                  onAutocompleteChange={(e, o) => {
                    this._productInput("productFamilyId", o ? o.value : "");
                  }}
                  disableAutocompletePopover={true}
                  value={product.productFamilyId}
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && product.productFamilyId === ""
                      ? true
                      : false
                  }
                  options={map(filteredProductFamilyList, (data) => ({
                    id: data.id,
                    name: data.name,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._productInput(
                      "productFamilyId",
                      e.target.value as string
                    );
                  }}
                />
                <RepnotesInput
                  id='repnotes-product-category'
                  type='searchabledropdown'
                  label='Category'
                  labelPosition='left'
                  autocompleteOptions={map(filteredCategoryList, (f) => ({
                    label: f.name,
                    value: f.id,
                  }))}
                  onAutocompleteChange={(e, o) => {
                    this._productInput("categoryId", o ? o.value : "");
                  }}
                  disableAutocompletePopover={true}
                  value={product.categoryId}
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && product.categoryId === ""
                      ? true
                      : false
                  }
                />
                <RepnotesInput
                  id='repnotes-product-description'
                  type='multiline'
                  placeholder='Description'
                  label='Description'
                  labelPosition='left'
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && product.description === ""
                      ? true
                      : false
                  }
                  value={product.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._productInput("description", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-product-image'
                  type='file'
                  label='Image'
                  labelPosition='left'
                  multiUpload={true}
                  uploadLabel='Upload Image'
                  uploadIcon={true}
                  fileAccepts='image/png, image/gif, image/jpeg, image/jpg'
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._setProductMedia(e.target.files, "image");
                  }}
                />
                {product.image.length > 0 && (
                  <Grid container justify='center'>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={8}>
                      <RepnotesMediaPreview
                        mediaList={product.image}
                        onDeleteClick={this._onDeleteMedia}
                        disabled={
                          !modules.product.edit &&
                          this.props.match.params.id !== "new"
                            ? true
                            : false
                        }
                        type='image'
                      />
                      {/* <RepnotesMediaList
                                            cols={3}
                                            data={map (product.image, (data) => ({
                                                ...data,
                                                title: data.name,
                                                img: `${API_URL}${data.path}`
                                            }))}
                                            mediaType="image"
                                            onDeleteClick={this._onDeleteProductImage}
                                            disabled={(!modules.product.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                        /> */}
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={6}>
                <RepnotesInput
                  id='repnotes-product-make'
                  type='searchabledropdown'
                  label='Make'
                  labelPosition='left'
                  value={product.makeId}
                  autocompleteOptions={map(filteredMakeList, (f) => ({
                    label: f.name,
                    value: f.id,
                  }))}
                  onAutocompleteChange={(e, o) => {
                    this._productInput("makeId", o ? o.value : "");
                  }}
                  disableAutocompletePopover={true}
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && product.makeId === ""
                      ? true
                      : false
                  }
                />
                <RepnotesInput
                  id='repnotes-product-price'
                  type='text'
                  placeholder='Price'
                  label='Price'
                  labelPosition='left'
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && product.price === ""
                      ? true
                      : false
                  }
                  value={product.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._productInput(
                      "price",
                      e.target.value !== ""
                        ? e.target.value.replace(/[^0-9]/g, "")
                        : ""
                    );
                  }}
                />
                <RepnotesInput
                  id='repnotes-product-status'
                  type='select'
                  label='Status'
                  labelPosition='left'
                  value={product.isActive}
                  options={STATUS_ARRAY}
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: string | any }>
                  ) => {
                    this._productInput(
                      "isActive",
                      e.target.value === "true" ? true : false
                    );
                  }}
                />
                <RepnotesInput
                  id='repnotes-product-key-feature'
                  type='multiline'
                  placeholder='Key Feature'
                  label='Key Feature'
                  labelPosition='left'
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && product.keyFeatures === ""
                      ? true
                      : false
                  }
                  value={product.keyFeatures}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._productInput("keyFeatures", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-product-video'
                  type='file'
                  label='Video'
                  labelPosition='left'
                  multiUpload={true}
                  uploadLabel='Upload Video'
                  uploadIcon={true}
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  fileAccepts='video/mp4, video/m4v, video/mov'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._setProductMedia(e.target.files, "video");
                  }}
                />
                {product.video && (
                  <Grid container justify='center'>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={8}>
                      <RepnotesMediaPreview
                        mediaList={product.video}
                        onDeleteClick={this._onDeleteMedia}
                        disabled={
                          !modules.product.edit &&
                          this.props.match.params.id !== "new"
                            ? true
                            : false
                        }
                        type='video'
                      />
                      {/* <RepnotesMediaList
                                            cols={3}
                                            data={map (product.video, (data) => ({
                                                ...data,
                                                title: data.name,
                                                img: `${API_URL}${data.path}`
                                            }))}
                                            mediaType="video"
                                            onDeleteClick={this._onDeleteProductVideo}
                                            disabled={(!modules.product.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                        /> */}
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                style={{ marginTop: 20, position: "relative" }}
              >
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
                  {(modules.product.edit ||
                    this.props.match.params.id === "new") && (
                    <>
                      {product.id && (
                        <>
                          <RepnotesFeatureGetTemplateButton />
                          <RepnotesFeatureImportButton
                            onTriggerImportClick={(featureName, e) => {
                              if (e.target.files) {
                                this.props.importProductFeature(
                                  e.target.files[0],
                                  featureName
                                );
                              }
                            }}
                          />
                        </>
                      )}
                      <RepnotesFeaturePopoverButton
                        onDialogOpen={this._onProductDialogOpen}
                      />
                    </>
                  )}
                </Box>
                <RepnotesProductFeatureTabs
                  onClickEdit={this._onEditFeature}
                  onClickDelete={this._onDeleteFeature}
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
                  disabled={
                    !modules.product.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                />
              </Grid>
            </Grid>
          ) : (
            <LoadingDialog />
          )}
        </Grid>
      </Box>
    );
  }
}

export const mapStateToProps = (state: AppState) => ({
  system: state.system,
  // alert: state.alert,
  makeState: state.makeState,
  productFamilyState: state.productFamilyState,
  productState: state.productState,
  categoryState: state.categoryState,
  dialog: state.dialog,
});

export default connect(mapStateToProps, {
  getProductFamilyList,
  getMakeList,
  getCategoryList,
  setProductState,
  loadProductDetails,
  updateProduct,
  setProductValidationState,
  deleteProductImage,
  deleteProductVideo,
  saveStandardMachineFeature,
  saveOptionalMachineFeature,
  deleteStandardFeatureImage,
  deleteOptionalFeatureImage,
  loadFeatureDetails,
  deleteStandardFeature,
  deleteOptionalFeature,
  setProductDialogOpen,
  clearProductDialog,
  saveProduct,
  openAlert,
  setRedirect,
  setDialogOpen,
  clearDialog,
  importProductFeature,
  saveProductFeature,
})(RepnotesProductForm);
