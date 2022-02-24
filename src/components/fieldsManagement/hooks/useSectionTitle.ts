import { useSelector } from "react-redux";
import {
  selectCurrentFieldModule,
  selectNotesDefaultSection,
  selectNotesFieldsDefaultSections,
} from "../../../store/fieldsManagement/selectors";

export default function useSectionTitle() {
  const activeFieldModule = useSelector(selectCurrentFieldModule);
  const notesDefaultSections = useSelector(selectNotesFieldsDefaultSections);
  const selectedNotesDefaultId = useSelector(selectNotesDefaultSection);

  if (activeFieldModule !== "NOTES" || !notesDefaultSections)
    return "Default Fields";

  const section = notesDefaultSections.find(
    (d) => d.id === selectedNotesDefaultId
  );

  if (!section) return "Default Fields";

  return section.name;
}
