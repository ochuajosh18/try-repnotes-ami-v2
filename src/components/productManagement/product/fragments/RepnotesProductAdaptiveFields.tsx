import React from "react";
import Grid from "@material-ui/core/Grid";
import { ProductDetails, Media } from "../../../../store/productManagement/product/types";
import { InputType, RepnotesInput } from "../../../common/RepnotesInput";
import { FieldInputs } from "../../../fieldsManagement/shared/constants";
import { inputTypeMap } from "../../../../util/constants";
import RepnotesMediaPreview from "../../../common/RepnotesMediaPreview";
import { ListMapType } from "../../utils/hooks";
import { mapToOptions } from "../../../../util/utils";
import RepnotesDateRangeInput from "../../../common/RepnotesDateRangeInput";

interface AdaptiveFieldsProps {
  field: FieldInputs;
  disabled: boolean;
  isForAddedFields?: boolean;
  fieldDetails: ProductDetails | Record<string, string | any[]>;
  listMngtMap: ListMapType;
  errorMap?: Record<string, boolean>;
  handleDeleteMedia: (type: string, name: string) => void;
  handleProductInput: (field: string, value: string | number | boolean | Array<string>) => void;
  handleProductMedia: (value: FileList | null, key: string, isMultiple: boolean) => void;
}

const RepnotesProductAdaptiveFields = (props: AdaptiveFieldsProps) => {
  const {
    field,
    disabled,
    isForAddedFields,
    fieldDetails,
    handleProductMedia,
    handleDeleteMedia,
    handleProductInput,
    listMngtMap,
    errorMap,
  } = props;

  if (!field || !fieldDetails) return null;

  const isMedia = field.type === "Multimedia";
  const isMediaPreviewDisabled = disabled;
  const fileType = field.accepts
    ? (field.accepts[0].split("/")[0] as "video" | "image" | "pdf")
    : "image";

  function getDropdownOptionsProps(field: FieldInputs) {
    const ddTypes = ["Dropdown", "Searchable Dropdown"];
    const { name, dataType, data, type, values } = field;
    if (name === "status") {
      return { autocompleteOptions: [], options: STATUS_ARRAY };
    }

    if (ddTypes.includes(type as string)) {
      if (dataType === "List Management") {
        return listMngtMap[data as string];
      }

      return mapToOptions(values as string[]);
    }

    return { autocompleteOptions: [], options: [] };
  }

  if (field.type === "Date Picker") {
    return (
      <RepnotesDateRangeInput
        value={fieldDetails[field.name] as string}
        onChange={(dateRangeStr) => handleProductInput(field.name, dateRangeStr)}
        label={field.title}
        dateRangeType={field.dateRangeType}
      />
    );
  }

  return (
    <React.Fragment>
      <RepnotesInput
        id={field.name}
        label={field.title}
        labelPosition='left'
        type={inputTypeMap[field.type as string] as InputType}
        disabled={disabled}
        placeholder={field.type?.includes("down") ? "" : field.title}
        value={!isMedia ? (fieldDetails[field.name] as any) : undefined}
        uploadLabel={`Upload ${field.title}`}
        fileAccepts={field.accepts?.join(", ")}
        multiUpload={field.isMultiple}
        uploadIcon
        error={errorMap ? errorMap[field.name] : undefined}
        disableAutocompletePopover
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (isMedia) {
            handleProductMedia(e.target.files, field.name, field.isMultiple);
          } else {
            handleProductInput(field.name, e.target.value);
          }
        }}
        onSelectChange={(
          e: React.ChangeEvent<{
            name?: string;
            value: unknown;
          }>
        ) => {
          handleProductInput(field.name, e.target.value as string);
        }}
        onAutocompleteChange={(e, o) => {
          handleProductInput(field.name, o ? o.value : "");
        }}
        {...getDropdownOptionsProps(field)}
      />
      {field.type === "Multimedia" &&
        fieldDetails &&
        fieldDetails[field.name] &&
        (fieldDetails[field.name] as Media[]).length > 0 && (
          <Grid container justify='center'>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <RepnotesMediaPreview
                mediaList={fieldDetails[field.name] as Media[]}
                onDeleteClick={handleDeleteMedia}
                disabled={isMediaPreviewDisabled}
                type={fileType}
                propertyKey={isForAddedFields ? field.name : undefined}
              />
            </Grid>
          </Grid>
        )}
    </React.Fragment>
  );
};

export default RepnotesProductAdaptiveFields;

// INITIAL VALUES
const STATUS_ARRAY = [
  { id: "true", name: "Active" },
  { id: "false", name: "Inactive" },
];
