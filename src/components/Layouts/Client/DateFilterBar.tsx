import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface DateFilterBarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const DateFilterBar = ({ selectedDate, onDateChange }: DateFilterBarProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (selectedDate) {
      const [fromString, toString] = selectedDate.split(',');
      setDateRange({
        from: fromString ? parse(fromString, "yyyy-MM-dd", new Date()) : undefined,
        to: toString ? parse(toString, "yyyy-MM-dd", new Date()) : undefined,
      });
    } else {
      setDateRange({ from: undefined, to: undefined });
    }
  }, [selectedDate]);

  const handleDateSelect = (day: Date | undefined) => {
    if (!day) return;

    if (!dateRange.from) {
      setDateRange({ from: day, to: undefined });
    } else if (!dateRange.to) {
      setDateRange(prev => ({
        from: day < prev.from! ? day : prev.from,
        to: day < prev.from! ? prev.from : day,
      }));
    } else {
      setDateRange({ from: day, to: undefined });
    }
  };

  const handleApply = () => {
    if (dateRange.from && dateRange.to) {
      const fromDate = format(dateRange.from, "yyyy-MM-dd");
      const toDate = format(dateRange.to, "yyyy-MM-dd");
      onDateChange(`${fromDate},${toDate}`);
      setIsPopoverOpen(false);
    }
  };

  const handleResetInPopover = () => {
    setDateRange({ from: undefined, to: undefined });
    onDateChange("");
    setIsPopoverOpen(false);
  };

  const handleClearOutside = () => {
    onDateChange("");
  };

  const isInRange = (date: Date) => {
    if (!dateRange.from || !dateRange.to) return false;
    return date >= dateRange.from && date <= dateRange.to;
  };

  const displayText = () => {
    if (selectedDate) {
      const [from, to] = selectedDate.split(',');
      return `${format(parse(from, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")} - ${format(parse(to, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}`;
    }
    return "Chọn khoảng thời gian";
  };

  return (
    <div className="bg-black">
      <div className="mx-5 lg:mx-auto max-w-[1200px]">
        <div className="py-4 flex items-center gap-4">
          <label className="text-white font-semibold whitespace-nowrap">
            Lọc theo ngày:
          </label>

          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger
              asChild
              className="flex items-center gap-3 justify-center"
            >
              <Button
                variant="outline"
                className="w-auto justify-start text-left font-normal bg-[#3f3f46] border-gray-600 text-white hover:bg-[#4f4f56] hover:text-white"
              >
                <CalendarIcon className="h-4 w-4" />
                {displayText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-4 bg-[#2a2a2a] border-gray-700"
              align="start"
            >
              <div className="space-y-4">
                {/* Info text */}
                <div className="text-sm text-gray-400">
                  {dateRange.from && !dateRange.to
                    ? "Chọn ngày kết thúc"
                    : "Chọn ngày bắt đầu"}
                </div>

                {/* Calendar */}
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={handleDateSelect}
                  className="bg-[#2a2a2a] text-white"
                  modifiers={{
                    inRange: isInRange,
                  }}
                  modifiersStyles={{
                    inRange: {
                      backgroundColor: "#2dc275",
                      color: "#000",
                      opacity: 1,
                    },
                    from: { backgroundColor: '#2dc275', color: 'white', borderRadius: '50%' },
                    to: { backgroundColor: '#2dc275', color: 'white', borderRadius: '50%' },
                  }}
                />

                {/* Action btns */}
                {(dateRange.from || dateRange.to) && (
                  <div className="flex gap-2 pt-2 border-t border-gray-700">
                    <Button
                      onClick={handleResetInPopover}
                      variant="outline"
                      className="flex-1 bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                    >
                      Thiết lập lại
                    </Button>
                    {dateRange.from && dateRange.to && (
                      <Button
                        onClick={handleApply}
                        className="flex-1 bg-[#2dc275] hover:bg-[#25a85f] text-white border-0"
                      >
                        Áp dụng
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {selectedDate && (
            <button
              onClick={handleClearOutside}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition flex items-center gap-2"
            >
              <X size={16} />
              Thiết lập lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateFilterBar;
