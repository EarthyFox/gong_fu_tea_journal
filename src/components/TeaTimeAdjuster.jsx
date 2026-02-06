import { useState, useEffect, useRef } from 'react';
import './TeaTimeAdjuster.css';

function TeaTimeAdjuster() {
    const [initialTemp, setInitialTemp] = useState('');
    const [currentTemp, setCurrentTemp] = useState('');
    const [initialTime, setInitialTime] = useState('');
    const [result, setResult] = useState(null);
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        let interval;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        audioRef.current?.play().catch(e => console.error(e));
                        setTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const calculateTime = () => {
        const i_temp = parseFloat(initialTemp);
        const c_temp = parseFloat(currentTemp);
        const i_time = parseFloat(initialTime);

        if (isNaN(i_temp) || isNaN(c_temp) || isNaN(i_time) || i_time === 0) {
            return;
        }

        let sep_temp = Math.abs(c_temp - i_temp);
        let time_inc = i_temp / i_time;
        let n_time;

        if (i_temp < c_temp) {
            n_time = i_time - ((sep_temp / time_inc + i_time) / 2);
        } else {
            n_time = (sep_temp / time_inc + i_time) * 2;
        }

        const calculatedTime = parseFloat(n_time.toFixed(2));
        setResult({
            sep_temp: sep_temp.toFixed(2),
            time_inc: time_inc.toFixed(4),
            n_time: calculatedTime
        });

        // Reset timer when new calculation happens
        setTimerActive(false);
        setTimeLeft(Math.ceil(calculatedTime));
    };

    const toggleTimer = () => {
        if (!timerActive && timeLeft === 0) {
            // Reset if starting from 0 (though ideally it matches result)
            setTimeLeft(Math.ceil(result.n_time));
        }
        setTimerActive(!timerActive);
    };

    const resetTimer = () => {
        setTimerActive(false);
        setTimeLeft(Math.ceil(result.n_time));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="tea-time-adjuster fade-in">
            <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuByvLaizsIHGS57OihUBELTKXh8LJnHgU7k9fyz3osBSh+yPDajkELF2G16OyrWBUIR6Hf8sFuIwUsgs7y2Ik3CBtnuezvpVIRC0+o4/C4aCAFOpPY8tJ9LwYpfsrw3I9CC" preload="auto" />

            <div className="adjuster-inputs">
                <div className="adjuster-intro">
                    <p>Adjust your brew time when water cools down.</p>
                </div>

                <div className="adjuster-inputs">
                    <div className="adjuster-input-group">
                        <label><span className="icon">🎯</span> Target Temp</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                value={initialTemp}
                                onChange={(e) => setInitialTemp(e.target.value)}
                                placeholder="200"
                            />
                            <span className="input-unit">°F</span>
                        </div>
                    </div>

                    <div className="adjuster-input-group">
                        <label><span className="icon">🌡️</span> Current Temp</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                value={currentTemp}
                                onChange={(e) => setCurrentTemp(e.target.value)}
                                placeholder="180"
                            />
                            <span className="input-unit">°F</span>
                        </div>
                    </div>

                    <div className="adjuster-input-group">
                        <label><span className="icon">⏱️</span> Standard Time</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                value={initialTime}
                                onChange={(e) => setInitialTime(e.target.value)}
                                placeholder="30"
                            />
                            <span className="input-unit">s</span>
                        </div>
                    </div>
                </div>

                <div className="adjuster-actions">
                    <button className="btn btn-primary calculate-btn" onClick={calculateTime}>
                        CALCULATE ADJUSTMENT
                    </button>
                </div>

                {result && (
                    <div className="adjuster-results">
                        <div className={`result-card primary ${timerActive ? 'active-timer' : ''}`}>
                            <h4>{timerActive ? 'Brewing...' : 'New Brewing Time'}</h4>
                            <div className="result-value-large">
                                {timerActive || timeLeft !== Math.ceil(result.n_time)
                                    ? formatTime(timeLeft)
                                    : <span>{result.n_time}<span className="result-unit">s</span></span>
                                }
                            </div>

                            <div className="timer-actions">
                                <button
                                    className={`btn ${timerActive ? 'btn-ghost' : 'btn-secondary'}`}
                                    onClick={toggleTimer}
                                    style={{ marginTop: '1rem', minWidth: '120px' }}
                                >
                                    {timerActive ? 'PAUSE' : timeLeft === 0 ? 'FINISHED' : 'START TIMER'}
                                </button>
                                {(timerActive || timeLeft !== Math.ceil(result.n_time)) && (
                                    <button
                                        className="btn btn-ghost"
                                        onClick={resetTimer}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        RESET
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="secondary-stats">
                            <div className="result-card secondary">
                                <h4>Temp Difference</h4>
                                <div className="result-value-medium">{result.sep_temp}°F</div>
                            </div>
                            <div className="result-card secondary">
                                <h4>Time Increment</h4>
                                <div className="result-value-medium">{result.time_inc}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeaTimeAdjuster;
