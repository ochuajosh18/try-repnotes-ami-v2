import { memo } from 'react';
import { Bar } from 'react-chartjs-2';

const options = {
    plugins:{
        legend: {
            display: false
        },
    },
    scales: {

      },
    maintainAspectRatio: false
};

interface RepnotesGraphicalBarProps {
    data: Array<string>;
    colors:  Array<string>;
    values: Array<string | number>;
};

const RepnotesGraphicalBar = (props: RepnotesGraphicalBarProps) => {
    const { data, colors, values } = props
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
        <Bar type data={YearToDate} options={options} />
    )
};

const areEqual = (prevProps: RepnotesGraphicalBarProps, nextProps: RepnotesGraphicalBarProps) => true;
export default memo(RepnotesGraphicalBar, areEqual);