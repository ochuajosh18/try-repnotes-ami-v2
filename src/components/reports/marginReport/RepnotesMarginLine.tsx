import { MarginResultDetails } from '../../../store/report/marginReport/types';
import Grid from '@material-ui/core/Grid';
import { Line } from 'react-chartjs-2';
import map from 'lodash/map';

interface RepnotesGraphicalLineProps {
    data: MarginResultDetails;
};

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



export const RepnotesGraphicalLine = (props: RepnotesGraphicalLineProps) => {
    let result = props.data;
    const data = {
        labels: map(Object.keys(result), (r: string) => `${r[0].toUpperCase()}${r.slice(1)}`),
        datasets: [
            {
                data: Object.values(result),
                backgroundColor: 'rgb(68,114,196)',
                borderColor: 'rgb(68,114,196)',
            },
        ],
    };
    return(
        <Grid item xs={12}>
            <Line type data={data} options={options} />
        </Grid>
    )
}