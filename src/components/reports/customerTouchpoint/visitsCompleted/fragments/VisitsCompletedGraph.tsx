import { useState, useEffect, memo } from 'react';
import { Bar } from 'react-chartjs-2';

const options = {
    plugins:{
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                // @ts-ignore
                label: (context) => {
                    let label = context.dataset.label || '';
                    if (label) {
                        label = `${label}: `;
                    }
                    if (context.parsed.y !== null) {
                        label = `${label}${context.parsed.y}%`;
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            stacked: true,
            ticks: {
                // @ts-ignore
                callback: (value) => {
                    return `${value}%`
                }
            }
        },
        x: {
            ticks: {
                font: {
                    size: 12
                },
            },
            stacked: true
        }
    },
    maintainAspectRatio: false
};

interface RepnotesGraphicalBarProps {
    completeData: Array<string | number>;
    incompleteData: Array<string | number>;
    colors:  Array<string>;
    data: Array<string>;
};

const RepnotesGraphicalBar = (props: RepnotesGraphicalBarProps) => {
    const [shallAnimate, setShallAnimate] = useState<boolean | undefined>(undefined);
    const { data, colors, completeData, incompleteData } = props;
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
                label: 'Completed Calls/Visit',
                data: completeData,
                backgroundColor: colors,
                barThickness: 100,
            },
            {
                label: 'Incomplete Calls/Visit',
                data: incompleteData,
                backgroundColor: ['#EC7D32', '#EC7D32', '#EC7D32', '#EC7D32'],
                barThickness: 100,
            },
        ],
    };

    return (
        <Bar key="visits-completed-graph" type data={YearToDate} options={{ ...options, animation: shallAnimate }} />
    );

};

const areEqual = (prevProps: RepnotesGraphicalBarProps, nextProps: RepnotesGraphicalBarProps) => true;
export default memo(RepnotesGraphicalBar, areEqual);