"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimePickerProps {
  onTimeSelect?: (time: string) => void;
  selectedTime?: string;
  className?: string;
}

export function TimePicker({
  onTimeSelect,
  selectedTime,
  className,
}: TimePickerProps) {
  // Generate time slots from 6 AM to 12 AM (next day)
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      const startTime = hour.toString().padStart(2, "0");
      const endTime = (hour + 1).toString().padStart(2, "0");
      const period1 = hour < 12 ? "AM" : "PM";
      const period2 = hour + 1 < 12 ? "AM" : "PM";
      const displayHour1 = hour > 12 ? hour - 12 : hour;
      const displayHour2 = hour + 1 > 12 ? hour + 1 - 12 : hour + 1;
      slots.push(`${displayHour1} ${period1}-${displayHour2} ${period2}`);
    }
    // Add the last slot (11 PM - 12 AM)
    slots.push("11 PM-12 AM");
    return slots;
  }, []);

  return (
    <Card className={cn("w-full max-w-md bg-black rounded-md border-none", className)}>
      <CardHeader className="border-b border-neutral-800">
        <CardTitle className="flex items-center gap-2 text-white">
          <Clock className="h-5 w-5" />
          Pick a Time
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid h-[250px] grid-cols-2 gap-2 overflow-y-auto pr-2 scrollbar-hide  scrollbar-none scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant="outline"
              className={cn(
                "h-10 w-full border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800",
                selectedTime === time &&
                  "border-primary bg-primary/10 text-primary"
              )}
              onClick={() => onTimeSelect?.(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
