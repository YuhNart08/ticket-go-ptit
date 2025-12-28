import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Layouts/admin/components/Pagination.jsx";
import axios from "@/utils/axiosInterceptor";
import { toast } from "sonner";

export default function EventShow() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const fetchEvents = async (page) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`/api/events?page=${page}&limit=8`);
      const data = res.data;

      const fetchedEvents = data.events || data.data || [];
      const pages = data.totalPages || data.total_pages || 1;

      setEvents(fetchedEvents);
      setTotalPages(pages);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`/api/events/${id}`);
      toast.success("Event deleted successfully!");

      setEvents((prevEvents) => {
        const newEvents = prevEvents.filter((u) => u.id !== id);
        if (newEvents.length === 0 && page > 1) setPage((p) => p - 1);
        return newEvents;
      });
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold mb-2">Manage Events</h1>

      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex space-x-2">
          <li>
            <Link to="/admin" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
            <span className="ms-2">/</span>
          </li>
          <li className="text-gray-700">Events</li>
        </ol>
      </nav>

      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold">Table events:</h5>
        <Link
          to="/admin/event-create"
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
        >
          Create a new event
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Start Date</th>
              <th className="px-6 py-3">Duration</th>
              {/* <th className="px-6 py-3">Organizer</th> */}
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : events.length > 0 ? (
              events.map((event) => (
                <tr
                  key={event.id}
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  <th className="px-6 py-4 font-medium text-gray-900">
                    {event.id}
                  </th>
                  <td
                    className="px-6 py-4 max-w-xs truncate"
                    title={event.title}
                  >
                    {event.title}
                  </td>
                  <td className="px-6 py-4">{event.category}</td>
                  <td
                    className="px-6 py-4 max-w-xs truncate"
                    title={event.location}
                  >
                    {event.location}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(event.startDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">{event.duration}</td>
                  {/* <td
                    className="px-6 py-4 max-w-xs truncate"
                    title={event.organizer}
                  >
                    {event.organizer}
                  </td> */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/event-detail/${event.id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
