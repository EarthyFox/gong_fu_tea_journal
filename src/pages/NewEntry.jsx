import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { flavorDimensions, defaultFlavorProfile } from '../config/flavorDimensions';
import FlavorRadarChart from '../components/FlavorRadarChart';
import './NewEntry.css';

const TEA_TYPES = ['Green Tea', 'Oolong', 'Black Tea', 'Raw Pu-erh', 'Ripe Pu-erh', 'White Tea', 'Herbal', 'Other'];

function NewEntry() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addEntry } = useJournal();
    const { token } = useAuth();

    const [teas, setTeas] = useState([]);
    const [formData, setFormData] = useState({
        teaName: '',
        teaType: '',
        temperature: '',
        waterAmount: '',
        teaWeight: '',
        steepTimes: [''],
        notes: '',
        flavorProfile: { ...defaultFlavorProfile },
    });

    // Load Stash
    useEffect(() => {
        const fetchTeas = async () => {
            try {
                const data = await api.get('/teas');
                setTeas(data);
            } catch (err) {
                console.error("Failed to load stash", err);
            }
        };
        fetchTeas();
    }, []);

    useEffect(() => {
        if (location.state && location.state.steepTimes) {
            setFormData(prev => ({
                ...prev,
                steepTimes: location.state.steepTimes
            }));
        }
    }, [location.state]);

    const handleStashSelect = (e) => {
        const teaId = e.target.value;
        if (!teaId) return;

        const selectedTea = teas.find(t => t.id === parseInt(teaId));
        if (selectedTea) {
            setFormData(prev => ({
                ...prev,
                teaName: selectedTea.name,
                teaType: selectedTea.type || '',
            }));
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFlavorChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            flavorProfile: {
                ...prev.flavorProfile,
                [key]: parseInt(value) || 0,
            },
        }));
    };

    const handleSteepTimeChange = (index, value) => {
        const newSteepTimes = [...formData.steepTimes];
        newSteepTimes[index] = value;
        setFormData((prev) => ({ ...prev, steepTimes: newSteepTimes }));
    };

    const addSteepTime = () => {
        setFormData((prev) => ({
            ...prev,
            steepTimes: [...prev.steepTimes, ''],
        }));
    };

    const removeSteepTime = (index) => {
        if (formData.steepTimes.length > 1) {
            setFormData((prev) => ({
                ...prev,
                steepTimes: prev.steepTimes.filter((_, i) => i !== index),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.teaName.trim()) {
            alert('Please enter a tea name');
            return;
        }

        // Clean up steep times (remove empty ones)
        const cleanedSteepTimes = formData.steepTimes
            .map((time) => time.trim())
            .filter((time) => time !== '');

        const entryData = {
            ...formData,
            steepTimes: cleanedSteepTimes,
            temperature: parseFloat(formData.temperature) || null,
            waterAmount: parseFloat(formData.waterAmount) || null,
            teaWeight: parseFloat(formData.teaWeight) || null,
        };

        addEntry(entryData);
        navigate('/journal');
    };

    const handleCancel = () => {
        navigate('/journal');
    };

    return (
        <div className="new-entry-page page">
            <div className="container">
                <div className="entry-header">
                    <h1>New Tea Session</h1>
                    <p>Document your Gong Fu tea experience</p>
                </div>

                <form onSubmit={handleSubmit} className="entry-form">
                    <div className="form-grid">
                        {/* Tea Information */}
                        <div className="form-section">
                            <h2>Tea Information</h2>

                            {teas.length > 0 && (
                                <div className="form-group stash-select-group">
                                    <label>Select from Stash</label>
                                    <select onChange={handleStashSelect} defaultValue="">
                                        <option value="" disabled>-- Pick from Stash --</option>
                                        {teas.map(tea => (
                                            <option key={tea.id} value={tea.id}>
                                                {tea.name} ({tea.type})
                                            </option>
                                        ))}
                                    </select>
                                    <small className="helper-text">Or type manually below</small>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="teaName">Tea Name *</label>
                                <input
                                    id="teaName"
                                    type="text"
                                    value={formData.teaName}
                                    onChange={(e) => handleChange('teaName', e.target.value)}
                                    placeholder="e.g., Tie Guan Yin"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="teaType">Tea Type</label>
                                <select
                                    id="teaType"
                                    value={formData.teaType}
                                    onChange={(e) => handleChange('teaType', e.target.value)}
                                >
                                    <option value="">Select type...</option>
                                    {TEA_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="temperature">Temperature (°C)</label>
                                    <input
                                        id="temperature"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={formData.temperature}
                                        onChange={(e) => handleChange('temperature', e.target.value)}
                                        placeholder="95"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="waterAmount">Water (ml)</label>
                                    <input
                                        id="waterAmount"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formData.waterAmount}
                                        onChange={(e) => handleChange('waterAmount', e.target.value)}
                                        placeholder="100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="teaWeight">Tea (g)</label>
                                    <input
                                        id="teaWeight"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={formData.teaWeight}
                                        onChange={(e) => handleChange('teaWeight', e.target.value)}
                                        placeholder="5"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Steep Times (seconds)</label>
                                <div className="steep-times-list">
                                    {formData.steepTimes.map((time, index) => (
                                        <div key={index} className="steep-time-input">
                                            <span className="steep-number">#{index + 1}</span>
                                            <input
                                                type="text"
                                                value={time}
                                                onChange={(e) => handleSteepTimeChange(index, e.target.value)}
                                                placeholder={`Steep ${index + 1}`}
                                            />
                                            {formData.steepTimes.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn-remove"
                                                    onClick={() => removeSteepTime(index)}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="btn btn-ghost btn-sm" onClick={addSteepTime}>
                                    + Add Steep
                                </button>
                            </div>
                        </div>

                        {/* Flavor Profile */}
                        <div className="form-section">
                            <h2>Flavor Profile</h2>
                            <p className="section-description">Rate each dimension from 0 to 10</p>

                            <div className="flavor-sliders">
                                {flavorDimensions.map((dim) => (
                                    <div key={dim.key} className="flavor-slider">
                                        <label htmlFor={`flavor-${dim.key}`}>
                                            {dim.label}
                                            <span className="flavor-value">{formData.flavorProfile[dim.key]}</span>
                                        </label>
                                        <input
                                            id={`flavor-${dim.key}`}
                                            type="range"
                                            min="0"
                                            max={dim.max}
                                            value={formData.flavorProfile[dim.key]}
                                            onChange={(e) => handleFlavorChange(dim.key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="chart-preview">
                                <h3>Preview</h3>
                                <FlavorRadarChart flavorProfile={formData.flavorProfile} size="small" />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="form-section full-width">
                        <h2>Tasting Notes</h2>
                        <div className="form-group">
                            <textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                placeholder="Describe your tea experience, observations, and reflections..."
                                rows="6"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewEntry;
