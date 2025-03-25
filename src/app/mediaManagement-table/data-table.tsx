// "use client";

// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { ChevronDown, PlusCircle } from "lucide-react";
// import DynamicTable from "@/components/ui/DynamicSessionTable";
// import { useEffect, useState } from "react";
// import { useToast } from "@/components/ui/toast/toast-context";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// const API_URL = process.env.NEXT_PUBLIC_API_URL;
// import Cookies from "js-cookie";

// import { ImportMediaDialog } from "@/components/ui/ImportMediaDialog";
// import { FilterDialog } from "@/components/ui/filterToast";
// import { CreateMediaDialog } from "@/components/ui/CreateMediaDailog";
// export type Media = {
//   _id: string;
//   mediaId: string;
//   id: string;
//   name: string; // MEDIA NAME
//   date: string; // DATE
//   category: string; // CATEGORY
//   format: string; // MEDIA FORMAT
//   status: string; // STATUS
//   createdAt: string;
//   updatedAt: string;
// };

// export function DataTableDemo() {
//   const { showToast } = useToast();
//   const idToken = Cookies.get("id_token");
//   const refreshToken = Cookies.get("refresh_token");
//   const username = Cookies.get("username");

//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [tableData, setTableData] = useState<Media[]>([]);
//   const [filterParams, setFilterParams] = useState({
//     category: "",
//     startDate: "",
//     endDate: "",
//     sortOrder: "",
//   });
//   const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
//   const handleSelectionChange = (selectedIds: string[]) => {
//     setSelectedItems(new Set(selectedIds)); // Store selected IDs
//   };
//   const useMediaData = (page: number, search: string) => {
//     const searchQueries = search
//       .split(/\s+(?=\w+:)/)
//       .map((query) => {
//         const [key, ...valueParts] = query.split(":");
//         return [key, valueParts.join(":")];
//       })
//       .filter(([key, value]) => key && value)
//       .reduce((acc, [key, value]) => {
//         acc[key as keyof Media] = value.toLowerCase();
//         return acc;
//       }, {} as Partial<Record<keyof Media, string>>);

//     const filteredData = tableData.filter((item) =>
//       Object.entries(searchQueries).every(([key, value]) => {
//         const itemValue = item[key as keyof Media];
//         return itemValue?.toString().toLowerCase().includes(value);
//       })
//     );

//     const pageSize = 10;
//     const start = (page - 1) * pageSize;
//     const paginatedData = filteredData.slice(start, start + pageSize);

//     return {
//       data: paginatedData,
//       totalPages: Math.ceil(filteredData.length / pageSize),
//     };
//   };

//   interface FilterParams {
//     category?: string;
//     startDate?: string;
//     endDate?: string;
//     sortOrder?: string;
//   }

//   const fetchTableData = async (params: FilterParams = {}) => {
//     try {
//       let url = `${API_URL}/fitnearn/web/admin/getAllActiveMedia`;

//       // If there are filter parameters, use the filter API instead
//       if (Object.keys(params).length > 0) {
//         url = `${API_URL}/fitnearn/web/admin/getFilteredData`;
//         const queryParams = new URLSearchParams();

//         if (params.category) queryParams.append("category", params.category);
//         if (params.startDate) queryParams.append("startDate", params.startDate);
//         if (params.endDate) queryParams.append("endDate", params.endDate);
//         if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

//         url += `?${queryParams.toString()}`;
//       }

//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${idToken}`,
//           "x-refresh-token": refreshToken || "",
//           "x-username": username || "",
//         },
//       });

//       const data = await response.json();
//       if (data.success) {
//         setTableData(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       showToast({
//         type: "error",
//         title: "Error",
//         description: "Failed to fetch media data",
//         actionText: "OK",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchTableData();
//   }, []);

//   const handleFilterApply = (filters) => {
//     setFilterParams(filters);
//     fetchTableData(filters);
//   };
//   const router = useRouter();

//   const columns = [
//     { key: "mediaName", header: "MEDIA NAME" },
//     { key: "updatedAt", header: "DATE" },
//     { key: "category", header: "CATEGORY" },
//     { key: "mediaFormat", header: "MEDIA FORMAT" },
//     { key: "state", header: "STATUS" },
//   ];

//   const handleDetailsClick = (item: Media) => {
//     router.push(`/mediaManagement-table/detail/${item.mediaId}`);
//   };
//   const handleDelete = async () => {
//     if (selectedItems.size === 0) {
//       showToast({
//         type: "error",
//         title: "No selection",
//         description: "Please select a media item to delete.",
//         actionText: "OK",
//       });
//       return;
//     }

//     try {
//       await Promise.all(
//         [...selectedItems].map(async (mediaId) => {
//           const response = await fetch(
//             `${API_URL}/fitnearn/web/admin/media/delete/${mediaId}`,
//             {
//               method: "DELETE",
//               headers: {
//                 Authorization: `Bearer ${idToken}`,
//                 "x-refresh-token": refreshToken || "",
//                 "x-username": username || "",
//               },
//             }
//           );

//           if (!response.ok)
//             throw new Error(`Failed to delete media: ${mediaId}`);
//         })
//       );

//       // Remove deleted items from table data
//       setTableData((prevData) =>
//         prevData.filter((item) => !selectedItems.has(item.mediaId))
//       );

//       showToast({
//         type: "success",
//         title: "Deleted",
//         description: "Selected media deleted successfully.",
//         actionText: "OK",
//         onAction() {
//           window.location.reload();
//         },
//       });

//       setSelectedItems(new Set()); // Clear selection after delete
//     } catch (error) {
//       console.error("Delete error:", error);
//       showToast({
//         type: "error",
//         title: "Error",
//         description: "Error in deleting.",
//         actionText: "OK",
//       });
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* Buttons above the table */}
//       <div className="flex items-center justify-between py-4 px-4">
//         {/* Left-aligned button */}
//         <div className="flex items-center space-x-4">
//           {/* Action Button */}

//           {/* ShadCN Select Component */}
//           <Select
//             onValueChange={(value) => {
//               if (value === "delete") {
//                 handleDelete();
//               }
//             }}
//           >
//             <SelectTrigger className="w-56 bg-neutral-800 text-neutral-200 rounded-md">
//               <SelectValue placeholder="Action on Selected Rows" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="delete">Delete</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Right-aligned buttons */}
//         <div className="flex space-x-2">
//           <ImportMediaDialog />

//           <Button
//             onClick={() => setIsFilterOpen(true)}
//             className="bg-[rgba(38,38,38,1)] text-white flex items-center space-x-2 hover:bg-gray-700"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="20"
//               height="21"
//               viewBox="0 0 20 21"
//               fill="none"
//             >
//               <path
//                 d="M10 2.16669C8.35185 2.16669 6.74068 2.65543 5.37027 3.57111C3.99986 4.48679 2.93176 5.78827 2.30103 7.31099C1.6703 8.83371 1.50527 10.5093 1.82681 12.1258C2.14836 13.7423 2.94203 15.2271 4.10747 16.3926C5.27291 17.558 6.75776 18.3517 8.37427 18.6732C9.99078 18.9948 11.6663 18.8297 13.1891 18.199C14.7118 17.5683 16.0133 16.5002 16.9289 15.1298C17.8446 13.7594 18.3334 12.1482 18.3334 10.5C18.3309 8.29063 17.4522 6.17242 15.8899 4.61014C14.3276 3.04787 12.2094 2.16911 10 2.16669ZM13.3184 13.8184C13.1621 13.9746 12.9502 14.0623 12.7292 14.0623C12.5082 14.0623 12.2963 13.9746 12.14 13.8184L9.41169 11.09C9.25581 10.9331 9.16783 10.7212 9.16669 10.5V7.16669C9.16669 6.94567 9.25449 6.73371 9.41077 6.57743C9.56705 6.42115 9.77901 6.33335 10 6.33335C10.221 6.33335 10.433 6.42115 10.5893 6.57743C10.7456 6.73371 10.8334 6.94567 10.8334 7.16669V10.155L13.3184 12.64C13.4746 12.7963 13.5623 13.0082 13.5623 13.2292C13.5623 13.4502 13.4746 13.6621 13.3184 13.8184Z"
//                 fill="#FAFAFA"
//               />
//             </svg>
//             <span>Filter by</span>
//             <ChevronDown className="h-4 w-4" />
//           </Button>
//           <FilterDialog
//             open={isFilterOpen}
//             onOpenChange={setIsFilterOpen}
//             onApplyFilter={handleFilterApply}
//           />

//           <CreateMediaDialog />
//         </div>
//       </div>

//       {/* Dynamic Table */}
//       <DynamicTable
//         columns={columns}
//         headerColor="#1a1a1a"
//         useData={useMediaData}
//         showBorder={false}
//         showDetailsColumn={true}
//         onDetailsClick={handleDetailsClick}
//         uniqueKey="mediaId"
//         onSelectionChange={handleSelectionChange}
//       />
//     </div>
//   );
// }

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
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";
import { ImportMediaDialog } from "@/components/ui/ImportMediaDialog";
import { FilterDialog } from "@/components/ui/filterToast";
import { CreateMediaDialog } from "@/components/ui/CreateMediaDailog";

export type Media = {
  _id: string;
  mediaId: string;
  id: string;
  name: string;
  date: string;
  category: string;
  format: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function DataTableDemo() {
  const { showToast } = useToast();
  const idToken = Cookies.get("id_token");
  const refreshToken = Cookies.get("refresh_token");
  const username = Cookies.get("username");
  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tableData, setTableData] = useState<Media[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const fetchTableData = async (params = {}) => {
    try {
      let url = `${API_URL}/fitnearn/web/admin/getAllActiveMedia`;
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

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedItems(new Set(selectedIds));
  };

  const handleDetailsClick = (item: Media) => {
    router.push(`/mediaManagement-table/detail/${item.mediaId}`);
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
            `${API_URL}/fitnearn/web/admin/media/delete/${mediaId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${idToken}`,
                "x-refresh-token": refreshToken || "",
                "x-username": username || "",
              },
            }
          );
          if (!response.ok) throw new Error(`Failed to delete media: ${mediaId}`);
        })
      );
      setTableData((prevData) =>
        prevData.filter((item) => !selectedItems.has(item.mediaId))
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
      setSelectedItems(new Set());
    } catch (error) {
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
      <div className="flex items-center justify-between py-4 px-4">
        <Select onValueChange={(value) => value === "delete" && handleDelete()}>
          <SelectTrigger className="w-56 bg-neutral-800 text-neutral-200 rounded-md">
            <SelectValue placeholder="Action on Selected Rows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex space-x-2">
          <ImportMediaDialog />
          <Button onClick={() => setIsFilterOpen(true)} className="bg-gray-800 text-white flex items-center space-x-2">
            <span>Filter by</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <FilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApplyFilter={fetchTableData} />
          <CreateMediaDialog />
        </div>
      </div>
      <DynamicTable
        columns={[
          { key: "name", header: "MEDIA NAME" },
          { key: "updatedAt", header: "DATE" },
          { key: "category", header: "CATEGORY" },
          { key: "format", header: "MEDIA FORMAT" },
          { key: "status", header: "STATUS" },
        ]}
        headerColor="#1a1a1a"
        useData={() => ({ data: tableData, totalPages: 1 })}
        showBorder={false}
        showDetailsColumn={true}
        onDetailsClick={handleDetailsClick}
        uniqueKey="mediaId"
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
