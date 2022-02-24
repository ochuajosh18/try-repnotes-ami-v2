import React from "react";
import FieldsModal from "../shared/FieldsModal";

interface FieldDeleteModalProps {
  open: boolean;
  onDelete: () => void;
  onClose: () => void;
  entityToDelete?: string;
}

const FieldDeleteModal = (props: FieldDeleteModalProps) => {
  const { open, onDelete, onClose, entityToDelete } = props;
  return (
    <FieldsModal
      modalFor='delete'
      onActionClick={onDelete}
      onClose={onClose}
      open={open}
      title='Delete Field'
      actionButtonText='Delete'
      type='danger'
    >
      <FieldsModal.Content>
        <FieldsModal.Text>
          Please note that deleting this {entityToDelete} will make permanent
          changes. Click <FieldsModal.Span>Delete</FieldsModal.Span> to
          continue.
        </FieldsModal.Text>
      </FieldsModal.Content>
    </FieldsModal>
  );
};

export default FieldDeleteModal;
