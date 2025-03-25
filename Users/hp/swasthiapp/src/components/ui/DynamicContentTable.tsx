"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Edit, Search } from "lucide-react";

interface Column {
  key: string;
  header: string;
}

interface DynamicTableProps {
  columns: Column[];
  headerColor: string;
  useData: (
    page: number,
    search: string
  ) => { data: any[]; totalPages: number };
  showBorder?: boolean;
  showDetailsColumn?: boolean;
  onDetailsClick?: (item: any) => void;
  uniqueKey: string;
  customStyles?: {
    columnKey: string;
    condition: (value: string) => boolean;
    styles: { color?: string; border?: string; padding?: string, backgroundColor?: string;};
    
  }[];
  showTimeRange?: boolean;

  onSelectionChange?: (selectedIds: string[]) => void; // ✅ New prop
}
function getFormattedTimeRange(dateTime: string, duration: number): string {
  const [date, time, period] = dateTime.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  // Convert to 24-hour format for calculation
  const startHours = period === "PM" && hours < 12 ? hours + 12 : hours;
  const startDate = new Date();
  startDate.setHours(startHours, minutes);

  // Calculate end time by adding the duration (in minutes)
  const endDate = new Date(startDate.getTime() + duration * 60000);

  // Format the end time back to 12-hour format
  const endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes();
  const endPeriod = endHours >= 12 ? "PM" : "AM";
  const formattedEndHours = endHours % 12 || 12;

  return `${time} ${period} - ${formattedEndHours}:${endMinutes
    .toString()
    .padStart(2, "0")} ${endPeriod}`;
}

export default function DynamicTable({
  columns,
  headerColor,
  useData,
  showBorder = true,
  showDetailsColumn = true,
  onDetailsClick,
  uniqueKey,
  customStyles = [],
  
  showTimeRange = true,
  onSelectionChange, // ✅ New prop
}: DynamicTableProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [page, setPage] = useState(1); // Initially set to 1, updated dynamically

  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    Object.fromEntries(columns.map((col) => [col.key, ""]))
  );

  const searchQuery = Object.entries(searchQueries)
    .filter(([_, value]) => value.trim() !== "")
    .map(([key, value]) => `${key}:${value}`)
    .join(" ");

  const { data, totalPages } = useData(page, searchQuery);
  const handleSearchChange = (field: string, value: string) => {
    setSearchQueries({ ...searchQueries, [field]: value });
  };

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows = checked
      ? new Set(data.map((item) => item[uniqueKey]))
      : new Set();
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(Array.from(newSelectedRows)); // ✅ Notify parent
  };

  const toggleRowSelection = (id: string) => {
    const updatedSelectedRows = new Set(selectedRows);
    updatedSelectedRows.has(id)
      ? updatedSelectedRows.delete(id)
      : updatedSelectedRows.add(id);
    setSelectedRows(updatedSelectedRows);
    onSelectionChange?.(Array.from(updatedSelectedRows)); // ✅ Notify parent
  };

  // Handle Page Change (Reversed)
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Pagination Buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 3;
  
    const addEllipsis = (key: string) => (
      <Button
        key={key}
        disabled
        className="rounded-none bg-transparent border border-[#525252] text-gray-400 cursor-default"
      >
        ...
      </Button>
    );
  
    const addPageButton = (pageNum: number) => (
      <Button
        key={pageNum}
        variant={page === pageNum ? "default" : "outline"}
        onClick={() => handlePageChange(pageNum)}
        className="rounded-none border-[#525252]"
      >
        {pageNum}
      </Button>
    );
  
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(addPageButton(i));
      }
    } else {
      if (page <= 3) {
        // First three pages
        buttons.push(addPageButton(1));
        buttons.push(addPageButton(2));
        buttons.push(addPageButton(3));
        buttons.push(addEllipsis("ellipsis-end"));
        buttons.push(addPageButton(totalPages));
      } else if (page >= totalPages - 2) {
        // Last three pages
        buttons.push(addPageButton(1));
        buttons.push(addEllipsis("ellipsis-start"));
        buttons.push(addPageButton(totalPages - 2));
        buttons.push(addPageButton(totalPages - 1));
        buttons.push(addPageButton(totalPages));
      } else {
        // Middle pages (fixing ellipsis position)
        buttons.push(addPageButton(page - 1));
        buttons.push(addPageButton(page));
        buttons.push(addPageButton(page + 1));
        buttons.push(addEllipsis("ellipsis-end"));
        buttons.push(addPageButton(totalPages));
      }
    }
  
    return buttons;
  };
  
  // Handling Prev & Next Arrows in Reverse Order
  // Pagination Arrow Functions
  const handlePrevPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  const customCellRender = (value: string, columnKey: string) => {
    if (columnKey === "dateTime") {
      // Check if the value contains the expected format with "|"
      if (!value.includes("|")) {
        return <div>Invalid Date/Time</div>;
      }

      const [date, timeRange] = value.split(" | "); // Split by " | "

      if (!timeRange) {
        return (
          <div>
            <div>{date}</div>
            <div>No Time Available</div>
          </div>
        );
      }

      return (
        <div>
          <div>{date}</div>
          <div>{timeRange}</div>
        </div>
      );
    }

    // Handle custom styles for other columns
    const matchingStyles = customStyles
      .filter(
        (style) => style.columnKey === columnKey && style.condition(value)
      )
      .map((style) => style.styles);

    const mergedStyles = matchingStyles.reduce(
      (acc, current) => ({ ...acc, ...current }),
      {}
    );

    if (Object.keys(mergedStyles).length > 0) {
      return (
        <div
          style={{
            ...mergedStyles,
            display: "inline-block",
            borderRadius: "4px",
            backgroundColor: mergedStyles.backgroundColor || "transparent",
          }}
        >
          {value}
        </div>
      );
    }

    return value; // Default case
  };

  const [sortColumn, setSortColumn] = useState<string>(uniqueKey); // Sorting based on unique key
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Reverse Pagination - Start from the last page
  const lastPage = Math.max(totalPages, 1);
  const [currentPage, setCurrentPage] = useState<number>(lastPage);
  // Ensure pagination updates from last to first

  // Set initial page to the last page when totalPages is available
  useEffect(() => {
    if (totalPages > 0) {
      setPage(1); // Move to the last page initially
    }
  }, [totalPages]);

  // Sort Data Before Rendering
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortColumn] || "";
    const bValue = b[sortColumn] || "";

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div
      className={`py-4 ${
        showBorder ? "border border-neutral-700" : ""
      }`}
    >
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: headerColor }}>
            
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className="text-center text-white cursor-pointer"
                onClick={() => {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  setSortColumn(column.key);
                }}
              >
                {column.header}{" "}
                {sortColumn === column.key
                  ? sortOrder === "asc"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </TableHead>
            ))}
            {showDetailsColumn && (
              <TableHead className="text-center text-white">DETAILS</TableHead>
            )}
          </TableRow>

        
        </TableHeader>

        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item[uniqueKey]}>
             
              {columns.map((column, index) => (
                <TableCell key={index} className="text-center">
                  {customCellRender(item[column.key], column.key)}
                </TableCell>
              ))}
              {showDetailsColumn && (
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-gray-200"
                    onClick={() => onDetailsClick?.(item)}
                  >
                    <Edit className="h-5 w-5 text-[#fafafa]" strokeWidth={2} />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4 p-4 text-gray-400">
        <div>
          Showing {(page - 1) * 9 + 1} to {Math.min(page * 9, totalPages * 9)}{" "}
          of {totalPages * 9} Entries
        </div>
        <div className="flex items-center divide-x divide-gray-600">
          <Button
            variant="outline"
            onClick={handlePrevPage} // ✅ Moves to previous page
            disabled={page <= 1}
            className="rounded-r-none border-r-0 border-[#525252]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPaginationButtons()}

          <Button
            variant="outline"
            onClick={handleNextPage} // ✅ Moves to next page
            disabled={page >= totalPages}
            className="rounded-l-none border-l-0 border-[#525252]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}