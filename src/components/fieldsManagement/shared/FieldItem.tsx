import React from "react";
import { Field } from "../../../store/fieldsManagement/types";
import { Draggable } from "react-beautiful-dnd";
import { appColors } from "./constants";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import DeleteIcon from "@material-ui/icons/Delete";
import { styled } from "@material-ui/core/styles";
import useFieldScaleFactor from "../hooks/useFieldScaleFactor";
import { useDispatch } from "react-redux";
import { setFieldsMngtModal } from "../../../store/fieldsManagement/actions";
import useFieldsPermission from "../hooks/useFieldsPermission";

const StyledFieldWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginTop: "10px",
  position: "relative",

  "&:hover > .field-item": {
    transition: "transform 0.2s ease",
  },

  "&:hover > .field-delete-btn": {
    transition: "transform 0.2s ease, opacity 0.2s ease",
    transform: "translateX(10px)",
    opacity: 1,
  },
});

const FieldDeleteBtn = styled(IconButton)({
  color: appColors.theme.danger.main,
  position: "absolute",
  left: "-10px",
  transition: "transform 0.2s ease, opacity 0.2s ease",
  transform: "translateX(-20px)",
  opacity: 0,
});

const FieldEditButton = styled(Button)({
  color: appColors.theme.primary.main,
  // position: "absolute",
  // top: "50%",
  // right: "5px",
  // transform: "translateY(-50%)",
  alignSelf: "end",
});

const StyledFieldBoxWrapper = styled("div")({
  flex: 1,
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  transition: "transform 0.2s ease",
  transformOrigin: "center right",
  position: "relative",
  overflow: "hidden",
  gap: "5px",
});

const StyledFieldBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  borderRadius: "3px",
  gap: "8px",
  border: appColors.border,
  backgroundColor: appColors.white,
  padding: "6px 8px",
  userSelect: "none",
  height: "42px",
  boxSizing: "border-box",

  "& .field-drag-icon": {
    color: appColors.lightGray,
  },
  "& .field-name": {
    color: appColors.text,
    fontSize: "12px",
    marginRight: "auto",
    flex: 1,
    textAlign: "left",
  },
  "& .field-type": {
    color: appColors.lightGray,
    fontSize: "10px",
    marginRight: "auto",
    flex: 1,
    textAlign: "left",
  },
});

const StyledCircleIndex = styled(Box)({
  fontSize: "10px",
  backgroundColor: appColors.theme.primary.hover,
  color: appColors.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "18px",
  height: "18px",
  borderRadius: "50%",
});

interface FieldItemProps {
  sectionId: string;
  field: Field;
  index: number;
  hasIndexUI?: boolean;
  kind?: "default" | "element";
}

function FieldItem({
  hasIndexUI = true,
  field,
  sectionId,
  index,
  kind = "default",
}: FieldItemProps) {
  const dispatch = useDispatch();
  const [fieldRef, scaleFactor] = useFieldScaleFactor();
  const isDefaultField = kind === "default";
  const sectionKey = sectionId.split("_")[0];

  const { canDelete, canEdit } = useFieldsPermission();

  function openEditModal() {
    dispatch(
      setFieldsMngtModal({
        open: true,
        activeFieldId: field.id,
        activeSectionId: sectionKey,
        type: "edit",
        target: "field",
      })
    );
  }

  function openDeleteModal() {
    dispatch(
      setFieldsMngtModal({
        open: true,
        activeFieldId: field.id,
        activeSectionId: sectionKey,
        type: "delete",
        target: "field",
      })
    );
  }

  function handleMouseEnter() {
    if (!canDelete) return;
    if (!fieldRef.current || isDefaultField) return;
    fieldRef.current.style.transform = `scaleX(${scaleFactor})`;
    fieldRef.current.style.marginLeft = "10px";
  }
  function handleMouseLeave() {
    if (!canDelete) return;
    if (!fieldRef.current || isDefaultField) return;
    fieldRef.current.style.transform = "scaleX(1)";
    fieldRef.current.style.marginLeft = "0";
  }

  return (
    <>
      <Draggable draggableId={field.id} index={index} isDragDisabled={!canEdit}>
        {(provided, { isDragging }) => (
          <StyledFieldWrapper
            {...provided.draggableProps}
            ref={provided.innerRef}
            className='field-item-container'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {kind === "element" && canDelete && (
              <FieldDeleteBtn onClick={openDeleteModal} size='small' className='field-delete-btn'>
                <DeleteIcon fontSize='small' />
              </FieldDeleteBtn>
            )}
            <StyledFieldBoxWrapper className='field-item' ref={fieldRef}>
              {!isDragging && hasIndexUI && <StyledCircleIndex>{index + 1}</StyledCircleIndex>}
              <StyledFieldBox
                className='field-box'
                flex={isDragging && kind === "default" ? "0 1 90%" : 1}
                {...provided.dragHandleProps}
              >
                <DragIndicatorIcon className='field-drag-icon' />
                <Typography
                  className='field-name'
                  style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "60px",
                    overflow: "hidden",
                  }}
                >
                  {field.title}
                </Typography>
                <Typography className='field-type'>{field.type}</Typography>
                {kind === "element" && canEdit && (
                  <FieldEditButton size='small' onClick={openEditModal}>
                    Edit
                  </FieldEditButton>
                )}
              </StyledFieldBox>
            </StyledFieldBoxWrapper>
          </StyledFieldWrapper>
        )}
      </Draggable>
    </>
  );
}

export default FieldItem;
