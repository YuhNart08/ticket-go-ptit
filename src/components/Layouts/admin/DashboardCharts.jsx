// File: src/components/admin/DashboardCharts.jsx
import { formatCurrency } from "@/utils/utils";

import { useState, useEffect } from "react";
import axios from "@/utils/axiosInterceptor";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const initialChartData = {
  revenueData: [],
  ticketSalesData: [],
  popularEventsData: [],
  ticketTypeData: [],
};

export default function DashboardCharts() {
  const [timeFilter, setTimeFilter] = useState("7days");
  const [chartData, setChartData] = useState(initialChartData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/dashboard/charts?filter=${timeFilter}`
        );
        if (response.data.success) {
          setChartData(response.data.chartData);
        } else {
          setChartData(initialChartData);
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setChartData(initialChartData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [timeFilter]);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, formatter }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-gray-800 font-semibold">
            {payload[0].name || "Giá trị"}
          </p>
          <p className="text-blue-600 text-sm">
            {formatter ? formatter(payload[0].value) : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Hàm lấy description theo filter
  const getFilterDescription = () => {
    const descriptions = {
      today: "Theo giờ hôm nay",
      "7days": "7 ngày gần nhất",
      "30days": "30 ngày gần nhất",
    };
    return descriptions[timeFilter] || "7 ngày gần nhất";
  };

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTimeFilter("today")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeFilter === "today"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Hôm nay
        </button>
        <button
          onClick={() => setTimeFilter("7days")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeFilter === "7days"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          7 ngày
        </button>
        <button
          onClick={() => setTimeFilter("30days")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeFilter === "30days"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          30 ngày
        </button>
      </div>

      {/* Row 1: Doanh thu và Số vé bán */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ doanh thu */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Doanh thu theo thời gian
          </h2>
          <p className="text-sm text-gray-600 mb-4">{getFilterDescription()}</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                content={<CustomTooltip formatter={(v) => formatCurrency(v)} />}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ số vé bán */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Số lượng vé bán được
          </h2>
          <p className="text-sm text-gray-600 mb-4">{getFilterDescription()}</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.ticketSalesData}>
              <defs>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="tickets"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorTickets)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Sự kiện phổ biến và Thống kê khách hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sự kiện phổ biến */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Sự kiện phổ biến nhất
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Top 5 sự kiện có nhiều vé bán nhất
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.popularEventsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="event"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                width={120}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800 mb-1">
                          {payload[0].payload.event}
                        </p>
                        <p className="text-sm text-blue-600">
                          Vé bán: {payload[0].value}
                        </p>
                        <p className="text-sm text-green-600">
                          Doanh thu:{" "}
                          {formatCurrency(payload[0].payload.revenue)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="tickets" fill="#f59e0b" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loại vé bán chạy */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Loại vé bán chạy nhất
          </h2>
          <p className="text-sm text-gray-600 mb-4">Thống kê theo loại vé</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.ticketTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="type" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800 mb-1">
                          {payload[0].payload.type}
                        </p>
                        <p className="text-sm text-blue-600">
                          Đã bán: {payload[0].value} vé
                        </p>
                        <p className="text-sm text-green-600">
                          Doanh thu:{" "}
                          {formatCurrency(payload[0].payload.revenue)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar
                dataKey="sold"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                name="Số vé đã bán"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
