import React, { useState, useEffect } from 'react';

// Import all four of our final chart components
import ListParticipationChart from './charts/ListParticipationChart';
import CheckInTimelineChart from './charts/CheckInTimelineChart';
import ListDistributionDoughnutChart from './charts/ListDistributionDoughnutChart';
import ProfileDistributionDoughnutChart from './charts/ProfileDistributionDoughnutChart';

import './AnalyticsDashboard.css';
import ProgressChart from './charts/ProgressChart';
import EngagementBubbleChart from './charts/EngagementBubbleChart';

const AnalyticsDashboard = () => {
    const [listParticipationData, setListParticipationData] = useState(null);
    const [checkInTimesData, setCheckInTimesData] = useState(null);
    const [listsData, setListsData] = useState(null);
    const [profilesData, setProfilesData] = useState(null);
    const [progressData, setProgressData] = useState(null);
    const [participantsData, setParticipantsData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const proxyBaseUrl = process.env.REACT_APP_PROXY_BASE_URL;
                const endpoints = ['profiles', 'participants', 'lists'];
                const requests = endpoints.map(endpoint => fetch(`${proxyBaseUrl}/${endpoint}`));

                const responses = await Promise.all(requests);
                for (const response of responses) {
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`);
                    }
                }

                const [profiles, participants, lists] = await Promise.all(
                    responses.map((res) => res.json())
                );

                setListsData(lists.data);
                setProfilesData(profiles.data);
                setParticipantsData(participants.data);

                const listCounts = participants.data.reduce((acc, p) => {
                    const listName = p.listName || 'Unknown List';
                    acc[listName] = (acc[listName] || 0) + 1;
                    return acc;
                }, {});
                const sortedLists = Object.entries(listCounts).sort(([, a], [, b]) => b - a);
                setListParticipationData({
                    labels: sortedLists.map(item => item[0]),
                    datasets: [{ data: sortedLists.map(item => item[1]) }],
                });

                const listColors = {};
                const colors = ['#36A2EB', '#FF6384', '#4BC0C0', '#FF9F40', '#9966FF', '#FFCD56'];
                lists.data.forEach((list, index) => { listColors[list.name] = colors[index % colors.length]; });

                const now = new Date();
                const timelineEntries = participants.data
                    .filter(p => p.checkedIn && p.checkInDate)
                    .map(p => {
                        const checkInTime = new Date(p.checkInDate * 1000);
                        let checkOutTime, status, color;
                        if (p.checkedOut && p.checkOutDate) {
                            status = 'completed';
                            checkOutTime = new Date(p.checkOutDate * 1000);
                            color = listColors[p.listName] || '#cccccc';
                        } else {
                            status = 'inprogress';
                            checkOutTime = now;
                            color = listColors[p.listName] || '#cccccc';
                        }
                        return {
                            label: `${p.name} (${p.listName})`,
                            checkIn: checkInTime,
                            checkOut: checkOutTime,
                            status,
                            color,
                        };
                    });

                if (timelineEntries.length === 0) {
                    setCheckInTimesData({ labels: [], datasets: [] });
                } else {
                    const allTimes = timelineEntries.flatMap(e => [e.checkIn, e.checkOut]);
                    const minTime = new Date(Math.min(...allTimes));
                    const maxTime = new Date(Math.max(...allTimes));
                    setCheckInTimesData({
                        labels: timelineEntries.map(e => e.label),
                        datasets: [{ data: timelineEntries.map(e => [e.checkIn, e.checkOut]), fullData: timelineEntries }],
                        minTime,
                        maxTime,
                    });
                }

                const listProgress = {};
                lists.data.forEach(list => {
                    listProgress[list.name] = { checkedIn: 0, total: list.totalParticipants || 0 };
                });
                participants.data.forEach(p => {
                    if (p.checkedIn && p.listName && listProgress[p.listName]) {
                        listProgress[p.listName].checkedIn += 1;
                    }
                });
                const progressLabels = Object.keys(listProgress);
                const checkedInData = progressLabels.map(label => listProgress[label].checkedIn);
                const remainingData = progressLabels.map(label => {
                    const remaining = listProgress[label].total - listProgress[label].checkedIn;
                    return remaining < 0 ? 0 : remaining;
                });

                const predefinedColors = ['#4BC0C0', '#FF9F40', '#9966FF', '#FFCD56', '#36A2EB', '#FF6384'];
                const progressColors = progressLabels.map(
                    (_, index) => predefinedColors[index % predefinedColors.length]
                );

                setProgressData({
                    labels: progressLabels,
                    datasets: [
                        {
                            label: 'Checked-in',
                            data: checkedInData,
                            backgroundColor: progressColors, // Use the array of colors instead of a single color
                        },
                        {
                            label: 'Remaining',
                            data: remainingData,
                            backgroundColor: '#E0E0E0',
                            hoverBackgroundColor: '#E0E0E0',
                        },
                    ],
                });


            } catch (err) {
                console.error("Dashboard failed to process data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    if (loading) { return <div className="dashboard-container"><h1>Loading Analytics...</h1></div>; }
    if (error) { return <div className="dashboard-container"><h1>Error: {error}</h1></div>; }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Analytics Dashboard</h1>
            </header>
            <main className="dashboard-grid">
                <div className="chart-card">
                    <ListDistributionDoughnutChart lists={listsData} />
                </div>
                <div className="chart-card">
                    <ProfileDistributionDoughnutChart profiles={profilesData} />
                </div>
                <div className="chart-card">
                    <ListParticipationChart chartData={listParticipationData} />
                </div>
                <div className="chart-card wide-card">
                    <ProgressChart chartData={progressData} />
                </div>

                <div className="chart-card wide-card">
                    <EngagementBubbleChart participants={participantsData} />
                </div>

                <div className="chart-card wide-card">
                    <CheckInTimelineChart chartData={checkInTimesData} />
                </div>
            </main>
        </div>
    );
};

export default AnalyticsDashboard;