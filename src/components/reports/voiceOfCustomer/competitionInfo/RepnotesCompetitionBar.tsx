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
    pricing: number;
    activities: number;
    commercialTerms: number;
};

const RepnotesGraphicalBar = ({pricing, activities, commercialTerms}: RepnotesGraphicalBarProps) => {
    const data = {
        labels: ['Commercial Terms', 'Pricing', 'Activities' ],
        datasets: [
            {
                data: [commercialTerms, pricing, activities],
                backgroundColor: [
                    'rgb(30,115,198)',
                    'rgb(255,116,38)',
                    'rgb(127,127,127)'
                ],
                barThickness: 100,
            },
        ],
    };
    return(
        <Grid item xs={12}>
            <Bar type data={data} options={options} />
        </Grid>
    )
}

const areEqual = (prevProps: RepnotesGraphicalBarProps, nextProps: RepnotesGraphicalBarProps) => true;
export default memo(RepnotesGraphicalBar, areEqual);