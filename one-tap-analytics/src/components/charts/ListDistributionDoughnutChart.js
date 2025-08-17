// src/components/charts/ListPieChart.js
import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ListDistributionDoughnutChart = ({ lists }) => {
    const chartDataAndOptions = useMemo(() => {
        if (!lists || lists.length === 0) {
            return { data: null, options: null };
        }

        const colors = ['#4BC0C0', '#36A2EB', '#FFCD56', '#9966FF', '#FF9F40', '#FF6384'];

        const data = {
            labels: lists.map(list => list.name),
            datasets: [
                {
                    label: 'Lists',
                    data: lists.map(() => 1), // Each slice has an equal size
                    backgroundColor: lists.map((_, index) => colors[index % colors.length]),
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 20,
                    hoverBorderWidth: 1,
                    hoverBorderColor: '#f0f0f0',
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'List Distribution',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const list = lists[context.dataIndex];
                            if (!list) return '';
                            // Create a detailed, multi-line tooltip
                            return [
                                `Name: ${list.name}`,
                                `Participants: ${list.totalParticipants || 0}`,
                                `Description: ${list.description || 'N/A'}`,
                            ];
                        },
                        title: () => null,
                    },
                },
            },
            animation: {
                duration: 1500,
                animateRotate: true,
                animateScale: true,
            },
        };

        return { data, options };
    }, [lists]);

    if (!chartDataAndOptions.data) {
        return <div>Loading List Data...</div>;
    }

    return <Pie options={chartDataAndOptions.options} data={chartDataAndOptions.data} />;
};

export default ListDistributionDoughnutChart;