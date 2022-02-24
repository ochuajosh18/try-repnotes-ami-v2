import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Grid from "@material-ui/core/Grid";
import { styled } from "@material-ui/core/styles";
import { appColors } from "./constants";
import FieldItem from "./FieldItem";
import { Field } from "../../../store/fieldsManagement/types";
import NoFieldItem from "./NoFieldItem";

interface FieldDataColumnProps {
  id: string;
  fields: Field[];
  kind: "default" | "element";
  headingText: string;
  numberOfColumns: 1 | 2;
}

const FieldDataColumn = (props: FieldDataColumnProps) => {
  const { id, fields, kind, headingText, numberOfColumns } = props;

  return (
    <Droppable droppableId={id} type='column'>
      {(provided, { isDraggingOver }) => (
        <Grid
          item
          xs={numberOfColumns === 1 ? 12 : 6}
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: isDraggingOver ? appColors.offWhite : "transparent",
          }}
        >
          {numberOfColumns === 2 && <ColumnText>{headingText}</ColumnText>}
          {fields.length === 0 ? (
            <NoFieldItem />
          ) : (
            fields.map((field, index) => (
              <FieldItem
                sectionId={id}
                field={field}
                index={index}
                key={field.id}
                kind={kind}
              />
            ))
          )}
          {provided.placeholder}
        </Grid>
      )}
    </Droppable>
  );
};

export default FieldDataColumn;

const ColumnText = styled("span")({
  fontSize: "12px",
  color: appColors.lightGray,
  width: "max-content",
  marginTop: "10px",
  display: "flex",
  marginLeft: "22px",
});
