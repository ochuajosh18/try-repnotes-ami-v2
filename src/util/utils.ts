import axios, { CancelTokenSource } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { CustomerDetails } from "../store/customerManagement/customer/types";
import { clearDialog, selectDialogState, setDialogOpen } from "../store/dialog/actions";
import map from "lodash/map";
import { MeetingLog, NotesLog } from "../store/dashboard/types";
import moment from "moment";
import { selectCurrentUserRole, selectSystemSessionToken } from "../store/system/actions";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCompany, selectCompanyList } from "../store/listManagement/company/actions";

export const currencyConverter = (data: number) => {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return formatter.format(data);
};

export const stringValidator = (string: string, removeAllSpaces = false) =>
  string
    ? removeAllSpaces
      ? string.replace(" ", "").toLowerCase().trim().split(/\s+/).join(" ")
      : string.toLowerCase().trim().split(/\s+/).join(" ")
    : string;

export const initAxiosCancelToken = (
  cancellableRequest: CancelTokenSource | null
): CancelTokenSource => {
  if (cancellableRequest) {
    (cancellableRequest as CancelTokenSource).cancel();
  }
  return axios.CancelToken.source();
};

export const stringParser = (stringArray: Array<string>) => {
  let output = [];
  for (var i = 0; i < stringArray.length; i++) {
    let stringArr = stringArray[i].split(" ");
    if (stringArr.length > 1) {
      output.push(stringArr);
    } else {
      output.push(stringArray[i]);
    }
  }
  return output;
};

export const emailValidator = (email: string): boolean => {
  var pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );
  return pattern.test(`${email}`);
};

export const numberValidator = (number: string) => {
  // eslint-disable-next-line
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(number);
};

// added by jeff
interface Media {
  name: string;
  path: string;
  size: string | number;
  type: string;
  file?: File;
}

export function mapToOptions(arr: any[]) {
  const autocompleteOptions = arr.map((item) => ({
    label: item.name ? item.name : item,
    value: item.id ? item.id : item,
  }));
  const options = arr.map((item) => ({
    id: item.id ? item.id : item,
    name: item.name ? item.name : item,
  }));
  return { autocompleteOptions, options };
}

export function mapToProductOptions(arr: any[]) {
  const autocompleteOptions = arr.map((item) => ({
    label: item.modelName,
    value: item.id,
  }));
  const options = arr.map((item) => ({
    id: item.id,
    name: item.modelName,
  }));
  return { autocompleteOptions, options };
}

export function mapToAreaOptions(arr: CustomerDetails[]) {
  const options = arr.map((item) => ({
    id: item.area,
    name: item.area,
  }));
  return { options };
}

export function maptoProvinceOrCity(arr: any[], type: "province" | "city/town") {
  const isProvince = type === "province";
  const options = map(arr[0], (data: any) => ({
    id: isProvince ? data.name : data,
    name: isProvince ? data.name : data,
  }));
  return { options };
}

export function transformFileList(fileList: FileList, oldMedia: Array<Media>, isMultiple: boolean) {
  let media: Array<Media> = [];
  const existingMediaNames = oldMedia.map((m) => m.name);
  for (const f of fileList) {
    if (!existingMediaNames.includes(f.name)) {
      media = [
        ...media,
        {
          path: "",
          name: (f as File).name,
          size: (f as File).size,
          type: (f as File).type,
          file: f as File,
        },
      ];
    }
  }

  return isMultiple ? [...oldMedia, ...media] : media;
}

export const notesLabelLookUp: Record<string, string> = {
  "COMPETITION::INFORMATION": "Competition Information",
  "CUSTOMER::EXPERIENCE": "Customer Experience",
  "GENERAL::COMMENT": "General Comment",
  "PRODUCT::PERFORMANCE": "Product Performance",
  "PRODUCT::QUALITY": "Product Quality",
  "UNMET::NEED": "Unmet Need",
};

export const getNotesLabel = (noteId: string) => {
  const key = noteId.split("::").slice(0, 2).join("::");
  return notesLabelLookUp[key];
};

export const getAverageRatingAsScore = (item: NotesLog) =>
  item.customerExperience &&
  (
    item.customerExperience?.reduce((acc, curr) => (acc += curr.rating), 0) /
    item.customerExperience?.length
  ).toFixed(2);

export const getMeetingStatus = (meeting: MeetingLog) => {
  let status = meeting.isCancelled ? "Cancelled" : "Open";
  return status;
};

export function isInPast30Days(date: string) {
  const endDate = moment().subtract(1, "day");
  const startDate = moment().subtract(30, "days");
  return moment(date).isBetween(startDate, endDate);
}

export function isInNext7Days(date: string) {
  const startDate = moment().add(1, "day");
  const endDate = moment().add(7, "days");
  return moment(date).isBetween(startDate, endDate);
}

export function isCurrentDate(date: string) {
  return moment().format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD");
}

export function formatDateForTable(date: string) {
  return moment(date).format("YYYY-MM-DD");
}

// FOR API CALL
const API_URL = process.env.REACT_APP_API_URL;
// axios instance for users and content mngt
export const executeApiCall = (sessionToken: string) =>
  axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

// HOOKS
export function useDialog() {
  const dispatch = useDispatch();
  const dialog = useSelector(selectDialogState);

  function closeDialog() {
    dispatch(clearDialog());
  }

  function openConfirmSaveDialog(label: string | undefined) {
    dispatch(
      setDialogOpen({
        dialogOpen: true,
        dialogLabel: label ? label : "",
        dialogType: "save",
        docId: "",
      })
    );
  }

  function openDeleteDialog(label: string | undefined, docId: string) {
    dispatch(
      setDialogOpen({
        dialogOpen: true,
        dialogLabel: label ? label : "",
        dialogType: "delete",
        docId,
      })
    );
  }

  return { dialog, closeDialog, openConfirmSaveDialog, openDeleteDialog };
}

export default function useCompany(
  currentCompany?: string,
  changeCallback?: (company: string) => void
) {
  const dispatch = useDispatch();

  const sessionToken = useSelector(selectSystemSessionToken);

  const userRole = useSelector(selectCurrentUserRole);
  const isUserSuper = userRole === "SUPER ADMIN";

  const [selectedCompany, setSelectedCompany] = useState<string>("");

  const savedCallback = useRef(changeCallback);

  // Remember the latest callback if it changes
  useEffect(() => {
    savedCallback.current = changeCallback;
  }, [changeCallback]);

  const noCompanySelected = !selectedCompany || !currentCompany;
  const isSuperAdmin = currentCompany === "SUPERADMIN";

  useEffect(() => {
    dispatch(getCompany(sessionToken));
  }, [dispatch, sessionToken]);

  useEffect(() => {
    if (isSuperAdmin) return setSelectedCompany("");
    const _companyId = currentCompany ? currentCompany : "";
    setSelectedCompany(_companyId);
  }, [currentCompany, isSuperAdmin]);

  const { companyArray } = useSelector(selectCompanyList);
  const companySelectOptions = companyArray
    .filter((c) => c.isActive)
    .map((item) => ({
      id: item.companyId,
      name: item.name,
    }));

  const handleCompanyChange = useCallback((e: React.ChangeEvent<HTMLInputElement | any>) => {
    const companyName = e.target.value;
    if (!companyName) return;
    setSelectedCompany(companyName);

    // update store
    if (savedCallback.current) savedCallback.current(companyName);
  }, []);

  return {
    selectedCompany,
    noCompanySelected,
    companySelectOptions,
    handleCompanyChange,
    isUserSuper,
  };
}
