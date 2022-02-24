import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFieldsMngtAlert } from "../../../store/fieldsManagement/actions";
import { FieldInputs } from "../shared/constants";

export default function useFieldInputValidator(fieldInputs: FieldInputs) {
  const [error, setError] = useState<string | null>("Initial Error");
  const dispatch = useDispatch();

  useEffect(() => {
    const { title, type, dataType, values, defaultValue, data } = fieldInputs;
    const isDdType = type === "Dropdown" || type === "Searchable Dropdown";

    if (!title) setError("Field Name is required!");
    else if (!type) setError("Field type is required!");
    else if (isDdType && dataType !== "List Management" && !values)
      setError("A range of values is required for Dropdown.");
    else if (isDdType && dataType !== "List Management" && !defaultValue)
      setError("A default value is required for Dropdown.");
    else if (isDdType && dataType === "List Management" && !data)
      setError("A data source is required for List Management data source.");
    else setError(null);

    if (error && error !== "Initial Error") {
      dispatch(
        setFieldsMngtAlert({ open: true, message: error, type: "error" })
      );
    }
    // if (
    //   fieldsMap &&
    //   Object.values(fieldsMap).some((field) => field.title === title.trim())
    // )
    //   return showError("The provided field name is already in use.");
  }, [dispatch, error, fieldInputs]);

  const isValid = error ? false : true;
  return isValid;
}
