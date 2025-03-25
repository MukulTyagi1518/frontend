"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { AdminUser as AdminUserType } from "./useAdminUserData";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronDown } from "lucide-react";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { FilterDialog } from "@/components/ui/filterToast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type AdminUser = {
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  appType: string;
  status: string;
  date: string;
  USR_ID: string;
};

const columns: { key: keyof Omit<AdminUser, "details">; header: string }[] = [
  { key: "name", header: "USER NAME" },
  { key: "role", header: "ROLE NAME" },
  { key: "email", header: "MAIL ID" },
  { key: "phoneNumber", header: "PHONE NUMBER" },
  { key: "date", header: "DATE" },
  { key: "status", header: "STATUS" },
];

export default function AccessControlManagementPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchAdminUsers = async (
    page: number,
    search: string
  ): Promise<{ adminUsers: AdminUser[]; totalPages: number }> => {
    try {
      // Fetch data from the API
      const response = await fetch(
        `${API_URL}/fitnearn/web/admin/access/users/get/all`
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
        return {
          name: item.name || "",
          email: item.email || "",
          phoneNumber: item.phoneNumber || "",
          appType: item.appType || "",
          status: item.status || "",
          role: item.role || "",
          USR_ID: item.USR_ID || "",
          date: item.createdAt ? formatAPIDate(item.createdAt) : "",
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

  const handleDetailsClick = (item: AdminUser) => {
    router.push(
      `/accessControlManagement/adminUser/userDetails/${item.USR_ID}`
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

        <div className="container mx-auto py-10 pt-24 pr-5 pl-[280px]">
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
            <h1 className="text-xl font-bold text-white">Admin Users</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-2 mb-1">
            {/* ShadCN Select Component */}
            <Select
              onValueChange={(value) => {
                if (value === "view") {
                  router.push("/bookingManagement/detail/ffd");
                } else if (value === "edit") {
                  router.push("/bookingManagement/detail/ffd");
                } else if (value === "delete") {
                  console.log("Delete action triggered");
                  // Add your delete logic here
                }
              }}
            >
              <SelectTrigger className="w-56 border border-none bg-neutral-800 text-neutral-200 rounded-md">
                <SelectValue placeholder="Action on Selected rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  onClick={() => {
                    router.push("/bookingsManagement/detail/ffd");
                  }}
                  value="view"
                >
                  View
                </SelectItem>
                <SelectItem
                  onClick={() => {
                    router.push("/bookingsManagement/detail/ffd");
                  }}
                  value="edit"
                >
                  Edit
                </SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            {/* Add User Button */}
            <Button
              className="bg-neutral-800 text-white flex items-center hover:bg-gray-700"
              onClick={() =>
                router.push("/accessControlManagement/adminUser/createUser")
              }
            >
              Add User
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>

          {/* Dynamic Table */}
          <DynamicTable
            columns={columns}
            headerColor="#1a1a1a"
            useData={useAdminUserData}
            showBorder={false}
            showDetailsColumn={true}
            onDetailsClick={handleDetailsClick}
            uniqueKey="userName"
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