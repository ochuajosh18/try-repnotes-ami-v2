import { CustomerDetails } from "../store/customerManagement/customer/types";
import {
  OptionalMachineFeature,
  ProductDetails,
  StandardMachineFeature,
} from "../store/productManagement/product/types";

export const inputTypeMap: Record<string, string> = {
  "Input Text": "text",
  "Input Number": "number",
  "Input Email": "email",
  "Multiline Text": "multiline",
  Dropdown: "select",
  "Searchable Dropdown": "searchabledropdown",
  Multimedia: "file",
  "Date Picker": "daterange",
};

export const EMPTY_PRODUCT = {
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

export const EMPTY_STANDARD_FEATURE = {
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

export const EMPTY_OPTIONAL_FEATURE = {
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

// CUSTOMER
export const EMPTY_CUSTOMER = {
  companyId: "",
  name: "",
  isActive: true,
  customerTypeId: "",
  industryId: "",
  internationalLocalId: "",
  fleetSize: "",
  branch: "",
  streetAddress: "",
  area: "",
  province: "",
  cityTown: "",
  category: "",
  groupName: "",
  salesPersonDocId: "",
  governmentPrivateId: "",
  tierId: "",
  turnOverId: "",
  contactNo1: "",
  contactNo2: "",
  email: "",
  internalTag: "",
  additionalNotes: "",
  status: "Approved",
  id: "",
} as CustomerDetails;

export const STATUS_ARRAY = [
  { id: "true", name: "Active" },
  { id: "false", name: "Inactive" },
];

export const CUSTOMER_CATEGORY_ARRAY = [
  { id: "Mother", name: "Mother" },
  { id: "Child", name: "Child" },
];

export const appColors = {
  white: "#fff",
  offWhite: "#d2d6de",
  light: "#F8F9FB",
  gray: "#aaa",
  lightGray: "#C6C6C6",
  darkViolet: "#272B75",
  violet: "#9195B5",
  text: "#222",
  active: "#4CAF50",
  inactive: "#DE4C38",
  primary: { main: "#49BCF8", hover: "#272B75" },
  success: { main: "#50AF44", hover: "#006400" },
  danger: { main: "#d73925", hover: "#d73925" },
  warning: { main: "#F49C12", hover: "#F49C12" },
  border: "1px solid #d2d6de",
};

export type TableColumn = {
  id: string;
  label: string;
  property?: string;
  key?: number | string;
  content?: (item: any, index: number) => void;
  sortable?: boolean;
  width?: number;
  flex?: number;
  minWidth?: number;
  align?: "left" | "center";
  textColor?: string;
};

export type Order = "asc" | "desc";
export type SortColumn = { path: string; order: Order };
export type TableOwnProps = {
  rowsPerPage: number;
  searchKeyword: string;
};

export interface AppTableHeadProps {
  columns: TableColumn[];
  sortColumn: SortColumn;
  onSort: (sortColumn: SortColumn) => void;
}

export interface AppTableBodyProps {
  data: any[];
  columns: TableColumn[];
  loading?: boolean;
}
