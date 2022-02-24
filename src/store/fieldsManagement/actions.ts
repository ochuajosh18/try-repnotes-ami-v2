import { AppThunk } from "../index";
import {
  ADD_FIELD,
  Alert,
  CALL_FIELDS_API,
  CALL_FIELDS_API_SUCCESS,
  defaultAlert,
  defaultModal,
  DELETE_FIELD,
  EDIT_FIELD,
  Field,
  FieldsMngtAction,
  FieldsModule,
  FieldsModuleType,
  LOAD_FIELDS,
  Modal,
  REORDER_FIELDS,
  SET_ACTIVE_FIELD_MODULE,
  SET_COMPANY_FOR_FIELDS,
  SET_FIELDS_ALERT,
  SET_FIELDS_MODAL,
  SET_NOTES_DEFAULT_SECTION,
} from "./types";
import { executeApiCall } from "./utils";

const url = "module-fields";

// Action Creators
const callFieldsApi = (): FieldsMngtAction => ({ type: CALL_FIELDS_API });
const callFieldsApiSuccess = (): FieldsMngtAction => ({
  type: CALL_FIELDS_API_SUCCESS,
});
const callFieldsApiFailed = (error: string | null): FieldsMngtAction => ({
  type: CALL_FIELDS_API_SUCCESS,
  payload: error,
});
const loadFields = (data: FieldsModule[]): FieldsMngtAction => ({
  type: LOAD_FIELDS,
  payload: data,
});
export const setCompanyForFields = (companyId: string): FieldsMngtAction => ({
  type: SET_COMPANY_FOR_FIELDS,
  payload: companyId,
});

export const setActiveFieldModule = (fieldModuleName: FieldsModuleType): FieldsMngtAction => ({
  type: SET_ACTIVE_FIELD_MODULE,
  payload: fieldModuleName,
});

export const setNotesDefaultSection = (moduleId: string): FieldsMngtAction => ({
  type: SET_NOTES_DEFAULT_SECTION,
  payload: moduleId,
});

export const setReorderedFields = (
  fieldModuleId: string,
  fieldsArrKey: keyof FieldsModule,
  reorderedFields: Field[]
): FieldsMngtAction => ({
  type: REORDER_FIELDS,
  payload: { fieldModuleId, fieldsArrKey, reorderedFields },
});

export const addNewField =
  (fieldModuleId: string, section: string, field: Partial<Field>): AppThunk =>
  async (dispatch) => {
    const id = `FIELD::${field?.title?.toUpperCase().split(" ").join("::")}`;
    const newField = { ...field, id, row: 1, column: 1 };
    dispatch({
      type: ADD_FIELD,
      payload: { field: newField, fieldModuleId, section },
    });

    dispatch(setFieldsMngtModal(null));

    dispatch(
      setFieldsMngtAlert({
        type: "success",
        message: "The field was added successfully!",
        open: true,
      })
    );
  };

export const editField =
  (
    fieldModuleId: string,
    oldSection: string,
    section: string,
    fieldId: string,
    updatedField: Partial<Field>
  ): AppThunk =>
  async (dispatch, getState) => {
    dispatch({
      type: EDIT_FIELD,
      payload: { fieldId, updatedField, fieldModuleId, section, oldSection },
    });

    dispatch(setFieldsMngtModal(null));

    dispatch(
      setFieldsMngtAlert({
        type: "success",
        message: "The field was updated successfully!",
        open: true,
      })
    );
  };

export const deleteField =
  (fieldModuleId: string, section: string, fieldId: string): AppThunk =>
  async (dispatch) => {
    dispatch({
      type: DELETE_FIELD,
      payload: { fieldModuleId, section, fieldId },
    });

    dispatch(setFieldsMngtModal(null));

    dispatch(
      setFieldsMngtAlert({
        type: "success",
        message: "The field was deleted successfully!",
        open: true,
      })
    );
  };

// ALERT & MODAL
export const setFieldsMngtAlert = (alert: Alert | null): FieldsMngtAction => ({
  type: SET_FIELDS_ALERT,
  payload: {
    alert: alert ? alert : defaultAlert,
  },
});

export const setFieldsMngtModal = (modal: Modal | null): FieldsMngtAction => ({
  type: SET_FIELDS_MODAL,
  payload: {
    modal: modal ? modal : defaultModal,
  },
});

// Async Actions
/**
 *
 * @param companyId the selected company id
 * @description Gets the fields from the server
 */
export const fetchFields =
  (companyId: string | null): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(callFieldsApi());

      const system = getState().system;
      const token = system.session.token;
      const _companyId = companyId ? companyId : system.session.userDetails.companyId;

      const response = await executeApiCall(token).get(`${url}?companyId=${_companyId}`);

      dispatch(loadFields(response.data));
      dispatch(callFieldsApiSuccess());
    } catch (err: any) {
      dispatch(callFieldsApiFailed(err.message));
      dispatch(
        setFieldsMngtAlert({
          type: "error",
          message: err.message,
          open: true,
        })
      );
    }
  };

export const saveFieldModules =
  (moduleId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(callFieldsApi());
      const state = getState();
      const token = state.system.session.token;
      const fieldModule = state.fieldsMngtState.data.find((d) => d.id === moduleId);

      if (!fieldModule) return dispatch(callFieldsApiFailed("No field module found."));

      await executeApiCall(token).put(`${url}/${moduleId}`, fieldModule);

      dispatch(callFieldsApiSuccess());
      dispatch(
        setFieldsMngtAlert({
          type: "success",
          message: "Changes were saved successfully!",
          open: true,
        })
      );
    } catch (err: any) {
      dispatch(callFieldsApiFailed(err.message));
      dispatch(
        setFieldsMngtAlert({
          type: "error",
          message: err.message,
          open: true,
        })
      );
    }
  };
