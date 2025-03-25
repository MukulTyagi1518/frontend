"use client";

import { useRouter } from "next/navigation";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { FilterDialog } from "@/components/ui/filterToast";
import { useEffect, useState } from "react";
import { MediaFilterDialog } from "@/components/ui/MediaFilterDialog";

type AdminUser = {
  permissionName: string;
  description: string;
  moduleName: string;
  state: string;
  date: string;
  status: string;
  select?: boolean;
  permissionID: string; // Add this field
};

const columns: { key: keyof Omit<AdminUser, "details">; header: string }[] = [
  { key: "permissionName", header: "PERMISSION NAME" },
  { key: "moduleName", header: "MODULE NAME" },
  { key: "description", header: "DESCRIPTION" },
  { key: "status", header: "STATUS" },
];

export default function AccessControlManagementPage() {
  const router = useRouter();
  const [tableData, setTableData] = useState<AdminUser[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterApply = async (filters: {
    moduleName?: string[];
    status?: "Active" | "Inactive" | null;
    sorting?: "asc" | "desc" | null;
  }) => {
    let url = `${API_URL}/fitnearn/web/admin/access/permissions/get-all?`;

    const params = new URLSearchParams();

    if (filters.moduleName && filters.moduleName.length > 0) {
      params.append("moduleName", filters.moduleName.join(""));
    }
    if (filters.status) {
      params.append("status", filters.status);
    }
    if (filters.sorting) {
      params.append("sortOrder", filters.sorting);
    }

    url += params.toString();

    try {
      const response = await fetch(url, {});

      const data = await response.json();
      if (data.success) {
        setTableData(data.data);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchAdminUsers = async (
    page: number,
    search: string
  ): Promise<{ adminUsers: AdminUser[]; totalPages: number }> => {
    try {
      // Fetch data from the API
      const response = await fetch(
        `${API_URL}/fitnearn/web/admin/access/permissions/get-all`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch admin users");
      }

      const result = await response.json();

      // Check if the response has the expected structure
      if (!result.success || !result.data) {
        throw new Error("Invalid response format");
      }

      // Access the actual data array from the response
      const data = result.data;
      console.log(data);
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
        return { adminUsers: [], totalPages: 0 };
      }

      // Helper function to format ISO date to MM-DD-YYYY
      const formatAPIDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${month}-${day}-${year}`;
      };

      // Map API data to AdminUser array
      const allAdminUsers: AdminUser[] = data.map((item: any) => {
        // Add null checks for nested objects
        const permission = item.permission || {};
        const module = item.module || {};

        return {
          permissionName: permission.permissionName || "",
          permissionID: permission.permissionID, // Add this line

          description: permission.description || "",
          moduleName: module.moduleName || "",
          state: permission.state || "",
          date: item.createdAt ? formatAPIDate(item.createdAt) : "",
          status: permission.status || "",
        };
      });

      // Parse search queries
      const searchQueries = search
        .split(/\s+(?=\w+:)/)
        .map((query) => {
          const [key, ...valueParts] = query.split(":");
          return [key.trim(), valueParts.join(":").trim()];
        })
        .filter(([key, value]) => key && value)
        .reduce((acc, [key, value]) => {
          const typedKey = key as keyof AdminUser;
          acc[typedKey] = value.toLowerCase();
          return acc;
        }, {} as Partial<Record<keyof AdminUser, string>>);

      // Filter admin users
      const filteredAdminUsers = allAdminUsers.filter((user) =>
        Object.entries(searchQueries).every(([key, value]) => {
          const userValue = user[key as keyof AdminUser];
          return userValue?.toString().toLowerCase().includes(value);
        })
      );

      const usersPerPage = 10;
      const totalPages = Math.ceil(filteredAdminUsers.length / usersPerPage);
      const paginatedAdminUsers = filteredAdminUsers.slice(
        (page - 1) * usersPerPage,
        page * usersPerPage
      );

      return { adminUsers: paginatedAdminUsers, totalPages };
    } catch (error) {
      console.error("Error fetching admin users:", error);
      return { adminUsers: [], totalPages: 0 };
    }
  };

  function useAdminUserData(
    page: number,
    search: string
  ): {
    data: AdminUser[];
    totalPages: number;
    error?: string;
    loading: boolean;
  } {
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      fetchAdminUsers(page, search)
        .then(({ adminUsers, totalPages }) => {
          setAdminUsers(adminUsers);
          setTotalPages(totalPages);
          setError(undefined);
        })
        .catch((err) => {
          setError(err.message);
          setAdminUsers([]);
          setTotalPages(0);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [page, search]);

    return { data: adminUsers, totalPages, error, loading };
  }

  useEffect(() => {
    fetchAdminUsers(1, ""); // Provide default arguments for page and search
  }, []);

  const handleDetailsClick = (item: AdminUser) => {
    router.push(
      `/accessControlManagement/permissionManagement/details/${item.permissionID}`
    );
  };

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div
        className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${
          isOpen ? "pl-60" : "pl-16"
        }`} // Adjust padding based on sidebar state
      >
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="container mx-auto py-10 pt-10 pr-10 pl-[60px]">
          {/* Header */}
          <div className="flex items-center mb-6 space-x-4">
            <span
              className="cursor-pointer flex items-center"
              onClick={() => router.back()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M14.653 19C14.3001 18.9999 13.9617 18.8526 13.7122 18.5903L8.3896 12.9972C8.14014 12.735 8 12.3794 8 12.0086C8 11.6378 8.14014 11.2822 8.3896 11.02L13.7122 5.42688C13.835 5.29333 13.9818 5.1868 14.1441 5.11352C14.3065 5.04024 14.4811 5.00167 14.6578 5.00005C14.8345 4.99844 15.0097 5.03382 15.1732 5.10412C15.3368 5.17443 15.4853 5.27826 15.6103 5.40955C15.7352 5.54084 15.834 5.69696 15.9009 5.8688C15.9678 6.04064 16.0015 6.22477 16 6.41043C15.9984 6.5961 15.9617 6.77958 15.892 6.95017C15.8222 7.12077 15.7209 7.27506 15.5938 7.40405L11.2119 12.0086L15.5938 16.6131C15.7798 16.8087 15.9065 17.0578 15.9578 17.329C16.0091 17.6002 15.9828 17.8813 15.8821 18.1368C15.7814 18.3922 15.6109 18.6106 15.3921 18.7643C15.1733 18.9179 14.9161 18.9999 14.653 19Z"
                  fill="#FAFAFA"
                />
              </svg>
            </span>
            <h1 className="text-xl font-bold">Access Control Management</h1>
            <span className="text-white text-2xl font-bold">›</span>
            <h1 className="text-xl font-bold text-white">Permissions</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-2 mb-1">
            {/* ShadCN Select Component */}
            <Button className="bg-neutral-800 text-white align-middle items-center text-center flex items-center hover:bg-gray-700">
              <Trash className="h-5 w-5" />
              Remove Permission
            </Button>

            {/* Add User Button */}
            <div className="flex gap-4">
              <Button
                onClick={() => setIsFilterOpen(true)}
                className="bg-neutral-800 text-white align-middle items-center text-center flex items-center hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M9.99996 2.16699C8.35179 2.16699 6.74062 2.65573 5.37021 3.57141C3.9998 4.48709 2.9317 5.78858 2.30097 7.3113C1.67024 8.83401 1.50521 10.5096 1.82675 12.1261C2.1483 13.7426 2.94197 15.2274 4.10741 16.3929C5.27284 17.5583 6.7577 18.352 8.37421 18.6735C9.99072 18.9951 11.6663 18.8301 13.189 18.1993C14.7117 17.5686 16.0132 16.5005 16.9289 15.1301C17.8446 13.7597 18.3333 12.1485 18.3333 10.5003C18.3309 8.29093 17.4521 6.17273 15.8898 4.61045C14.3276 3.04817 12.2094 2.16942 9.99996 2.16699ZM13.3183 13.8187C13.162 13.9749 12.9501 14.0626 12.7291 14.0626C12.5082 14.0626 12.2962 13.9749 12.14 13.8187L9.41163 11.0903C9.25575 10.9334 9.16776 10.7215 9.16663 10.5003V7.16699C9.16663 6.94598 9.25443 6.73402 9.41071 6.57774C9.56699 6.42146 9.77895 6.33366 9.99996 6.33366C10.221 6.33366 10.4329 6.42146 10.5892 6.57774C10.7455 6.73402 10.8333 6.94598 10.8333 7.16699V10.1553L13.3183 12.6403C13.4745 12.7966 13.5623 13.0085 13.5623 13.2295C13.5623 13.4505 13.4745 13.6624 13.3183 13.8187Z"
                    fill="#FAFAFA"
                  />
                </svg>
                Filter By
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M10.0143 13.8337C9.7049 13.8336 9.4082 13.7167 9.18946 13.5088L4.5228 9.07341C4.41137 8.97112 4.32249 8.84877 4.26134 8.71348C4.2002 8.5782 4.16802 8.4327 4.16667 8.28547C4.16532 8.13824 4.19484 7.99223 4.2535 7.85595C4.31216 7.71968 4.39879 7.59588 4.50833 7.49176C4.61788 7.38765 4.74814 7.30532 4.89152 7.24956C5.03489 7.19381 5.18852 7.16575 5.34343 7.16703C5.49834 7.16831 5.65143 7.1989 5.79377 7.25702C5.93611 7.31513 6.06484 7.3996 6.17246 7.50551L10.0143 11.1569L13.8561 7.50551C14.0762 7.30352 14.3709 7.19176 14.6768 7.19429C14.9827 7.19681 15.2753 7.31343 15.4916 7.51902C15.7079 7.7246 15.8306 8.00272 15.8332 8.29345C15.8359 8.58418 15.7183 8.86428 15.5058 9.07341L10.8391 13.5088C10.6204 13.7167 10.3237 13.8336 10.0143 13.8337Z"
                    fill="#FAFAFA"
                  />
                </svg>
              </Button>
              <MediaFilterDialog
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApplyFilter={handleFilterApply}
              />
              <Button
                className="bg-neutral-800 text-white flex items-center hover:bg-gray-700"
                onClick={() =>
                  router.push(
                    "/accessControlManagement/permissionManagement/create"
                  )
                }
              >
                New
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Dynamic Table */}
          <DynamicTable
            columns={columns}
            headerColor="#1a1a1a"
            useData={useAdminUserData}
            showBorder={false}
            showDetailsColumn={true}
            onDetailsClick={handleDetailsClick}
            uniqueKey="permissionName"
            customStyles={[
              {
                columnKey: "status",
                condition: (value) => value === "Active",
                styles: {
                  color: "#4ADE80",
                  border: "1px solid #4ADE80",
                  padding: "2px 4px",
                },
              },
              {
                columnKey: "status",
                condition: (value) => value === "Inactive",
                styles: {
                  color: "#F87171",
                  border: "1px solid #F87171",
                  padding: "2px 4px",
                },
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
