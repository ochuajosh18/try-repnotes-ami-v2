import { memo } from 'react';
import Grid from '@material-ui/core/Grid';
import { Bar } from 'react-chartjs-2';
import { StatusDetails } from '../../../store/report/salesOpportunities/types';

interface RepnotesGraphicalBarProps {
    datePeriod: string;
    statusData: StatusDetails;
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



const YearToDate = {
    labels: ['Open Sales Opportunities', 'Lost Deal To Date'],
    datasets: [
        {
            data: [0, 0, 0],
            backgroundColor: [
                'rgb(163,213,245)',
                'rgb(66,154,213)',
                'rgb(4,123,238)'
            ],
            barThickness: 100,
        },
    ],
};

const RepnotesSOGraphicalBar = ( props: RepnotesGraphicalBarProps ) => {

    YearToDate.datasets[0].data = [ 
        props.statusData.yearToDate.openSales,
        props.statusData.yearToDate.lostDealTodate,
    ]

    const Monthly = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {   
                label: 'Open Sales Opportunities',
                data: Object.values(props.statusData.monthly.openSales),
                backgroundColor: 'rgb(163,213,245)',
            },
            {
                label: 'Lost Deal To Date',
                data: Object.values(props.statusData.monthly.lostDealTodate),
                backgroundColor: 'rgb(4,123,238)',
            }
        ],
    };

    let data = props.datePeriod === 'yeartodate' ? YearToDate : Monthly

    return(
        <Grid item xs={12}>
            <Bar type data={data} options={options} />
        </Grid>
    )
}

const areEqual = (prevProps: RepnotesGraphicalBarProps, nextProps: RepnotesGraphicalBarProps) => true;
export default memo(RepnotesSOGraphicalBar, areEqual);