import React from "react";
import camelCase from "lodash/camelCase";
import { FieldInputs } from "../shared/constants";

type FieldKey = keyof FieldInputs;

const baseInputKeys: FieldKey[] = ["name", "title", "type", "isActive", "isRequired"];
const dropdownKeys: FieldKey[] = [...baseInputKeys, "selectionType", "values", "defaultValue"];
const listDropdownKeys: FieldKey[] = [...baseInputKeys, "selectionType", "data", "dataType"];
const mediaKeys: FieldKey[] = [...baseInputKeys, "isMultiple", "accepts"];
const datePickerKeys: FieldKey[] = [...baseInputKeys, "dateRangeType"];

export default function useFieldInputSanitizer() {
  function cleanInputs(input: FieldInputs, inputKeys: FieldKey[]) {
    Object.keys(input).forEach(
      (key) => !inputKeys.includes(key as FieldKey) && delete input[key as FieldKey]
    );
  }

  const fieldSanitizerFunc = React.useCallback((fieldInputs: FieldInputs) => {
    const inputs = { ...fieldInputs };

    const { title } = inputs;
    // inputs.name = title.trim().toLowerCase();
    inputs.name = camelCase(title);

    switch (fieldInputs.type) {
      case "Dropdown":
      case "Searchable Dropdown":
        cleanInputs(
          inputs,
          fieldInputs.dataType === "List Management" ? listDropdownKeys : dropdownKeys
        );
        break;
      case "Multimedia":
        cleanInputs(inputs, mediaKeys);
        break;
      case "Date Picker":
        cleanInputs(inputs, datePickerKeys);
        break;
      default:
        cleanInputs(inputs, baseInputKeys);
        break;
    }

    return inputs;
  }, []);

  return fieldSanitizerFunc;
}
