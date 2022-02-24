import { useSelector } from "react-redux";
import { selectFieldsModule } from "../../../store/fieldsManagement/selectors";

export default function useFieldModuleData() {
  const data = useSelector(selectFieldsModule);
  if (!data) return null;

  const { defaultFields, addedFields, unassignedFields, columnNumber } = data;
  const defColOne =
    columnNumber === 1
      ? defaultFields
      : defaultFields.filter((i) => i.column === 1);
  const defColTwo =
    columnNumber === 1 ? [] : defaultFields.filter((i) => i.column === 2);

  const addedColOne =
    columnNumber === 1
      ? addedFields
      : addedFields.filter((i) => i.column === 1);
  const addedColTwo =
    columnNumber === 1 ? [] : addedFields.filter((i) => i.column === 2);

  const defLength = defaultFields.length;
  const addedLength = addedFields.length;

  return {
    data,
    id: data.id,
    defColOne,
    defColTwo,
    addedColOne,
    addedColTwo,
    defLength,
    addedLength,
    unassignedFields,
    numberOfColumns: columnNumber as 1 | 2,
  };
}
