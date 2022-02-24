import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FormModal from "../shared/BaseFormModal";
import { BaseInput } from "../shared/BaseInput";
import {
  AcceptedDateRangeArray,
  fieldInitialValues,
  FieldInputs,
  FieldTypesArray,
  FormModalProps,
  getListMngtItems,
  IsRequiredOptions,
  MediaAcceptOptions,
  SectionsArray,
} from "../shared/constants";
import OptionsInput from "../shared/OptionsInput";
import {
  selectFieldsMap,
  selectFieldsMngtModalState,
} from "../../../store/fieldsManagement/selectors";
import { setFieldsMngtAlert } from "../../../store/fieldsManagement/actions";
import { FormRadioGroup, FormSelect } from "../shared/FormLib";
import { DateRangeType, MediaType } from "../../../store/fieldsManagement/types";
import useFieldInputSanitizer from "../hooks/useFieldInputSanitizer";

const listMngtOptions = getListMngtItems();

interface FieldsCustomerFormModalProps extends FormModalProps {
  onSave?: (section: string, fieldInputs: FieldInputs) => void;
  formType?: "add" | "edit";
}

function FieldsAddFormModal({ formType = "add", ...props }: FieldsCustomerFormModalProps) {
  const { open, onClose, onSave, title: formTitle } = props;
  const [section, setSection] = useState<string>("unassignedFields");
  const fieldsMap = useSelector(selectFieldsMap);
  const dispatch = useDispatch();
  const fieldSanitizerFunc = useFieldInputSanitizer();

  const { activeFieldId, activeSectionId } = useSelector(selectFieldsMngtModalState);

  const [field, setField] = useState<FieldInputs>(fieldInitialValues);
  const prevFieldTitle = useRef(field.title);

  useEffect(() => {
    // check if for edit
    const initialField =
      activeFieldId && formType === "edit" && fieldsMap
        ? fieldsMap[activeFieldId]
        : fieldInitialValues;

    setField(initialField as FieldInputs);

    prevFieldTitle.current = initialField.title;
  }, [activeFieldId, fieldsMap, formType]);

  useEffect(() => {
    if (!activeSectionId) return;
    setSection(activeSectionId);
  }, [activeSectionId]);

  const {
    title,
    isRequired,
    type,
    values,
    defaultValue,
    accepts,
    isMultiple,
    data,
    dataType,
    dateRangeType,
  } = field;

  function handleFieldInputChange(e: React.ChangeEvent<HTMLInputElement | any>) {
    setField({ ...field, [e.target.name]: e.target.value });
  }

  function handleRequired(val: string) {
    setField({ ...field, isRequired: val === "true" ? true : false });
  }

  function handleIsMultiple(val: string) {
    setField({ ...field, isMultiple: val === "true" ? true : false });
  }

  function handleAccepts(val: MediaType) {
    setField({ ...field, accepts: [val] });
  }

  function handleDatePickerRange(val: DateRangeType) {
    setField({ ...field, dateRangeType: val });
  }

  function handleAddOption(option: string) {
    const dropdownValues = !values ? [option] : [...values, option];
    setField({ ...field, values: dropdownValues });
  }
  function handleDeleteOption(option: string) {
    const dropdownValues = values?.filter((item) => item !== option);
    setField({ ...field, values: dropdownValues });
  }
  function handleClearOptions() {
    const _field = { ...field };
    delete _field.defaultValue;
    delete _field.values;
    setField(_field);
  }

  function showError(message: string) {
    dispatch(setFieldsMngtAlert({ open: true, message, type: "error" }));
  }

  function handleSubmit() {
    const isDdType = type === "Dropdown" || type === "Searchable Dropdown";

    if (!title) return showError("Field Name is required!");
    if (!type) return showError("Field type is required!");
    if (isDdType && dataType !== "List Management" && values?.length === 0)
      return showError("A range of values is required for Dropdown.");
    if (isDdType && dataType !== "List Management" && !defaultValue)
      return showError("A default value is required for Dropdown.");
    if (isDdType && dataType === "List Management" && !data)
      return showError("A data source is required for List Management data source.");

    if (
      fieldsMap &&
      Object.values(fieldsMap).some((field) =>
        formType === "add"
          ? field.title === title.trim()
          : field.title === title.trim() && field.title !== prevFieldTitle.current
      )
    )
      return showError("The provided field name is already in use.");

    if (onSave) {
      const fieldInputs = fieldSanitizerFunc(field);
      onSave(section, fieldInputs);
    }

    handleClose();
  }

  function handleClose() {
    setField(fieldInitialValues);
    onClose();
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSave={handleSubmit}
      modalFor='editing field'
      title={formTitle}
    >
      <FormModal.Content>
        <FormModal.InputRow>
          <FormModal.InputLabel htmlFor='name'>Field Name</FormModal.InputLabel>
          <BaseInput
            margin='dense'
            variant='outlined'
            type='text'
            name='title'
            value={title}
            onChange={handleFieldInputChange}
          />
        </FormModal.InputRow>
        <FormModal.InputRow>
          <FormModal.InputLabel htmlFor='type'>Field Type</FormModal.InputLabel>
          <FormSelect
            defaultValue=''
            value={type ? type : ""}
            onChange={handleFieldInputChange}
            name='type'
            options={FieldTypesArray}
          />
        </FormModal.InputRow>
        {(type === "Dropdown" || type === "Searchable Dropdown") && (
          <>
            <FormModal.InputRow>
              <FormModal.InputLabel>Dropdown Values Source</FormModal.InputLabel>
              <FormSelect
                defaultValue='User defined'
                value={dataType ? dataType : "User defined"}
                onChange={handleFieldInputChange}
                name='dataType'
                options={["List Management", "User defined"].map((v) => ({
                  id: v,
                  label: v,
                  value: v,
                }))}
              />
            </FormModal.InputRow>
            {dataType !== "List Management" && (
              <FormModal.InputRow>
                <FormModal.InputLabel>Dropdown Values</FormModal.InputLabel>
                <OptionsInput
                  options={values ? values : []}
                  onAdd={handleAddOption}
                  onDelete={handleDeleteOption}
                  onClear={handleClearOptions}
                />
                <FormModal.InputLabel style={{ marginTop: "15px" }}>
                  Default Value
                </FormModal.InputLabel>
                <FormSelect
                  defaultValue=''
                  value={defaultValue ? defaultValue : ""}
                  onChange={handleFieldInputChange}
                  name='defaultValue'
                  options={values?.map((v) => ({ id: v, label: v, value: v }))}
                />
              </FormModal.InputRow>
            )}
            {dataType === "List Management" && (
              <FormModal.InputRow>
                <FormModal.InputLabel>Data Source</FormModal.InputLabel>
                <FormSelect
                  defaultValue=''
                  value={data ? data : ""}
                  onChange={handleFieldInputChange}
                  name='data'
                  options={listMngtOptions}
                />
              </FormModal.InputRow>
            )}
          </>
        )}
        {type === "Multimedia" && (
          <FormModal.InputRow>
            <FormModal.InputLabel>Accepts</FormModal.InputLabel>
            <FormRadioGroup
              options={MediaAcceptOptions}
              aria-label='media accept'
              name='accepts'
              value={accepts ? accepts[0] : "image/*"}
              onChange={(e, v) => handleAccepts(v as MediaType)}
              row
            />
            <FormModal.InputLabel>Is multiple?</FormModal.InputLabel>
            <FormRadioGroup
              options={["Yes", "No"].map((v) => ({
                label: v,
                value: v === "Yes" ? "true" : "false",
              }))}
              aria-label='is media accept multiple'
              name='isMultiple'
              value={isMultiple ? isMultiple.toString() : "false"}
              onChange={(e, v) => handleIsMultiple(v)}
              row
            />
          </FormModal.InputRow>
        )}
        {type === "Date Picker" && (
          <FormModal.InputRow>
            <FormModal.InputLabel>Accepted Date Range</FormModal.InputLabel>
            <FormRadioGroup
              options={AcceptedDateRangeArray}
              aria-label='accepted date range'
              name='acceptedDateRange'
              value={dateRangeType}
              onChange={(e, v) => handleDatePickerRange(v as DateRangeType)}
            />
          </FormModal.InputRow>
        )}
        <FormModal.InputRow>
          <FormModal.InputLabel>Required</FormModal.InputLabel>
          <FormRadioGroup
            options={IsRequiredOptions}
            aria-label='is field required'
            name='isRequired'
            value={isRequired.toString()}
            onChange={(e, v) => handleRequired(v)}
            row
          />
        </FormModal.InputRow>
        <FormModal.InputRow>
          <FormModal.InputLabel>Section</FormModal.InputLabel>
          <FormSelect
            defaultValue=''
            name='section'
            onChange={(e) => setSection(e.target.value as string)}
            value={section}
            options={SectionsArray}
          />
        </FormModal.InputRow>
      </FormModal.Content>
    </FormModal>
  );
}

export default FieldsAddFormModal;
