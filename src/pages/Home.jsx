import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home-page page">
            <div className="container">
                <section className="hero fade-in">
                    <h1 className="hero-title">
                        Welcome to Your
                        <br />
                        <span className="text-primary">Gong Fu Tea Journey</span>
                    </h1>
                    <p className="hero-subtitle">
                        Document, analyze, and refine your tea practice with precision and mindfulness
                    </p>
                    <div className="hero-actions">
                        <Link to="/journal/new" className="btn btn-primary">
                            New Tea Session
                        </Link>
                        <Link to="/tools" className="btn btn-secondary">
                            Explore Tools
                        </Link>
                    </div>
                </section>

                <section className="features">
                    <h2 className="section-title">Your Tea Companion</h2>
                    <div className="grid grid-3">
                        <FeatureCard
                            icon="📝"
                            title="Journal"
                            description="Document every tea session with detailed notes and flavor profiles"
                            link="/journal"
                        />
                        <FeatureCard
                            icon="⏱️"
                            title="Timer"
                            description="Perfect timing for multiple steeps with audio alerts"
                            link="/tools?tab=timer"
                        />
                        <FeatureCard
                            icon="⚖️"
                            title="Calculator"
                            description="Calculate perfect tea-to-water ratios for any brew"
                            link="/tools?tab=calculator"
                        />
                        <FeatureCard
                            icon="🌡️"
                            title="Temperature"
                            description="Convert and track optimal temperatures for each tea type"
                            link="/tools?tab=temperature"
                        />
                        <FeatureCard
                            icon="🧘"
                            title="Meditation"
                            description="Center yourself with guided breathing exercises"
                            link="/tools?tab=meditation"
                        />
                        <FeatureCard
                            icon="📊"
                            title="Flavor Analysis"
                            description="Visualize taste profiles with interactive radar charts"
                            link="/journal"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description, link }) {
    return (
        <Link to={link} className="feature-card card">
            <div className="feature-icon">{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </Link>
    );
}

export default Home;
