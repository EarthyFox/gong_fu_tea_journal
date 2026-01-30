import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { exportAsJSON, exportAsCSV } from '../utils/exportUtils';
import FlavorRadarChart from '../components/FlavorRadarChart';
import './Journal.css';

function Journal() {
    const { entries } = useJournal();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Filter and sort entries
    let filteredEntries = entries.filter((entry) => {
        const matchesSearch =
            entry.teaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filterType || entry.teaType === filterType;
        return matchesSearch && matchesType;
    });

    if (sortBy === 'newest') {
        filteredEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
        filteredEntries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'name') {
        filteredEntries.sort((a, b) => a.teaName?.localeCompare(b.teaName || '') || 0);
    }

    const teaTypes = [...new Set(entries.map((e) => e.teaType).filter(Boolean))];

    return (
        <div className="journal-page page">
            <div className="container">
                <div className="journal-header">
                    <div>
                        <h1>Tea Journal</h1>
                        <p className="journal-subtitle">
                            {entries.length} {entries.length === 1 ? 'session' : 'sessions'} documented
                        </p>
                    </div>
                    <Link to="/journal/new" className="btn btn-primary">
                        + New Session
                    </Link>
                </div>

                {entries.length > 0 && (
                    <>
                        <div className="journal-controls">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search by tea name or notes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <div className="filter-controls">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Types</option>
                                    {teaTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name">By Name</option>
                                </select>

                                <div className="export-buttons">
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => exportAsJSON(entries)}
                                    >
                                        Export JSON
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => exportAsCSV(entries)}
                                    >
                                        Export CSV
                                    </button>
                                </div>
                            </div>
                        </div>

                        {filteredEntries.length === 0 ? (
                            <div className="empty-state">
                                <p>No sessions match your search criteria</p>
                            </div>
                        ) : (
                            <div className="journal-grid">
                                {filteredEntries.map((entry) => (
                                    <JournalEntryCard key={entry.id} entry={entry} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {entries.length === 0 && (
                    <div className="empty-state glass-container">
                        <div className="empty-icon">🍵</div>
                        <h2>No Tea Sessions Yet</h2>
                        <p>Start documenting your Gong Fu tea journey</p>
                        <Link to="/journal/new" className="btn btn-primary">
                            Create First Session
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function JournalEntryCard({ entry }) {
    const date = new Date(entry.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Link to={`/journal/${entry.id}`} className="journal-entry-card card">
            <div className="entry-card-header">
                <h3 className="entry-card-title">{entry.teaName}</h3>
                {entry.teaType && <span className="entry-card-type">{entry.teaType}</span>}
            </div>

            <div className="entry-card-date">{formattedDate}</div>

            {entry.flavorProfile && (
                <div className="entry-card-chart">
                    <FlavorRadarChart flavorProfile={entry.flavorProfile} size="small" />
                </div>
            )}

            <div className="entry-card-details">
                {entry.temperature && (
                    <div className="entry-detail-item">
                        <span className="detail-icon">🌡️</span>
                        <span>{entry.temperature}°C</span>
                    </div>
                )}
                {entry.steepTimes && entry.steepTimes.length > 0 && (
                    <div className="entry-detail-item">
                        <span className="detail-icon">⏱️</span>
                        <span>{entry.steepTimes.length} steeps</span>
                    </div>
                )}
                {entry.teaWeight && entry.waterAmount && (
                    <div className="entry-detail-item">
                        <span className="detail-icon">⚖️</span>
                        <span>1:{(entry.waterAmount / entry.teaWeight).toFixed(1)}</span>
                    </div>
                )}
            </div>

            {entry.notes && (
                <p className="entry-card-notes">{entry.notes.substring(0, 100)}{entry.notes.length > 100 ? '...' : ''}</p>
            )}
        </Link>
    );
}

export default Journal;
