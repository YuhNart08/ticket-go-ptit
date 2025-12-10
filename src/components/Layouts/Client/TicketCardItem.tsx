import React from "react";
import { MapPin, Clock, FileText, Ticket as TicketIcon } from "lucide-react";
import axios from "@/utils/axiosInterceptor";
import { toast } from "sonner";

interface TicketCardItemProps {
  ticket: {
    ticket_id: string;
    event_name: string;
    event_date: string;
    event_location?: string;
    event_duration?: string;
    status: string;
    ticket_type: string;
    quantity: number;
  };
}

const TicketCardItem: React.FC<TicketCardItemProps> = ({ ticket }) => {
  const dateParts = ticket.event_date ? ticket.event_date.split(" ") : [];
  const day = dateParts[0] || "";
  let month = dateParts[1] || "";
  const year = dateParts[dateParts.length - 1] || "";

  if (dateParts.length === 4 && dateParts[1] === "Tháng") {
    month = `${dateParts[1]} ${dateParts[2]}`;
  }

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      COMPLETED: "Thành công",
      PENDING: "Đang xử lý",
      CANCELLED: "Đã hủy",
      completed: "Thành công",
      pending: "Đang xử lý",
      cancelled: "Đã hủy",
      all: "Tất cả",
      success: "Thành công",
    };
    return statusMap[status] || "Chưa xác định";
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "completed" || statusLower === "success")
      return "bg-[#2dc275]";
    if (statusLower === "pending") return "bg-[#ff9800]";
    if (statusLower === "cancelled") return "bg-red-600";
    return "bg-[#2dc275]";
  };

  const handleRetryPayment = async () => {
    try {
      const response = await axios.post(`/api/orders/${ticket.ticket_id}/retry-payment`);
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      toast.error("Đơn hàng đã hết hạn hoặc có lỗi xảy ra. Vui lòng đặt lại vé.");
    }
  };
  return (
    <div className="relative bg-[#515257] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#2dc275]/30 transition-all duration-300 flex flex-col md:flex-row">
      {/* Left side - Date section (ticket stub) */}
      <div className="bg-[#515257] p-4 md:p-6 flex flex-col items-center justify-center min-w-[120px] md:min-w-[140px]">
        <div className="text-center">
          <div className="text-white text-4xl md:text-5xl font-bold leading-none">
            {day}
          </div>
          <div className="text-gray-400 text-xs md:text-sm mt-1">
            {month}
          </div>
          {year && <div className="text-gray-500 text-xs">{year}</div>}
        </div>
      </div>

      {/* Divider with notches */}
      <div className="hidden md:flex flex-col absolute top-0 bottom-0 left-[120px] md:left-[140px] -translate-x-1/2 items-center justify-center z-10">
        <div className="w-6 h-6 rounded-full bg-[#212121] -mt-3"></div>
        <div className="flex-1 border-l-2 border-dashed border-[#212121] my-1"></div>
        <div className="w-6 h-6 rounded-full bg-[#212121] -mb-3"></div>
      </div>
      {/* Mobile Divider (Horizontal) */}
      <div className="md:hidden relative w-full h-4 bg-[#515257] flex items-center justify-center">
        <div className="absolute left-0 w-4 h-4 rounded-full bg-[#212121] -ml-2"></div>
        <div className="w-full border-t-2 border-dashed border-[#212121]"></div>
        <div className="absolute right-0 w-4 h-4 rounded-full bg-[#212121] -mr-2"></div>
      </div>


      {/* Right side - Ticket details */}
      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between pl-6 md:pl-8">
        {/* Header with status */}
        <div className="mb-3 md:mb-4">
          <h3 className="text-white font-bold text-base md:text-lg mb-3 line-clamp-2">
            {ticket.event_name}
          </h3>

          {/* Status badge */}
          <div className="flex gap-2 flex-wrap">
            <span
              className={`${getStatusColor(
                ticket.status
              )} text-white text-xs px-3 py-1 rounded-full font-medium`}
            >
              ✓ {getStatusDisplay(ticket.status)}
            </span>
            <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full font-medium">
              Vé điện tử
            </span>
          </div>
        </div>

        {/* Details section */}
        <div className="space-y-2 md:space-y-3 text-sm">
          {/* Order Code */}
          {ticket.ticket_id && (
            <div className="flex items-center gap-2 text-gray-300">
              <FileText size={16} className="flex-shrink-0" />
              <span className="text-xs md:text-sm">
                Mã đơn: {ticket.ticket_id}
              </span>
            </div>
          )}

          {/* Ticket Type */}
          {ticket.ticket_type && (
            <div className="flex items-center gap-2 text-gray-300">
              <TicketIcon size={16} className="flex-shrink-0" />
              <span className="text-xs md:text-sm">
                {ticket.quantity >= 2 && (
                  <span className="font-bold text-white mr-1.5">{ticket.quantity} x</span>
                )}
                {ticket.ticket_type}
              </span>
            </div>
          )}

          {/* Time */}
          {ticket.event_duration && (
            <div className="flex items-center gap-2 text-gray-300">
              <Clock size={16} className="flex-shrink-0" />
              <span className="text-xs md:text-sm">{ticket.event_duration}</span>
            </div>
          )}

          {/* Location */}
          {ticket.event_location && (
            <div className="flex items-start gap-2 text-gray-300">
              <MapPin size={16} className="flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm line-clamp-2">
                {ticket.event_location}
              </span>
            </div>
          )}
        </div>

        {/* Retry Payment Button */}
        {ticket.status.toUpperCase() === 'PENDING' && (
          <div className="mt-4">
            <button
              onClick={handleRetryPayment}
              className="w-full bg-[#ff9800] hover:bg-[#e68a00] text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Thanh toán ngay
            </button>
          </div>
        )}
        {/* Price section removed as requested */}
      </div>
    </div>
  );
};

export default TicketCardItem;
