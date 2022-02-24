import { useState } from 'react'
import { DateRangePicker } from 'materialui-daterange-picker'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { RepnotesInput } from '../../../common/RepnotesInput'

interface MarginDateRangeProps {
    startDate: string;
    endDate: string;
    onDateChange: (start?: Date, end?: Date) => void;
}

const MarginDateRange = (props: MarginDateRangeProps) => {
    const [pickerOpen, setPickerOpen] = useState(false)
    return (
        <Grid item xs={4}>
            <Box width="100%" display="flex" position="relative" justifyContent="center" flexDirection="column">
                <RepnotesInput
                    id="repnotes-margin-report-date-ranges"
                    type="daterange"
                    label="Date Range"
                    labelPosition="top"
                    disabled={false}
                    firstSelectOption="None"
                    value={`${props.startDate} - ${props.endDate}`}
                    onClickDate={() => setPickerOpen(!pickerOpen)}
                />
                <DateRangePicker
                    open={pickerOpen}
                    toggle={() => setPickerOpen(!pickerOpen)}
                    onChange={(range) => {
                        props.onDateChange(range.startDate, range.endDate)
                        if (range.startDate && range.endDate) setPickerOpen(false)
                    }}
                />
            </Box>
        </Grid>
    )
}

export default MarginDateRange