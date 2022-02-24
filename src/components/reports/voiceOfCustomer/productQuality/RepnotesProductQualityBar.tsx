import { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import { Bar } from 'react-chartjs-2';
import { stringParser } from '../../../../util/utils';

const options = {
    plugins:{
        legend: {
            display: false
        },
    },
    scales: {
        
        yAxes: [
            {
                stacked: true,
                ticks: {
                    beginAtZero: true,
                },
                barThinkness: 18
            }
        ],
        xAxes: [
            {
                stacked: true,
            }
        ],
      },
    maintainAspectRatio: false
};

interface RepnotesGraphicalBarProps {
    data: Array<string>;
    colors:  Array<string>;
    values: Array<number>;
    viewType: string;
};

export const RepnotesGraphicalBar = (props: RepnotesGraphicalBarProps) => {
    const { data, colors, values } = props
    const YearToDate = {
        labels: stringParser(data),
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                barThickness: (props.viewType === 'Product Family') ? 100 : 50,
            },
        ],
    };
    return(
        <Grid item xs={12}>
            <Bar type data={YearToDate} options={options} />
        </Grid>
    )
}


const areEqual = (prevProps: RepnotesGraphicalBarProps, nextProps: RepnotesGraphicalBarProps) => true;
export default memo(RepnotesGraphicalBar, areEqual);