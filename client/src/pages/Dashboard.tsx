import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="min-w-full border mt-4">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="even:bg-accent">
              <td className="p-2 border">{user.id}</td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 