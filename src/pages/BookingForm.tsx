import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Event } from "@/constants/types/types";
import { Calendar, MapPin } from "lucide-react";
import { formatDateTimeDisplay } from "@/utils/utils";
import CountdownTimer from "../components/Layouts/Client/CountdownTimer";

import { useForm } from "react-hook-form";

const BookingForm = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event>();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const form = useForm();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/events/${String(id)}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Sự kiện không tồn tại. Mời bạn chọn sự kiện khác");
          }
          throw new Error(`Error when loaded data: ${response.statusText}`);
        }
        const result = await response.json();
        console.log("event result", result.data);
        setEvent(result);
      } catch (err: any) {
        setError(err.message);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    window.scrollTo(0, 0);

    fetchEvents();
  }, []);

  return (
    <>
      <div className="relative w-full h-62 md:h-72 lg:h-62 overflow-hidden">
        <img
          src={`/images/event/${event?.bannerUrl}`}
          alt={`${event?.title} banner`}
          className="absolute inset-0 w-full h-full object-cover blur-lg"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="flex flex-row items-center justify-between relative mx-10 md:mx-10 lg:mx-50 gap-6 md:gap-8  text-white h-full ">
          {/* INFO SECTION */}
          <div className="flex flex-col flex-9 gap-2">
            <h1 className="flex-1 w-full lg:text-3xl sm:text-xl md:text-2xl font-bold mb-2 py-5 border-b-white border-b-1 ">
              {event?.title.toUpperCase()}
            </h1>
            <div className="flex items-center mb-2 gap-2 text-white">
              <Calendar strokeWidth={3} size={24} className="text-white" />
              <p className="font-bold text-xl sm:text-sm lg:text-lg">
                {event?.duration},{" "}
                {event
                  ? formatDateTimeDisplay(event.startDate)
                  : "Chưa có ngày diễn ra"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-white">
              <MapPin strokeWidth={3} size={24} className="text-white" />
              <p className="font-bold text-xl sm:text-sm lg:text-lg">
                {event?.location}
              </p>
            </div>
          </div>
          {/* COUNTDOWN SECTION */}
          <div className="flex-1">
            <CountdownTimer initialMinutes={15} />
          </div>
        </div>
      </div>

      <div className="bg-black w-full flex flex-1">
        {/* FORM */}
        <div className="p-5 md:mx-10 lg:mx-50">
          <h1 className="text-white">BẢNG CÂU HỎI</h1>
          <div className="flex flex-col">
            <div className="bg-[#38383d] p-5 flex-7">
              <form onSubmit={() => alert("datr ve")} className="space-y-4">
                <h3>{event?.title}</h3>

                <div className="text-white">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    className="border p-2 rounded w-full"
                    placeholder="Họ và tên"
                  />
                  {/* {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )} */}
                </div>

                <div className="text-white">
                  <label>Email</label>
                  <input
                    type="email"
                    className="border p-2 rounded w-full"
                    placeholder="Email"
                  />
                  {/* {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )} */}
                </div>

                <div className="text-white">
                  <label>Số điện thoại</label>
                  <input
                    className="border p-2 rounded w-full text-white"
                    placeholder="Số điện thoại"
                  />
                  {/* {errors.ticketType && (
                <p className="text-red-500">{errors.ticketType.message}</p>
              )} */}
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Đặt vé
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
