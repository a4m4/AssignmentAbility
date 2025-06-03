import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Login from "./pages/Login";

function Layout({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/logs")}>
            Logs
          </Button>
        </div>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            // </ProtectedRoute>
          }
        />
        
        <Route
          path="/logs"
          element={
            // <ProtectedRoute>
              <Layout>
                <Logs />
              </Layout>
            // </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
} 