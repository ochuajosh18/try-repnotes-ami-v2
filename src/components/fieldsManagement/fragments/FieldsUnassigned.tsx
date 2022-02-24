import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";

import { FieldElementsContainer, FieldElementsList } from "../shared/FieldSectionContainer";
import FieldItem from "../shared/FieldItem";
import NoFieldItem from "../shared/NoFieldItem";
import FieldsElementsHead from "../shared/FieldsElementsHead";
import FieldAddFormModal from "./FieldAddFormModal";
import { appColors, FieldInputs } from "../shared/constants";
import { addNewField } from "../../../store/fieldsManagement/actions";
import useFieldModuleData from "../hooks/useFieldModuleData";
import useToggle from "../hooks/useToggle";

function FieldsUnassigned() {
  const fieldModule = useFieldModuleData();

  const dispatch = useDispatch();
  const [addFormOpen, openAddForm, closeAddForm] = useToggle();
  const [searchKeyword, setSearchKeyword] = useState("");

  if (!fieldModule) return null;

  const { unassignedFields, id: fieldModuleId } = fieldModule;

  const handleSearch = (keyword: string) => setSearchKeyword(keyword);

  const handleFieldSave = (section: string, fieldInputs: FieldInputs) => {
    dispatch(addNewField(fieldModuleId, section, fieldInputs));
  };

  return (
    <FieldElementsContainer>
      <FieldsElementsHead
        onAddNewFieldClick={openAddForm}
        onSearch={handleSearch}
        searchValue={searchKeyword}
      />
      <Droppable droppableId='unassignedFields_col_one' type='column'>
        {(provided, { isDraggingOver }) => (
          <FieldElementsList
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: isDraggingOver ? appColors.offWhite : "transparent",
            }}
          >
            {unassignedFields && unassignedFields.length === 0 ? (
              <NoFieldItem text='Add a new field to create a draggable element' />
            ) : (
              unassignedFields
                .filter((f) => f.title.toLowerCase().includes(searchKeyword.toLowerCase()))
                .map((field, index) => (
                  <FieldItem
                    sectionId='unassignedFields_col_one'
                    field={field}
                    index={index}
                    key={field.id}
                    kind='element'
                    hasIndexUI={false}
                  />
                ))
            )}
            {provided.placeholder}
          </FieldElementsList>
        )}
      </Droppable>
      <FieldAddFormModal
        title='Add New Field'
        open={addFormOpen}
        onClose={closeAddForm}
        onSave={handleFieldSave}
      />
    </FieldElementsContainer>
  );
}

export default FieldsUnassigned;
