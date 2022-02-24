import React from "react";
import { DateRangePicker } from "materialui-daterange-picker";
import { RepnotesInput } from "../../common/RepnotesInput";
import Grid from '@material-ui/core/Grid';

import moment from 'moment'

interface DateRangeProps {
    startDate: string;
    endDate: string;
    disabled?: boolean;
    dateRange: (startDate: string, endDate: string) => void;
    minDate?: string;
    maxDate?: string;
}

export const RepnotesDateRange = (props: DateRangeProps) => {

    const { startDate, endDate, minDate, maxDate, dateRange, disabled } = props
    const [openDateRange, setOpenDateRange] = React.useState(false);

    const handleClick = () => {
        setOpenDateRange(openDateRange ? false : true);
    };

    return (
        <Grid item>
            <RepnotesInput
            id="repnotes-so-report-date-ranges"
            type="daterange"
            label="Date Range"
            labelPosition="left"
            disabled={disabled}
            firstSelectOption="None"
            value={`${startDate} - ${endDate}`}
            onClickDate={handleClick}
            />
            <DateRangePicker
                open={openDateRange}
                toggle={handleClick}
                minDate={minDate}
                maxDate={maxDate}
                onChange={(range) => dateRange(moment(range.startDate).format('YYYY-MM-DD 00:00:01') as unknown as string, moment(range.endDate).format('YYYY-MM-DD 23:59:59') as unknown as string)}
                wrapperClassName="date-range-picker no-toolbar"
            />
        </Grid>
    );
}