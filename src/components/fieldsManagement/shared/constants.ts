import { DateRangeType, FieldTypes, MediaType } from "../../../store/fieldsManagement/types";

export const appColors = {
  white: "#fff",
  offWhite: "#d2d6de",
  light: "#F8F9FB",
  gray: "#aaa",
  lightGray: "#C6C6C6",
  darkViolet: "#272B75",
  text: "#222",
  theme: {
    primary: { main: "#49BCF8", hover: "#272B75" },
    success: { main: "#50AF44", hover: "#006400" },
    danger: { main: "#d73925", hover: "#d73925" },
    warning: { main: "#F49C12", hover: "#F49C12" },
    secondary: { main: "#C6C6C6", hover: "#aaa" },
  },
  border: "1px solid #eee",
};

export const FieldTypesArray: {
  id: number;
  label: string;
  value: FieldTypes;
}[] = [
  { id: 1, label: "Input Text", value: "Input Text" },
  { id: 2, label: "Input Number", value: "Input Number" },
  { id: 3, label: "Input Email", value: "Input Email" },
  { id: 4, label: "Date Picker", value: "Date Picker" },
  // { id: 5, label: "Radio Button", value: "Radio Button" },
  { id: 6, label: "Dropdown", value: "Dropdown" },
  { id: 7, label: "Searchable Dropdown", value: "Searchable Dropdown" },
  { id: 8, label: "Multiline Text", value: "Multiline Text" },
  { id: 9, label: "Multimedia", value: "Multimedia" },
  {
    id: 10,
    label: "Service Ranking & Comment",
    value: "Service Ranking & Comment",
  },
];

export const SectionsArray = [
  { id: "addedFields", label: "Added Fields", value: "addedFields" },
  {
    id: "unassignedFields",
    label: "Unassigned Fields",
    value: "unassignedFields",
  },
];

export const SectionsArrayWithDef = [
  {
    id: "defaultFields",
    label: "Default Fields",
    value: "defaultFields",
  },
  { id: "addedFields", label: "Added Fields", value: "addedFields" },
  {
    id: "unassignedFields",
    label: "Unassigned Fields",
    value: "unassignedFields",
  },
];

export interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  modalFor?: string;
}

export interface FieldInputs {
  name: string;
  type: FieldTypes;
  isActive: boolean;
  isRequired: boolean;
  title: string;
  defaultValue?: string;
  values?: string[];
  selectionType: "Single" | "Multiple";
  isMultiple: boolean;
  accepts: MediaType[];
  data: string;
  dataType?: string;
  dateRangeType: DateRangeType;
}

export const fieldInitialValues: FieldInputs = {
  name: "",
  title: "",
  isActive: true,
  isRequired: false,
  isMultiple: false,
  accepts: ["image/*"],
  selectionType: "Single",
  type: null,
  values: [],
  data: "",
  dataType: "List Management",
  dateRangeType: "open",
};

export type ModalTypes = "edit" | "delete" | null;

export const AcceptedDateRangeArray: { label: string; value: DateRangeType }[] = [
  { label: "Past", value: "past" },
  { label: "Past To Present", value: "past-to-present" },
  { label: "Open", value: "open" },
  { label: "Present To Future", value: "present-to-future" },
  { label: "Future", value: "future" },
];

export const MediaAcceptOptions: { label: string; value: MediaType }[] = [
  { label: "Image", value: "image/*" },
  { label: "Video", value: "video/*" },
];

export const IsRequiredOptions: { label: string; value: string }[] = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const listMngtItems = `
  Product,
  Customer,
  Customer Type,
  Location,
  Category,
  Industry,
  Product Family,
  Make,
  Turnover,
  Tier,
  Internation/Local,
  Government/Private,
  Branch`;

export const getListMngtItems = () =>
  listMngtItems.split(",\n").map((i) => ({ id: i, label: i.trim(), value: i.trim() }));
