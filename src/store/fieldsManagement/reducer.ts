import {
  ADD_FIELD,
  CALL_FIELDS_API,
  CALL_FIELDS_API_FAILED,
  CALL_FIELDS_API_SUCCESS,
  defaultAlert,
  defaultModal,
  DELETE_FIELD,
  EDIT_FIELD,
  FieldsMngtAction,
  FieldsMngtState,
  LOAD_FIELDS,
  REORDER_FIELDS,
  SET_ACTIVE_FIELD_MODULE,
  SET_COMPANY_FOR_FIELDS,
  SET_FIELDS_ALERT,
  SET_FIELDS_MODAL,
  SET_NOTES_DEFAULT_SECTION,
} from "./types";

const INITIAL_STATE: FieldsMngtState = {
  data: [],
  status: "idle",
  error: null,
  currentCompanyId: null,
  currentFieldModule: "CUSTOMER",
  notesDefaultSection: null,
  modal: defaultModal,
  alert: defaultAlert,
};

export function fieldsReducer(state = INITIAL_STATE, action: FieldsMngtAction): FieldsMngtState {
  switch (action.type) {
    case CALL_FIELDS_API:
      return { ...state, status: "loading" };
    case CALL_FIELDS_API_SUCCESS:
      return { ...state, status: "success" };
    case CALL_FIELDS_API_FAILED:
      return { ...state, status: "failed", error: action.payload };
    case LOAD_FIELDS:
      return { ...state, data: action.payload };
    case SET_COMPANY_FOR_FIELDS:
      return { ...state, currentCompanyId: action.payload };
    case SET_ACTIVE_FIELD_MODULE:
      return { ...state, currentFieldModule: action.payload };
    case SET_NOTES_DEFAULT_SECTION:
      return { ...state, notesDefaultSection: action.payload };
    case ADD_FIELD: {
      const { fieldModuleId, section, field } = action.payload;
      const key = section as "addedFields" | "unassignedFields";
      return {
        ...state,
        data: state.data.map((d) =>
          d.id === fieldModuleId ? { ...d, [key]: [...d[key], field] } : d
        ),
      };
    }
    case EDIT_FIELD: {
      const { fieldModuleId, oldSection, section, fieldId, updatedField } = action.payload;

      const newSectionKey = section as "defaultFields" | "addedFields" | "unassignedFields";
      const oldSectionKey = oldSection as "defaultFields" | "addedFields" | "unassignedFields";

      return {
        ...state,
        data: state.data.map((d) =>
          d.id === fieldModuleId
            ? oldSectionKey === newSectionKey
              ? {
                  ...d,
                  [newSectionKey]: d[newSectionKey].map((f) =>
                    f.id === fieldId
                      ? { id: f.id, column: f.column, row: f.row, ...updatedField }
                      : f
                  ),
                }
              : {
                  ...d,
                  [newSectionKey]: [
                    ...d[newSectionKey],
                    { id: fieldId, row: 1, column: 1, ...updatedField },
                  ],
                  [oldSectionKey]: d[oldSectionKey].filter((f) => f.id !== fieldId),
                }
            : d
        ),
      };
    }
    case DELETE_FIELD: {
      const { fieldModuleId, section, fieldId } = action.payload;
      const key = section as "addedFields" | "unassignedFields";
      return {
        ...state,
        data: state.data.map((d) =>
          d.id === fieldModuleId ? { ...d, [key]: d[key].filter((f) => f.id !== fieldId) } : d
        ),
      };
    }

    case REORDER_FIELDS:
      return {
        ...state,
        data: state.data.map((d) =>
          d.id === action.payload.fieldModuleId
            ? {
                ...d,
                [action.payload.fieldsArrKey]: action.payload.reorderedFields,
              }
            : d
        ),
      };
    case SET_FIELDS_ALERT:
      return { ...state, alert: action.payload.alert };
    case SET_FIELDS_MODAL:
      return { ...state, modal: action.payload.modal };
    default:
      return state;
  }
}
