import { useState, useEffect, memo } from 'react';
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
    const [shallAnimate, setShallAnimate] = useState<boolean | undefined>(undefined);
    const { data, colors, values } = props;
    useEffect(() => {
        if (data) {
            setTimeout(() => {
                setShallAnimate(false);
            }, 750);
        }
    }, [data])

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
        <Bar type data={YearToDate} options={{ ...options, animation: shallAnimate }} />
    )
};

const areEqual = (prevProps: RepnotesGraphicalBarProps, nextProps: RepnotesGraphicalBarProps) => true;
export default memo(RepnotesGraphicalBar, areEqual);