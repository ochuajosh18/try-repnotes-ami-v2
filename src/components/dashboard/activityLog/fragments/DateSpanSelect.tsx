import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMeetingsLogs,
  getNotesLogs,
  getSalesOppsAndQuotesLogs,
  selectDashboardDateRange,
  selectDashboardState,
  setDashboardDateRange,
} from "../../../../store/dashboard/actions";
import { RepnotesInput } from "../../../common/RepnotesInput";
import {
  dateRangeOptions,
  dateRangeOptionsMeetings,
  DateSpanSelectProps,
} from "../utils/constants";

const DateSpanSelect = (props: DateSpanSelectProps) => {
  const { dateSpanFor, onChange } = props;

  const dispatch = useDispatch();
  const dateSpan = useSelector(selectDashboardDateRange(dateSpanFor));
  const { filterSelectedCompany } = useSelector(selectDashboardState);

  const options = dateSpanFor === "meetingsDateRange" ? dateRangeOptionsMeetings : dateRangeOptions;

  useEffect(() => {
    dispatch(setDashboardDateRange(dateSpanFor, "past-30-days"));
  }, [dateSpanFor, dispatch]);

  const handleChange = (value: string) => {
    dispatch(setDashboardDateRange(dateSpanFor, value));

    if (onChange) onChange();

    if (dateSpanFor === "salesDateRange") dispatch(getSalesOppsAndQuotesLogs());
    if (dateSpanFor === "meetingsDateRange") dispatch(getMeetingsLogs());
    if (dateSpanFor === "notesDateRange") dispatch(getNotesLogs());
  };

  return (
    <RepnotesInput
      id={`act-log-datespan-select-${dateSpanFor}`}
      type='select'
      label='Date Range'
      labelPosition='top'
      value={dateSpan as string}
      options={options}
      onSelectChange={(e) => handleChange(e.target.value as string)}
      disabled={!filterSelectedCompany}
    />
  );
};

export default DateSpanSelect;
