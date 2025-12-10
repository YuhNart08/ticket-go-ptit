// File: src/components/admin/DashboardCharts.jsx

import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function DashboardCharts() {
  const [timeFilter, setTimeFilter] = useState("7days");

  // Mock data - Doanh thu theo thời gian (thay đổi theo filter)
  const getRevenueData = () => {
    const dataMap = {
      today: [
        { date: "00:00", revenue: 1200000 },
        { date: "04:00", revenue: 2500000 },
        { date: "08:00", revenue: 4200000 },
        { date: "12:00", revenue: 5800000 },
        { date: "16:00", revenue: 7200000 },
        { date: "20:00", revenue: 9500000 },
      ],
      "7days": [
        { date: "01/12", revenue: 12500000 },
        { date: "02/12", revenue: 15200000 },
        { date: "03/12", revenue: 11800000 },
        { date: "04/12", revenue: 18500000 },
        { date: "05/12", revenue: 16200000 },
        { date: "06/12", revenue: 21000000 },
        { date: "07/12", revenue: 19500000 },
      ],
      "30days": [
        { date: "01-07/12", revenue: 95000000 },
        { date: "08-14/12", revenue: 112000000 },
        { date: "15-21/12", revenue: 98000000 },
        { date: "22-31/12", revenue: 145000000 },
      ],
      custom: [
        { date: "01/12", revenue: 12500000 },
        { date: "08/12", revenue: 18200000 },
        { date: "15/12", revenue: 21500000 },
      ],
    };
    return dataMap[timeFilter] || dataMap["7days"];
  };

  // Mock data - Số lượng vé bán được (thay đổi theo filter)
  const getTicketSalesData = () => {
    const dataMap = {
      today: [
        { date: "00:00", tickets: 5 },
        { date: "04:00", tickets: 12 },
        { date: "08:00", tickets: 28 },
        { date: "12:00", tickets: 35 },
        { date: "16:00", tickets: 42 },
        { date: "20:00", tickets: 58 },
      ],
      "7days": [
        { date: "01/12", tickets: 45 },
        { date: "02/12", tickets: 62 },
        { date: "03/12", tickets: 38 },
        { date: "04/12", tickets: 78 },
        { date: "05/12", tickets: 55 },
        { date: "06/12", tickets: 92 },
        { date: "07/12", tickets: 71 },
      ],
      "30days": [
        { date: "01-07/12", tickets: 350 },
        { date: "08-14/12", tickets: 425 },
        { date: "15-21/12", tickets: 380 },
        { date: "22-31/12", tickets: 520 },
      ],
      custom: [
        { date: "01/12", tickets: 45 },
        { date: "08/12", tickets: 82 },
        { date: "15/12", tickets: 95 },
      ],
    };
    return dataMap[timeFilter] || dataMap["7days"];
  };

  // Mock data - Loại vé bán chạy
  const ticketTypeData = [
    { type: "VIP", sold: 145, revenue: 43500000 },
    { type: "Standard", sold: 320, revenue: 48000000 },
    { type: "Early Bird", sold: 210, revenue: 31500000 },
    { type: "Student", sold: 95, revenue: 9500000 },
  ];

  // Mock data - Sự kiện phổ biến
  const popularEventsData = [
    { event: "Concert Rock Việt", tickets: 450, revenue: 67500000 },
    { event: "Hội chợ Công nghệ", tickets: 380, revenue: 57000000 },
    { event: "Festival Âm nhạc", tickets: 520, revenue: 78000000 },
    { event: "Workshop Marketing", tickets: 125, revenue: 18750000 },
    { event: "Stand-up Comedy", tickets: 280, revenue: 42000000 },
  ];

  // Mock data - Thống kê khách hàng
  const customerStatsData = [
    { category: "Khách mới", value: 45, color: "#3b82f6" },
    { category: "Khách quay lại", value: 35, color: "#10b981" },
    { category: "VIP Members", value: 20, color: "#f59e0b" },
  ];

  const formatCurrency = (num) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num || 0);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, formatter }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-gray-800 font-semibold">{payload[0].name || "Giá trị"}</p>
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
      custom: "Tuỳ chọn",
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
        <button
          onClick={() => setTimeFilter("custom")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeFilter === "custom"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Tùy chọn
        </button>
      </div>

      {/* Row 1: Doanh thu và Số vé bán */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ doanh thu */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Doanh thu theo thời gian</h2>
          <p className="text-sm text-gray-600 mb-4">{getFilterDescription()}</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getRevenueData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip content={<CustomTooltip formatter={(v) => formatCurrency(v)} />} />
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
          <h2 className="text-lg font-bold text-gray-900 mb-1">Số lượng vé bán được</h2>
          <p className="text-sm text-gray-600 mb-4">{getFilterDescription()}</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getTicketSalesData()}>
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

      {/* Row 2: Loại vé bán chạy */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Loại vé bán chạy nhất</h2>
        <p className="text-sm text-gray-600 mb-4">Thống kê theo loại vé</p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={ticketTypeData}>
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
                        Doanh thu: {formatCurrency(payload[0].payload.revenue)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="sold" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Số vé đã bán" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 3: Sự kiện phổ biến và Thống kê khách hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sự kiện phổ biến */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Sự kiện phổ biến nhất</h2>
          <p className="text-sm text-gray-600 mb-4">Top 5 sự kiện có nhiều vé bán nhất</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={popularEventsData} layout="vertical">
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
                          Doanh thu: {formatCurrency(payload[0].payload.revenue)}
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

        {/* Thống kê khách hàng */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Thống kê khách hàng</h2>
          <p className="text-sm text-gray-600 mb-4">Phân loại khách hàng</p>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={customerStatsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, value }) => `${category}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {customerStatsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800">
                          {payload[0].payload.category}
                        </p>
                        <p className="text-sm text-blue-600">
                          {payload[0].value}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}