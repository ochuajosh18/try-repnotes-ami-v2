import React from "react";
import Grid from "@material-ui/core/Grid";
import { InputType, RepnotesInput } from "../../../common/RepnotesInput";
import { FieldInputs } from "../../../fieldsManagement/shared/constants";
import RepnotesMediaPreview from "../../../common/RepnotesMediaPreview";
import { ListMapType } from "../../utils/hooks";
import { inputTypeMap } from "../../../../util/constants";
import { mapToOptions } from "../../../../util/utils";
import { CustomerDetails, Media } from "../../../../store/customerManagement/customer/types";
import filter from "lodash/filter";
import map from "lodash/map";
import RepnotesDateRangeInput from "../../../common/RepnotesDateRangeInput";

interface AdaptiveFieldsProps {
  field: FieldInputs;
  disabled: boolean;
  isForAddedFields?: boolean;
  fieldDetails: CustomerDetails | Record<string, string | any[]>;
  customerList?: CustomerDetails[];
  listMngtMap: ListMapType;
  errorMap?: Record<string, boolean>;
  handleDeleteMedia: (type: string, name: string) => void;
  handleCustomerInput: (field: string, value: string | number | boolean | Array<string>) => void;
  handleCustomerMedia: (value: FileList | null, key: string, isMultiple: boolean) => void;
}

const RepnotesCustomerAdaptiveFields = (props: AdaptiveFieldsProps) => {
  const {
    field,
    disabled,
    isForAddedFields,
    fieldDetails,
    customerList,
    handleCustomerMedia,
    handleDeleteMedia,
    handleCustomerInput,
    listMngtMap,
    errorMap,
  } = props;

  if (!field || !fieldDetails) return null;

  const isMedia = field.type === "Multimedia";
  const isMediaPreviewDisabled = disabled;
  const fileType = field.accepts
    ? (field.accepts[0].split("/")[0] as "video" | "image" | "pdf")
    : "image";

  const motherList = filter(customerList, (item) => item.category === "Mother" && item.isActive);

  function getDropdownOptionsProps(field: FieldInputs) {
    const ddTypes = ["Dropdown", "Searchable Dropdown"];
    const dataTypesArr = ["List Management", "Location", "User", "Customer"];

    const { name, dataType, data, type, values } = field;

    if (type && !ddTypes.includes(type)) {
      return { autocompleteOptions: undefined, options: undefined };
    }

    if (name === "isActive") {
      return { autocompleteOptions: undefined, options: STATUS_ARRAY };
    }
    if (name === "groupName") {
      const options =
        fieldDetails.category === "Child"
          ? map(motherList, (data: any) => ({
              id: data.id,
              name: data.name,
            }))
          : [];
      return { autocompleteOptions: undefined, options };
    }
    if (ddTypes.includes(type as string)) {
      if (dataType && dataTypesArr.includes(dataType)) {
        return listMngtMap[data as string];
      }

      return mapToOptions(values as string[]);
    }
  }

  if (field.type === "Date Picker") {
    return (
      <RepnotesDateRangeInput
        value={fieldDetails[field.name] as string}
        onChange={(dateRangeStr) => handleCustomerInput(field.name, dateRangeStr)}
        label={field.title}
        dateRangeType={field.dateRangeType}
      />
    );
  }

  if (field.name === "status") {
    return (
      <RepnotesInput
        id='repnotes-customer-status'
        type='select'
        label='Status'
        labelPosition='left'
        value={fieldDetails.isActive}
        options={STATUS_ARRAY}
        disabled={disabled}
        onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
          handleCustomerInput("isActive", e.target?.value as string);
        }}
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
            handleCustomerMedia(e.target.files, field.name, field.isMultiple);
          } else {
            handleCustomerInput(field.name, e.target.value);
          }
        }}
        onSelectChange={(
          e: React.ChangeEvent<{
            name?: string;
            value: unknown;
          }>
        ) => {
          handleCustomerInput(field.name, e.target.value as string);
        }}
        onAutocompleteChange={(e, o) => {
          handleCustomerInput(field.name, o ? o.value : "");
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

export default RepnotesCustomerAdaptiveFields;

// INITIAL VALUES
const STATUS_ARRAY = [
  { id: "true", name: "Active" },
  { id: "false", name: "Inactive" },
];
