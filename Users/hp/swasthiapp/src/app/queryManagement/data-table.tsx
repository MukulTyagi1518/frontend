"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast/toast-context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
const API_URL = process.env.NEXT_PUBLIC_API_URL_2;
import Cookies from "js-cookie";
import { QueryFilter } from "@/components/ui/queryFilter";

const idToken = Cookies.get("id_token");
const refreshToken = Cookies.get("refresh_token");
const username = Cookies.get("username");

export type Query = {
  _id: string;
  query_ID: string;
  full_name: string;
  email: string;
  mobnum: string; 
  issuetype: string;
  query_status: string;  
  attachment: string;  
  message: string;  
  createdAt: string;
};

export function DataTableDemo() {
  const { showToast } = useToast();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tableData, setTableData] = useState<Query[]>([]);
  const [filterParams, setFilterParams] = useState({
    sorting: "",
    responsiblePerson: "",
    stage: "",
    startDate: "",
    endDate: "",
  });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedItems(new Set(selectedIds)); // Store selected IDs
  };
  
  const useQueryData = (page: number, search: string) => {
    const searchQueries = search
      .split(/\s+(?=\w+:)/)
      .map((query) => {
        const [key, ...valueParts] = query.split(":");
        return [key, valueParts.join(":")];
      })
      .filter(([key, value]) => key && value)
      .reduce((acc, [key, value]) => {
        acc[key as keyof Query] = value.toLowerCase();
        return acc;
      }, {} as Partial<Record<keyof Query, string>>);
      
      const filteredData = tableData.filter((item) =>
      Object.entries(searchQueries).every(([key, value]) => {
        const itemValue = item[key as keyof Query];
        return itemValue?.toString().toLowerCase().includes(value);
      })
    );

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(start, start + pageSize);

    return {
      data: paginatedData,
      totalPages: Math.ceil(filteredData.length / pageSize),
    };
  };

  interface FilterParams {
    sorting: string,
    responsiblePerson: string,
    stage: string,
    startDate: string,
    endDate: string,
  }

  const fetchTableData = async (params: FilterParams) => {
    try {
      let url = `${API_URL}/queryManagement/getAllQuery`;

      // If there are filter parameters, use the filter API instead
      if (Object.keys(params).length > 0) {
        url = `${API_URL}/queryManagement/getAllQuery`;
        const queryParams = new URLSearchParams();

        if (params.sorting) queryParams.append("sorting", params.sorting);
         if (params.responsiblePerson) queryParams.append("responsiblePerson", params.responsiblePerson);  // ---
         if (params.stage) queryParams.append("stage", params.stage);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
         url += `?${queryParams.toString()}`;
      }

      console.log("URL FOR FILTER: " , url);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "x-refresh-token": refreshToken || "",
          "x-username": username || "",
        },
      });

      const data = await response.json();
      console.log(data.data);
      if (data.success) {
        setTableData(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to fetch media data",
        actionText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchTableData(filterParams);
  }, [filterParams]);

  const handleFilterApply = (filters: any) => {
    console.log("datas: ", filters);
    
    setFilterParams(filters);
    fetchTableData(filters);
  };
  const router = useRouter();

  const columns = [

    { key: "query_ID", header: "QUERY ID" },
    { key: "fullName", header: "NAME" },
    { key: "email", header: "EMAIL ID" },
    { key: "mobNum", header: "PHONE NO." },
    { key: "createdAt", header: "DATE & TIME" },
    { key: "query_status", header: "STAGE" },
    // { key: "details", header: "DETAILS" }, 
  ];

  const handleDetailsClick = (item: Query) => {
    console.log(item.query_ID);
    router.push(`/queryManagement/respondQuery/${item.query_ID}`);
  };
  const handleDelete = async () => {
    if (selectedItems.size === 0) {
      showToast({
        type: "error",
        title: "No selection",
        description: "Please select a media item to delete.",
        actionText: "OK",
      });
      return;
    }

    try {
      await Promise.all(
        [...selectedItems].map(async (query_ID) => {
          console.log(query_ID);

         const response = await fetch(
              `${API_URL}/queryManagement/deleteQuery/${query_ID}`,
              {
                method: "DELETE",
              }
            );

          if (!response.ok)
            throw new Error(`Failed to delete media: ${query_ID}`);
        })
      );

      // Remove deleted items from table data
      fetchTableData(filterParams);
      setTableData((prevData) =>
        prevData.filter((item) => !selectedItems.has(item.query_ID))
      );

      showToast({
        type: "success",
        title: "Deleted",
        description: "Selected media deleted successfully.",
        actionText: "OK",
        onAction() {
          window.location.reload();
        },
      });

      setSelectedItems(new Set()); // Clear selection after delete
    } catch (error) {
      console.error("Delete error:", error);
      showToast({
        type: "error",
        title: "Error",
        description: "Error in deleting.",
        actionText: "OK",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Buttons above the table */}
      <div className="flex items-center justify-between py-4 px-4">
        {/* Left-aligned button */}
        <div className="flex items-center">
          {/* Action Button */}

          {/* ShadCN Select Component */}
          <Select
            onValueChange={(value) => {
              if (value === "delete") {
                handleDelete();
              }
            }}
          >
            <SelectTrigger className="w-56 bg-neutral-800 text-neutral-200 rounded-md">
              <SelectValue placeholder="Action on Selected Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delete">Delete</SelectItem>
            </SelectContent>
          </Select>
          
        </div>

        {/* Right-aligned buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsFilterOpen(true)}
            className="bg-[rgba(38,38,38,1)] text-white flex items-center space-x-2 hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <path
                d="M10 2.16669C8.35185 2.16669 6.74068 2.65543 5.37027 3.57111C3.99986 4.48679 2.93176 5.78827 2.30103 7.31099C1.6703 8.83371 1.50527 10.5093 1.82681 12.1258C2.14836 13.7423 2.94203 15.2271 4.10747 16.3926C5.27291 17.558 6.75776 18.3517 8.37427 18.6732C9.99078 18.9948 11.6663 18.8297 13.1891 18.199C14.7118 17.5683 16.0133 16.5002 16.9289 15.1298C17.8446 13.7594 18.3334 12.1482 18.3334 10.5C18.3309 8.29063 17.4522 6.17242 15.8899 4.61014C14.3276 3.04787 12.2094 2.16911 10 2.16669ZM13.3184 13.8184C13.1621 13.9746 12.9502 14.0623 12.7292 14.0623C12.5082 14.0623 12.2963 13.9746 12.14 13.8184L9.41169 11.09C9.25581 10.9331 9.16783 10.7212 9.16669 10.5V7.16669C9.16669 6.94567 9.25449 6.73371 9.41077 6.57743C9.56705 6.42115 9.77901 6.33335 10 6.33335C10.221 6.33335 10.433 6.42115 10.5893 6.57743C10.7456 6.73371 10.8334 6.94567 10.8334 7.16669V10.155L13.3184 12.64C13.4746 12.7963 13.5623 13.0082 13.5623 13.2292C13.5623 13.4502 13.4746 13.6621 13.3184 13.8184Z"
                fill="#FAFAFA"
              />
            </svg>
            <span>Filter by</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <QueryFilter
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            onApplyFilter={handleFilterApply}
          />
        </div>
      </div>

      {/* Dynamic Table */}
      <DynamicTable
        columns={columns}
        headerColor="#1a1a1a"
        useData={useQueryData}
        showBorder={false}
        showDetailsColumn={true}
        onDetailsClick={handleDetailsClick}
        uniqueKey="_id"     
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
