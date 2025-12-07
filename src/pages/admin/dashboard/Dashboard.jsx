import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "@/utils/axiosInterceptor";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import DashboardCharts from "./DashboardCharts"; // Import component mới

export default function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    countUser: 0,
    countEvent: 0,
    countOrder: 0,
    totalRevenue: 0,
  });

  const formatCurrency = (num) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num || 0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !user) {
        console.log("No token or user available");
        return;
      }

      try {
        const res = await axios.get("/api/dashboard/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        if (data.success && data.info) {
          setStats(data.info);
        }
      } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 500) {
          alert(
            "Error fetching dashboard data: " + error.response.data.message
          );
        } else {
          alert("An unexpected error occurred while fetching dashboard data.");
        }
      }
    };

    fetchDashboardData();
  }, [token, user]);

  return (
    <>
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex space-x-2">
            <li className="after:content-['/'] after:mx-2">Dashboard</li>
          </ol>
        </nav>

        <div className="bg-yellow-500 text-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-4 text-lg font-semibold">
            Revenue ({formatCurrency(stats.totalRevenue)})
          </div>
          <div className="flex items-center justify-between bg-yellow-600 px-4 py-3 text-sm">
            <Link to="/admin/orders" className="hover:underline">
              View Details
            </Link>
            <i className="fas fa-angle-right"></i>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-600 text-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 text-lg font-semibold">
              Users ({stats.countUser})
            </div>
            <div className="flex items-center justify-between bg-blue-700 px-4 py-3 text-sm">
              <Link to="/admin/users" className="hover:underline">
                View Details
              </Link>
              <i className="fas fa-angle-right"></i>
            </div>
          </div>

          <div className="bg-red-600 text-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 text-lg font-semibold">
              Events ({stats.countEvent})
            </div>
            <div className="flex items-center justify-between bg-red-700 px-4 py-3 text-sm">
              <Link to="/admin/events" className="hover:underline">
                View Details
              </Link>
              <i className="fas fa-angle-right"></i>
            </div>
          </div>

          <div className="bg-green-600 text-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 text-lg font-semibold">
              Orders ({stats.countOrder})
            </div>
            <div className="flex items-center justify-between bg-green-700 px-4 py-3 text-sm">
              <Link to="/admin/orders" className="hover:underline">
                View Details
              </Link>
              <i className="fas fa-angle-right"></i>
            </div>
          </div>
        </div>

        {/* Thêm phần biểu đồ thống kê */}
        <div className="mt-8">
          <DashboardCharts />
        </div>
      </div>
    </>
  );
}