import { useState } from 'react';
import './WeightCalculator.css';

const TEA_TYPES = {
    'Green Tea': 3,
    'Oolong': 5,
    'Black Tea': 3,
    'Pu-erh': 5,
    'White Tea': 4,
};

function WeightCalculator() {
    const [teaWeight, setTeaWeight] = useState(5);
    const [waterVolume, setWaterVolume] = useState(100);
    const [selectedTea, setSelectedTea] = useState('');

    const ratio = waterVolume > 0 ? (waterVolume / teaWeight).toFixed(1) : 0;

    const loadPreset = (teaType) => {
        const recommendedRatio = TEA_TYPES[teaType];
        const newWeight = (waterVolume / recommendedRatio).toFixed(1);
        setTeaWeight(parseFloat(newWeight));
        setSelectedTea(teaType);
    };

    const calculateForRatio = (targetRatio) => {
        const newWeight = (waterVolume / targetRatio).toFixed(1);
        setTeaWeight(parseFloat(newWeight));
    };

    return (
        <div className="weight-calculator">
            <div className="calculator-inputs">
                <div className="input-group">
                    <label htmlFor="tea-weight">Tea Weight (grams)</label>
                    <input
                        id="tea-weight"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={teaWeight}
                        onChange={(e) => setTeaWeight(parseFloat(e.target.value) || 0)}
                    />
                </div>

                <div className="ratio-display">
                    <div className="ratio-value">1:{ratio}</div>
                    <div className="ratio-label">Tea to Water Ratio</div>
                </div>

                <div className="input-group">
                    <label htmlFor="water-volume">Water Volume (ml)</label>
                    <input
                        id="water-volume"
                        type="number"
                        min="1"
                        step="1"
                        value={waterVolume}
                        onChange={(e) => setWaterVolume(parseInt(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div className="tea-presets">
                <h3>Tea Type Presets</h3>
                <p className="presets-description">
                    Select a tea type to auto-calculate recommended weight for your water volume
                </p>
                <div className="preset-grid">
                    {Object.entries(TEA_TYPES).map(([tea, ratio]) => (
                        <button
                            key={tea}
                            className={`preset-card ${selectedTea === tea ? 'selected' : ''}`}
                            onClick={() => loadPreset(tea)}
                        >
                            <div className="preset-tea-name">{tea}</div>
                            <div className="preset-ratio">1:{ratio} ratio</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="quick-ratios">
                <h3>Quick Ratio Adjustments</h3>
                <div className="ratio-buttons">
                    {[15, 20, 25, 30].map((targetRatio) => (
                        <button
                            key={targetRatio}
                            className="btn btn-ghost ratio-btn"
                            onClick={() => calculateForRatio(targetRatio)}
                        >
                            1:{targetRatio}
                        </button>
                    ))}
                </div>
            </div>

            <div className="calculator-summary">
                <h3>Summary</h3>
                <div className="summary-grid">
                    <div className="summary-item">
                        <span className="summary-label">Tea</span>
                        <span className="summary-value">{teaWeight}g</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Water</span>
                        <span className="summary-value">{waterVolume}ml</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Ratio</span>
                        <span className="summary-value">1:{ratio}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeightCalculator;
