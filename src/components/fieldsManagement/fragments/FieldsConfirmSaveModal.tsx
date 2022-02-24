import React from "react";
import FieldsModal from "../shared/FieldsModal";

interface FieldsConfirmSaveModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

const FieldsConfirmSaveModal = (props: FieldsConfirmSaveModalProps) => {
  const { open, onConfirm, onClose, loading } = props;
  return (
    <FieldsModal
      modalFor='confirm-save'
      onActionClick={onConfirm}
      onClose={onClose}
      open={open}
      title='Save Fields'
      actionButtonText={loading ? "Saving..." : "Confirm"}
    >
      <FieldsModal.Content>
        <FieldsModal.Text>
          Saving the fields will result to permanent changes. Click Confirm to
          continue.
        </FieldsModal.Text>
      </FieldsModal.Content>
    </FieldsModal>
  );
};

export default FieldsConfirmSaveModal;
