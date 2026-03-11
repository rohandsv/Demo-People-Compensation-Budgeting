import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS, ROLE_LABELS } from '../data/constants';
import './LoginPage.css';

const ROLE_ICONS = {
  cfo: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  hr_admin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  manager: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  approver: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  employee: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
};

const ROLE_COLORS = {
  cfo: '#1e3a8a',
  hr_admin: '#0e7490',
  manager: '#065f46',
  approver: '#92400e',
  employee: '#6b21a8',
};

const LoginPage = () => {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState('hr_admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const errs = {};
    if (!username.trim()) errs.username = 'Username is required';
    if (!password.trim()) errs.password = 'Password is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
    }, 800);
  };

  const handleQuickLogin = (role) => {
    const user = DEMO_USERS.find(u => u.role === role);
    setSelectedRole(role);
    setUsername(user.username);
    setPassword('demo123');
    setErrors({});
  };

  return (
    <div className="login-page">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h1 className="login-brand-name">CompBudget</h1>
          </div>

          <div className="login-hero">
            <h2 className="login-hero-title">
              Smarter Compensation.<br />Faster Decisions.
            </h2>
            <p className="login-hero-sub">
              Manage your annual compensation review cycle with intelligent budgeting, merit matrices, and multi-level approval workflows.
            </p>
          </div>

          <div className="login-features">
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  </svg>
                ),
                text: 'Real-time budget tracking across departments',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                  </svg>
                ),
                text: 'Merit matrix guided hike recommendations',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                ),
                text: 'Multi-level approval workflow',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                ),
                text: 'Automated increment letters & payroll sync',
              },
            ].map((f, i) => (
              <div key={i} className="login-feature-item">
                <div className="login-feature-icon">{f.icon}</div>
                <span className="login-feature-text">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="login-cycle-info">
            <div className="login-cycle-top">
              <div className="login-cycle-dot"></div>
              <div className="login-cycle-badge">Active Cycle</div>
            </div>
            <div className="login-cycle-name">FY2026 Annual Increment</div>
            <div className="login-cycle-deadline">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Submission deadline: April 15, 2026
            </div>
            <div className="login-cycle-progress">
              <div className="login-cycle-track">
                <div className="login-cycle-fill"></div>
              </div>
              <span className="login-cycle-pct">68% complete</span>
            </div>
          </div>
        </div>

        {/* Geometric shapes */}
        <div className="login-geo login-geo-1"></div>
        <div className="login-geo login-geo-2"></div>
        <div className="login-geo login-geo-3"></div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-form-brand">
            <div className="login-form-brand-icon">CB</div>
            <span className="login-form-brand-name">CompBudget</span>
          </div>

          <div className="login-form-header">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-sub">Sign in to your workspace</p>
          </div>

          <div className="login-quick-roles">
            <p className="login-quick-label">Quick Demo Login</p>
            <div className="login-role-pills">
              {DEMO_USERS.map(user => (
                <button
                  key={user.role}
                  className={`role-pill ${selectedRole === user.role ? 'active' : ''}`}
                  onClick={() => handleQuickLogin(user.role)}
                  type="button"
                  style={selectedRole === user.role ? { background: ROLE_COLORS[user.role], borderColor: ROLE_COLORS[user.role] } : {}}
                >
                  {ROLE_ICONS[user.role]}
                  <span>{ROLE_LABELS[user.role].split('/')[0].trim()}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="login-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Role</label>
              <select
                id="role"
                className="form-input"
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </span>
                <input
                  id="username"
                  className={`form-input login-input-field ${errors.username ? 'error' : ''}`}
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })); }}
                />
              </div>
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  className={`form-input login-input-field ${errors.password ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                />
                <button
                  type="button"
                  className="login-input-toggle"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label="Toggle password"
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className={`login-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner"></span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-demo-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Demo mode — any credentials work. Use quick login above.
          </div>

          <div className="login-security-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            256-bit encrypted · SOC 2 Type II
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
