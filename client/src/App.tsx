import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";

export default function App() {
  const [page, setPage] = useState<'dashboard' | 'logs'>("dashboard");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex gap-4 mb-8">
        <Button variant={page === 'dashboard' ? 'default' : 'outline'} onClick={() => setPage('dashboard')}>
          Dashboard
        </Button>
        <Button variant={page === 'logs' ? 'default' : 'outline'} onClick={() => setPage('logs')}>
          Logs
        </Button>
      </div>
      {page === 'dashboard' ? <Dashboard /> : <Logs />}
    </div>
  );
} 