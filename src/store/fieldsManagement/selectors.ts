import { AppState } from "../index";
import { FieldRecord, FieldsModule, ModuleName } from "./types";
import { formatSectionName } from "./utils";

export const selectCompanyIdForFields = (state: AppState) =>
  state.fieldsMngtState.currentCompanyId;

export const selectFieldsModule = (state: AppState) => {
  // this is the id of the notes module section
  const { notesDefaultSection, currentFieldModule, data } =
    state.fieldsMngtState;
  return currentFieldModule === "NOTES"
    ? data.find((d) => d.id === notesDefaultSection)
    : data.find((d) => d.module === currentFieldModule);
};

export const selectActiveFieldModuleId = (state: AppState) => {
  const { data, currentFieldModule, notesDefaultSection } =
    state.fieldsMngtState;
  if (currentFieldModule === "NOTES") return notesDefaultSection;
  const fieldModule = data.find((item) => item.module === currentFieldModule);
  if (!fieldModule) return null;
  return fieldModule.id;
};

export const selectCurrentFieldModule = (state: AppState) =>
  state.fieldsMngtState.currentFieldModule;

export const selectNotesDefaultSection = (state: AppState) =>
  state.fieldsMngtState.notesDefaultSection;

export const selectFieldsMap = (state: AppState) => {
  const { data, currentFieldModule, notesDefaultSection } =
    state.fieldsMngtState;
  const fieldsModule =
    currentFieldModule === "NOTES"
      ? data.find((d) => d.id === notesDefaultSection)
      : data.find((d) => d.module === currentFieldModule);

  if (!fieldsModule) return;

  const { defaultFields, addedFields, unassignedFields } =
    fieldsModule || ({} as FieldsModule);

  const fields = [
    ...defaultFields,
    ...addedFields,
    ...unassignedFields,
  ].reduce<FieldRecord>(
    (mapped, item) => ({ ...mapped, [item["id"]]: item }),
    {}
  );

  return fields;
};

// select the mapped sections list for NOTES
export const selectNotesFieldsDefaultSections = (state: AppState) => {
  const { currentFieldModule, data } = state.fieldsMngtState;
  if (currentFieldModule !== "NOTES") return null;

  const notesSections = data.filter(
    (d) => d.module !== "CUSTOMER" && d.module !== "PRODUCT"
  );
  return notesSections.map((item) => ({
    id: item.id,
    name: formatSectionName(item.module),
  }));
};

// select the modal state
export const selectFieldsMngtModalState = (state: AppState) =>
  state.fieldsMngtState.modal;

// select the alert state
export const selectFieldsMngtAlertState = (state: AppState) =>
  state.fieldsMngtState.alert;

// select the status
export const selectFieldsMngtStatus = (state: AppState) =>
  state.fieldsMngtState.status;

export const selectFieldsByModuleName =
  (moduleName: ModuleName) => (state: AppState) => {
    return (
      state.fieldsMngtState.data.find((d) => d.module === moduleName) ||
      ({} as FieldsModule)
    );
  };
