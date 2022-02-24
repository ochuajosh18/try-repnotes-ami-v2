import { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import { Bar } from 'react-chartjs-2';

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
};

const RepnotesGraphicalBar = (props: RepnotesGraphicalBarProps) => {
    const { data, colors, values } = props
    const YearToDate = {
        labels: data,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                barThickness: 100,
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