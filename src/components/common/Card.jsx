import React from 'react';
import './Card.css';

const Card = ({ title, subtitle, children, actions, className = '', accent, noPadding = false }) => {
  return (
    <div className={`card ${accent ? `card-accent-${accent}` : ''} ${className}`}>
      {(title || actions) && (
        <div className="card-header">
          <div className="card-header-text">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'card-body'}>
        {children}
      </div>
    </div>
  );
};

export const StatCard = ({ label, value, subValue, icon, color = 'primary', trend }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-top">
        <div className="stat-card-info">
          <span className="stat-card-label">{label}</span>
          <span className="stat-card-value">{value}</span>
          {subValue && <span className="stat-card-sub">{subValue}</span>}
        </div>
        {icon && (
          <div className={`stat-card-icon stat-icon-${color}`}>
            {icon}
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className={`stat-card-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {trend >= 0
              ? <polyline points="18 15 12 9 6 15"/>
              : <polyline points="6 9 12 15 18 9"/>
            }
          </svg>
          {Math.abs(trend).toFixed(1)}% from last cycle
        </div>
      )}
    </div>
  );
};

export default Card;
