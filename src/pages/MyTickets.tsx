import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserSidebar from "../components/Layouts/Client/UserSidebar";
import SelectTicketLayout from "../components/Layouts/Client/SelectTicketLayout";
import axios from "../utils/axiosInterceptor";
import type {
  OrdersHistoryResponse,
  RawOrder,
  RawTicketOrderDetail,
  MappedTicket,
} from "../constants/types/types";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type TabType = "ALL" | "COMPLETED" | "PENDING" | "CANCELLED";
type SubTabType = "UPCOMING" | "PAST";

const MyTickets = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("UPCOMING");
  const [loading, setIsLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<MappedTicket[]>([])
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = Number(searchParams.get("page")) || 1;

  const updateUrlParams = (
    newParams: Record<string, string | number | null>
  ) => {
    const currentParams = new URLSearchParams(searchParams);
    for (const key in newParams) {
      if (newParams[key] === null || newParams[key] === "") {
        currentParams.delete(key);
      } else {
        currentParams.set(key, String(newParams[key]));
      }
    }
    setSearchParams(currentParams);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    updateUrlParams({ page: 1 });
  };

  const handleSubTabChange = (subTab: SubTabType) => {
    setActiveSubTab(subTab);
    updateUrlParams({ page: 1 });
  };

  const PAGE_LIMIT = 3; // Không phải số vé mà là số đơn hàng mỗi trang

  useEffect(() => {
    const handleFetchMyTicket = async () => {
      setIsLoading(true);
      setTickets([]);

      try {
        const response = await axios.get<OrdersHistoryResponse>("/api/orders/history", {
          params: {
            limit: PAGE_LIMIT,
            page: currentPage,
            status: activeTab,
            eventTime: activeSubTab,
          },
        });

        const result = response.data;
        const orders: RawOrder[] = result.orders || [];
        setTotalPages(result.totalPages || 1);

        const mappedTickets: MappedTicket[] = [];

        orders.forEach((order: RawOrder) => {
          let items: RawTicketOrderDetail[] = [];
          if (Array.isArray(order.ticketOrderDetails)) {
            items = order.ticketOrderDetails;
          } else if (Array.isArray(order.orderDetails)) {
            items = order.orderDetails;
          }

          items.forEach((item: RawTicketOrderDetail) => {
            const event = item.ticketType?.event;

            let dateStr = "";
            if (event?.startDate) {
              const d = new Date(event.startDate);
              const day = d.getDate().toString().padStart(2, '0');
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const year = d.getFullYear();
              dateStr = `${day} Tháng ${month} ${year}`;
            }

            console.log('Event data:', event); // Debug: check event structure
            mappedTickets.push({
              id: item.id || Math.random(),
              ticket_id: order.id ? `${order.id}` : "N/A",
              event_name: event?.title || "Sự kiện không xác định",
              event_date: dateStr,
              event_location: event?.location,
              event_duration: event?.duration,
              event_banner: event?.bannerUrl,
              status: order.status,
              ticket_type: item.ticketType?.type || "Không xác định",
              quantity: item.quantity
            });
          });
        });
        setTickets(mappedTickets);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setTickets([]);
        setIsLoading(false);
      }
    };

    handleFetchMyTicket();
  }, [activeTab, activeSubTab, currentPage]);

  const tabs = [
    { id: "ALL" as TabType, label: "Tất cả" },
    { id: "COMPLETED" as TabType, label: "Thành công" },
    { id: "PENDING" as TabType, label: "Đang xử lý" },
    { id: "CANCELLED" as TabType, label: "Đã hủy" },
  ];


  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-black font-bold text-white">
        Đang tải...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#212121]">
      <div className="mx-4 md:mx-30 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="text-xs md:text-sm text-gray-400 mb-4 md:mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Trang chủ
          </button>
          <span className="mx-1 md:mx-2">›</span>
          <span className="text-white">Vé của tôi</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Sidebar - ẩn trên mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <UserSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 md:mb-6 lg:mb-8">
              Vé của tôi
            </h1>

            {/* Tabs - grid 2x2 trên mobile */}
            <div className="grid grid-cols-2 md:flex gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6 lg:mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3 md:px-6 lg:px-10 py-2 md:py-2.5 lg:py-3 rounded-full font-medium text-sm md:text-base transition-colors ${activeTab === tab.id
                    ? "bg-[#2dc275] text-white"
                    : "bg-[#52525b] text-gray-300 hover:bg-[#616169]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub Tabs */}
            <div className="flex gap-6 md:gap-8 lg:gap-12 mb-6 md:mb-8 border-b border-gray-700">
              <button
                onClick={() => handleSubTabChange("UPCOMING")}
                className={`pb-2 md:pb-3 font-medium transition-colors relative text-sm md:text-base ${activeSubTab === "UPCOMING"
                  ? "text-[#2dc275]"
                  : "text-gray-400 hover:text-gray-300"
                  }`}
              >
                Sắp diễn ra
                {activeSubTab === "UPCOMING" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2dc275]"></div>
                )}
              </button>
              <button
                onClick={() => handleSubTabChange("PAST")}
                className={`pb-2 md:pb-3 font-medium transition-colors relative text-sm md:text-base ${activeSubTab === "PAST"
                  ? "text-[#2dc275]"
                  : "text-gray-400 hover:text-gray-300"
                  }`}
              >
                Đã kết thúc
                {activeSubTab === "PAST" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2dc275]"></div>
                )}
              </button>
            </div>

            {/* Empty State */}
            {!loading && tickets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 md:py-12 lg:py-20">
                <div className="w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 mb-4 md:mb-6">
                  <img
                    src="/emptyState.svg"
                    alt="No tickets"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-400 text-sm md:text-base lg:text-xl">
                  Bạn chưa có vé nào
                </p>
              </div>
            )}

            {/* Ticket List - Sử dụng component SelectTicketLayout */}
            {tickets.length > 0 && (
              <SelectTicketLayout tickets={tickets} />
            )}

            {/* shadcn PAGINATION  */}
            {totalPages > 1 && (
              <div className="flex justify-center py-8">
                <Pagination>
                  <PaginationContent className="text-white">
                    {/* prev btn */}
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() =>
                          updateUrlParams({ page: Math.max(currentPage - 1, 1) })
                        }
                        className={`${currentPage === 1
                          ? "opacity-40 pointer-events-none"
                          : "hover:bg-blue-600 hover:text-white"
                          } bg-[#3f3f46] text-white border border-gray-600`}
                      />
                    </PaginationItem>

                    {/* page nums */}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={() => updateUrlParams({ page: i + 1 })}
                          className={`${currentPage === i + 1
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-[#3f3f46] text-gray-300 hover:bg-blue-600 hover:text-white border border-gray-600"
                            }`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* next btn */}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() =>
                          updateUrlParams({
                            page: Math.min(currentPage + 1, totalPages),
                          })
                        }
                        className={`${currentPage === totalPages
                          ? "opacity-40 pointer-events-none"
                          : "hover:bg-blue-600 hover:text-white"
                          } bg-[#3f3f46] text-white border border-gray-600`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;