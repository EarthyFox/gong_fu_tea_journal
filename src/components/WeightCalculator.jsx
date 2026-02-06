import { useState } from 'react';
import './WeightCalculator.css';

/* Additional styles in JS file for now if simple, or updated CSS file. 
   Actually, let's update WeightCalculator.css separately. */
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
    const [ratio, setRatio] = useState(20); // Default ratio 1:20
    const [isRatioLocked, setIsRatioLocked] = useState(true);
    const [selectedTea, setSelectedTea] = useState('');

    // Handle Tea Weight Change
    const handleTeaChange = (val) => {
        const weight = parseFloat(val) || 0;
        setTeaWeight(weight);
        if (isRatioLocked && weight > 0) {
            setWaterVolume(Math.round(weight * ratio));
        } else if (!isRatioLocked && waterVolume > 0 && weight > 0) {
            setRatio(parseFloat((waterVolume / weight).toFixed(1)));
        }
    };

    // Handle Water Volume Change
    const handleWaterChange = (val) => {
        const volume = parseFloat(val) || 0;
        setWaterVolume(volume);
        if (isRatioLocked && ratio > 0) {
            setTeaWeight(parseFloat((volume / ratio).toFixed(1)));
        } else if (!isRatioLocked && teaWeight > 0 && volume > 0) {
            setRatio(parseFloat((volume / teaWeight).toFixed(1)));
        }
    };

    // Handle Ratio Change
    const handleRatioChange = (val) => {
        const newRatio = parseFloat(val) || 0;
        setRatio(newRatio);
        if (isRatioLocked && waterVolume > 0) {
            setTeaWeight(parseFloat((waterVolume / newRatio).toFixed(1)));
        }
    };

    const loadPreset = (teaType) => {
        const recommendedRatio = TEA_TYPES[teaType];
        setRatio(recommendedRatio);
        setSelectedTea(teaType);
        // Assuming water is the constant (vessel size), update tea
        if (waterVolume > 0) {
            setTeaWeight(parseFloat((waterVolume / recommendedRatio).toFixed(1)));
        }
    };

    const toggleLock = () => {
        setIsRatioLocked(!isRatioLocked);
    };

    return (
        <div className="weight-calculator">
            <div className="calculator-inputs">
                <div className="input-group">
                    <label htmlFor="tea-weight">Tea (g)</label>
                    <input
                        id="tea-weight"
                        type="number"
                        min="0"
                        step="0.1"
                        value={teaWeight}
                        onChange={(e) => handleTeaChange(e.target.value)}
                    />
                </div>

                <div className={`ratio-display ${isRatioLocked ? 'locked' : 'unlocked'}`} onClick={toggleLock}>
                    <div className="ratio-icon">{isRatioLocked ? '🔒' : '🔓'}</div>
                    <div className="ratio-content-wrapper">
                        <div className="ratio-control">
                            <span className="ratio-prefix">1 :</span>
                            {isRatioLocked ? (
                                <input
                                    type="number"
                                    className="ratio-input"
                                    value={ratio}
                                    onChange={(e) => handleRatioChange(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span className="ratio-static-value">{ratio}</span>
                            )}
                        </div>
                    </div>
                    <div className="ratio-label">Ratio</div>
                </div>

                <div className="input-group">
                    <label htmlFor="water-volume">Water (ml)</label>
                    <input
                        id="water-volume"
                        type="number"
                        min="0"
                        step="1"
                        value={waterVolume}
                        onChange={(e) => handleWaterChange(e.target.value)}
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
                <h3>Quick Ratios</h3>
                <div className="ratio-buttons">
                    {[15, 20, 25, 30].map((targetRatio) => (
                        <button
                            key={targetRatio}
                            className={`btn btn-ghost ratio-btn ${ratio === targetRatio ? 'active' : ''}`}
                            onClick={() => handleRatioChange(targetRatio)}
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
