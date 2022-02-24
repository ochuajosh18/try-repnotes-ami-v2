import React from "react";
import { DateRangePicker } from "materialui-daterange-picker";
import Grid from '@material-ui/core/Grid';

interface DateRangeProps {
    isOpen: boolean;
    handleClickOpenDateRange: () => void;
    dateRange: (startDate: string, endDate: string) => void;
}

export const RepnotesDateRange = (props: DateRangeProps) => {
    return (
        <Grid item>
            <DateRangePicker
                open={props.isOpen}
                toggle={props.handleClickOpenDateRange}
                onChange={(range) => props.dateRange(range.startDate as unknown as string, range.endDate as unknown as string)}
            />
        </Grid>
    );
}