import { useState, useEffect, useRef } from 'react';
import './Meditation.css';

const BREATHING_TECHNIQUES = {
    '4-7-8': {
        name: '4-7-8 Relaxation',
        description: 'Inhale 4s, Hold 7s, Exhale 8s - Great for relaxation',
        phases: [
            { name: 'Inhale', duration: 4 },
            { name: 'Hold', duration: 7 },
            { name: 'Exhale', duration: 8 },
        ],
    },
    'box': {
        name: 'Box Breathing',
        description: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s - Improves focus',
        phases: [
            { name: 'Inhale', duration: 4 },
            { name: 'Hold', duration: 4 },
            { name: 'Exhale', duration: 4 },
            { name: 'Hold', duration: 4 },
        ],
    },
    'equal': {
        name: 'Equal Breathing',
        description: 'Inhale 5s, Exhale 5s - Calms the mind',
        phases: [
            { name: 'Inhale', duration: 5 },
            { name: 'Exhale', duration: 5 },
        ],
    },
};

function Meditation() {
    const [selectedTechnique, setSelectedTechnique] = useState('4-7-8');
    const [isActive, setIsActive] = useState(false);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
    const [totalCycles, setTotalCycles] = useState(0);
    const intervalRef = useRef(null);

    const technique = BREATHING_TECHNIQUES[selectedTechnique];
    const currentPhase = technique.phases[currentPhaseIndex];

    useEffect(() => {
        if (isActive && phaseTimeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setPhaseTimeLeft((prev) => {
                    if (prev <= 1) {
                        nextPhase();
                        return technique.phases[(currentPhaseIndex + 1) % technique.phases.length].duration;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, phaseTimeLeft, currentPhaseIndex]);

    const nextPhase = () => {
        if (currentPhaseIndex === technique.phases.length - 1) {
            setTotalCycles((prev) => prev + 1);
        }
        setCurrentPhaseIndex((prev) => (prev + 1) % technique.phases.length);
    };

    const startBreathing = () => {
        setIsActive(true);
        setPhaseTimeLeft(technique.phases[0].duration);
        setCurrentPhaseIndex(0);
    };

    const stopBreathing = () => {
        setIsActive(false);
        setPhaseTimeLeft(0);
        setCurrentPhaseIndex(0);
    };

    const resetStats = () => {
        setTotalCycles(0);
        stopBreathing();
    };

    const getPhaseColor = (phaseName) => {
        if (phaseName.toLowerCase().includes('inhale')) return 'var(--color-primary)';
        if (phaseName.toLowerCase().includes('exhale')) return 'var(--color-secondary)';
        return 'var(--color-accent)';
    };

    const circleScale = isActive
        ? currentPhase.name.toLowerCase().includes('inhale')
            ? 1.3
            : 0.8
        : 1;

    return (
        <div className="meditation-tool">
            <div className="meditation-header">
                <h2>Mindful Breathing</h2>
                <p>Center yourself before or during your tea practice</p>
            </div>

            <div className="technique-selector">
                {Object.entries(BREATHING_TECHNIQUES).map(([key, tech]) => (
                    <button
                        key={key}
                        className={`technique-card ${selectedTechnique === key ? 'selected' : ''}`}
                        onClick={() => {
                            setSelectedTechnique(key);
                            stopBreathing();
                        }}
                        disabled={isActive}
                    >
                        <div className="technique-name">{tech.name}</div>
                        <div className="technique-description">{tech.description}</div>
                    </button>
                ))}
            </div>

            <div className="breathing-visualizer">
                <div className="breathing-circle-container">
                    <svg className="breathing-circle" viewBox="0 0 300 300">
                        <defs>
                            <radialGradient id="breathGradient">
                                <stop offset="0%" stopColor={getPhaseColor(currentPhase.name)} stopOpacity="0.3" />
                                <stop offset="80%" stopColor={getPhaseColor(currentPhase.name)} stopOpacity="0.1" />
                                <stop offset="100%" stopColor={getPhaseColor(currentPhase.name)} stopOpacity="0" />
                            </radialGradient>
                        </defs>

                        <circle
                            cx="150"
                            cy="150"
                            r="80"
                            fill="url(#breathGradient)"
                            style={{
                                transform: `scale(${circleScale})`,
                                transformOrigin: 'center',
                                transition: `transform ${currentPhase.duration}s ease-in-out`,
                            }}
                        />

                        <circle
                            cx="150"
                            cy="150"
                            r="60"
                            fill="none"
                            stroke={getPhaseColor(currentPhase.name)}
                            strokeWidth="2"
                            opacity="0.5"
                            style={{
                                transform: `scale(${circleScale})`,
                                transformOrigin: 'center',
                                transition: `transform ${currentPhase.duration}s ease-in-out`,
                            }}
                        />
                    </svg>

                    <div className="breathing-text">
                        <div className="phase-name" style={{ color: getPhaseColor(currentPhase.name) }}>
                            {currentPhase.name}
                        </div>
                        {isActive && (
                            <div className="phase-timer">{phaseTimeLeft}s</div>
                        )}
                    </div>
                </div>

                <div className="breathing-controls">
                    {!isActive ? (
                        <button className="btn btn-primary btn-large" onClick={startBreathing}>
                            Begin
                        </button>
                    ) : (
                        <button className="btn btn-secondary btn-large" onClick={stopBreathing}>
                            Stop
                        </button>
                    )}
                    {totalCycles > 0 && (
                        <button className="btn btn-ghost" onClick={resetStats}>
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {totalCycles > 0 && (
                <div className="meditation-stats">
                    <div className="stat-item">
                        <span className="stat-value">{totalCycles}</span>
                        <span className="stat-label">Cycles Completed</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">
                            {Math.floor((totalCycles * technique.phases.reduce((sum, p) => sum + p.duration, 0)) / 60)}
                        </span>
                        <span className="stat-label">Minutes Practiced</span>
                    </div>
                </div>
            )}

            <div className="meditation-tips">
                <h3>💡 Tips for Mindful Breathing</h3>
                <ul>
                    <li>Find a comfortable seated position</li>
                    <li>Close your eyes or soften your gaze</li>
                    <li>Focus on the sensation of breath</li>
                    <li>Let thoughts pass like clouds</li>
                    <li>Return gently to the breath when distracted</li>
                </ul>
            </div>
        </div>
    );
}

export default Meditation;
