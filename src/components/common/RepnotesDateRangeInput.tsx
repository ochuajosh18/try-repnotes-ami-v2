import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { DateRange, DateRangePicker } from "materialui-daterange-picker";
import { RepnotesTextField } from "./RepnotesInput";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { DateRangeType } from "../../store/fieldsManagement/types";
import moment from "moment";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      color: "#fff",
      filter: "blur",
      zIndex: theme.zIndex.modal + 1,
      backdropFilter: "blur(2px)",
      position: "fixed",
    },
    pickerWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    appHeaderHideClass: {
      zIndex: 1000,
      borderBottom: "1px solid #ddd",
    },
  })
);

interface IProps {
  label?: string;
  disabled?: boolean;
  dateRangeType?: DateRangeType;
  value?: string;
  onChange: (dateRangeStr: string) => void;
}

const RepnotesDateRangeInput = (props: IProps) => {
  const { label, disabled, dateRangeType, value, onChange } = props;
  const classes = useStyles();
  const [pickerShown, setPickerShown] = useState(false);

  const [dateRange, setDateRange] = useState(value);
  const [initialDateRange, setInitialDateRange] = useState<DateRange>();

  useEffect(() => {
    if (!value) return;
    const dr = value.split(" - ");
    const startDate = moment(dr[0]).toDate();
    const endDate = moment(dr[1]).toDate();

    setInitialDateRange({ startDate, endDate });
  }, [value]);

  function handleDateRangeChange(startDate: string, endDate: string) {
    const dr = `${moment(startDate).format("MMM DD, YYYY")} - ${moment(endDate).format(
      "MMM DD, YYYY"
    )}`;

    setDateRange(dr);
  }

  function handleClose() {
    onChange(dateRange ? dateRange : "");
    setPickerShown((p) => !p);
  }

  function getRanges() {
    const ranges: Record<string, any> = { minDate: undefined, maxDate: undefined };
    switch (dateRangeType) {
      case "past":
        ranges.maxDate = moment().subtract(1, "day").toDate(); // past until yesterday
        break;
      case "past-to-present":
        ranges.maxDate = moment().toDate();
        break;
      case "future":
        ranges.minDate = moment().toDate();
        break;
      case "present-to-future":
        ranges.minDate = moment().subtract(1, "day").toDate();
        break;
    }

    return ranges;
  }

  useEffect(() => {
    if (pickerShown) document.querySelector("header")?.classList.add(classes.appHeaderHideClass);
  }, [classes.appHeaderHideClass, pickerShown]);

  useEffect(() => {
    if (!pickerShown)
      document.querySelector("header")?.classList.remove(classes.appHeaderHideClass);
  }, [classes.appHeaderHideClass, pickerShown]);

  return (
    <>
      <Box className='repnotes-input-container' position='relative'>
        <Grid container>
          <Grid
            item
            className='repnotes-input-label-container'
            xs={4}
            style={{
              textAlign: "right",
              paddingRight: "15px",
              paddingTop: "15px",
            }}
          >
            <Typography
              style={{
                padding: "3px 0",
                fontSize: 12,
                fontWeight: 700,
                color: "#272B75",
              }}
            >
              {label}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <RepnotesTextField
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setPickerShown(true)} style={{ padding: "0" }}>
                    <DateRangeIcon />
                  </IconButton>
                ),
              }}
              margin='dense'
              variant='outlined'
              fullWidth={true}
              type='text'
              value={dateRange}
              disabled={disabled}
              placeholder={label}
            />
          </Grid>
        </Grid>
      </Box>
      <Backdrop open={pickerShown} className={classes.backdrop}>
        <DateRangePicker
          wrapperClassName={classes.pickerWrapper}
          open={true}
          toggle={handleClose}
          initialDateRange={initialDateRange}
          onChange={(range) =>
            handleDateRangeChange(
              range.startDate as unknown as string,
              range.endDate as unknown as string
            )
          }
          {...getRanges()}
        />
      </Backdrop>
    </>
  );
};

export default RepnotesDateRangeInput;
