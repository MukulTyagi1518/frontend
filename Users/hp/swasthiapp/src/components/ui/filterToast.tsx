import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { addDays } from "date-fns";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filters: FilterState) => void;
}

// interface FilterState {
//   sorting: "A_Z" | "Z-A" | null;
//   date: {
//     from: Date | null;
//     to: Date | null;
//   };
//   categories: string[];
// }
interface FilterState {
    sorting: "A_Z" | "Z-A" | null;
    date: {
      from: Date | null;
      to: Date | null;
    };
    categories: string[];
    startDate?: string;
    endDate?: string;
    category?: string;
    sortOrder?: "A_Z" | "Z-A" | null;
  }
  
const CATEGORIES = ["MEDITATION", "WARMUP", "HIIT", "STRENGTH & COND.", "YOGA"];

export function FilterDialog({
  open,
  onOpenChange,
  onApplyFilter,
}: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterState>({
    sorting: null,
    date: {
      from: null,
      to: null,
    },
    categories: [],
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleClearAll = () => {
    setFilters({
      sorting: null,
      date: {
        from: null,
        to: null,
      },
      categories: [],
    });
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#262626] text-white border-neutral-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Refine by</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl mb-4">Sorting</h3>
            <RadioGroup
              value={filters.sorting || ""}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  sorting: value as "A_Z" | "Z-A",
                }))
              }
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative">
                <Label
                  htmlFor="a_z"
                  className={`border border-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-800 block ${
                    filters.sorting === "A_Z"
                      ? "bg-neutral-700 border-white"
                      : ""
                  }`}
                >
                  <RadioGroupItem value="A_Z" id="a_z" className="sr-only" />
                  A-Z
                </Label>
              </div>
              <div className="relative">
                <Label
                  htmlFor="z-a"
                  className={`border border-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-800 block ${
                    filters.sorting === "Z-A"
                      ? "bg-neutral-700 border-white"
                      : ""
                  }`}
                >
                  <RadioGroupItem value="Z-A" id="z-a" className="sr-only" />
                  Z-A
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h3
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="text-xl mb-4 cursor-pointer flex items-center"
            >
              Date Range {isCalendarOpen ? "▼" : "▶"}
            </h3>
            {isCalendarOpen && (
              <div className="border border-neutral-700 rounded-lg p-4 bg-[#262626]">
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.date.from || undefined,
                    to: filters.date.to || undefined,
                  }}
                  onSelect={(range) =>
                    setFilters((prev) => ({
                      ...prev,
                      date: {
                        from: range?.from || null,
                        to: range?.to || null,
                      },
                    }))
                  }
                  className="bg-[#262626]"
                  numberOfMonths={1}
                  defaultMonth={new Date()}
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl mb-4">Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className={`border-neutral-700 justify-start ${
                    filters.categories.includes(category)
                      ? "bg-neutral-700 border-white"
                      : ""
                  }`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={handleClearAll}
              className="text-white hover:text-neutral-300"
            >
              Clear all
            </Button>
            <Button
              onClick={() => {
                onApplyFilter({
                  ...filters,
                  startDate: filters.date.from?.toISOString(),
                  endDate: filters.date.to?.toISOString(),
                  category: filters.categories.join(","),
                  sortOrder: filters.sorting,
                });
                onOpenChange(false);
              }}
              className="bg-white text-black hover:bg-neutral-200"
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FilterDialog;
