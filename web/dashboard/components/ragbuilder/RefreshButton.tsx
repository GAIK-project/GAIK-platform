"use client";

export function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: "5px",
        marginLeft: "20px",
        backgroundColor: "#3366ff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Refresh Data
    </button>
  );
}
