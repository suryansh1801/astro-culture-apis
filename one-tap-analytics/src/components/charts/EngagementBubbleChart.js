// src/components/charts/EngagementBubbleChart.js
import React, { useMemo } from 'react';
import { Bubble } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

const EngagementBubbleChart = ({ participants }) => {
    console.log(participants);
    // Memoize the complex data transformation.
    const chartData = useMemo(() => {
        if (!participants || participants.length === 0) return null;

        // 1. Count check-ins for each participant
        const participantCounts = participants.reduce((acc, p) => {
            if (p.checkedIn) {
                if (!acc[p.profileId]) {
                    acc[p.profileId] = { name: p.name, count: 0 };
                }
                acc[p.profileId].count += 1;
            }
            return acc;
        }, {});

        // 2. Convert the counts into the {x, y, r} format for the bubble chart
        const bubbleData = Object.values(participantCounts).map((p, index) => ({
            x: (index % 10) * 10 + Math.random() * 5, // Spread bubbles horizontally
            y: Math.floor(index / 10) * 10 + Math.random() * 5, // Spread bubbles vertically
            r: p.count * 4 + 2, // 'r' is the radius, based on the check-in count
            name: p.name, // Store name for the tooltip
            count: p.count, // Store count for the tooltip
        }));

        const colors = ['#FF6384', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB'];

        return {
            datasets: [
                {
                    label: 'Participant Engagement',
                    data: bubbleData,
                    backgroundColor: bubbleData.map(
                        (_, i) => colors[i % colors.length] + 'B3' // Add alpha for transparency
                    ),
                    borderColor: bubbleData.map(
                        (_, i) => colors[i % colors.length]
                    ),
                    borderWidth: 2,
                },
            ],
        };
    }, [participants]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Participant Engagement',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const dataPoint = context.raw;
                        return `${dataPoint.name}: ${dataPoint.count} check-in(s)`;
                    },
                },
            },
        },
        scales: {
            // We hide the axes for a more 'floating bubble' look
            x: { display: false },
            y: { display: false },
        },
    }), []);

    if (!chartData) {
        return <div>No engagement data available.</div>;
    }

    return (
        <div style={{ height: '300px' }}>
            <Bubble options={chartOptions} data={chartData} />
        </div>
    );
};

export default EngagementBubbleChart;