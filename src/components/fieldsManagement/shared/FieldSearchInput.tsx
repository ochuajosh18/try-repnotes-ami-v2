import React from "react";
import { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { BaseInput } from "./BaseInput";

interface FieldSearchInputProps {
  onClear: () => void;
}

const FieldSearchInput = ({ onClear, ...rest }: FieldSearchInputProps & TextFieldProps) => {
  return (
    <BaseInput
      {...rest}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon style={{ paddingLeft: 0, color: "#272B75" }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment component='div' position='end'>
            {(rest.value as string) && (
              <IconButton
                aria-label='clear search'
                size='small'
                edge='end'
                style={{ transform: "translateX(8px)" }}
                onClick={onClear}
              >
                <ClearIcon style={{ paddingRight: 0, color: "#272B75", fontSize: "18px" }} />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
      margin='dense'
      variant='outlined'
      type='text'
    />
  );
};

export default FieldSearchInput;
