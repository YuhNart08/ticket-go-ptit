import React, { useState } from "react";
import { MapPin, Clock, FileText, Ticket as TicketIcon, QrCode, X, Lock } from "lucide-react";
import axios from "@/utils/axiosInterceptor";
import { toast } from "sonner";
import QRCode from "react-qr-code";

interface TicketCardItemProps {
  ticket: {
    ticket_id: string;
    event_name: string;
    event_date: string;
    event_location?: string;
    event_duration?: string;
    event_banner?: string;
    status: string;
    ticket_type: string;
    quantity: number;
  };
}

const TicketCardItem: React.FC<TicketCardItemProps> = ({ ticket }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
  const [showFullQR, setShowFullQR] = useState(false);

  
  const dateParts = ticket.event_date ? ticket.event_date.split(" ") : [];
  const day = dateParts[0] || "";
  let month = dateParts[1] || "";
  const year = dateParts[dateParts.length - 1] || "";

  if (dateParts.length === 4 && dateParts[1] === "Tháng") {
    month = `${dateParts[1]} ${dateParts[2]}`;
  }

  const handleShowQR = () => {
    if (ticket.status.toUpperCase() === 'COMPLETED') {
      setShowQRModal(true);
      setSelectedTicketIndex(0);
    }
  };

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

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          {ticket.status.toUpperCase() === 'PENDING' && (
            <button
              onClick={handleRetryPayment}
              className="flex-1 bg-[#ff9800] hover:bg-[#e68a00] text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Thanh toán ngay
            </button>
          )}
          {ticket.status.toUpperCase() === 'COMPLETED' && (
            <button
              onClick={handleShowQR}
              className="flex-1 bg-[#2dc275] hover:bg-[#25a860] text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <QrCode size={20} />
              Xem mã QR
            </button>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && ticket.status.toUpperCase() === 'COMPLETED' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => { setShowQRModal(false); setShowFullQR(false); }}>
          <div className="bg-[#4c556a] rounded-3xl w-full max-w-4xl overflow-hidden relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => { setShowQRModal(false); setShowFullQR(false); }}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 transition-colors bg-black/30 rounded-full p-2"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="px-6 pt-6">
              <h2 className="text-white text-xl md:text-2xl font-bold pr-10">
                {ticket.event_name}
              </h2>
            </div>

            {/* Main Content */}
            <div className="p-6 pt-4 grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-4 md:gap-6 items-start">
              {/* Left: Banner + Info */}
              <div className="space-y-4">
                {/* Banner card */}
                <div className="w-full rounded-xl overflow-hidden bg-black/60 border border-white/10">
                  {ticket.event_banner ? (
                    <div className="w-full aspect-[16/9]">
                      <img
                        src={`/images/event/${ticket.event_banner}`}
                        alt={ticket.event_name}
                        className="w-full h-full object-contain bg-black"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] flex items-center justify-center text-white/60 text-sm">
                      Chưa có ảnh sự kiện
                    </div>
                  )}
                </div>

                <div className="bg-black/20 rounded-xl p-4 text-white space-y-3 border border-white/10">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">Mã</p>
                    <p className="text-lg font-bold break-all">{ticket.ticket_id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">Loại vé</p>
                    <p className="text-base font-semibold text-[#2dc275]">{ticket.ticket_type}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">Thời gian</p>
                    <p className="text-sm font-medium">{ticket.event_duration || "14:00 - 23:59"}</p>
                    <p className="text-sm font-medium">{ticket.event_date}</p>
                  </div>
                </div>
              </div>

              {/* Right: QR Code */}
              <div className="bg-white rounded-2xl p-5 flex flex-col items-center shadow-lg min-h-[260px]">
                <div className="relative cursor-pointer" onClick={() => setShowFullQR(true)}>
                  <QRCode
                    value={`TICKET-${ticket.ticket_id}-${ticket.ticket_type}-${selectedTicketIndex + 1}`}
                    size={200}
                    level="H"
                    className={`${showFullQR ? "" : "blur-[4px] opacity-80 transition-all"}`}
                  />
                  {!showFullQR && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/85 flex items-center justify-center shadow-md">
                        <Lock size={24} className="text-gray-700" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-4 font-medium">
                  Nhấn vào ảnh để xem mã QR
                </p>

                {ticket.quantity > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: ticket.quantity }).map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setSelectedTicketIndex(index); setShowFullQR(false); }}
                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                          selectedTicketIndex === index
                            ? 'bg-[#2dc275] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Instruction */}
            <div className="px-6 pb-6 text-center text-white/80 text-sm">
              Vuốt ngang để xem vé khác
            </div>

            {/* Fullscreen QR when unlocked */}
            {showFullQR && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6" onClick={() => setShowFullQR(false)}>
                <div className="bg-white rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <QRCode
                    value={`TICKET-${ticket.ticket_id}-${ticket.ticket_type}-${selectedTicketIndex + 1}`}
                    size={320}
                    level="H"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCardItem;
