import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { flavorDimensions } from '../config/flavorDimensions';
import './FlavorRadarChart.css';

function FlavorRadarChart({ flavorProfile, size = 'large' }) {
    // Transform flavor profile into recharts format
    const data = flavorDimensions.map((dim) => ({
        dimension: dim.label,
        value: flavorProfile?.[dim.key] || 0,
        fullMark: dim.max,
    }));

    const chartSize = size === 'large' ? 400 : 200;
    const fontSize = size === 'large' ? 14 : 10;

    return (
        <div className={`flavor-radar-chart ${size}`}>
            <ResponsiveContainer width="100%" height={chartSize}>
                <RadarChart data={data}>
                    <defs>
                        <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0.3} />
                        </linearGradient>
                    </defs>
                    <PolarGrid stroke="var(--glass-border)" />
                    <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fill: 'var(--color-text-secondary)', fontSize }}
                        stroke="var(--color-text-tertiary)"
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 5]}
                        tick={{ fill: 'var(--color-text-tertiary)', fontSize: fontSize - 2 }}
                        stroke="var(--color-text-tertiary)"
                    />
                    <Radar
                        name="Flavor Profile"
                        dataKey="value"
                        stroke="var(--color-primary)"
                        fill="url(#radarGradient)"
                        fillOpacity={0.6}
                        strokeWidth={2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default FlavorRadarChart;
