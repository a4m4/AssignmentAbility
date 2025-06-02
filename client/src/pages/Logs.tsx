import React, { useEffect, useState } from "react";

interface Log {
  _id: string;
  method: string;
  url: string;
  timestamp: string;
  statusCode?: number;
}

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/logs")
      .then((res) => res.json())
      .then(setLogs);
  }, []);

  useEffect(() => {
    setFiltered(
      logs.filter(
        (log) =>
          log.url.toLowerCase().includes(search.toLowerCase()) ||
          log.method.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, logs]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Request Logs</h1>
      <input
        className="border p-2 mb-4 w-full rounded"
        placeholder="Search by URL or method..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="min-w-full border mt-4">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 border">Method</th>
            <th className="p-2 border">URL</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((log) => (
            <tr key={log._id} className="even:bg-accent">
              <td className="p-2 border">{log.method}</td>
              <td className="p-2 border">{log.url}</td>
              <td className="p-2 border">{log.statusCode ?? "-"}</td>
              <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 