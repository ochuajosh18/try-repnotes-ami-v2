import React from "react";
import { DateRangePicker } from "materialui-daterange-picker";
import Grid from '@material-ui/core/Grid';
import { RepnotesInput } from "./RepnotesInput";

interface DateRangeProps {
    id: string;
    startDate: string;
    endDate: string;
    disabled?: boolean;
    onDateChange: (startDate: string, endDate: string) => void;
}

const RepnotesDateRange = (props: DateRangeProps) => {

    const { id, startDate, endDate, onDateChange, disabled } = props
    const [openDateRange, setOpenDateRange] = React.useState(false);

    const handleClick = () => {
        setOpenDateRange(openDateRange ? false : true);
    };

    return (
        <Grid item>
            <RepnotesInput
                id={id}
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
                onChange={(range) => onDateChange(range.startDate as unknown as string, range.endDate as unknown as string)}
            />
        </Grid>
    );
}

export default RepnotesDateRange;