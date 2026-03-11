import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../data/constants';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import Card from '../common/Card';
import Pagination from '../common/Pagination';
import './Phase5.css';

const IncrementLetters = () => {
const { employees, hikeProposals, generateLetter, addNotification, cycle } = useApp();
const [previewEmp, setPreviewEmp] = useState(null);
const [generating, setGenerating] = useState(false);
const [page, setPage] = useState(1);
const PER_PAGE = 10;

const eligibleEmps = employees.filter(e => hikeProposals[e.id]?.eligible);
const generatedCount = eligibleEmps.filter(e => hikeProposals[e.id]?.letterGenerated).length;

const handleGenerateAll = () => {
setGenerating(true);
setTimeout(() => {
eligibleEmps.forEach(e => generateLetter(e.id));
setGenerating(false);
addNotification('success', `${eligibleEmps.length} increment letters generated.`);
}, 1200);
};

const handlePreview = (emp) => {
setPreviewEmp(emp);
};

const formatDate = (date) => {
return new Date(date || '2025-05-01').toLocaleDateString('en-IN', {
day: 'numeric',
month: 'long',
year: 'numeric'
});
};

return ( <div className="phase5-section">

```
  <Card
    title="Increment Letters"
    subtitle="Generate and distribute increment letters to employees"
    actions={
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondary btn-sm" disabled={generatedCount === 0}>
          Download All
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleGenerateAll}
          disabled={generating}
        >
          {generating ? 'Generating...' : `Generate All (${eligibleEmps.length})`}
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
            <th className="text-right">Current CTC</th>
            <th className="text-right">New CTC</th>
            <th className="text-right">Hike %</th>
            <th>Effective Date</th>
            <th>Letter Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {eligibleEmps
            .slice((page - 1) * PER_PAGE, page * PER_PAGE)
            .map(emp => {

              const proposal = hikeProposals[emp.id];
              const newCTC = emp.currentCTC * (1 + (proposal?.proposedHike || 0) / 100);
              const generated = proposal?.letterGenerated;

              return (
                <tr key={emp.id} className={generated ? 'row-success' : ''}>
                  <td>
                    <div className="emp-name-cell-p5">
                      <div className="emp-avatar-sm-p5">{emp.name.charAt(0)}</div>

                      <div>
                        <div style={{ fontWeight: 600 }}>{emp.name}</div>
                        <div className="text-small text-muted">
                          {emp.empId} · {emp.title}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>{emp.dept}</td>

                  <td className="text-right">
                    {formatINR(emp.currentCTC)}
                  </td>

                  <td
                    className="text-right font-bold"
                    style={{ color: 'var(--success)' }}
                  >
                    {formatINR(newCTC)}
                  </td>

                  <td className="text-right">
                    <span style={{ fontWeight: 700, color: 'var(--phase3)' }}>
                      +{(proposal?.proposedHike || 0).toFixed(1)}%
                    </span>
                  </td>

                  <td>May 1, 2026</td>

                  <td>
                    <StatusBadge
                      status={generated ? 'generated' : 'pending'}
                      size="sm"
                    />
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handlePreview(emp)}
                      >
                        Preview
                      </button>

                      {!generated && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            generateLetter(emp.id);
                            addNotification(
                              'success',
                              `Letter generated for ${emp.name}.`
                            );
                          }}
                        >
                          Generate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>

    <Pagination
      totalItems={eligibleEmps.length}
      itemsPerPage={PER_PAGE}
      currentPage={page}
      onPageChange={setPage}
    />

  </Card>


  <Modal
    isOpen={!!previewEmp}
    onClose={() => setPreviewEmp(null)}
    title="Increment Letter Preview"
    size="lg"
    footer={
      <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={() => setPreviewEmp(null)}>
          Close
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              generateLetter(previewEmp?.id);
              addNotification('success', 'Letter downloaded.');
              setPreviewEmp(null);
            }}
          >
            Download PDF
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              generateLetter(previewEmp?.id);
              addNotification('success', 'Letter sent to employee portal.');
              setPreviewEmp(null);
            }}
          >
            Send to Portal
          </button>
        </div>
      </div>
    }
  >
    {previewEmp && (() => {

      const proposal = hikeProposals[previewEmp.id];
      const newCTC =
        previewEmp.currentCTC * (1 + (proposal?.proposedHike || 0) / 100);

      return (
        <div className="letter-preview">

          <div className="letter-header">
            <div className="letter-logo">CompBudget Corp</div>
            <div className="letter-date">
              {formatDate('2025-04-30')}
            </div>
          </div>

          <div className="letter-body">

            <p><strong>Confidential</strong></p>

            <p style={{ marginTop: 12 }}>
              Dear <strong>{previewEmp.name}</strong>,
            </p>

            <p style={{ marginTop: 12 }}>
              We are pleased to inform you that as part of our Annual
              Compensation Review for {cycle?.name || 'FY2025'},
              your compensation has been revised with effect from
              <strong> May 1, 2026</strong>.
            </p>

            <div className="letter-comp-table">
              <table>
                <tbody>

                  <tr>
                    <td>Employee ID</td>
                    <td><strong>{previewEmp.empId}</strong></td>
                  </tr>

                  <tr>
                    <td>Designation</td>
                    <td><strong>{previewEmp.title}</strong></td>
                  </tr>

                  <tr>
                    <td>Department</td>
                    <td><strong>{previewEmp.dept}</strong></td>
                  </tr>

                  <tr className="comp-row">
                    <td>Previous CTC</td>
                    <td>
                      <strong>{formatINR(previewEmp.currentCTC)}</strong>
                    </td>
                  </tr>

                  <tr className="comp-row highlight">
                    <td>Revised CTC</td>
                    <td>
                      <strong style={{ color: 'var(--success)', fontSize: 16 }}>
                        {formatINR(newCTC)}
                      </strong>
                    </td>
                  </tr>

                  <tr className="comp-row">
                    <td>Increment %</td>
                    <td>
                      <strong style={{ color: 'var(--phase3)' }}>
                        {(proposal?.proposedHike || 0).toFixed(1)}%
                      </strong>
                    </td>
                  </tr>

                  <tr>
                    <td>Effective Date</td>
                    <td><strong>May 1, 2026</strong></td>
                  </tr>

                </tbody>
              </table>
            </div>

            <p style={{ marginTop: 16 }}>
              This revision reflects our recognition of your valuable
              contribution and performance during FY2025-26.
              We look forward to your continued growth and success.
            </p>

            <p style={{ marginTop: 12 }}>Warm regards,</p>

            <p style={{ marginTop: 8 }}>
              <strong>Chief Human Resources Officer</strong>
            </p>

            <p className="text-muted text-small">
              CompBudget Corporation · Human Resources Division
            </p>

          </div>
        </div>
      );
    })()}
  </Modal>

</div>

);
};

export default IncrementLetters;
