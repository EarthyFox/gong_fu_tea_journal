import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './Stash.css';

const TEA_TYPES = ['Green Tea', 'Oolong', 'Black Tea', 'Raw Pu-erh', 'Ripe Pu-erh', 'White Tea', 'Herbal', 'Other'];

function Stash() {
    const { user } = useAuth();
    const [teas, setTeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        vendor: '',
        year: '',
        weight_grams: '',
        in_stock: true
    });

    useEffect(() => {
        fetchTeas();
    }, []);

    const fetchTeas = async () => {
        try {
            const data = await api.get('/teas');
            setTeas(data);
        } catch (err) {
            console.error(err);
            setError('Could not load your tea stash.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTea = await api.post('/teas', {
                ...formData,
                weight_grams: parseFloat(formData.weight_grams) || 0
            });

            setTeas(prev => [...prev, newTea].sort((a, b) => a.name.localeCompare(b.name)));
            setShowAddForm(false);
            setFormData({ name: '', type: '', vendor: '', year: '', weight_grams: '', in_stock: true });
        } catch (err) {
            console.error(err);
            const msg = err.error || err.message || 'Error adding tea';
            alert(`Error adding tea: ${msg}`);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this tea?')) return;
        try {
            await api.delete(`/teas/${id}`);
            setTeas(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert('Error deleting tea');
        }
    };

    if (loading) return <div className="loading-spinner">Loading Stash...</div>;

    return (
        <div className="stash-page page">
            <div className="container">
                <div className="stash-header">
                    <h1>My Tea Stash</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? 'Cancel' : '+ Add Tea'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="add-tea-form-container">
                        <form onSubmit={handleSubmit} className="add-tea-form">
                            <h3>Add New Tea</h3>
                            <div className="form-group">
                                <label>Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Da Hong Pao" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select name="type" value={formData.type} onChange={handleInputChange}>
                                        <option value="">Select Type</option>
                                        {TEA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Year</label>
                                    <input name="year" value={formData.year} onChange={handleInputChange} placeholder="e.g. 2024" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Vendor</label>
                                    <input name="vendor" value={formData.vendor} onChange={handleInputChange} placeholder="Where did you get it?" />
                                </div>
                                <div className="form-group">
                                    <label>Weight (g)</label>
                                    <input type="number" name="weight_grams" value={formData.weight_grams} onChange={handleInputChange} placeholder="50" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary full-width">Save to Stash</button>
                        </form>
                    </div>
                )}

                <div className="stash-grid">
                    {teas.length === 0 && !loading && (
                        <div className="empty-state">
                            <p>No teas in your stash yet. Add some!</p>
                        </div>
                    )}
                    {teas.map(tea => (
                        <div key={tea.id} className="tea-card">
                            <div className="tea-card-header">
                                <h3>{tea.name}</h3>
                                <span className="tea-type-badge">{tea.type}</span>
                            </div>
                            <div className="tea-details">
                                {tea.year && <span className="detail-item">📅 {tea.year}</span>}
                                {tea.vendor && <span className="detail-item">🏪 {tea.vendor}</span>}
                                {tea.weight_grams > 0 && <span className="detail-item">⚖️ {tea.weight_grams}g</span>}
                            </div>
                            <button
                                className="btn-delete-icon"
                                onClick={() => handleDelete(tea.id)}
                                title="Remove tea"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Stash;
