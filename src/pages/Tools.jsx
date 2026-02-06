import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Timer from '../components/Timer';
import WeightCalculator from '../components/WeightCalculator';
import TemperatureTool from '../components/TemperatureTool';
import Meditation from '../components/Meditation';
import TeaTimeAdjuster from '../components/TeaTimeAdjuster';
import './Tools.css';

function Tools() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('timer');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['timer', 'calculator', 'temperature', 'meditation'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    return (
        <div className="tools-page page">
            <div className="container">
                <h1 className="page-title">Tea Tools</h1>
                <p className="page-subtitle">Everything you need for the perfect tea session</p>

                <div className="tools-container glass-container">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'timer' ? 'active' : ''}`}
                            onClick={() => handleTabChange('timer')}
                        >
                            <span className="tab-icon">⏱️</span>
                            <span>Timer</span>
                        </button>
                        <button
                            className={`tab ${activeTab === 'calculator' ? 'active' : ''}`}
                            onClick={() => handleTabChange('calculator')}
                        >
                            <span className="tab-icon">⚖️</span>
                            <span>Calculator</span>
                        </button>
                        <button
                            className={`tab ${activeTab === 'adjuster' ? 'active' : ''}`}
                            onClick={() => handleTabChange('adjuster')}
                        >
                            <span className="tab-icon">🌡️⏱️</span>
                            <span>Time Adjuster</span>
                        </button>
                        <button
                            className={`tab ${activeTab === 'temperature' ? 'active' : ''}`}
                            onClick={() => handleTabChange('temperature')}
                        >
                            <span className="tab-icon">🌡️</span>
                            <span>Temperature</span>
                        </button>
                        <button
                            className={`tab ${activeTab === 'meditation' ? 'active' : ''}`}
                            onClick={() => handleTabChange('meditation')}
                        >
                            <span className="tab-icon">🧘</span>
                            <span>Meditation</span>
                        </button>
                    </div>

                    <div className="tool-content">
                        {activeTab === 'timer' && <Timer />}
                        {activeTab === 'calculator' && <WeightCalculator />}
                        {activeTab === 'adjuster' && <TeaTimeAdjuster />}
                        {activeTab === 'temperature' && <TemperatureTool />}
                        {activeTab === 'meditation' && <Meditation />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tools;
