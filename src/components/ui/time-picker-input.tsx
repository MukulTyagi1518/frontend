"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./time-picker";

interface TimePickerInputProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
}

export function TimePickerInput({
  value,
  onChange,
  className,
  required = false,
}: TimePickerInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Convert time range (e.g., "6 AM-7 AM") to 24-hour format (e.g., "06:00")
  const formatTimeForInput = (timeRange: string) => {
    const [startTime] = timeRange.split("-");
    const [hour, period] = startTime.trim().split(" ");
    let hourNum = parseInt(hour);

    if (period === "PM" && hourNum !== 12) {
      hourNum += 12;
    } else if (period === "AM" && hourNum === 12) {
      hourNum = 0;
    }

    return `${hourNum.toString().padStart(2, "0")}:00`;
  };

  // Convert 24-hour format to time range
  const formatTimeForDisplay = (time24: string) => {
    const [hour] = time24.split(":");
    const hourNum = parseInt(hour);
    const nextHour = (hourNum + 1) % 24;

    const period1 = hourNum >= 12 ? "PM" : "AM";
    const period2 = nextHour >= 12 ? "PM" : "AM";
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    const nextHour12 =
      nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour;

    return `${hour12} ${period1}-${nextHour12} ${period2}`;
  };

  const handleTimeSelect = (timeRange: string) => {
    onChange?.(formatTimeForInput(timeRange));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-neutral-50">
        Session Time {required && <span className="text-red-500">*</span>}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative mt-2">
            <Input
              value={value || "--:--"} // Show placeholder when value is empty
              readOnly
              required={required}
              className={cn("pr-10 cursor-pointer", className)}
              onClick={() => setIsOpen(true)}
            />
            <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <TimePicker
            selectedTime={value ? formatTimeForDisplay(value) : undefined}
            onTimeSelect={handleTimeSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
