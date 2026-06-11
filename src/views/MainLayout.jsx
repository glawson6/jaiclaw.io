import { useEffect } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import jaiclawLogo from '../assets/images/jaiclaw-logo.png';
import ScrollToTop from '../components/ScrollToTop.jsx';
import { GITHUB_URL, TAPTECH_URL } from '../config/constants.js';

const defaultTitle = 'JaiClaw - The Java Framework for AI Assistants';

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    document.title = defaultTitle;
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path ||
           (path === '/' && location.pathname === '/home');
  };

  return (
    <div className="app-container">
      <ScrollToTop />

      <header className="app-header">
        <img
          src={jaiclawLogo}
          alt="JaiClaw Logo"
          className="logo"
        />
        <h1>JaiClaw</h1>
      </header>

      <nav className="app-nav">
        <NavLink to="/" className={isActiveRoute('/') ? 'active' : ''}>
          Home
        </NavLink>
        <NavLink to="/features" className={({ isActive }) => isActive ? 'active' : ''}>
          Features
        </NavLink>
        <NavLink to="/why" className={({ isActive }) => isActive ? 'active' : ''}>
          Why JaiClaw
        </NavLink>
        <NavLink to="/docs" className={({ isActive }) => isActive ? 'active' : ''}>
          Docs
        </NavLink>
        <NavLink to="/resources" className={({ isActive }) => isActive ? 'active' : ''}>
          Resources
        </NavLink>
        <NavLink to="/examples" className={({ isActive }) => isActive ? 'active' : ''}>
          Examples
        </NavLink>
        <NavLink to="/pricing" className={({ isActive }) => isActive ? 'active' : ''}>
          Pricing
        </NavLink>
        <NavLink to="/enterprise" className={({ isActive }) => isActive ? 'active' : ''}>
          Enterprise
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
          Contact
        </NavLink>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-github"></i> GitHub
        </a>
      </nav>

      <main className="app-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>
          &copy; {new Date().getFullYear()} JaiClaw. An open-source project by{' '}
          <a href={TAPTECH_URL} target="_blank" rel="noopener noreferrer">
            TapTech Holdings, Inc.
          </a>
        </p>
        <p>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <i className="bi bi-github"></i> GitHub
          </a>
          {' | '}
          <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer">
            Apache License 2.0
          </a>
        </p>
      </footer>
    </div>
  );
}
