import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  resetTimer,
  timerIsRunning,
} from "../../store/forgot-password/actions";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";

interface RepnotesButtonProps {
  label?: string;
  interval?: number;
  startTimer?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "delete" | "edit" | "view" | "modify";
  docId?: string | number;
  link?: string;
}

export const RepnotesPrimaryButton = withStyles(() => ({
  root: {
    height: 35,
    color: "#fff",
    backgroundColor: "#49BCF8",
    borderRadius: 3,
    padding: 7,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 30,
    paddingLeft: 30,
    minWidth: 20,
    alignSelf: "center",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#272B75",
    },
  },
}))(Button);

export const RepnotesSuccessButton = withStyles(() => ({
  root: {
    height: 35,
    color: "#fff",
    backgroundColor: "#50AF44",
    padding: 7,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 30,
    paddingLeft: 30,
    minWidth: 20,
    alignSelf: "center",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#006400",
    },
  },
}))(Button);

export const RepnotesDangerButton = withStyles(() => ({
  root: {
    height: 35,
    color: "#fff",
    backgroundColor: "#d73925",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 30,
    paddingLeft: 30,
    minWidth: 20,
    alignSelf: "center",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#d73925",
    },
  },
}))(Button);

export const RepnotesDefaultButton = withStyles(() => ({
  root: {
    height: 35,
    color: "#272B75",
    backgroundColor: "#f4f4f4",
    padding: 10,
    paddingRight: 30,
    paddingLeft: 30,
    minWidth: 20,
    alignSelf: "center",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#e6e6e6",
      borderColor: "#adadad",
    },
  },
}))(Button);

export const RepnotesWarningButton = withStyles(() => ({
  root: {
    height: 35,
    color: "#fff",
    backgroundColor: "#F49C12",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 30,
    paddingLeft: 30,
    minWidth: 20,
    alignSelf: "center",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#F49C12",
    },
  },
}))(Button);

export const RepnotesIconButton = withStyles(() => ({
  root: {
    height: 35,
    backgroundColor: "transparent",
    padding: "0",
    margin: "0 3px",
    minWidth: 20,
    alignSelf: "center",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}))(Button);

export const RepnotesAddButton = withStyles(() => ({
  root: {
    height: 35,
    color: "#fff",
    backgroundColor: "#49BCF8",
    padding: 7,
    marginLeft: 10,
    alignSelf: "center",
    textTransform: "none",
    minWidth: 20,
    "&:hover": {
      backgroundColor: "#272B75",
    },
  },
}))(Button);

export const RepnotesLinkIconButton = withStyles(() => ({
  root: {
    height: 14,
    backgroundColor: "transparent",
    paddingTop: "0",
    margin: "0 3px",
    minWidth: 20,
    alignSelf: "center",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "transparent",
      cursor: "pointer",
    },
  },
}))(Box);

export const RepnotesLinkDefaultButton = withStyles(() => ({
  root: {
    height: 14,
    color: "#272B75",
    backgroundColor: "#f4f4f4",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 30,
    paddingLeft: 30,
    minWidth: 23,
    borderRadius: 3,
    alignSelf: "center",
    textTransform: "none",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#e6e6e6",
      borderColor: "#adadad",
    },
  },
}))(Box);

export const RepnotesLinkPrimaryButton = withStyles(() => ({
  root: {
    height: 14,
    color: "#fff",
    backgroundColor: "#49BCF8",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 30,
    paddingLeft: 30,
    minWidth: 23,
    borderRadius: 3,
    alignSelf: "center",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#272B75",
    },
  },
}))(Box);

export const RepnotesLinkDangerButton = withStyles(() => ({
  root: {
    height: 14,
    color: "#fff",
    backgroundColor: "#d73925",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 30,
    paddingLeft: 30,
    minWidth: 20,
    borderRadius: 3,
    alignSelf: "center",
    textTransform: "none",
  },
}))(Box);

export const RepnotesActionButton = (props: RepnotesButtonProps) => {
  const { link, docId, type, onClick } = props;

  return (
    <Box>
      {type === "edit" && (
        <Link to={`/${link}/${docId}`} style={{ textTransform: "none" }}>
          <RepnotesLinkIconButton>
            <EditIcon
              style={{ fontSize: 20, color: "#9195B5", marginTop: 7 }}
            />
          </RepnotesLinkIconButton>
        </Link>
      )}
      {type === "modify" && (
        <RepnotesIconButton onClick={onClick}>
          <EditIcon style={{ fontSize: 20, color: "#9195B5" }} />
        </RepnotesIconButton>
      )}
      {type === "view" && (
        <RepnotesIconButton onClick={onClick}>
          <VisibilityIcon style={{ fontSize: 20, color: "#9195B5" }} />
        </RepnotesIconButton>
      )}
      {type === "delete" && (
        <RepnotesIconButton onClick={onClick}>
          <DeleteIcon style={{ fontSize: 20, color: "#d73925" }} />
        </RepnotesIconButton>
      )}
    </Box>
  );
};

export const RepnotesBackButton = (props: RepnotesButtonProps) => {
  const history = useHistory();

  const { label } = props;

  return (
    <RepnotesDefaultButton onClick={() => history.goBack()}>
      {label}
    </RepnotesDefaultButton>
  );
};

export const RepnotesCountdownButton = (props: RepnotesButtonProps) => {
  const { label, interval, startTimer, onClick } = props;

  const [counter, setCounter] = React.useState(parseInt(`${interval}`));

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (startTimer) {
      const timer = setInterval(() => setCounter(counter - 1), 1000);
      if (counter === 0) {
        dispatch(resetTimer());
      }
      return () => clearInterval(timer);
    } else {
      setCounter(parseInt(`${interval}`));
    }
    // eslint-disable-next-line
  }, [counter, startTimer]);

  const onTimerResend = () => {
    dispatch(timerIsRunning());
  };

  return (
    <RepnotesPrimaryButton
      onClick={counter === parseInt(`${interval}`) ? onClick : onTimerResend}
    >
      {label}
      {startTimer ? `(${counter})` : ""}
    </RepnotesPrimaryButton>
  );
};
