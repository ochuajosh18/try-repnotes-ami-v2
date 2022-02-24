import { memo } from 'react';
import { TypeOfEntriesDetails } from '../../../../store/report/voiceOfCustomer/typeOfEntries/types';
import Grid from '@material-ui/core/Grid';
import { Bar } from 'react-chartjs-2';

interface RepnotesGraphicalBarProps {
    datePeriod: string;
    data: TypeOfEntriesDetails;
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
    labels: ['Competition Info', 'Customer Experience', 'General Comments', 'Product Performance', 'Product Quality', 'Unmet Need' ],
    datasets: [
        {
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
                'rgb(30,115,198)',
                'rgb(255,116,37)',
                'rgb(127,127,127)',
                'rgb(255,189,53)',
                'rgb(42,157,215)',
                'rgb(79,175,67)'
            ],
            barThickness: 100,
        },
    ],
};

const RepnotesTOEGraphicalBar = ( props: RepnotesGraphicalBarProps ) => {
    
    YearToDate.datasets[0].data = [
        props.data.YearToDate.competitionInfo,
        props.data.YearToDate.customerExperience,
        props.data.YearToDate.generalComments,
        props.data.YearToDate.productPerformance,
        props.data.YearToDate.productQuality,
        props.data.YearToDate.unmetNeed
     ]

     const Monthly = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {   
                label: 'Competition Info',
                data: Object.values(props.data.Monthly.competitionInfo),
                backgroundColor: 'rgb(30,115,198)',
            },
            {
                label: 'Customer Experience',
                data: Object.values(props.data.Monthly.customerExperience),
                backgroundColor: 'rgb(255,116,37)',
            },
            {
                label: 'General Comments',
                data: Object.values(props.data.Monthly.generalComments),
                backgroundColor: 'rgb(127,127,127)',
            },
            {
                label: 'Product Performance',
                data: Object.values(props.data.Monthly.productPerformance),
                backgroundColor: 'rgb(255,189,53)',
            },
            {
                label: 'Product Quality',
                data: Object.values(props.data.Monthly.productQuality),
                backgroundColor: 'rgb(42,157,215)',
            },
            {
                label: 'Unmet Need',
                data: Object.values(props.data.Monthly.unmetNeed),
                backgroundColor: 'rgb(79,175,67)',
            },
        ],
    };


    return(
        <Grid item xs={12}>
            <Bar type data={props.datePeriod === 'YearToDate' ? YearToDate : Monthly} options={options} />
        </Grid>
    )
}

const areEqual = (prevProps: RepnotesGraphicalBarProps, nextProps: RepnotesGraphicalBarProps) => true;
export default memo(RepnotesTOEGraphicalBar, areEqual);