import { memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { stringParser } from '../../../../../util/utils';

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

const RepnotesGraphicalBar = (props: RepnotesGraphicalBarProps) => {
    const { data, colors, values, viewType } = props
    const YearToDate = {
        labels: stringParser(data),
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                barThickness: (viewType === 'Make-Model') ? 100 : 50,
            },
        ],
    };
    return(
        <Bar type data={YearToDate} options={options} />
    )
};

const areEqual = (prevProps: RepnotesGraphicalBarProps, nextProps: RepnotesGraphicalBarProps) => true;
export default memo(RepnotesGraphicalBar, areEqual);