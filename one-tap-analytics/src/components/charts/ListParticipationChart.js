// src/components/charts/ListParticipationChart.js
import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const ListParticipationChart = ({ chartData }) => {

    const chartOptions = useMemo(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Participants per List',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                },
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuad',
            },
        };
    }, []); // Empty dependency array ensures this is created only once.

    const lollipopData = useMemo(() => {
        // We add a guard clause inside the hook to handle cases where data isn't ready.
        if (!chartData || !chartData.labels || !chartData.datasets?.[0]?.data) {
            return null;
        }

        const labels = chartData.labels;
        const data = chartData.datasets[0].data;

        return {
            labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Participants',
                    data,
                    backgroundColor: '#d3d3d3', // A neutral gray for the stick
                    barThickness: 3,
                },
                {
                    type: 'scatter',
                    label: 'Participants',
                    data,
                    backgroundColor: '#007FFF',
                    pointRadius: 7,
                    pointHoverRadius: 9,
                },
            ],
        };
    }, [chartData]); // This hook re-runs only when chartData changes.

    if (!lollipopData) {
        return <div>No participation data available.</div>;
    }

    return (
        <div style={{ height: '100%', position: 'relative' }}>
            <Chart type='bar' options={chartOptions} data={lollipopData} />
        </div>
    );
};

export default ListParticipationChart;