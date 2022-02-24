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
    purchasingExperience: number;
    communicationOfOrderStatus: number;
    productLeadTime: number;
    deliveryExperience: number;
    partsAvailability: number;
    partsPricing: number;
    serviceTechnicianSupport: number;
    others: number;
};

const RepnotesCEGraphicalBar = ({ purchasingExperience, communicationOfOrderStatus, productLeadTime, deliveryExperience, partsAvailability, partsPricing, serviceTechnicianSupport, others }: RepnotesGraphicalBarProps) => {
    const data = {
        labels: [['Purchasing', 'Experience'], ['Communication Of', 'Order Status'], ['Product', 'Lead Time'], ['Delivery', 'Experience'], ['Parts', 'Availability'], ['Parts', 'Pricing'], ['Service Technician', 'Support'], 'Others' ],
        datasets: [
            {
                data: [purchasingExperience, communicationOfOrderStatus, productLeadTime, deliveryExperience, partsAvailability, partsPricing, serviceTechnicianSupport, others],
                backgroundColor: [
                    'rgb(30,115,198)',
                    'rgb(255,116,37)',
                    'rgb(127,127,127)',
                    'rgb(255,189,53)',
                    'rgb(42,157,215)',
                    'rgb(79,175,67)',
                    'rgb(10,192,239)',
                    'rgb(5,165,89)'
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
export default memo(RepnotesCEGraphicalBar, areEqual);