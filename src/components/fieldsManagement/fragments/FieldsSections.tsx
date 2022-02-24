import React from "react";
import { Droppable } from "react-beautiful-dnd";
import useFieldModuleData from "../hooks/useFieldModuleData";
import useSectionTitle from "../hooks/useSectionTitle";
import FieldDataColumn from "../shared/FieldDataColumn";
import FieldDataView from "../shared/FieldDataView";
import FieldsAccordion from "../shared/FieldsAccordion";
import { FieldSectionList } from "../shared/FieldSectionContainer";

function FieldsSections() {
  const data = useFieldModuleData();
  const title = useSectionTitle();
  if (!data) return null;

  const {
    defColOne,
    defColTwo,
    addedColOne,
    addedColTwo,
    defLength,
    addedLength,
    numberOfColumns,
  } = data;

  return (
    <Droppable droppableId='section-box' type='section'>
      {(provided, { isDraggingOver }) => (
        <FieldSectionList ref={provided.innerRef} {...provided.droppableProps}>
          <FieldsAccordion
            title={title}
            id='defaultFields'
            index={0}
            kind='default'
          >
            <FieldDataView numOfFields={defLength}>
              <FieldDataColumn
                id='defaultFields_col_one'
                fields={defColOne}
                kind='default'
                headingText='Column One'
                numberOfColumns={numberOfColumns}
              />
              {numberOfColumns === 2 && (
                <FieldDataColumn
                  id='defaultFields_col_two'
                  fields={defColTwo}
                  kind='default'
                  headingText='Column Two'
                  numberOfColumns={numberOfColumns}
                />
              )}
            </FieldDataView>
          </FieldsAccordion>
          <FieldsAccordion
            title='Added Fields'
            id='addedFields'
            index={1}
            kind='added'
          >
            <FieldDataView numOfFields={addedLength}>
              <FieldDataColumn
                id='addedFields_col_one'
                fields={addedColOne}
                kind='element'
                headingText='Column One'
                numberOfColumns={numberOfColumns}
              />
              {numberOfColumns === 2 && (
                <FieldDataColumn
                  id='addedFields_col_two'
                  fields={addedColTwo}
                  kind='element'
                  headingText='Column Two'
                  numberOfColumns={numberOfColumns}
                />
              )}
            </FieldDataView>
          </FieldsAccordion>
          {provided.placeholder}
        </FieldSectionList>
      )}
    </Droppable>
  );
}

export default FieldsSections;
