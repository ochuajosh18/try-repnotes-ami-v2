import { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import { RollingDetails } from '../../../store/report/marketReport/types';
import { Bar } from 'react-chartjs-2';
import map from 'lodash/map';

interface RepnotesGraphicalMixedProps {
    rollingMarketSize: RollingDetails;
    rollingShare: RollingDetails;
    rollingUnitSales: RollingDetails;
}

const options = {
    plugins:{
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                label: (item: { label: string, formattedValue: string }) => {
                    return `${item.label}: ${item.formattedValue}%`
                }
            }
        }
    },
    scales: {
        yAxes: [
            {
                stacked: true,
                ticks: {
                    beginAtZero: true,
                },
                barThinkness: 12
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


const RepnotesGraphicalMixedChart = (props: RepnotesGraphicalMixedProps) => {
    const data = {
        labels: map(Object.keys(props.rollingMarketSize), (r: string) => `${r[0].toUpperCase()}${r.slice(1)}`),
        datasets: [
            {
                type: 'line',
                label: 'Share Percentage',
                borderColor: 'rgb(166,166,166)',
                borderWidth: 2,
                fill: false,
                data: Object.values(props.rollingShare),
                
            },
        ],
    };
    return(
        <Grid item xs={12}>
            <Bar type data={data} options={options} />
        </Grid>
    )
}

const areEqual = (prevProps: RepnotesGraphicalMixedProps, nextProps: RepnotesGraphicalMixedProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps);
export default memo(RepnotesGraphicalMixedChart, areEqual);