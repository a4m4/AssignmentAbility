import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Activity } from "lucide-react";

interface Request {
  id: number;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  status: number;
  timestamp: string;
  responseTime: string;
}

const mockRequests: Request[] = [
  {
    id: 1,
    method: "GET",
    endpoint: "/api/users",
    status: 200,
    timestamp: "2024-03-20 10:30:45",
    responseTime: "120ms",
  },
  {
    id: 2,
    method: "POST",
    endpoint: "/api/users/create",
    status: 201,
    timestamp: "2024-03-20 10:31:15",
    responseTime: "150ms",
  },
  {
    id: 3,
    method: "PUT",
    endpoint: "/api/users/123",
    status: 200,
    timestamp: "2024-03-20 10:32:00",
    responseTime: "180ms",
  },
  {
    id: 4,
    method: "DELETE",
    endpoint: "/api/users/456",
    status: 204,
    timestamp: "2024-03-20 10:33:20",
    responseTime: "90ms",
  },
  {
    id: 5,
    method: "GET",
    endpoint: "/api/users/profile",
    status: 200,
    timestamp: "2024-03-20 10:34:10",
    responseTime: "110ms",
  },
];

export default function Dashboard() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");

  const filteredRequests = selectedMethod === "ALL" 
    ? requests 
    : requests.filter(request => request.method === selectedMethod);

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "POST":
        return "bg-green-100 text-green-700 border-green-200";
      case "PUT":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "DELETE":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600";
    if (status >= 400 && status < 500) return "text-yellow-600";
    if (status >= 500) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-indigo-600" />
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Request Logger Dashboard
                </CardTitle>
              </div>
              <div className="w-48">
                <Select
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Filter by method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Methods</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-gray-600">Loading requests...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="m-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-[100px] font-semibold text-gray-900">Method</TableHead>
                      <TableHead className="font-semibold text-gray-900">Endpoint</TableHead>
                      <TableHead className="w-[100px] font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900">Timestamp</TableHead>
                      <TableHead className="w-[100px] font-semibold text-gray-900">Response Time</TableHead>
                      <TableHead className="w-[100px] font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request, index) => (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMethodColor(request.method)}`}>
                            {request.method}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-700">{request.endpoint}</TableCell>
                        <TableCell className={`font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </TableCell>
                        <TableCell className="text-gray-700">{request.timestamp}</TableCell>
                        <TableCell className="text-gray-700">{request.responseTime}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                          >
                            Details
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 