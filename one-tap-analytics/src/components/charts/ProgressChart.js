// src/components/charts/ProgressChart.js
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressChart = ({ chartData }) => {
    const chartOptions = useMemo(() => {
        return {
            indexAxis: 'y', // This makes the bar chart horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Check-in Progress per List',
                },
                legend: {
                    display: false, // We don't need a legend if the tooltip is clear
                },
                tooltip: {
                    // Custom tooltip to show "X out of Y"
                    callbacks: {
                        label: function (context) {
                            const checkedInCount = context.dataset.data[context.dataIndex];
                            // To get the total, we sum the data from both datasets at this index
                            const total = context.chart.data.datasets.reduce((sum, dataset) => {
                                return sum + dataset.data[context.dataIndex];
                            }, 0);
                            return `Total: ${checkedInCount} out of ${total}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true, // This is the key to stacking the bars
                    display: false, // Hide the bottom axis for a cleaner progress bar look
                    grid: {
                        display: false, // Hide grid lines
                    },
                },
                y: {
                    stacked: true,
                    grid: {
                        display: false,
                    },
                },
            },
            animation: {
                duration: 1200,
                easing: 'easeOutCubic',
            },
        };
    }, []);

    if (!chartData || !chartData.labels || !chartData.datasets) {
        return <div>No progress data available.</div>;
    }

    return <div style={{ height: "280px" }}>
        <Bar data={chartData} options={chartOptions} />
    </div>;
};

export default ProgressChart;