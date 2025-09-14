import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { analyticsAPI } from '../services/api';
import './ViewReportsPage.css';

function ViewReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState('tickets');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const reportTypes = [
    { value: 'tickets', label: 'Tickets Report', description: 'Download a CSV report of all tickets with details like status, priority, assigned technician, etc.' },
    { value: 'clients', label: 'Clients Report', description: 'Download a CSV report of all clients with contact information and status.' },
    { value: 'sites', label: 'Sites Report', description: 'Download a CSV report of all sites with location and status information.' }
  ];

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await analyticsAPI.exportCSV(selectedReportType);

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedReportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setError('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedReport = reportTypes.find(type => type.value === selectedReportType);

  return (
    <div className="view-reports-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Reports</h2>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="row">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header">
              <h5>Report Type</h5>
            </div>
            <div className="card-body">
              <Form.Group className="mb-3">
                <Form.Label>Select Report Type</Form.Label>
                <Form.Select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  disabled={isDownloading}
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="mt-3">
                <h6>{selectedReport?.label}</h6>
                <p className="text-muted small">{selectedReport?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-header">
              <h5>Generate Report</h5>
            </div>
            <div className="card-body d-flex flex-column">
              <div className="flex-grow-1">
                <p className="mb-4">
                  Generate and download a comprehensive {selectedReport?.label.toLowerCase()} in CSV format.
                  The report will include all relevant data for analysis and record-keeping.
                </p>

                <div className="mb-3">
                  <strong>Report Details:</strong>
                  <ul className="mt-2">
                    {selectedReportType === 'tickets' && (
                      <>
                        <li>Ticket ID, Title, and Description</li>
                        <li>Client Information</li>
                        <li>Priority and Status</li>
                        <li>Assigned Technician</li>
                        <li>Creation and Completion Dates</li>
                        <li>Time Spent</li>
                      </>
                    )}
                    {selectedReportType === 'clients' && (
                      <>
                        <li>Client ID and Name</li>
                        <li>Contact Information (Email, Phone)</li>
                        <li>Address</li>
                        <li>Status</li>
                        <li>Registration Date</li>
                      </>
                    )}
                    {selectedReportType === 'sites' && (
                      <>
                        <li>Site ID and Name</li>
                        <li>Location (Latitude, Longitude)</li>
                        <li>Site Type</li>
                        <li>Address</li>
                        <li>Status</li>
                        <li>Creation Date</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownloadCSV}
                  disabled={isDownloading}
                  className="w-100"
                >
                  {isDownloading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download me-2"></i>
                      Download {selectedReport?.label}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewReportsPage;
