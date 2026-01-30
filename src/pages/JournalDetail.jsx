import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import FlavorRadarChart from '../components/FlavorRadarChart';
import './JournalDetail.css';

function JournalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getEntry, deleteEntry } = useJournal();

    const entry = getEntry(id);

    if (!entry) {
        return (
            <div className="journal-detail-page page">
                <div className="container">
                    <div className="empty-state glass-container">
                        <h2>Entry Not Found</h2>
                        <p>This tea session does not exist.</p>
                        <Link to="/journal" className="btn btn-primary">
                            Back to Journal
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            deleteEntry(id);
            navigate('/journal');
        }
    };

    const date = new Date(entry.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="journal-detail-page page">
            <div className="container">
                <div className="detail-header">
                    <Link to="/journal" className="back-link">
                        ← Back to Journal
                    </Link>
                    <div className="detail-actions">
                        <button className="btn btn-secondary" onClick={handleDelete}>
                            Delete Entry
                        </button>
                    </div>
                </div>

                <div className="detail-content">
                    <div className="detail-main">
                        <div className="detail-title-section glass-container">
                            <h1>{entry.teaName}</h1>
                            {entry.teaType && <span className="tea-type-badge">{entry.teaType}</span>}
                            <div className="detail-meta">
                                <span>{formattedDate}</span>
                                <span className="meta-separator">•</span>
                                <span>{formattedTime}</span>
                            </div>
                        </div>

                        <div className="detail-section glass-container">
                            <h2>Session Details</h2>
                            <div className="details-grid">
                                {entry.temperature && (
                                    <div className="detail-stat">
                                        <span className="stat-icon">🌡️</span>
                                        <div>
                                            <div className="stat-label">Temperature</div>
                                            <div className="stat-value">{entry.temperature}°C</div>
                                        </div>
                                    </div>
                                )}

                                {entry.waterAmount && (
                                    <div className="detail-stat">
                                        <span className="stat-icon">💧</span>
                                        <div>
                                            <div className="stat-label">Water</div>
                                            <div className="stat-value">{entry.waterAmount}ml</div>
                                        </div>
                                    </div>
                                )}

                                {entry.teaWeight && (
                                    <div className="detail-stat">
                                        <span className="stat-icon">🍃</span>
                                        <div>
                                            <div className="stat-label">Tea</div>
                                            <div className="stat-value">{entry.teaWeight}g</div>
                                        </div>
                                    </div>
                                )}

                                {entry.teaWeight && entry.waterAmount && (
                                    <div className="detail-stat">
                                        <span className="stat-icon">⚖️</span>
                                        <div>
                                            <div className="stat-label">Ratio</div>
                                            <div className="stat-value">
                                                1:{(entry.waterAmount / entry.teaWeight).toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {entry.steepTimes && entry.steepTimes.length > 0 && (
                            <div className="detail-section glass-container">
                                <h2>Steep Times</h2>
                                <div className="steep-times-display">
                                    {entry.steepTimes.map((time, index) => (
                                        <div key={index} className="steep-time-badge">
                                            <span className="steep-badge-number">#{index + 1}</span>
                                            <span className="steep-badge-time">{time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {entry.notes && (
                            <div className="detail-section glass-container">
                                <h2>Tasting Notes</h2>
                                <p className="notes-text">{entry.notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="detail-sidebar">
                        {entry.flavorProfile && (
                            <div className="detail-section glass-container">
                                <h2>Flavor Profile</h2>
                                <FlavorRadarChart flavorProfile={entry.flavorProfile} size="large" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JournalDetail;
