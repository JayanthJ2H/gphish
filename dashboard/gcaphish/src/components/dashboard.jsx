import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.css';

export default function Dashboard() {
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState('');

    const fetchLogs = () => {
        axios.post('http://98.70.37.51:3000/api/track')
            .then(response => {
                console.log('🚀 Logs loaded:', response.data);

                const latestRun = response.data.length > 0
                    ? response.data[response.data.length - 1]
                    : [];

                setLogs(latestRun);
            })
            .catch(error => {
                console.error('Failed to load logs', error);
                setLogs([]);
                showMessage('❌ Failed to load logs');
            });
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSendEmail = () => {
        axios.post('http://98.70.37.51:3000/sendEmail')
            .then(() => {
                showMessage('📧 Emails sent successfully!');
            })
            .catch(error => {
                console.error('Failed to send email:', error);
                showMessage('❌ Failed to send email');
            });
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const clearData = () => {
        axios.post('http://98.70.37.51:3000/api/cleardata')
            .then(() => {
                showMessage('✅ Data cleared successfully!');
                fetchLogs(); 
            })
            .catch(error => {
                console.error('Failed to clear data:', error);
                showMessage('❌ Failed to clear data');
            });
    }       

    // Calculate stats
    const stats = {
        emailsSent: logs.length || 0,
        emailsOpened: logs.filter(e => e.opened).length || 0,
        clickedLink: logs.filter(e => e.Clicked).length || 0,
        submittedData: logs.filter(e => e.credentailsEntered).length || 0,
    };

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>

            <div className="dashboard-actions">
                <button
                    className="send-email-btn"
                    onClick={handleSendEmail}
                >
                    📧 Send Email
                </button>

                <button
                    className="refresh-btn"
                    onClick={fetchLogs}
                >
                    🔄 Refresh Logs
                </button>

                <button
                    className="refresh-btn"
                    onClick={clearData}
                >
                    ClearData
                </button>
            </div>

            {/* Summary Circle Stats */}
            <div className="dashboard-summary">
                <div className="summary-card sent">
                    <div className="summary-count">{stats.emailsSent}</div>
                    <div className="summary-label">Email Sent</div>
                </div>

                {/* <div className="summary-card opened">
                    <div className="summary-count">{stats.emailsOpened}</div>
                    <div className="summary-label">Email Opened</div>
                </div> */}

                <div className="summary-card clicked">
                    <div className="summary-count">{stats.clickedLink}</div>
                    <div className="summary-label">Clicked Link</div>
                </div>

                <div className="summary-card submitted">
                    <div className="summary-count">{stats.submittedData}</div>
                    <div className="summary-label">Submitted Data</div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="dashboard-table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Employee Email</th>
                            <th>Typed Email</th>
                            <th>Typed Password</th>
                            <th>Timestamp</th>
                            <th>Clicked</th>
                            <th>Credentials Entered</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((entry, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{entry.email || ''}</td>
                                <td>{entry.details?.typed_email || ''}</td>
                                <td>***********</td>
                                <td>{entry.details?.timestamp ? new Date(entry.details.timestamp).toLocaleString() : ''}</td>
                                <td>{entry.Clicked ? '✅' : '❌'}</td>
                                <td>{entry.credentailsEntered ? '✅' : '❌'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {message && <div className="popup-message">{message}</div>}
        </div>
    );
}
