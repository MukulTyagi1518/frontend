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

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filters: FilterState) => void;
}

interface FilterState {
  sorting: "A_Z" | "Z-A" | null;
  date: {
    from: Date | null;
    to: Date | null;
  };
  responsiblePerson: string;
  stage: string;
}

const Responsible_person = ["Nikita Jain", "Zoffi Khan", "Aniriddha Teke"];
const Stages = ["Completed", "Pending", "New", "In Progress", "Urgent"];

export function QueryFilter({ open, onOpenChange, onApplyFilter }: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterState>({
    sorting: null,
    date: {
      from: null,
      to: null,
    },
    responsiblePerson: "",
    stage: "",
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleClearAll = () => {
    setFilters({
      sorting: null,
      date: {
        from: null,
        to: null,
      },
      responsiblePerson: "",
      stage: "",
    });
    window.location.reload();
  };

  const updateResponsiblePerson = (person: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      responsiblePerson: person,
    }));
  };

  const updateStage = (newStage: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      stage: newStage,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#262626] h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 text-white border-neutral-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Filter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="border-b border-b-neutral-700 pb-4">
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
                    filters.sorting === "A_Z" ? "bg-neutral-700 border-white" : ""
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
                    filters.sorting === "Z-A" ? "bg-neutral-700 border-white" : ""
                  }`}
                >
                  <RadioGroupItem value="Z-A" id="z-a" className="sr-only" />
                  Z-A
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-b border-b-neutral-700 pb-4">
            <h3
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="text-xl mb-4 cursor-pointer flex items-center"
            >
              Date {isCalendarOpen ? "▼" : "▶"}
            </h3>
            {isCalendarOpen && (
              <div>
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
                  className="rounded-xl m-auto"
                  numberOfMonths={1}
                  defaultMonth={new Date()}
                />
              </div>
            )}
          </div>

          <div className="border-b border-b-neutral-700 pb-4">
            <h3 className="text-xl mb-4">Responsible Person</h3>
            <div>
              {Responsible_person.map((person) => (
                <div className="flex gap-2" key={person}>
                  <label>
                    <input
                      type="radio"
                      name="responsibleperson"
                      value={person}
                      checked={filters.responsiblePerson === person}
                      onChange={() => updateResponsiblePerson(person)}
                    />
                    {person}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-b-neutral-700 pb-4">
            <h3 className="text-xl mb-4">Stages</h3>
            <div>
              {Stages.map((stage) => (
                <div className="flex gap-2" key={stage}>
                  <label>
                    <input
                      type="radio"
                      name="stage"
                      value={stage}
                      checked={filters.stage === stage}
                      onChange={() => updateStage(stage)}
                    />
                    {stage}
                  </label>
                </div>
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
                  sorting: filters.sorting,
                  responsiblePerson: filters.responsiblePerson,
                  stage: filters.stage,
                  date: filters.date, // Keeping date as it is in FilterState
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

export default QueryFilter;
