import { memo } from 'react';
import { ActualVsTargetStatus } from '../../../../store/report/actualToTarget/types';
import { Bar } from 'react-chartjs-2';

const options = {
    plugins:{
        legend: {
            display: false
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Total'
            },
            ticks: {
                display: false
            }
        }
      },
    maintainAspectRatio: false
};

interface ActualToTargetStatusGraphProps {
    data?: ActualVsTargetStatus;
    type: string;
};

const ActualToTargetStatusGraph = (props: ActualToTargetStatusGraphProps) => {
    const { type, data } = props
    if (data) {
        const YearToDate = {
            labels: ['Whole Year Target', 'Actual Sales To Target', 'Backlog To Date'],
            datasets: [
                {
                    data: [data.yearToDate.summaryWholeYearTarget, data.yearToDate.summaryActualSalesToDate, data.yearToDate.summaryBacklogToDate],
                    backgroundColor: [
                        'rgb(255,116,37)',
                        'rgb(30,115,198)',
                        'rgb(127,127,127)'
                    ],
                    barThickness: 100,
                },
            ],
        };
        const QuarterToDate = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {   
                    label: 'Whole Year Target',
                    data: Object.values({ 
                        q1: data.quarterToDate.summaryWholeYearTarget.q1,
                        q2: data.quarterToDate.summaryWholeYearTarget.q2,
                        q3: data.quarterToDate.summaryWholeYearTarget.q3,
                        q4: data.quarterToDate.summaryWholeYearTarget.q4
                    }),
                    backgroundColor: 'rgb(255,116,37)',
                },
                {
                    label: 'Actual Sales To Target',
                    data: Object.values({ 
                        q1: data.quarterToDate.summaryActualSalesToDate.q1,
                        q2: data.quarterToDate.summaryActualSalesToDate.q2,
                        q3: data.quarterToDate.summaryActualSalesToDate.q3,
                        q4: data.quarterToDate.summaryActualSalesToDate.q4
                    }),
                    backgroundColor: 'rgb(30,115,198)',
                },
                {
                    label: 'Backlog To Date',
                    data: Object.values({ 
                        q1: data.quarterToDate.summaryBacklogToDate.q1,
                        q2: data.quarterToDate.summaryBacklogToDate.q2,
                        q3: data.quarterToDate.summaryBacklogToDate.q3,
                        q4: data.quarterToDate.summaryBacklogToDate.q4
                    }),
                    backgroundColor: 'rgb(127,127,127)',
                }
            ],
        };
        return(
            <Bar type data={type !== "QTD" ? YearToDate : QuarterToDate } options={options} />
        )
    }
    return <Bar type data={undefined} options={options} />
};


const areEqual = (prevProps: ActualToTargetStatusGraphProps, nextProps: ActualToTargetStatusGraphProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps)
};
export default memo(ActualToTargetStatusGraph, areEqual);
