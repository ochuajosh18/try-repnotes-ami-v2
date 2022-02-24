import { ProductState, ProductAction, SET_PRODUCT_STATE, DELETE_PRODUCT } from "./types";

const INITIAL_STATE: ProductState = {
  productList: [],
  loading: false,
  validation: false,
  dialogOpen: false,
  dialogOption: "",
  standardMachineFeature: {
    id: "",
    name: "",
    image: {
      name: "",
      path: "",
      size: 0,
      type: "",
    },
    subFeature: [],
  },
  optionalMachineFeature: {
    id: "",
    name: "",
    image: {
      name: "",
      path: "",
      size: 0,
      type: "",
    },
    subFeature: [],
  },
  selectedCompanyId: "",
  importProductList: [],
  importLoading: false,
  importFeatureList: [],
  featureImportDialogOpen: false,
  featureImportType: "standard",
};

export function productReducers(state = INITIAL_STATE, action: ProductAction): ProductState {
  // if (action.type === DELETE_PRODUCT) console.log(action.payload.id);
  switch (action.type) {
    case SET_PRODUCT_STATE:
      return { ...state, ...action.payload };
    case DELETE_PRODUCT:
      return { ...state, productList: state.productList.filter((p) => p.id !== action.payload.id) };
    case "reset_product_management_state":
      return INITIAL_STATE;
    default:
      return state;
  }
}
