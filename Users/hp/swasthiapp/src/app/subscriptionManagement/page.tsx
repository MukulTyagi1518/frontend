"use client";

import { useRouter } from "next/navigation";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { useState, useEffect } from "react";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { useToast } from "@/components/ui/toast/toast-context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { ChevronDown, Clock } from "lucide-react";
import { SubscriptionFilter } from "@/components/ui/SubscriptionFilter";
const apiForTable = process.env.NEXT_PUBLIC_API_URL_2;

const columns: {
  key: keyof Omit<SubscriptionPlan, "SUBS_ID">;
  header: string;
}[] = [
  { key: "subsId", header: "PLAN ID" },
  { key: "planName", header: "PLAN NAME" },
  { key: "duration", header: "DURATION" },
  { key: "features", header: "FEATURES" },
  { key: "price", header: "PRICE" },
  { key: "status", header: "STATUS" },
];
type SubscriptionPlan = {
  SUBS_ID: string;
  planId: number; // Unique Plan ID
  planName: string; // Subscription Plan Name
  duration: string; // Plan Duration (Period)
  features: string; // Features (Converted to string)
  price: string; // Plan Price (Formatted)
  status: string; // Status (Derived from price)
  subsId: string; // Subscription ID (Used for navigation)
};

export default function SubscriptionManagementTable() {
  type SubscriptionPlan = {
    SUBS_ID: string;
    planId: number; // Unique Plan ID
    planName: string; // Subscription Plan Name
    duration: string; // Plan Duration (Period)
    features: string; // Features (Converted to string)
    price: string; // Plan Price (Formatted)
    status: string; // Status (Derived from price)
    subsId: string; // Subscription ID (Used for navigation)
  };

  function useSubscriptionData(
    page: number,
    filters: FilterState
  ): { data: SubscriptionPlan[]; totalPages: number } {
    const [data, setData] = useState<SubscriptionPlan[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
      const fetchSubscriptionPlans = async () => {
        try {
          // Construct query parameters
          const queryParams = new URLSearchParams();
          if (filters.period) queryParams.append("period", filters.period);
          if (filters.status) queryParams.append("status", filters.status);
          if (filters.planName)
            queryParams.append("plan_name", filters.planName);

          const response = await fetch(
            `${apiForTable}/subscription-plan/getAllPlans${
              queryParams.toString() ? `?${queryParams.toString()}` : ""
            }`
          );
          const result = await response.json();

          if (result.success && Array.isArray(result.plans)) {
            const formattedData: SubscriptionPlan[] = result.plans.map(
              (plan: {
                plan_id: number;
                plan_name: string;
                features: string[];
                period: string;
                price: number;
                SUBS_ID: string;
              }) => ({
                planId: plan.plan_id,
                planName: plan.plan_name,
                duration:
                  plan.period.charAt(0).toUpperCase() + plan.period.slice(1),
                features: plan.features.join(", "),
                price: `${parseFloat(plan.price.toString()).toFixed(2)}`,
                status: plan.price > 0 ? "Active" : "Inactive",
                subsId: plan.SUBS_ID,
              })
            );

            const totalItems = formattedData.length;
            setTotalPages(Math.ceil(totalItems / itemsPerPage));

            const paginatedData = formattedData.slice(
              (page - 1) * itemsPerPage,
              page * itemsPerPage
            );

            setData(paginatedData);
          }
        } catch (error) {
          console.error("Error fetching subscription plans:", error);
          setData([]);
        }
      };

      fetchSubscriptionPlans();
    }, [page, filters]);

    return { data, totalPages };
  }
  // Add this type definition near the top of the file
  type FilterState = {
    period: string;
    status: string;
    planName: string;
  };

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { showToast } = useToast();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Replace the existing filterParams state
  const [filterParams, setFilterParams] = useState<FilterState>({
    period: "",
    status: "",
    planName: "",
  });
  // Ensure to pass both arguments to useSubscriptionData
  const { data: subscriptionData, totalPages } = useSubscriptionData(
    1,
    filterParams
  );

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedItems(new Set(selectedIds));
    console.log("selected IDs", selectedIds);
  };

  const handleFilterApply = (filters: FilterState) => {
    setFilterParams({
      period: filters.period,
      status: filters.status,
      planName: filters.planName,
    });
  };

  const handleDetailsClick = (item: SubscriptionPlan) => {
    router.push(
      `/subscriptionManagement/details/${encodeURIComponent(item.subsId)}`
    );
  };

  // First, update the handleDelete function
  const handleDelete = async () => {
    if (selectedItems.size === 0) {
      showToast({
        type: "error",
        title: "No selection",
        description: "Please select a subscription plan to delete.",
        actionText: "OK",
      });
      return;
    }

    // Confirm deletion
    if (
      !window.confirm("Are you sure you want to delete the selected plans?")
    ) {
      return;
    }

    try {
      // Delete each selected plan
      for (const planId of selectedItems) {
        const response = await fetch(
          `${apiForTable}/subscription-plan/deletePlan/${planId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        console.log(result);
        if (!result.success) {
          throw new Error(`Failed to delete plan ${planId}`);
        }
      }

      // Show success message
      showToast({
        type: "success",
        title: "Success",
        description: "Selected plans have been deleted successfully.",
        actionText: "OK",
      });

      // Clear selection
      setSelectedItems(new Set());

      // Refresh the data by triggering a re-fetch
      // This will work because filterParams is included in the useEffect dependency array
      setFilterParams({ ...filterParams });
    } catch (error) {
      console.error("Error deleting plans:", error);
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to delete the selected plans. Please try again.",
        actionText: "OK",
      });
    }
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
            {/* Back Button SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 7.25C2.0335 7.25 1.25 8.0335 1.25 9V20C1.25 20.9665 2.0335 21.75 3 21.75H21C21.9665 21.75 22.75 20.9665 22.75 20V9C22.75 8.0335 21.9665 7.25 21 7.25H3Z"
                fill="#FAFAFA"
              />
              <path
                d="M10.4301 10.3856C10.201 10.2252 9.90169 10.2056 9.65364 10.3348C9.40559 10.4639 9.25 10.7203 9.25 11V18C9.25 18.2797 9.40559 18.5361 9.65364 18.6652C9.90169 18.7944 10.201 18.7748 10.4301 18.6144L15.4301 15.1144C15.6306 14.9741 15.75 14.7447 15.75 14.5C15.75 14.2553 15.6306 14.0259 15.4301 13.8856L10.4301 10.3856Z"
                fill="#262626"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.25 5.5C3.25 5.08579 3.58579 4.75 4 4.75H20C20.4142 4.75 20.75 5.08579 20.75 5.5C20.75 5.91421 20.4142 6.25 20 6.25H4C3.58579 6.25 3.25 5.91421 3.25 5.5ZM5.25 3C5.25 2.58579 5.58579 2.25 6 2.25H18C18.4142 2.25 18.75 2.58579 18.75 3C18.75 3.41421 18.4142 3.75 18 3.75H6C5.58579 3.75 5.25 3.41421 5.25 3Z"
                fill="#FAFAFA"
              />
            </svg>
          </span>
          <h1 className="text-xl font-bold">Subscription Management</h1>
        </div>

        <div className="flex items-center justify-between py-4 px-4">
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
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
              <Clock className="h-4 w-4" />
              <span>Filter by</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <SubscriptionFilter
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              onApplyFilter={handleFilterApply}
            />
          </div>
        </div>

        {/* Dynamic Table */}
        {/* Replace the existing DynamicTable implementation */}
        <DynamicTable
          columns={columns}
          headerColor="#1a1a1a"
          useData={(page) => useSubscriptionData(page, filterParams)}
          showBorder={false}
          showDetailsColumn={true}
          onDetailsClick={handleDetailsClick}
          uniqueKey="subsId"
          onSelectionChange={handleSelectionChange}
        />
      </div>
      </div>
    </>
  );
}
