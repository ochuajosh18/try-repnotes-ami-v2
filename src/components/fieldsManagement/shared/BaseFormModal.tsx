import React, { ReactNode } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { styled } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { appColors } from "./constants";
import FieldsButton from "./FieldsButton";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

type FormModalProps = {
  onClose: () => void;
  onSave?: () => void;
  title: string;
  modalFor: string;
  saveButtonText?: string;
  children: ReactNode;
  hasCloseBtn?: boolean;
  open: boolean;
};

const FormModalContent = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  return (
    <DialogContent style={{ width: 430, maxHeight: 400 }}>
      {children}
    </DialogContent>
  );
};

const FormModal = ({
  onClose,
  onSave,
  saveButtonText = "Save",
  title,
  modalFor,
  children,
  hasCloseBtn = false,
  open,
}: FormModalProps) => {
  if (!open) return null;

  return (
    <Dialog
      open
      keepMounted
      TransitionComponent={Transition}
      onClose={onClose}
      aria-labelledby={`edit-modal-${title}`}
      aria-describedby='alert-dialog-description'
      style={{ margin: "0 10px" }}
    >
      <DialogTitle id={`edit-modal-${title}`} style={{ fontSize: "12px" }}>
        {title}
        {hasCloseBtn && (
          <IconButton
            aria-label={`close ${modalFor} edit modal`}
            onClick={onClose}
            size='small'
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              color: appColors.gray,
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      {children}
      <DialogActions
        style={{
          padding: "5px 20px 20px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FieldsButton
          disableElevation
          onClick={onClose}
          btnType='outlined'
          style={{ flex: 1 }}
        >
          Cancel
        </FieldsButton>
        <FieldsButton disableElevation onClick={onSave} style={{ flex: 1 }}>
          {saveButtonText}
        </FieldsButton>
      </DialogActions>
    </Dialog>
  );
};

FormModal.Content = FormModalContent;
FormModal.Text = styled("div")({
  color: "#0000008A",
  marginBottom: "10px",
  lineHeight: 1.2,
});

FormModal.InputRow = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginBottom: "15px",
});

FormModal.InputLabel = styled("label")({
  fontSize: "12px",
  color: appColors.gray,
});

export default FormModal;
