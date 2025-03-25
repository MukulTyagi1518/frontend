"use client";

import { useRouter } from "next/navigation";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { useSessionData, Session } from "./useRefundData";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar, Clock, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FilterDialog } from "@/components/ui/filterToast";
import { QueryFilter } from "@/components/ui/queryFilter";
import { RefundFilter} from "@/components/ui/refundFilter"
import { useToast } from "@/components/ui/toast/toast-context";
import Cookies from "js-cookie";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
const columns: { key: keyof Omit<Session, "details">; header: string }[] = [
  { key: "UserId", header: "USER ID" },
  { key: "BookingNo", header: "BOOKING PO NO." },
  { key: "RefundAmount", header: "REFUND AMOUNT" },
  { key: "PostedAt", header: "POSTED AT" },
  { key: "CancelledAt", header: "CANCELLED AT" },
  { key: "status", header: "STATUS" },
];
const API_URL = process.env.NEXT_PUBLIC_API_URL_2;
export default function LiveSessionTable() {
  const { showToast } = useToast();
  const idToken = Cookies.get("id_token");
  const refreshToken = Cookies.get("refresh_token");
  const username = Cookies.get("username");
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tableData, setTableData] = useState<Session[]>([]);
  const [filteredData, setFilteredData] = useState<Session[]>([]);
  const [selectedItems, setSelectedItems] = useState<Session[]>([]);
  const [filterParams, setFilterParams] = useState({
    sort: "",
    responsiblePerson: "",
    status: "",
    startDate: "",
    endDate: "",
    bookingType: "",
    modeOfPayment: "",
  });

  useEffect(() => {
    const fetchData = async () => {
        const { data } = await useSessionData(1, ""); // Pass default values
      setTableData(data);
      setFilteredData(data);
    };
    fetchData();
  }, []);
  interface FilterParams {
    sort: string;
    responsiblePerson: string;
    status: string;
    startDate: string;
    endDate: string;
    bookingType: string;
    modeOfPayment: string;
  }
  const fetchTableData = async (params: FilterParams) => {
    try {
      let url = `${API_URL}/refund/get`;

      // If there are filter parameters, use the filter API instead
      if (Object.keys(params).length > 0) {
        url = `${API_URL}/bookings/get-all`;
        const queryParams = new URLSearchParams();

        if (params.sort) queryParams.append("sort", params.sort);
        if (params.responsiblePerson) queryParams.append("responsiblePerson", params.responsiblePerson);
        if (params.status) queryParams.append("stage", params.status);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.bookingType) queryParams.append("bookingType", params.bookingType);
        if (params.modeOfPayment) queryParams.append("modeOfPayment", params.modeOfPayment);
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

  const handleFilterApply = (filters: any) => {
    console.log("datas: ", filters);
    
    setFilterParams(filters);
    fetchTableData(filters);
  };
  useEffect(() => {
    fetchTableData(filterParams);
  }, [filterParams]);

  const handleDetailsClick = (item: any) => {
    if (!item.UserId) {
      console.error("Report ID is missing!");
      return;
    }

    switch (item.status) {
      case "cancelled":
        router.push(`/RefundManagement/denied/${item.UserId}`);
        break;
      case "draft":
        router.push(`/RefundManagement/draft/${item.UserId}`);
        break;
      case "Completed":
      case "rejected":
        router.push(`/RefundManagement/unsuccessful/${item.UserId}`);
        break;
      case "Urgent":
        case "pending approval":
        router.push(`/RefundManagement/inProgress/${item.UserId}`);
        break;
      case "approved":
        router.push(`/RefundManagement/successful/${item.UserId}`);
        break;
      default:
        console.error("Unknown status!", item.status);
    }
  };
  

  return (
    <div className="rounded-xl p-4">
      {/* Action Buttons */}
      <div className="flex items-center justify-between px-2 mb-1">
        {/* ShadCN Select Component */}
        <Select
          onValueChange={(value) => {
            if (value === "view") {
              router.push("/RefundManagement/draft/${item.reportId}");
            } else if (value === "edit") {
                router.push("/RefundManagement/draft/${item.reportId}");
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

        <div className="flex space-x-4 mx-4">
          <Button
            className="bg-[rgba(38,38,38,1)] text-white flex items-center space-x-2 hover:bg-gray-700"
            onClick={() => setIsFilterOpen(true)}
          >
            <Clock className="h-4 w-4" />
            <span>Filter by</span>
          </Button>
          <RefundFilter
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
        useData={useSessionData}
        showBorder={false}
        showDetailsColumn={true} // Pass this explicitly if you want to show the "Details" column
        onDetailsClick={handleDetailsClick}
        uniqueKey="UserId"
        customStyles={[
          {
            columnKey: "status",
            condition: (value) => value === "under review",
            styles: {
              color: "#818CF8",
              border: "1px solid #818CF8",
              padding: "2px 4px",
              backgroundColor: "#262626",
            },
          },
          {
            columnKey: "status",
            condition: (value) => value === "rejected",
            styles: {
              color: "#F87171",
              border: "1px solid #F87171",
              padding: "2px 4px",
              backgroundColor: "#262626",
            },
          },
          {
            columnKey: "status",
            condition: (value) => value === "draft",
            styles: {
              color: "#A78BFA",
              border: "1px solid #A78BFA",
              padding: "2px 4px",
              backgroundColor: "#262626",
            },
          },
          {
            columnKey: "status",
            condition: (value) => value === "approved",
            styles: {
              color: "#4ADE80",
              border: "1px solid #4ADE80",
              padding: "2px 4px",
              backgroundColor: "#262626",
            },
          },
          {
            columnKey: "status",
            condition: (value) => value === "pending approval",
            styles: {
              color: "#FACA15",
              border: "1px solid #FACA15",
              padding: "2px 4px",
              backgroundColor: "#262626",
            },
          },
          {
            columnKey: "status",
            condition: (value) => value === "cancelled",
            styles: {
              color: "#E91E63",
              border: "1px solid #E91E63",
              padding: "2px 4px",
              backgroundColor: "#262626",
            },
          },
        ]}
      />
    </div>
  );
}
