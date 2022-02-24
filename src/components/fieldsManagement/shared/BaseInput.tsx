import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/styles";
import { appColors } from "./constants";

const { offWhite, darkViolet } = appColors;

export const BaseInput = withStyles(() => ({
  root: {
    color: darkViolet,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 12,
    "& label.Mui-focused": {
      color: offWhite,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: offWhite,
      },
      "&:hover fieldset": {
        borderColor: darkViolet,
      },
      "&.Mui-focused fieldset": {
        borderColor: darkViolet,
      },
    },
    "& .MuiInputBase-input": {
      fontSize: 12,
    },
  },
}))(TextField);
