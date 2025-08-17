// src/components/charts/ProfileDistributionDoughnutChart.js
import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// 1. Define the custom plugin to draw text in the center
const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
        const centerText = chart.config.options.plugins.centerText;
        if (centerText && centerText.display) {
            const { ctx } = chart;
            const { top, left, width, height } = chart.chartArea;
            const x = left + width / 2;
            const y = top + height / 2;

            ctx.save();
            ctx.font = centerText.font || 'bold 30px sans-serif';
            ctx.fillStyle = centerText.color || '#333';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(centerText.text, x, y);
            ctx.restore();
        }
    },
};

// 2. Register the new custom plugin with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title, centerTextPlugin);

const ProfileDistributionDoughnutChart = ({ profiles }) => {
    const chartDataAndOptions = useMemo(() => {
        if (!profiles || profiles.length === 0) {
            return { data: null, options: null };
        }

        const colors = ['#FF6384', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB'];

        const data = {
            labels: profiles.map(p => p.name || 'Unknown'),
            datasets: [
                {
                    label: 'Profiles',
                    data: profiles.map(() => 1),
                    backgroundColor: profiles.map((_, index) => colors[index % colors.length]),
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 15,
                },
            ],
        };

        const options = {
            responsive: true,
            // 3. Define the size of the center hole
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Profile Distribution',
                },
                tooltip: {

                    callbacks: {

                        label: function (context) {

                            const profile = profiles[context.dataIndex];

                            if (!profile) return '';



                            return [

                                `Name: ${profile.name}`,

                                `Email: ${profile.email || 'N/A'}`,

                            ];

                        },

                        title: () => null,

                    },

                },
                // 4. Configure the text for our custom plugin
                centerText: {
                    display: true,
                    text: `${profiles.length}`, // The total count
                    color: '#333',
                    font: 'bold 28px sans-serif',
                },
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuad',
            },
        };

        return { data, options };
    }, [profiles]);


    if (!chartDataAndOptions.data) {
        return <div>Loading Profile Data...</div>;
    }

    return <Doughnut options={chartDataAndOptions.options} data={chartDataAndOptions.data} />;
};

export default ProfileDistributionDoughnutChart;