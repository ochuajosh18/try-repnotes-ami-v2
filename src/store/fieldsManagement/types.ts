import { AnyAction } from "redux";

// Entities Types
export interface BaseField {
  id: string;
  name: string;
  title: string;
  type: FieldTypes;
  row: number; // order
  column: number;
  isRequired: boolean;
  isActive: boolean;
}

export interface DropdownField extends BaseField {
  defaultValue: string;
  values: string[];
  selectionType: "Single" | "Multiple";
}

export interface ListManagementField extends BaseField {
  data: string;
  dataType: string;
  selectionType: "Single" | "Multiple";
}

export interface ServiceRankingAndCommentField extends BaseField {
  defaultValue: string;
  selectionType: "Single" | "Multiple";
}

export interface MultimediaField extends BaseField {
  isMultiple: boolean;
  accepts: MediaType[];
}

export interface DatePickerField extends BaseField {
  dateRangeType: DateRangeType;
}

export type MediaType = "video/*" | "image/*";

export type DateRangeType = "past" | "past-to-present" | "open" | "present-to-future" | "future";

export type Field =
  | BaseField
  | DropdownField
  | ListManagementField
  | ServiceRankingAndCommentField
  | MultimediaField
  | DatePickerField;

export type SectionIdType = "unassigned_fields" | "added_fields" | "default_fields";

// will add more
export type FieldTypes =
  | "Input Text"
  | "Input Number"
  | "Input Email"
  | "Date Picker"
  | "Radio Button"
  | "Dropdown"
  | "Multiline Text"
  | "Service Ranking & Comment"
  | "Searchable Dropdown"
  | "Multimedia"
  | null;

export type FieldsModuleType = "CUSTOMER" | "PRODUCT" | "NOTES" | "ADAPT"; // adapt is for testing
export type Status = "idle" | "loading" | "success" | "failed";
export type ModalTypes = "add" | "edit" | "delete" | null;
export type AlertTypes = "success" | "info" | "warning" | "error";

export type ModuleName = "CUSTOMER" | "PRODUCT"; // add the notes modules later

export interface Modal {
  open: boolean;
  type: ModalTypes;
  target: "section" | "field" | null;
  activeFieldId: string | null;
  activeSectionId: string | null;
}

export interface Alert {
  open: boolean;
  message: string;
  type: AlertTypes;
}

export interface FieldsModule {
  columnNumber: number;
  companyId: string;
  module: string;
  id: string;
  dateUpdated: string;
  addedFields: Field[];
  defaultFields: Field[];
  unassignedFields: Field[];
}

export interface FieldsMngtState {
  data: FieldsModule[];
  status: Status;
  currentCompanyId: string | null;
  currentFieldModule: FieldsModuleType;
  notesDefaultSection: string | null;
  modal: Modal;
  alert: Alert;
  error: string | null | undefined;
}

export type FieldRecord = Record<string, Field>;
// Action Types
export const CALL_FIELDS_API = "fields/api/call/start";
export const CALL_FIELDS_API_SUCCESS = "fields/api/call/success";
export const CALL_FIELDS_API_FAILED = "fields/api/call/failed";
export const SET_FIELDS_ALERT = "fields/set/alert";
export const SET_FIELDS_MODAL = "fields/set/modal";

export const LOAD_FIELDS = "fields/load";
export const SET_COMPANY_FOR_FIELDS = "fields/set/companyId";
export const SET_ACTIVE_FIELD_MODULE = "fields/set/activeFieldModule";
export const SET_NOTES_DEFAULT_SECTION = "fields/set/notes/defaultSection";
export const REORDER_FIELDS = "fields/reorder";
export const ADD_FIELD = "fields/add";
export const DELETE_FIELD = "fields/delete";
export const EDIT_FIELD = "fields/edit";

export interface CallFieldsApiAction {
  type: typeof CALL_FIELDS_API;
  payload: null;
}

export interface CallFieldsApiSuccessAction {
  type: typeof CALL_FIELDS_API_SUCCESS;
  payload: null;
}

export interface CallFieldsApiFailedAction {
  type: typeof CALL_FIELDS_API_FAILED;
  payload: string | null;
}

export interface LoadFieldsAction {
  type: typeof LOAD_FIELDS;
  payload: FieldsModule[];
}

export interface SetCompanyForFieldsAction {
  type: typeof SET_COMPANY_FOR_FIELDS;
  payload: string | null;
}

export interface SetActiveFieldModuleAction {
  type: typeof SET_ACTIVE_FIELD_MODULE;
  payload: FieldsModuleType;
}

export interface SetNotesDefaultSectionAction {
  type: typeof SET_NOTES_DEFAULT_SECTION;
  payload: string;
}

export interface ReorderFieldsAction {
  type: typeof REORDER_FIELDS;
  payload: {
    fieldModuleId: string;
    fieldsArrKey: keyof FieldsModule;
    reorderedFields: Field[];
  };
}

export interface SetFieldsAlertAction {
  type: typeof SET_FIELDS_ALERT;
  payload: {
    alert: Alert;
  };
}
export interface SetFieldsModalAction {
  type: typeof SET_FIELDS_MODAL;
  payload: {
    modal: Modal;
  };
}

export interface AddFieldAction {
  type: typeof ADD_FIELD;
  payload: {
    fieldModuleId: string;
    field: Field;
    section: string;
  };
}

export interface EditFieldAction {
  type: typeof EDIT_FIELD;
  payload: {
    fieldModuleId: string;
    fieldId: string;
    oldSection: string;
    section: string;
    updatedField: Field;
  };
}

export interface DeleteFieldAction {
  type: typeof DELETE_FIELD;
  payload: {
    fieldModuleId: string;
    fieldId: string;
    section: string;
  };
}

export type FieldsMngtAction =
  | AnyAction
  | CallFieldsApiAction
  | CallFieldsApiSuccessAction
  | CallFieldsApiFailedAction
  | LoadFieldsAction
  | SetCompanyForFieldsAction
  | SetActiveFieldModuleAction
  | SetNotesDefaultSectionAction
  | ReorderFieldsAction
  | SetFieldsAlertAction
  | SetFieldsModalAction
  | AddFieldAction
  | EditFieldAction
  | DeleteFieldAction;

// Constants
export const defaultAlert: Alert = {
  open: false,
  message: "",
  type: "success",
};

export const defaultModal: Modal = {
  open: false,
  type: null,
  activeFieldId: null,
  activeSectionId: null,
  target: null,
};
