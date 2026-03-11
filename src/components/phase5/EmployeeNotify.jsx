import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import StatusBadge from '../common/StatusBadge';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import './Phase5.css';

const EmployeeNotify = () => {
  const { employees, hikeProposals, sendNotification, addNotification } = useApp();
  const [showTemplate, setShowTemplate] = useState(false);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const eligibleEmps = employees.filter(e => hikeProposals[e.id]?.eligible);
  const sentCount = eligibleEmps.filter(e => hikeProposals[e.id]?.notificationSent).length;
  const pendingCount = eligibleEmps.filter(e => !hikeProposals[e.id]?.notificationSent).length;

  const handleSendAll = () => {
    setSending(true);
    setTimeout(() => {
      eligibleEmps.forEach(e => sendNotification(e.id));
      setSending(false);
      addNotification('success', `Notifications sent to ${eligibleEmps.length} employees.`);
    }, 1000);
  };

  const getNotifStatus = (emp) => {
    const p = hikeProposals[emp.id];
    if (p?.notificationSent) return 'sent';
    return 'pending';
  };

  return (
    <div className="phase5-section">
      
      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Total Employees', value: eligibleEmps.length, color: 'primary' },
          { label: 'Sent', value: sentCount, color: 'success' },
          { label: 'Pending', value: pendingCount, color: 'warning' },
          { label: 'Acknowledged', value: Math.floor(sentCount * 0.7), color: 'teal' },
        ].map((s, i) => (
          <div key={i} className={`stat-card stat-card-${s.color}`}>
            <div className="stat-card-top">
              <div className="stat-card-info">
                <span className="stat-card-label">{s.label}</span>
                <span className="stat-card-value">{s.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card */}
      <Card
        title="Notification Actions"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowTemplate(true)}
            >
              Preview Template
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={handleSendAll}
              disabled={sending || pendingCount === 0}
            >
              {sending ? 'Sending...' : `Send to ${pendingCount} Employees`}
            </button>
          </div>
        }
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="phase5-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th className="text-right">Hike %</th>
                <th>Send Status</th>
                <th>Acknowledgement</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {eligibleEmps
                .slice((page - 1) * PER_PAGE, page * PER_PAGE)
                .map(emp => {
                  const proposal = hikeProposals[emp.id];
                  const sent = proposal?.notificationSent;

                  return (
                    <tr key={emp.id} className={sent ? 'row-success' : ''}>
                      <td>
                        <div className="emp-name-cell-p5">
                          <div className="emp-avatar-sm-p5">
                            {emp.name.charAt(0)}
                          </div>

                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {emp.name}
                            </div>
                            <div className="text-small text-muted">
                              {emp.empId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>{emp.dept}</td>

                      <td className="text-right">
                        <span
                          style={{
                            fontWeight: 700,
                            color: 'var(--phase3)'
                          }}
                        >
                          +{(proposal?.proposedHike || 0).toFixed(1)}%
                        </span>
                      </td>

                      <td>
                        <StatusBadge
                          status={sent ? 'sent' : 'pending'}
                          size="sm"
                        />
                      </td>

                      <td>
                        <StatusBadge
                          status={
                            sent
                              ? Math.random() > 0.4
                                ? 'acknowledged'
                                : 'sent'
                              : 'pending'
                          }
                          size="sm"
                        />
                      </td>

                      <td>
                        {!sent && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              sendNotification(emp.id);
                              addNotification(
                                'info',
                                `Notification sent to ${emp.name}.`
                              );
                            }}
                          >
                            Send
                          </button>
                        )}

                        {sent && (
                          <span className="text-success text-small">
                            Sent ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalItems={eligibleEmps.length}
          itemsPerPage={PER_PAGE}
          currentPage={page}
          onPageChange={setPage}
        />
      </Card>

      {/* Template Modal */}
      <Modal
        isOpen={showTemplate}
        onClose={() => setShowTemplate(false)}
        title="Notification Template Preview"
        size="md"
        footer={
          <button
            className="btn btn-secondary"
            onClick={() => setShowTemplate(false)}
          >
            Close
          </button>
        }
      >
        <div className="notif-template">

          <div className="notif-template-header">
            <strong>Subject:</strong> Your FY2025-26 Compensation Revision — Confidential
          </div>

          <div className="notif-template-body">
            <p>
              Dear <span className="template-var">[Employee Name]</span>,
            </p>

            <p>
              We are pleased to share that your compensation has been revised effective
              <span className="template-var"> May 1, 2025</span>, as part of our Annual Increment Cycle.
            </p>

            <div className="notif-comp-summary">
              <div className="notif-comp-row">
                <span>Previous CTC</span>
                <strong>
                  <span className="template-var">[Old CTC]</span>
                </strong>
              </div>

              <div className="notif-comp-row highlight">
                <span>Revised CTC</span>
                <strong>
                  <span className="template-var">[New CTC]</span>
                </strong>
              </div>

              <div className="notif-comp-row">
                <span>Increment</span>
                <strong>
                  <span className="template-var">[Hike %]</span>
                </strong>
              </div>
            </div>

            <p>
              Your increment letter is available in the
              <strong> Employee Self-Service Portal</strong>.
            </p>

            <p>
              Please log in at
              <a href="#"> portal.compbudget.com</a> to view and acknowledge receipt of your letter.
            </p>

            <p>
              Warm regards,
              <br />
              <strong>People & Culture Team</strong>
            </p>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default EmployeeNotify;