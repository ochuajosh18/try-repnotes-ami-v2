import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import Divider from "@material-ui/core/Divider";
import FieldsSectionInstruction from "../shared/FieldsSectionInstruction";
import FieldSectionContainer from "../shared/FieldSectionContainer";
import { selectFieldsMap } from "../../../store/fieldsManagement/selectors";
import { Field } from "../../../store/fieldsManagement/types";
import {
  setFieldsMngtAlert,
  setReorderedFields,
} from "../../../store/fieldsManagement/actions";
import FieldsSections from "./FieldsSections";
import FieldsUnassigned from "./FieldsUnassigned";
import useFieldModuleData from "../hooks/useFieldModuleData";
import EmptyMessage from "../shared/EmptyMessage";
import useFieldsPermission from "../hooks/useFieldsPermission";

const columnMap = {
  one: 1,
  two: 2,
};

type colKey = keyof typeof columnMap;
const minCount = 5;

function FieldsModuleView() {
  const dispatch = useDispatch();

  const fieldModule = useFieldModuleData();
  const fieldsMap = useSelector(selectFieldsMap);

  const { canEdit } = useFieldsPermission();

  if (!fieldModule || !fieldsMap)
    return <EmptyMessage message='No available field data.' />;

  const { data } = fieldModule;
  type dataKey = keyof typeof fieldModule.data;

  function showWarningAlert(message: string) {
    dispatch(
      setFieldsMngtAlert({
        type: "warning",
        message,
        open: true,
      })
    );
  }

  function handleDragEnd(result: DropResult) {
    if (!data || !fieldsMap) return;

    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (!canEdit) return;

    const sIdSplit = source.droppableId.split("_");
    const dIdSplit = destination.droppableId.split("_");
    const sKey = sIdSplit[0] as dataKey;
    const dKey = dIdSplit[0] as dataKey;
    const sCol = columnMap[sIdSplit[2] as colKey];
    const dCol = columnMap[dIdSplit[2] as colKey];

    let sourceArr: Field[];
    let destArr: Field[];

    if (data.columnNumber === 1) {
      sourceArr = data[sKey] as Field[];
      destArr = data[dKey] as Field[];
    } else {
      sourceArr = (data[sKey] as Field[]).filter((f) => f.column === sCol);
      destArr = (data[dKey] as Field[]).filter((f) => f.column === dCol);
    }

    if (
      sourceArr.length === minCount &&
      sCol !== dCol &&
      data.columnNumber === 2 &&
      sKey === "defaultFields"
    ) {
      return showWarningAlert(
        "Each column of default fields should have at least 5 fields."
      );
    }

    // same section (default, added, unassigned)
    if (sKey === dKey) {
      // same column reorder
      if (sCol === dCol) {
        console.log("same column");

        // use either sourceArr or destArr
        // get the field ids
        const fieldIds = sourceArr.map((f) => f.id);
        fieldIds.splice(source.index, 1);
        fieldIds.splice(destination.index, 0, draggableId);

        // map the reordered field ids to actual fields with the modified `row` property
        const reorderedSourceArr = fieldIds.map((id, idx) => ({
          ...fieldsMap[id],
          row: idx + 1,
        }));

        if (data.columnNumber === 1) {
          return dispatch(
            setReorderedFields(data.id, sKey, reorderedSourceArr)
          );
        }

        const untouchedColumnArr = (data[dKey] as Field[]).filter(
          (f) => f.column !== sCol
        );
        const reorderedFields = [...reorderedSourceArr, ...untouchedColumnArr];

        dispatch(setReorderedFields(data.id, sKey, reorderedFields));
        return;
      }

      // inter-column reorder
      if (sCol !== dCol) {
        console.log("inter column");

        const sourceFieldIds = sourceArr.map((f) => f.id);
        sourceFieldIds.splice(source.index, 1);

        const destFieldIds = destArr.map((f) => f.id);
        destFieldIds.splice(destination.index, 0, draggableId);

        const reorderedSourceArr = sourceFieldIds.map((id, idx) => ({
          ...fieldsMap[id],
          row: idx + 1,
          column: sCol,
        }));
        const reorderedDestArr = destFieldIds.map((id, idx) => ({
          ...fieldsMap[id],
          row: idx + 1,
          column: dCol,
        }));

        const reorderedFields = [...reorderedSourceArr, ...reorderedDestArr];

        dispatch(setReorderedFields(data.id, sKey, reorderedFields));

        return;
      }
    }

    // different sections (added <----> unassigned)

    if (sKey === "defaultFields" || dKey === "defaultFields") {
      return showWarningAlert(
        "Adding or removing fields from Default Fields is not allowed."
      );
    }
    // get the field ids
    const sourcefieldIds = sourceArr.map((f) => f.id);
    sourcefieldIds.splice(source.index, 1);

    const destFieldIds = destArr.map((f) => f.id);
    destFieldIds.splice(destination.index, 0, draggableId);

    // map the reordered field ids to actual fields with the modified `row` property
    const reorderedSourceArr = sourcefieldIds.map((id, idx) => ({
      ...fieldsMap[id],
      row: idx + 1,
      column: sCol,
    }));

    const reorderedDestArr = destFieldIds.map((id, idx) => ({
      ...fieldsMap[id],
      row: idx + 1,
      column: dCol,
    }));

    if (data.columnNumber === 1) {
      dispatch(setReorderedFields(data.id, sKey, reorderedSourceArr));
      dispatch(setReorderedFields(data.id, dKey, reorderedDestArr));
      return;
    }

    const untouchedSColArr = (data[sKey] as Field[]).filter(
      (f) => f.column !== sCol
    );

    const untouchedDColArr = (data[dKey] as Field[]).filter(
      (f) => f.column !== dCol
    );

    dispatch(
      setReorderedFields(data.id, sKey, [
        ...reorderedSourceArr,
        ...untouchedSColArr,
      ])
    );
    dispatch(
      setReorderedFields(data.id, dKey, [
        ...reorderedDestArr,
        ...untouchedDColArr,
      ])
    );
  }

  return (
    <>
      <FieldsSectionInstruction />
      <DragDropContext onDragEnd={handleDragEnd}>
        <FieldSectionContainer>
          <FieldsSections />
          <Divider orientation='vertical' flexItem />
          <FieldsUnassigned />
        </FieldSectionContainer>
      </DragDropContext>
    </>
  );
}

export default FieldsModuleView;
