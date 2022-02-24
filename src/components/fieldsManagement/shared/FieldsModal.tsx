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

type FieldsModalProps = {
  onClose: () => void;
  onActionClick: () => void;
  title: string;
  modalFor: string;
  actionButtonText?: string;
  children?: ReactNode;
  hasCloseBtn?: boolean;
  open: boolean;
  type?: "primary" | "danger" | "success" | "warning";
};

const Content = ({ children }: { children: ReactNode }): JSX.Element => {
  return <DialogContent style={{ width: 350 }}>{children}</DialogContent>;
};

const FieldsModal = ({
  onClose,
  onActionClick,
  actionButtonText = "Confirm",
  type = "primary",
  title,
  modalFor,
  children,
  hasCloseBtn = false,
  open,
}: FieldsModalProps): JSX.Element => {
  return (
    <Dialog
      open={open}
      keepMounted
      TransitionComponent={Transition}
      onClose={onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      style={{ margin: "0 10px" }}
    >
      <DialogTitle id='alert-dialog-title' style={{ fontSize: "12px" }}>
        {title}
        {hasCloseBtn && (
          <IconButton
            aria-label={`close ${modalFor} ${type} modal`}
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
      <DialogActions style={{ padding: "5px 20px 20px 20px" }}>
        <FieldsButton
          disableElevation
          onClick={onClose}
          btnColor={type}
          btnType='outlined'
        >
          Cancel
        </FieldsButton>
        <FieldsButton disableElevation onClick={onActionClick} btnColor={type}>
          {actionButtonText}
        </FieldsButton>
      </DialogActions>
    </Dialog>
  );
};

FieldsModal.Content = Content;
FieldsModal.Text = styled("div")({
  color: "#0000008A",
  marginBottom: "10px",
  lineHeight: 1.2,
  fontSize: "13px !important",
});
FieldsModal.Span = styled("span")({
  fontSize: "inherit !important",
  // borderBottom: "2px solid",
  // borderBottomColor: appColors.theme.danger.main,
});
export default FieldsModal;
