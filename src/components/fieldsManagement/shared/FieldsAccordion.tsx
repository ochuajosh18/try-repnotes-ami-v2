import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FlexRowCenter from "./FlexRowCenter";
import { styled } from "@material-ui/core/styles";
import { appColors } from "./constants";
import { useSelector } from "react-redux";
import { selectCurrentFieldModule } from "../../../store/fieldsManagement/selectors";

const SectionHead = styled("div")({
  backgroundColor: appColors.light,
  padding: "10px 20px",
  minWidth: "350px",
  height: "64px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  boxSizing: "border-box",
  borderRadius: "0px",
  borderLeft: `4px solid ${appColors.theme.primary.main}`,
  color: appColors.text,
  overflow: "hidden",
  width: "100%",

  "& .section-expand-icon": {
    marginLeft: "auto",
    transition: "transform 0.2s ease-out",
    transformOrigin: "center center",
    transform: "rotate(0deg)",
  },

  "&.open .section-expand-icon": {
    transition: "transform 0.2s ease-out",
    transform: "rotate(180deg)",
  },
});

export const SectionTitleInput = styled("input")({
  fontSize: "16px !important",
  fontWeight: 600,
  color: appColors.text,
  padding: "4px 8px",
  backgroundColor: "transparent",
  outline: "none",
  border: "2px solid transparent",
  borderRadius: "2px",
  maxWidth: "65%",
  minWidth: "max-content",

  "&:focus": {
    border: `2px solid ${appColors.theme.primary.main}`,
  },
});

const SectionTitle = styled("p")({
  fontSize: "16px !important",
  fontWeight: 600,
  color: appColors.text,
});

interface FieldsAccordionHeadProps {
  title: string;
  expanded: boolean;
  toggleExpanded: (value: boolean) => void;
}

export const FieldsAccordionHead = (props: FieldsAccordionHeadProps) => {
  const { title, expanded, toggleExpanded } = props;

  return (
    <Box display='flex' alignItems='center' style={{ gap: "5px" }}>
      <SectionHead
        onClick={(e) => toggleExpanded(!expanded)}
        className={expanded ? "open" : "close"}
      >
        <SectionTitle>{title}</SectionTitle>
        <ExpandMoreIcon className='section-expand-icon' />
      </SectionHead>
    </Box>
  );
};

interface FieldsAccordionProps {
  title: string;
  id: string;
  index: number;
  children?: ReactNode;
  kind: "default" | "added" | "unassigned";
}

const FieldsAccordion = (props: FieldsAccordionProps) => {
  const [expanded, setExpanded] = useState(false);
  const { title, id, index, children } = props;

  const currentFieldModule = useSelector(selectCurrentFieldModule);
  const activeFieldModuleRef = useRef(currentFieldModule);

  useEffect(() => {
    const prev = activeFieldModuleRef.current;
    activeFieldModuleRef.current = currentFieldModule;
    if (prev === currentFieldModule) return;
    setExpanded(false);
  }, [currentFieldModule]);

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={true}>
      {(provided, snapshot) => (
        <FlexRowCenter ref={provided.innerRef}>
          <Box flex={1} width='100%'>
            <FieldsAccordionHead
              title={title}
              expanded={expanded}
              toggleExpanded={setExpanded}
            />
            {expanded && children}
          </Box>
        </FlexRowCenter>
      )}
    </Draggable>
  );
};

export default FieldsAccordion;
