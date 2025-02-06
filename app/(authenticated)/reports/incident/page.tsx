"use client";

import React, { useState } from "react";

export default function IncidentReportForm() {
  const placeholderText = `
  On October 10, 2024, at approximately 3:45 PM, a significant incident occurred at our production facility in Building 3. An unexpected malfunction in one of the primary cooling systems led to a rapid temperature increase in the assembly area. The automated safety protocols were immediately triggered, and all personnel were evacuated without incident. Although no injuries were reported, production was halted for nearly 2 hours, causing substantial downtime. Preliminary investigations suggest that a faulty sensor may have caused the system to overheat. A comprehensive review of the cooling system and an update to the maintenance procedures are recommended to prevent similar incidents in the future.
  `;
  const [incidentDetails, setIncidentDetails] = useState(
    placeholderText.trim(),
  );
  const [report, setReport] = useState<{
    reportTitle: string;
    incidentSummary: string;
    causeAnalysis: string;
    recommendedActions: string;
    incidentTimestamp: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidentDetails }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error generating report.");
      }
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-10">
      <h1 className="text-2xl mb-10">Automated Incident Reporting</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={incidentDetails}
          onChange={(e) => setIncidentDetails(e.target.value)}
          placeholder="Enter incident details (e.g., what happened, where, when, and any additional context)..."
          rows={6}
          style={{ width: "100%" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating Report..." : "Generate Report"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {report && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <h2>{report.reportTitle}</h2>
          <p>
            <strong>Incident Summary:</strong> {report.incidentSummary}
          </p>
          <p>
            <strong>Cause Analysis:</strong> {report.causeAnalysis}
          </p>
          <p>
            <strong>Recommended Actions:</strong> {report.recommendedActions}
          </p>
          <p>
            <strong>Timestamp:</strong> {report.incidentTimestamp}
          </p>
        </div>
      )}
    </div>
  );
}
