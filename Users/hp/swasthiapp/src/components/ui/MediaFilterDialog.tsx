import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface MediaFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filters: FilterState) => void;
}

interface FilterState {
  sorting: "asc" | "desc" | null;
  moduleName: string[];
  status: "Active" | "Inactive" | null;
}

// Update module names to match your API response
const MODULE_NAMES = ["MODULE-1", "MODULE-2", "MODULE-3", "MODULE-6"];
const MODULE_DISPLAY_NAMES: Record<string, string> = {
  "MODULE-1": "User Management",
  "MODULE-2": "Media Management",
  "MODULE-3": "Permission Management",
  "MODULE-6": "Live Session"
};

export function MediaFilterDialog({
  open,
  onOpenChange,
  onApplyFilter,
}: MediaFilterDialogProps) {
  const [filters, setFilters] = useState<FilterState>({
    sorting: null,
    moduleName: [],
    status: null,
  });

  const handleModuleToggle = (module: string) => {
    setFilters((prev) => ({
      ...prev,
      moduleName: prev.moduleName.includes(module)
        ? prev.moduleName.filter((m) => m !== module)
        : [...prev.moduleName, module],
    }));
  };

  const handleClearAll = () => {
    setFilters({
      sorting: null,
      moduleName: [],
      status: null,
    });
  };

  const handleSortingSelect = (value: "asc" | "desc") => {
    setFilters((prev) => ({
      ...prev,
      sorting: prev.sorting === value ? null : value,
    }));
  };

  const handleStatusSelect = (value: "Active" | "Inactive") => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status === value ? null : value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 text-white border-neutral-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Refine by</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Sorting Section */}
          <div>
            <h3 className="text-2xl mb-4">Sorting</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleSortingSelect("asc")}
                className={`border border-neutral-600 h-14 ${
                  filters.sorting === "asc"
                    ? "bg-neutral-700 border-white"
                    : "bg-transparent"
                }`}
              >
                A-Z
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSortingSelect("desc")}
                className={`border border-neutral-700 h-14 ${
                  filters.sorting === "desc"
                    ? "bg-neutral-700 border-white"
                    : "bg-transparent"
                }`}
              >
                Z-A
              </Button>
            </div>
          </div>

          {/* Module Name Section */}
          <div>
            <h3 className="text-2xl mb-4">Module Name</h3>
            <div className="grid grid-cols-2 gap-4">
              {MODULE_NAMES.map((module) => (
                <Button
                  key={module}
                  variant="outline"
                  onClick={() => handleModuleToggle(module)}
                  className={`border border-neutral-700 h-14 ${
                    filters.moduleName.includes(module)
                      ? "bg-neutral-700 border-white"
                      : "bg-transparent"
                  }`}
                >
                  {MODULE_DISPLAY_NAMES[module]}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Section */}
          <div>
            <h3 className="text-2xl mb-4">Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleStatusSelect("Active")}
                className={`border border-neutral-700 h-14 ${
                  filters.status === "Active"
                    ? "bg-neutral-700 border-white"
                    : "bg-transparent"
                }`}
              >
                Active
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusSelect("Inactive")}
                className={`border border-neutral-700 h-14 ${
                  filters.status === "Inactive"
                    ? "bg-neutral-700 border-white"
                    : "bg-transparent"
                }`}
              >
                Inactive
              </Button>
            </div>
          </div>

          {/* Footer Buttons */}
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
                onApplyFilter(filters);
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