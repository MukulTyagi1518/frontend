// "use client";

// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { ChevronDown, Plus, Search, Edit3 } from "lucide-react";
// import DynamicTable from "@/components/ui/DynamicSessionTable";
// import { useEffect, useState, ReactNode } from "react";
// import { useToast } from "@/components/ui/toast/toast-context";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import Cookies from "js-cookie";
// import { ImportMediaDialog } from "@/components/ui/ImportMediaDialog";
// import { FilterDialog } from "@/components/ui/filterToast";
// import { CreateMediaDialog } from "@/components/ui/CreateMediaDailog";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export type Media = {
//   _id: string;
//   mediaId: string;
//   name: string;
//   healthTip: string;
//   date: string;
//   status: string;
//   updatedAt: string;
// };

// type Column = {
//   key: string;
//   header: string;
// };

// export function DataTableDemo() {
//   const { showToast } = useToast();
//   const router = useRouter();
//   const idToken = Cookies.get("id_token");
//   const refreshToken = Cookies.get("refresh_token");
//   const username = Cookies.get("username");

//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [tableData, setTableData] = useState<Media[]>([]);
//   const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

//   // Fetch data
//   const fetchTableData = async () => {
//     try {
//       let url = `${API_URL}/fitnearn/web/admin/getAllActiveMedia`;
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

//   const handleSelectionChange = (selectedIds: string[]) => {
//     setSelectedItems(new Set(selectedIds));
//   };

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
//           if (!response.ok) throw new Error(`Failed to delete media: ${mediaId}`);
//         })
//       );
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
//       setSelectedItems(new Set());
//     } catch (error) {
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
//       {/* Actions & Filters */}
//       <div className="flex items-center justify-between py-4 px-4">
//         <Select onValueChange={(value) => value === "delete" && handleDelete()}>
//           <SelectTrigger className="w-56 bg-neutral-800 text-neutral-200 rounded-md">
//             <SelectValue placeholder="Action on selected rows" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="delete">Delete</SelectItem>
//           </SelectContent>
//         </Select>
//         <div className="flex space-x-2">
//           <ImportMediaDialog />
//           <Button onClick={() => setIsFilterOpen(true)} className="bg-gray-800 text-white flex items-center space-x-2">
//             <span>Filter by</span>
//             <ChevronDown className="h-4 w-4" />
//           </Button>
//           <FilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApplyFilter={fetchTableData} />
//           <Button className="bg-green-600 text-white flex items-center space-x-2">
//             <Plus className="h-4 w-4" />
//             <span>New</span>
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <DynamicTable
//         columns={[
//           { key: "image", header: "IMAGE" },
//           { key: "name", header: "HEALTH TIP" },
//           { key: "date", header: "DATE" },
//           { key: "status", header: "STATUS" },
//           { key: "actions", header: "DETAILS", render: (row: Media) => (
//             <button onClick={() => handleDetailsClick(row)} className="text-white hover:text-blue-400">
//               <Edit3 size={16} />
//             </button>
//           ) },
//         ]}
//         headerColor="#1a1a1a"
//         useData={() => ({ data: tableData, totalPages: 1 })}
//         showBorder={false}
//         showDetailsColumn={false}
//         onSelectionChange={handleSelectionChange}
//         uniqueKey="mediaId"
//       />

//       {/* Pagination */}
//       <div className="flex justify-between items-center p-4 text-gray-300 text-sm">
//         <span>Showing 1 to {tableData.length} of 100 Entries</span>
//         <div className="flex space-x-2">
//           <Button className="px-3 py-1 bg-gray-700 rounded-md">&lt;</Button>
//           <Button className="px-3 py-1 bg-gray-600 rounded-md">1</Button>
//           <Button className="px-3 py-1 bg-gray-700 rounded-md">2</Button>
//           <Button className="px-3 py-1 bg-gray-700 rounded-md">3</Button>
//           <Button className="px-3 py-1 bg-gray-700 rounded-md">...</Button>
//           <Button className="px-3 py-1 bg-gray-700 rounded-md">100</Button>
//           <Button className="px-3 py-1 bg-gray-700 rounded-md">&gt;</Button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Search, Edit3 } from "lucide-react";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { useEffect, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/toast/toast-context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import { ImportMediaDialog } from "@/components/ui/ImportMediaDialog";
import { FilterDialog } from "@/components/ui/filterToast";
import { CreateMediaDialog } from "@/components/ui/CreateMediaDailog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Media = {
  _id: string;
 
  name: string;
  healthTip: string;
  date: string;
  status: string;
  updatedAt: string;
};

type Column = {
  key: string;
  header: string;
  render?: (row: Media) => ReactNode; // Allow custom rendering
};

export function DataTableDemo() {
  const { showToast } = useToast();
  const router = useRouter();
  const idToken = Cookies.get("id_token");
  const refreshToken = Cookies.get("refresh_token");
  const username = Cookies.get("username");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tableData, setTableData] = useState<Media[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Fetch data
  const fetchTableData = async () => {
    try {
      let url = `${API_URL}`;
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
    router.push(``);
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
            `${API_URL}`,
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

  const columns: Column[] = [
    { key: "image", header: "IMAGE" },
    { key: "name", header: "HEALTH TIP" },
    { key: "date", header: "DATE" },
    { key: "status", header: "STATUS" },
    {
      key: "actions",
      header: "DETAILS",
      render: (row: Media) => (
        <button onClick={() => handleDetailsClick(row)} className="text-white hover:text-blue-400">
          <Edit3 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Actions & Filters */}
      <div className="flex items-center justify-between py-4 px-4">
        <Select onValueChange={(value) => value === "delete" && handleDelete()}>
          <SelectTrigger className="w-56 bg-neutral-800 text-neutral-200 rounded-md">
            <SelectValue placeholder="Action on selected rows" />
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
          <Button className="bg-green-600 text-white flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <DynamicTable
        columns={columns}
        headerColor="#1a1a1a"
        useData={() => ({ data: tableData, totalPages: 1 })}
        showBorder={false}
        showDetailsColumn={false}
        onSelectionChange={handleSelectionChange}
        uniqueKey="mediaId"
      />

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 text-gray-300 text-sm">
        <span>Showing 1 to {tableData.length} of 100 Entries</span>
        <div className="flex space-x-2">
          <Button className="px-3 py-1 bg-gray-700 rounded-md">&lt;</Button>
          <Button className="px-3 py-1 bg-gray-600 rounded-md">1</Button>
          <Button className="px-3 py-1 bg-gray-700 rounded-md">2</Button>
          <Button className="px-3 py-1 bg-gray-700 rounded-md">3</Button>
          <Button className="px-3 py-1 bg-gray-700 rounded-md">...</Button>
          <Button className="px-3 py-1 bg-gray-700 rounded-md">100</Button>
          <Button className="px-3 py-1 bg-gray-700 rounded-md">&gt;</Button>
        </div>
      </div>
    </div>
  );
}
