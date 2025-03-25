import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filters: FilterState) => void;
}

interface FilterState {
  period: string;
  status: string;
  planName: string;
}

export function SubscriptionFilter({
  open,
  onOpenChange,
  onApplyFilter,
}: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterState>({
    period: "",
    status: "",
    planName: "",
  });

  const handleClearAll = () => {
    setFilters({
      period: "",
      status: "",
      planName: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1C] text-white border-neutral-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Filter</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Duration/Period Section */}
          <div className="space-y-3">
            <h3 className="text-2xl">Duration</h3>
            <Select
              value={filters.period}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, period: value }))
              }
            >
              <SelectTrigger className="bg-[#1C1C1C] border-neutral-600">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Plan Name Section */}
          <div className="space-y-3">
            <h3 className="text-2xl">Plan Name</h3>
            <Select
              value={filters.planName}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, planName: value }))
              }
            >
              <SelectTrigger className="bg-[#1C1C1C] border-neutral-600">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Section */}
          <div className="space-y-3">
            <h3 className="text-2xl">Status</h3>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="bg-[#1C1C1C] border-neutral-600">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={handleClearAll}
              className="text-white hover:text-neutral-300 px-0"
            >
              Clear all
            </Button>
            <Button
              onClick={() => {
                onApplyFilter(filters);
                onOpenChange(false);
              }}
              className="bg-white text-black hover:bg-neutral-200 rounded-md px-6"
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
