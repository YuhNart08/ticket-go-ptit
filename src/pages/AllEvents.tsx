import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Event } from "@/constants/types/types";
import EventCard from "@/components/Layouts/Client/EventCard";
import { getDisplayPrice } from "@/utils/getDisplayPrice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CategoryFilterBar from "@/components/Layouts/Client/CategoryFilterBar";
import DateFilterBar from "@/components/Layouts/Client/DateFilterBar";
import { categories } from "@/constants/data/categories";

const AllEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  // const categoryName = searchParams.get("category");
  // const searchQuery = searchParams.get("search");
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const selectedDate = fromDate && toDate ? `${fromDate},${toDate}` : "";

  const updateUrlParams = (
    newParams: Record<string, string | number | null>
  ) => {
    const currentParams = new URLSearchParams(searchParams);
    let pageReset = false;

    for (const key in newParams) {
      if (
        key !== "page" &&
        String(currentParams.get(key) || "") !== String(newParams[key] || "")
      ) {
        pageReset = true;
      }
      if (newParams[key] === null || newParams[key] === "") {
        currentParams.delete(key);
      } else {
        currentParams.set(key, String(newParams[key]));
      }
    }

    if (pageReset) {
      currentParams.set("page", "1");
    }

    setSearchParams(currentParams);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", "20");
      const url = `/api/events?${params.toString()}`;

      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);

        const result = await response.json();
        setEvents(result.events || []);
        setTotalPages(result.totalPages || 1);
      } catch (e) {
        console.error("Lỗi khi fetch sự kiện:", e);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    fetchData();
  }, [searchParams]);

  return (
    <>
      <CategoryFilterBar data={categories} />
      <DateFilterBar
        selectedDate={selectedDate}
        onDateChange={(dateString) => {
          if (dateString) {
            // Khi lọc theo ngày, xóa tất cả các query cũ và chỉ giữ lại from, to
            const [from, to] = dateString.split(",");
            const newParams = new URLSearchParams();
            newParams.set("from", from);
            newParams.set("to", to);
            setSearchParams(newParams);
          } else {
            updateUrlParams({ from: null, to: null });
          }
        }}
      />

      <div className="min-h-screen bg-[#000] pb-15">
        <div className="mx-5 lg:mx-auto max-w-[1250px]">
          {/* header */}
          <div className="text-white container py-6">
            <p className="text-[#2dc275] font-semibold">Kết quả tìm kiếm:</p>
          </div>
          {/* seach results section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#3f3f46] rounded-xl aspect-[16/9] animate-pulse"
                ></div>
              ))
              : events.map((event, index) => (
                <EventCard
                  key={event.id ?? index}
                  event={event}
                  price={getDisplayPrice(event.ticketTypes)}
                />
              ))}
          </div>
        </div>

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
    </>
  );
};

export default AllEvents;
