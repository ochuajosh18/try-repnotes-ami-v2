import { AnyAction } from "redux";

export interface FormatData {
  [property: string]:
    | string
    | number
    | boolean
    | Media
    | Array<Media>
    | StandardMachineFeature
    | OptionalMachineFeature
    | Array<StandardMachineFeature>
    | Array<OptionalMachineFeature>
    | Array<string>;
}

export interface DynamicObject<T> {
  [name: string]: T;
}

export interface SubFeature {
  name: string;
  price: string | number;
}

export interface OptionalMachineFeature extends DynamicObject<string | Array<string> | any> {
  id: string;
  name: string;
  image: Media;
  subFeature: Array<SubFeature>;
}

export interface StandardMachineFeature extends DynamicObject<string | Array<string> | any> {
  id: string;
  name: string;
  image: Media;
  subFeature: Array<string>;
}

export interface Media {
  name: string;
  path: string;
  size: string | number;
  type: string;
  file?: File;
}

export interface ProductDetails extends FormatData {
  companyId: string;
  modelName: string;
  categoryId: string;
  description: string;
  productFamilyId: string;
  keyFeatures: string;
  makeId: string;
  price: string | number;
  isActive: boolean;
  image: Array<Media>;
  video: Array<Media>;
  standardMachineFeature: Array<StandardMachineFeature>;
  optionalMachineFeature: Array<OptionalMachineFeature>;
  id: string;
}

export interface ProductState {
  productList: Array<ProductDetails>;
  product?: ProductDetails;
  loading: boolean;
  validation: boolean;
  dialogOpen: boolean;
  dialogOption: string;
  standardMachineFeature: StandardMachineFeature;
  optionalMachineFeature: OptionalMachineFeature;
  selectedCompanyId: string;
  importProductList: Array<ProductDetails>;
  importFeatureList: Array<StandardMachineFeature | OptionalMachineFeature>;
  importLoading: boolean;
  featureImportDialogOpen: boolean;
  featureImportType: "optional" | "standard";
}

export interface ProductInput {
  [name: string]:
    | string
    | number
    | boolean
    | Array<Media>
    | StandardMachineFeature
    | OptionalMachineFeature
    | Array<StandardMachineFeature>
    | Array<OptionalMachineFeature>
    | Array<string>
    | FormatData
    | SubFeature;
}

export interface SetProductSelectedCompanyFilter {
  selectedCompanyId: string;
}

export interface ProductValidation {
  validation: boolean;
}

export const SET_PRODUCT_STATE = "set_product_state";
export const DELETE_PRODUCT = "delete_product";

export interface SetProductStateInput {
  type: typeof SET_PRODUCT_STATE;
  payload: ProductState;
}

export interface DeleteProductAction {
  type: typeof DELETE_PRODUCT;
  payload: { id: string };
}

export type ProductAction = SetProductStateInput | DeleteProductAction | AnyAction;
