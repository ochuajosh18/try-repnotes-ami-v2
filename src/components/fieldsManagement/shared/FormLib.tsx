import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup, { RadioGroupProps } from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select, { SelectProps } from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CheckIcon from "@material-ui/icons/CheckCircle";
import { appColors } from "./constants";

interface FormRadioGroupProps extends RadioGroupProps {
  options: { label: string; value: any }[];
}

export const FormRadioGroup = (props: FormRadioGroupProps) => {
  const { options, ...radioProps } = props;
  return (
    <RadioGroup
      {...radioProps}
      style={{ color: appColors.gray, paddingTop: "3px", ...radioProps.style }}
    >
      {options.map((item) => (
        <FormControlLabel
          key={item.value}
          style={{ height: radioProps.row ? "auto" : "32px" }}
          value={item.value}
          control={
            <Radio
              checkedIcon={
                <CheckIcon style={{ color: appColors.theme.primary.main }} />
              }
            />
          }
          label={item.label}
        />
      ))}
    </RadioGroup>
  );
};

interface FormSelectProps extends SelectProps {
  options?: { id: string | number; label: string; value: any }[];
}

export const FormSelect = (props: FormSelectProps) => {
  const { options, ...selectProps } = props;
  return (
    <Select
      name='type'
      margin='dense'
      variant='outlined'
      style={{ marginTop: "3px", fontSize: "12px" }}
      {...selectProps}
    >
      {options &&
        options.map((item) => (
          <MenuItem key={item.id} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
    </Select>
  );
};
