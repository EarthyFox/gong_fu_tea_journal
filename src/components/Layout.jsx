import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">
                            <span className="logo-icon">🍵</span>
                            <span className="logo-text">Gong Fu Tea Journal</span>
                        </Link>

                        <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                            <Link
                                to="/"
                                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/tools"
                                className={`nav-link ${isActive('/tools') ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Tools
                            </Link>
                            {user && (
                                <Link
                                    to="/journal"
                                    className={`nav-link ${isActive('/journal') ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Journal
                                </Link>
                            )}

                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className={`nav-link btn btn-primary ${isActive('/signup') ? 'active' : ''}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <button
                                    className="nav-link btn-ghost"
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{ border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                                >
                                    Logout ({user.username})
                                </button>
                            )}
                        </nav>

                        <div className="mobile-actions">
                            {!user && !mobileMenuOpen && (
                                <Link to="/login" className="mobile-login-link">Login</Link>
                            )}
                            <button
                                className="mobile-menu-toggle"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="app-main">
                {children}
            </main>

            <footer className="app-footer">
                <div className="container">
                    <p>&copy; 2026 Gong Fu Tea Journal. Crafted with mindfulness.</p>
                </div>
            </footer>
        </div>
    );
}

export default Layout;
