import { useState } from 'react';
import './TemperatureTool.css';

const TEA_TEMPS = {
    'Green Tea': { c: 75, f: 167 },
    'White Tea': { c: 75, f: 167 },
    'Oolong': { c: 90, f: 194 },
    'Black Tea': { c: 95, f: 203 },
    'Pu-erh': { c: 100, f: 212 },
    'Herbal': { c: 100, f: 212 },
};

function TemperatureTool() {
    const [celsius, setCelsius] = useState(80);
    const [unit, setUnit] = useState('C');

    const fahrenheit = (celsius * 9 / 5) + 32;

    const handleCelsiusChange = (value) => {
        setCelsius(parseFloat(value) || 0);
    };

    const handleFahrenheitChange = (value) => {
        const c = ((parseFloat(value) || 0) - 32) * 5 / 9;
        setCelsius(c);
    };

    const loadPreset = (teaType) => {
        setCelsius(TEA_TEMPS[teaType].c);
    };

    const getTemperatureColor = (temp) => {
        if (temp < 50) return '#6eb4db';
        if (temp < 70) return '#7fb069';
        if (temp < 85) return '#e6b87d';
        if (temp < 95) return '#d4a373';
        return '#e56b6f';
    };

    const gaugeRotation = ((celsius / 100) * 180) - 90;

    return (
        <div className="temperature-tool">
            <div className="temp-display-section">
                <div className="temp-gauge-container">
                    <svg className="temp-gauge" viewBox="0 0 200 120">
                        <defs>
                            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6eb4db" />
                                <stop offset="25%" stopColor="#7fb069" />
                                <stop offset="50%" stopColor="#e6b87d" />
                                <stop offset="75%" stopColor="#d4a373" />
                                <stop offset="100%" stopColor="#e56b6f" />
                            </linearGradient>
                        </defs>

                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke="var(--color-surface)"
                            strokeWidth="12"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke="url(#tempGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${Math.PI * 80} ${Math.PI * 80}`}
                            strokeDashoffset={Math.PI * 80 * (1 - celsius / 100)}
                        />

                        <line
                            x1="100"
                            y1="100"
                            x2="100"
                            y2="30"
                            stroke={getTemperatureColor(celsius)}
                            strokeWidth="3"
                            strokeLinecap="round"
                            transform={`rotate(${gaugeRotation} 100 100)`}
                            style={{ transition: 'transform 0.3s ease' }}
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="8"
                            fill={getTemperatureColor(celsius)}
                        />
                    </svg>

                    <div className="temp-readings">
                        <div className="temp-reading">
                            <span className="temp-value" style={{ color: getTemperatureColor(celsius) }}>
                                {celsius.toFixed(1)}°C
                            </span>
                        </div>
                        <div className="temp-reading">
                            <span className="temp-value-small">
                                {fahrenheit.toFixed(1)}°F
                            </span>
                        </div>
                    </div>
                </div>

                <div className="temp-inputs">
                    <div className="temp-input-group">
                        <label htmlFor="celsius-input">Celsius</label>
                        <input
                            id="celsius-input"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={celsius}
                            onChange={(e) => handleCelsiusChange(e.target.value)}
                        />
                    </div>

                    <div className="temp-divider">⇄</div>

                    <div className="temp-input-group">
                        <label htmlFor="fahrenheit-input">Fahrenheit</label>
                        <input
                            id="fahrenheit-input"
                            type="number"
                            min="32"
                            max="212"
                            step="0.1"
                            value={fahrenheit.toFixed(1)}
                            onChange={(e) => handleFahrenheitChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="tea-temp-presets">
                <h3>Recommended Temperatures by Tea Type</h3>
                <div className="temp-preset-grid">
                    {Object.entries(TEA_TEMPS).map(([tea, temps]) => (
                        <button
                            key={tea}
                            className="temp-preset-card"
                            onClick={() => loadPreset(tea)}
                        >
                            <div className="temp-preset-name">{tea}</div>
                            <div className="temp-preset-values">
                                <span>{temps.c}°C</span>
                                <span className="temp-separator">/</span>
                                <span>{temps.f}°F</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="temp-guide">
                <h3>Temperature Guide</h3>
                <div className="guide-items">
                    <div className="guide-item">
                        <span className="guide-color" style={{ background: '#6eb4db' }}></span>
                        <span>0-50°C: Cool - Perfect for cold brew</span>
                    </div>
                    <div className="guide-item">
                        <span className="guide-color" style={{ background: '#7fb069' }}></span>
                        <span>50-70°C: Warm - Delicate green and white teas</span>
                    </div>
                    <div className="guide-item">
                        <span className="guide-color" style={{ background: '#e6b87d' }}></span>
                        <span>70-85°C: Hot - Most green teas, some oolongs</span>
                    </div>
                    <div className="guide-item">
                        <span className="guide-color" style={{ background: '#d4a373' }}></span>
                        <span>85-95°C: Very Hot - Oolongs, black teas</span>
                    </div>
                    <div className="guide-item">
                        <span className="guide-color" style={{ background: '#e56b6f' }}></span>
                        <span>95-100°C: Boiling - Pu-erh, black, herbal</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemperatureTool;
