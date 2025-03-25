"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, PlusCircle } from "lucide-react";
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
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";

import { ImportMediaDialog } from "@/components/ui/ImportMediaDialog";
import { FilterDialog } from "@/components/ui/filterToast";

export type Media = {
  _id: string;
  mediaId: string;
  id: string;
  name: string; // MEDIA NAME
  date: string; // DATE
  category: string; // CATEGORY
  format: string; // MEDIA FORMAT
  status: string; // STATUS
  createdAt: string;
  updatedAt: string;
  roleId: string; // Add roleId to Media type
};

export function DataTableDemo() {
  const { showToast } = useToast();
  const idToken = Cookies.get("id_token");
  const refreshToken = Cookies.get("refresh_token");
  const username = Cookies.get("username");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tableData, setTableData] = useState<Media[]>([]);
  const [filterParams, setFilterParams] = useState<{
    category?: string;
    startDate?: string;
    endDate?: string;
    sortOrder?: string;
  }>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedItems(new Set(selectedIds)); // Store selected IDs
  };
  const useMediaData = (page: number, search: string) => {
    const searchQueries = search
      .split(/\s+(?=\w+:)/)
      .map((query) => {
        const [key, ...valueParts] = query.split(":");
        return [key, valueParts.join(":")];
      })
      .filter(([key, value]) => key && value)
      .reduce((acc, [key, value]) => {
        acc[key as keyof Media] = value.toLowerCase();
        return acc;
      }, {} as Partial<Record<keyof Media, string>>);

    const filteredData = tableData.filter((item) =>
      Object.entries(searchQueries).every(([key, value]) => {
        const itemValue = item[key as keyof Media];
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
    category?: string;
    startDate?: string;
    endDate?: string;
    sortOrder?: string;
  }

  const fetchTableData = async (params: FilterParams = {}) => {
    try {
      let url = `${API_URL}/fitnearn/web/admin/access/role/get-all`;

      // If there are filter parameters, use the filter API instead
      if (Object.keys(params).length > 0) {
        url = `${API_URL}/fitnearn/web/admin/getFilteredData`;
        const queryParams = new URLSearchParams();

        if (params.category) queryParams.append("category", params.category);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "x-refresh-token": refreshToken || "",
          "x-username": username || "",
        },
      });

      const data = await response.json();
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
    fetchTableData();
  }, []);

  const handleFilterApply = (filters: FilterParams) => {
    setFilterParams(filters);
    fetchTableData(filters);
  };

  const router = useRouter();

  const columns = [
    { key: "roleName", header: "ROLE NAME" },
    { key: "roleId", header: "ROLE ID" },
    { key: "roleDesc", header: "ROLE DESCRIPTION" },
    { key: "isActive", header: "STATUS" },
  ];

  const handleDetailsClick = (item: Media) => {
    router.push(
      `/accessControlManagement/rolesManagement/details/${item.roleId}`
    );
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
        [...selectedItems].map(async (mediaId) => {
          const response = await fetch(
            `${API_URL}/fitnearn/web/admin/access/role/delete/${mediaId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok)
            throw new Error(`Failed to delete Roles: ${mediaId}`);
        })
      );

      // Remove deleted items from table data
      setTableData((prevData) =>
        prevData.filter((item) => !selectedItems.has(item.mediaId))
      );

      showToast({
        type: "success",
        title: "Deleted",
        description: "Selected Roles deleted successfully.",
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
        <div className="flex items-center space-x-4">
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
            className="bg-[rgba(38,38,38,1)] text-white flex items-center space-x-2 hover:bg-gray-700"
            onClick={() =>
              router.push("/accessControlManagement/rolesManagement/create")
            }
          >
            <span>New</span>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dynamic Table */}
      <DynamicTable
        columns={columns}
        headerColor="#1a1a1a"
        useData={useMediaData}
        showBorder={false}
        showDetailsColumn={true}
        onDetailsClick={handleDetailsClick}
        uniqueKey="roleId"
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
