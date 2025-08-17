// src/components/charts/CheckInTimelineChart.js
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, TimeSeriesScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Chart.js setup only needs to run once.
ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, TimeSeriesScale
);

// This helper function doesn't depend on component state, so it stays outside.
const createGradient = (ctx, area, color) => {
    const gradient = ctx.createLinearGradient(area.left, 0, area.right, 0);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.9, color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
    return gradient;
};

// Define constants for clarity.
const BAR_HEIGHT_PX = 35;
const MIN_CHART_HEIGHT_PX = 300;

const CheckInTimelineChart = ({ chartData }) => {
    // Hooks are called at the top level, before any conditions or returns.
    const chartOptions = useMemo(() => {
        return {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Check-in to Check-out Duration per Participant',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            if (!context.raw || !Array.isArray(context.raw)) {
                                return context.label || '';
                            }
                            const start = new Date(context.raw[0]).toLocaleTimeString();
                            const end = new Date(context.raw[1]).toLocaleTimeString();
                            return `${context.label}: ${start} - ${end}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'minute', tooltipFormat: 'hh:mm a', displayFormats: { minute: 'h:mm a' } },
                    min: chartData?.minTime,
                    max: chartData?.maxTime,
                },
            },
            animation: {
                duration: 1800,
                easing: 'easeInOutQuad',
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 50 + context.datasetIndex * 100;
                    }
                    return delay;
                },
            },
        };
    }, [chartData?.minTime, chartData?.maxTime]);

    const transformedChartData = useMemo(() => {
        if (!chartData?.datasets) {
            return { labels: [], datasets: [] };
        }
        return {
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
                ...dataset,
                backgroundColor: (context) => {
                    if (!context.chart.chartArea || !dataset.fullData || !dataset.fullData[context.dataIndex]) return '#cccccc';
                    const entry = dataset.fullData[context.dataIndex];
                    if (entry.status === 'inprogress') {
                        return createGradient(context.chart.ctx, context.chart.chartArea, entry.color);
                    }
                    return entry.color;
                },
                borderColor: (context) => {
                    if (!dataset.fullData || !dataset.fullData[context.dataIndex]) return '#cccccc';
                    const entry = dataset.fullData[context.dataIndex];
                    return entry.color;
                },
                borderWidth: 1,
                borderRadius: 5,
                borderSkipped: false,
            })),
        };
    }, [chartData?.labels, chartData?.datasets]);

    // Conditional return now happens AFTER all hook calls.
    if (!chartData || !chartData.labels || chartData.labels.length === 0) {
        return <div>No timeline data available.</div>;
    }

    const chartHeight = Math.max(chartData.labels.length * BAR_HEIGHT_PX, MIN_CHART_HEIGHT_PX);

    return (
        <div style={{ height: `${chartHeight}px`, position: 'relative' }}>
            <Bar options={chartOptions} data={transformedChartData} />
        </div>
    );
};

export default CheckInTimelineChart;