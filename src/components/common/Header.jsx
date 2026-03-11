import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PHASES, ROLE_LABELS } from '../../data/constants';
import './Header.css';

const Header = ({ sidebarCollapsed }) => {
  const { currentUser, currentPage, currentPhase, notifications, markNotificationsRead, logout } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getBreadcrumb = () => {
    if (currentPage === 'dashboard') return 'Dashboard';
    const phaseNum = parseInt(currentPage.replace('phase', ''));
    if (phaseNum >= 1 && phaseNum <= 5) {
      const phase = PHASES[phaseNum - 1];
      return `Phase ${phaseNum}: ${phase.name}`;
    }
    return 'Dashboard';
  };

  const handleNotifClick = () => {
    setShowNotifs(!showNotifs);
    setShowUserMenu(false);
    if (!showNotifs) markNotificationsRead();
  };

  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifs(false);
  };

  return (
    <header className={`app-header${sidebarCollapsed ? ' app-header-collapsed' : ''}`}>
      <div className="header-left">
        <div className="header-logo">
          {/* <span className="header-logo-icon">CB</span> */}
          {/* <span className="header-logo-text">CompBudget</span> */}
        </div>
        <div className="header-breadcrumb">
          <span className="breadcrumb-home">Home</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{getBreadcrumb()}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-notif-wrap">
          <button
            className={`header-notif-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
            onClick={handleNotifClick}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span className="notif-title">Notifications</span>
                <span className="notif-count">{notifications.length}</span>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications</div>
                ) : notifications.slice(0, 8).map(n => (
                  <div key={n.id} className={`notif-item notif-${n.type} ${!n.read ? 'unread' : ''}`}>
                    <div className={`notif-dot notif-dot-${n.type}`}></div>
                    <div className="notif-body">
                      <p className="notif-msg">{n.message}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="header-user-wrap">
          <button className="header-user-btn" onClick={handleUserClick}>
            <div className="user-avatar">{currentUser.avatar}</div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">{ROLE_LABELS[currentUser.role]}</span>
            </div>
            <svg className="user-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar lg">{currentUser.avatar}</div>
                <div>
                  <div className="user-dropdown-name">{currentUser.name}</div>
                  <div className="user-dropdown-role">{ROLE_LABELS[currentUser.role]}</div>
                </div>
              </div>
              <div className="user-dropdown-menu">
                <button className="user-dropdown-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  My Profile
                </button>
                <button className="user-dropdown-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                  Settings
                </button>
                <div className="dropdown-divider"></div>
                <button className="user-dropdown-item danger" onClick={logout}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(showNotifs || showUserMenu) && (
        <div className="header-overlay" onClick={() => { setShowNotifs(false); setShowUserMenu(false); }} />
      )}
    </header>
  );
};

export default Header;
