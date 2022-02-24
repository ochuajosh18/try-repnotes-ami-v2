import React from "react";
import { RepnotesInputChip } from "./RepnotesGeneralComponents";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import SearchIcon from "@material-ui/icons/Search";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withStyles } from "@material-ui/styles";
import { useTheme, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import FolderIcon from "@material-ui/icons/Folder";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ClearIcon from "@material-ui/icons/Clear";
import findIndex from "lodash/findIndex";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";

export type InputType =
  | "text"
  | "number"
  | "password"
  | "email"
  | "multiline"
  | "select"
  | "search"
  | "file"
  | "daterange"
  | "searchabledropdown";

interface RepnotesInputProps {
  type: InputType;
  id: string;
  placeholder?: string;
  label?: string;
  uploadLabel?: string;
  uploadIcon?: boolean;
  error?: boolean;
  labelPosition?: "top" | "left" | "right" | "bottom";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange?: (e: React.ChangeEvent<{ name?: string; value: string | unknown }>) => void;
  onClickDate?: () => void;
  options?: Array<{ [property: string]: string | number }>;
  value?: string | number | boolean | Array<string>;
  firstSelectOption?: string;
  disabled?: boolean;
  fieldSize?: "small";
  labelSize?: "small";
  multipleSelect?: boolean;
  multiUpload?: boolean;
  fileAccepts?: string;
  fileStartIcon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autocompleteOptions?: Array<{ label: string; value: string }>;
  onAutocompleteChange?: (
    e: React.ChangeEvent<{}>,
    value: { label: string; value: string } | null
  ) => void;
  onMultiselectAutocompleteChange?: (
    e: React.ChangeEvent<{}>,
    value: Array<{ label: string; value: string }> | null
  ) => void;
  disableAutocompletePopover?: boolean;
  inputHeight?: number;
  inputWidth?: string | number;
  onClear?: () => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "auto",
    },
  },
};

const getStyles = (name: string | number, selected: string[], theme: Theme) => {
  return {
    fontWeight:
      selected.indexOf(name as string) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

export const RepnotesTextField = withStyles(() => ({
  root: {
    color: "#272B75",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 12,
    "& label.Mui-focused": {
      color: "#d2d6de",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#d2d6de",
      },
      "&:hover fieldset": {
        borderColor: "#272B75",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#272B75",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: 12,
    },
  },
}))(TextField);

export const RepnotesSelect = withStyles(() => ({
  root: {
    width: "100%",
    color: "#000",
    fontSize: 12,
    padding: "2px 15px",
    margin: 0,
    lineHeight: 1,
    "& .MuiInput-underline": {
      "&:before": {
        border: "none",
      },
      "&:after": {
        borderBottom: "none",
      },
      "&:hover": {
        border: "none",
      },
    },
  },
}))(Select);

export const RepnotesCheckbox = withStyles(() => ({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
    borderColor: "#d2d6de",
    width: 20,
    height: 20,
    padding: 0,
    "&$checked": {
      color: "#49BCF8",
    },
  },
  checked: {},
}))(Checkbox);

export const RepnotesInput = (props: RepnotesInputProps) => {
  const theme = useTheme();
  const [passVisible, setPassVisible] = React.useState(false);
  const [eyeVisible, setEyeVisible] = React.useState(false);
  const [emailIsValid, setEmailIsValid] = React.useState(false);
  const {
    placeholder,
    onChange,
    onAutocompleteChange,
    onMultiselectAutocompleteChange,
    disableAutocompletePopover,
    autocompleteOptions,
    fileStartIcon,
    fileAccepts,
    id,
    type,
    value,
    label,
    labelPosition,
    error,
    onSelectChange,
    onClickDate,
    onFocus,
    onBlur,
    onKeyPress,
    options,
    disabled,
    fieldSize,
    labelSize,
    firstSelectOption,
    multipleSelect,
    multiUpload,
    uploadLabel,
    uploadIcon,
    onClear,
  } = props;

  // DEBUG
  // if (autocompleteOptions) console.log(autocompleteOptions);

  const searchableDropdownValueIndex = findIndex(props.autocompleteOptions, {
    value: value as string,
  });
  const searchableDropdownValue =
    searchableDropdownValueIndex > -1 && autocompleteOptions
      ? autocompleteOptions[searchableDropdownValueIndex]
      : null;
  const multipleSelectSearchableDropdownValue = filter(props.autocompleteOptions, (o) =>
    (value as Array<string>).includes(o.value)
  );
  return (
    <Box className='repnotes-input-container'>
      <Grid container>
        {labelPosition === "top" && (
          <Grid
            item
            xs={12}
            style={{ textAlign: "left" }}
            className='repnotes-input-label-container'
          >
            <Typography
              style={{
                fontSize: 12,
                fontWeight: 700,
                textAlign: "left",
                color: "#272B75",
              }}
            >
              {label}
            </Typography>
          </Grid>
        )}
        {labelPosition === "left" && (
          <Grid
            item
            className='repnotes-input-label-container'
            xs={labelSize === "small" ? 2 : 4}
            style={{
              textAlign: "right",
              paddingRight: "15px",
              paddingTop: "15px",
            }}
          >
            <Typography
              style={{
                padding: "3px 0",
                fontSize: 12,
                fontWeight: 700,
                color: "#272B75",
              }}
            >
              {label}
            </Typography>
          </Grid>
        )}
        <Grid
          item
          xs={
            labelPosition === "left" || labelPosition === "right"
              ? fieldSize === "small"
                ? 10
                : 8
              : 12
          }
        >
          {type === "password" && (
            <RepnotesTextField
              onFocus={onFocus}
              onBlur={onBlur}
              InputProps={
                eyeVisible
                  ? {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton edge='end' onClick={() => setPassVisible(!passVisible)}>
                            {passVisible ? (
                              <Visibility style={{ color: "#49BCF8" }} />
                            ) : (
                              <VisibilityOff style={{ color: "#49BCF8" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : {}
              }
              margin='dense'
              id={id}
              variant='outlined'
              fullWidth={true}
              type={passVisible ? "text" : "password"}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value !== "" ? setEyeVisible(true) : setEyeVisible(false);
              }}
              onKeyPress={onKeyPress}
            />
          )}
          {type === "email" && (
            <RepnotesTextField
              InputProps={
                emailIsValid
                  ? {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton edge='end'>
                            <CheckCircleIcon style={{ fontSize: 15, color: "#50AF44" }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : {}
              }
              error={error}
              margin='dense'
              id={id}
              variant='outlined'
              type='email'
              fullWidth={true}
              placeholder={placeholder}
              value={value}
              disabled={disabled}
              onChange={onChange}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                var pattern = new RegExp(
                  /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
                );
                pattern.test(e.target.value) && e.target.value !== ""
                  ? setEmailIsValid(true)
                  : setEmailIsValid(false);
              }}
              onKeyPress={onKeyPress}
            />
          )}
          {type === "text" && (
            <RepnotesTextField
              error={error}
              margin='dense'
              id={id}
              variant='outlined'
              type='text'
              fullWidth={true}
              disabled={disabled}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
          )}
          {type === "number" && (
            <RepnotesTextField
              error={error}
              margin='dense'
              id={id}
              variant='outlined'
              type='number'
              fullWidth={true}
              disabled={disabled}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          )}
          {type === "multiline" && (
            <RepnotesTextField
              multiline={true}
              rows={3}
              margin='dense'
              id={id}
              variant='outlined'
              fullWidth={true}
              type='text'
              disabled={disabled}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          )}
          {type === "select" && (
            <Box>
              {multipleSelect ? (
                <FormControl variant='outlined' fullWidth={true}>
                  <RepnotesSelect
                    multiple
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: 4,
                      margin: "6px 0",
                      padding: (value as string[]).length ? "3px 0" : "8px 0",
                      textAlign: "left",
                    }}
                    id={id}
                    value={value}
                    displayEmpty
                    error={error}
                    disabled={disabled}
                    onChange={onSelectChange}
                    input={<Input id='select-multiple-chip' />}
                    inputProps={{ id }}
                    renderValue={(selected) => {
                      if ((selected as string[]).length === 0) {
                        return <em style={{ fontStyle: "normal" }}>{" - Select - "}</em>;
                      } else {
                        return (
                          <Box style={{ display: "flex", flexWrap: "wrap" }}>
                            {(selected as string[]).map((value) => (
                              <Chip
                                key={value}
                                label={options?.find((data) => data.id === value)?.name}
                                style={{
                                  margin: "0 2px",
                                  height: 25,
                                  backgroundColor: "#121336",
                                  color: "#fff",
                                }}
                              />
                            ))}
                          </Box>
                        );
                      }
                    }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value='' disabled>
                      <em>{" - Select - "}</em>
                    </MenuItem>
                    {options && options.length > 0
                      ? options.map((options, keyIndex) => {
                          return (
                            <MenuItem
                              key={keyIndex}
                              value={options.id}
                              style={getStyles(options.name, value as string[], theme)}
                            >
                              {options.name}
                            </MenuItem>
                          );
                        })
                      : undefined}
                  </RepnotesSelect>
                </FormControl>
              ) : (
                <FormControl variant='outlined' style={{ margin: "4.5px 0" }} fullWidth={true}>
                  <RepnotesSelect
                    native
                    style={{ padding: "9px 2px" }}
                    id={id}
                    value={value}
                    error={error}
                    disabled={disabled}
                    onChange={onSelectChange}
                    inputProps={{ id }}
                  >
                    {firstSelectOption ? (
                      firstSelectOption === "all" && <option value=''>{" - All - "}</option>
                    ) : firstSelectOption === "removeall" ? (
                      ""
                    ) : (
                      <option value=''>{" - Select - "}</option>
                    )}
                    {options && options.length > 0
                      ? options.map((options, keyIndex) => {
                          return (
                            <option key={keyIndex} value={options.id}>
                              {options.name}
                            </option>
                          );
                        })
                      : undefined}
                  </RepnotesSelect>
                </FormControl>
              )}
            </Box>
          )}
          {type === "searchabledropdown" && (
            <Box>
              {multipleSelect ? (
                <Autocomplete
                  id={id}
                  multiple
                  value={multipleSelectSearchableDropdownValue} // unknown type due to keypairs
                  options={
                    autocompleteOptions && autocompleteOptions.length > 0
                      ? sortBy(autocompleteOptions, (a) => a.label.toLowerCase())
                      : []
                  }
                  renderOption={(option) => option.label || ""}
                  getOptionLabel={(option) => option.label || ""}
                  fullWidth={true}
                  renderInput={(props) => (
                    <RepnotesTextField
                      {...props}
                      error={error}
                      margin='dense'
                      id={id}
                      variant='outlined'
                      type='text'
                      fullWidth={true}
                      disabled={disabled}
                      placeholder={placeholder}
                    />
                  )}
                  renderTags={(value: Array<{ label: string; value: string }>, getTagProps) =>
                    value.map((option: { label: string; value: string }, index: number) => (
                      <RepnotesInputChip label={option.label} {...getTagProps({ index })} />
                    ))
                  }
                  onChange={onMultiselectAutocompleteChange}
                  PopperComponent={
                    !disableAutocompletePopover
                      ? (props) => {
                          const { className, anchorEl, style, ...rest } = props;
                          return (
                            <Box
                              {...rest}
                              id={`${id}-autocomplete-list`}
                              style={{
                                ...props.style,
                                position: "absolute",
                                top: 46,
                                width: "100%",
                                left: 0,
                                right: 0,
                                zIndex: 1300,
                              }}
                            >
                              {props.children}
                            </Box>
                          );
                        }
                      : undefined
                  }
                />
              ) : (
                <Autocomplete
                  id={id}
                  value={searchableDropdownValue} // unknown type due to keypairs
                  options={
                    autocompleteOptions && autocompleteOptions.length > 0
                      ? sortBy(autocompleteOptions, (a) => a.label.toLowerCase())
                      : []
                  }
                  renderOption={(option) => option.label || ""}
                  getOptionLabel={(option) => option.label || ""}
                  fullWidth={true}
                  renderInput={(props) => (
                    <RepnotesTextField
                      {...props}
                      error={error}
                      margin='dense'
                      id={id}
                      variant='outlined'
                      type='text'
                      fullWidth={true}
                      disabled={disabled}
                      placeholder={placeholder}
                    />
                  )}
                  onChange={onAutocompleteChange}
                  PopperComponent={
                    !disableAutocompletePopover
                      ? (props) => {
                          const { className, anchorEl, style, ...rest } = props;
                          return (
                            <Box
                              {...rest}
                              id={`${id}-autocomplete-list`}
                              style={{
                                ...props.style,
                                position: "absolute",
                                top: 46,
                                width: "100%",
                                left: 0,
                                right: 0,
                                zIndex: 1300,
                              }}
                            >
                              {props.children}
                            </Box>
                          );
                        }
                      : undefined
                  }
                />
              )}
            </Box>
          )}
          {type === "search" && (
            <RepnotesTextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon style={{ paddingLeft: 0, color: "#272B75", fontSize: "20px" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end' style={{ marginLeft: 0 }}>
                    {value && (
                      <IconButton
                        aria-label='clear search'
                        size='small'
                        edge='end'
                        style={{ transform: "translateX(8px)" }}
                        onClick={onClear}
                      >
                        <ClearIcon
                          style={{ paddingRight: 0, color: "#272B75", fontSize: "18px" }}
                        />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              margin='dense'
              id={id}
              variant='outlined'
              fullWidth={true}
              type='text'
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          )}
          {type === "daterange" && (
            <RepnotesTextField
              InputProps={{
                endAdornment: (
                  <IconButton onClick={disabled ? () => {} : onClickDate} style={{ padding: "0" }}>
                    <DateRangeIcon />
                  </IconButton>
                ),
              }}
              margin='dense'
              id={id}
              variant='outlined'
              fullWidth={true}
              type='text'
              disabled={disabled}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          )}
          {type === "file" && (
            <Box
              style={{
                width: props.inputWidth || "unset",
                textAlign: "left",
                margin: uploadIcon ? "6px 0" : 0,
              }}
            >
              <label htmlFor={id}>
                <input
                  style={{ display: "none" }}
                  id={id}
                  type='file'
                  disabled={disabled}
                  multiple={multiUpload}
                  value={value as string}
                  onChange={onChange}
                  accept={fileAccepts}
                />
                <Button
                  startIcon={fileStartIcon}
                  variant='contained'
                  component='span'
                  style={{
                    height: props.inputHeight ? props.inputHeight : 36,
                    width: props.inputWidth || "unset",
                    boxShadow: "none",
                    color: "#fff",
                    backgroundColor: "#49BCF8",
                    borderRadius: 3,
                    padding: 7,
                    paddingRight: 30,
                    paddingLeft: 30,
                    minWidth: 20,
                    alignSelf: "center",
                    textTransform: "none",
                  }}
                >
                  {uploadIcon && <FolderIcon style={{ marginRight: 5 }} />} {uploadLabel}
                </Button>{" "}
              </label>
            </Box>
          )}
        </Grid>
        {labelPosition === "right" && (
          <Grid
            item
            xs={2}
            style={{
              textAlign: "left",
              paddingLeft: "15px",
              paddingTop: "15px",
            }}
          >
            <Typography
              style={{
                padding: "3px 0",
                fontSize: 12,
                fontWeight: 700,
                color: "#272B75",
              }}
            >
              {label}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
