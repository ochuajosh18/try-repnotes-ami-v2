import React from "react";
import FieldsMngtAlert from "../shared/FieldsMngtAlert";
import {
  deleteField,
  editField,
  setFieldsMngtModal,
} from "../../../store/fieldsManagement/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveFieldModuleId,
  selectFieldsMngtAlertState,
  selectFieldsMngtModalState,
} from "../../../store/fieldsManagement/selectors";
import FieldDeleteModal from "./FieldDeleteModal";
import FieldsAddFormModal from "./FieldAddFormModal";
import { FieldInputs } from "../shared/constants";

const FieldsAlertAndModal = () => {
  const dispatch = useDispatch();

  const fieldModuleId = useSelector(selectActiveFieldModuleId);
  const modal = useSelector(selectFieldsMngtModalState);
  const alert = useSelector(selectFieldsMngtAlertState);
  const { open: modalOpen, type, target } = modal;

  function handleModalClose() {
    dispatch(setFieldsMngtModal(null));
  }

  function handleFieldDelete() {
    if (!fieldModuleId) return;
    const { activeFieldId, activeSectionId } = modal;
    if (!activeFieldId || !activeSectionId) return;
    dispatch(deleteField(fieldModuleId, activeSectionId, activeFieldId));
  }

  function handleFieldEditSave(section: string, fieldInputs: FieldInputs) {
    if (!fieldModuleId) return;
    const { activeFieldId, activeSectionId } = modal;
    if (!activeFieldId || !activeSectionId) return;
    const oldSection = activeSectionId;
    dispatch(
      editField(fieldModuleId, oldSection, section, activeFieldId, fieldInputs)
    );
  }

  return (
    <>
      <FieldDeleteModal
        entityToDelete='field'
        open={modalOpen && type === "delete" && target === "field"}
        onDelete={handleFieldDelete}
        onClose={handleModalClose}
      />
      <FieldsMngtAlert
        message={alert.message}
        open={alert.open}
        severity={alert.type}
      />
      <FieldsAddFormModal
        onClose={handleModalClose}
        open={modalOpen && type === "edit" && target === "field"}
        title='Edit Field'
        modalFor='editing field'
        formType='edit'
        onSave={handleFieldEditSave}
      />
    </>
  );
};

export default FieldsAlertAndModal;
