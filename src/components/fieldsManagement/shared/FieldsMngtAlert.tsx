import React, { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { useDispatch } from "react-redux";
import { setFieldsMngtAlert } from "../../../store/fieldsManagement/actions";

interface FieldsMngtAlertProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}
function FieldsMngtAlert(props: FieldsMngtAlertProps) {
  const dispatch = useDispatch();
  const { open, message, severity } = props;

  useEffect(() => {
    dispatch(setFieldsMngtAlert(null));
  }, [dispatch]);

  function handleClose() {
    dispatch(setFieldsMngtAlert(null));
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert variant='filled' severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default FieldsMngtAlert;
