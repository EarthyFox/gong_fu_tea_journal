import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Timer.css';

const TEA_PRESETS = [
    { name: 'Green Tea', times: [30, 20, 30, 40] },
    { name: 'Oolong', times: [45, 30, 45, 60, 90] },
    { name: 'Black Tea', times: [30, 25, 35, 45] },
    { name: 'Pu-erh', times: [20, 15, 20, 30, 45, 60] },
    { name: 'White Tea', times: [60, 45, 60, 90] },
];

function Timer() {
    const navigate = useNavigate();
    const [currentSteep, setCurrentSteep] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [customTime, setCustomTime] = useState(30);
    const [steepHistory, setSteepHistory] = useState([]);
    const audioRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        playAlert();
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft]);

    const playAlert = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(err => console.log('Audio play failed:', err));
        }
    };

    const startTimer = (seconds) => {
        setTimeLeft(seconds);
        setIsRunning(true);
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(0);
    };

    const loadPreset = (preset, steepIndex) => {
        const seconds = preset.times[steepIndex];
        setCurrentSteep(steepIndex);
        startTimer(seconds);
        setSteepHistory([...steepHistory, { tea: preset.name, steep: steepIndex + 1, time: seconds }]);
    };

    const startCustomTimer = () => {
        if (customTime > 0) {
            startTimer(customTime);
            setSteepHistory([...steepHistory, { tea: 'Custom', steep: '-', time: customTime }]);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = timeLeft > 0 ? ((timeLeft / customTime) * 100) : 0;

    return (
        <div className="timer-tool">
            <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuByvLaizsIHGS57OihUBELTKXh8LJnHgU7k9fyz3osBSh+yPDajkELF2G16OyrWBUIR6Hf8sFuIwUsgs7y2Ik3CBtnuezvpVIRC0+o4/C4aCAFOpPY8tJ9LwYpfsrw3I9CC" preload="auto" />

            <div className="timer-display-section">
                <div className="timer-display">
                    <svg className="timer-circle" viewBox="0 0 200 200">
                        <circle
                            className="timer-circle-bg"
                            cx="100"
                            cy="100"
                            r="90"
                        />
                        <circle
                            className="timer-circle-progress"
                            cx="100"
                            cy="100"
                            r="90"
                            style={{
                                strokeDasharray: `${2 * Math.PI * 90}`,
                                strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`,
                            }}
                        />
                    </svg>
                    <div className="timer-time">{formatTime(timeLeft)}</div>
                </div>

                <div className="timer-controls">
                    <button
                        className="btn btn-primary"
                        onClick={toggleTimer}
                        disabled={timeLeft === 0}
                    >
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button className="btn btn-secondary" onClick={resetTimer}>
                        Reset
                    </button>
                </div>
            </div>

            <div className="timer-presets">
                <h3>Tea Presets</h3>
                {TEA_PRESETS.map((preset) => (
                    <div key={preset.name} className="preset-group">
                        <h4>{preset.name}</h4>
                        <div className="preset-buttons">
                            {preset.times.map((time, index) => (
                                <button
                                    key={index}
                                    className="btn btn-ghost preset-btn"
                                    onClick={() => loadPreset(preset, index)}
                                >
                                    Steep {index + 1}: {time}s
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="custom-timer">
                <h3>Custom Timer</h3>
                <div className="custom-timer-controls">
                    <input
                        type="number"
                        min="1"
                        max="600"
                        value={customTime}
                        onChange={(e) => setCustomTime(parseInt(e.target.value) || 0)}
                        className="custom-time-input"
                    />
                    <span>seconds</span>
                    <button className="btn btn-primary" onClick={startCustomTimer}>
                        Start Custom
                    </button>
                </div>
            </div>

            {steepHistory.length > 0 && (
                <div className="steep-history">
                    <h3>Session History</h3>
                    <div className="history-list">
                        {steepHistory.map((item, index) => (
                            <div key={index} className="history-item">
                                <span>{item.tea}</span>
                                <span>Steep #{item.steep}</span>
                                <span>{item.time}s</span>
                            </div>
                        ))}
                    </div>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setSteepHistory([])}
                    >
                        Clear History
                    </button>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', width: '100%' }}
                        onClick={() => {
                            // Extract just the times
                            const times = steepHistory.map(h => h.time.toString());
                            navigate('/journal/new', { state: { steepTimes: times } });
                        }}
                    >
                        📝 Save Session to Journal
                    </button>
                </div>
            )}
        </div>
    );
}

export default Timer;
