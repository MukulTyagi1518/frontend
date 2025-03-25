"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateFolderDialog } from "@/components/ui/create-folder-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const id_token = Cookies.get("id_token");
const refresh_token = Cookies.get("refresh_token");
const [isOpen, setIsOpen] = useState(true);
const username = Cookies.get("username");
type Bucket = {
  Name: string;
  CreationDate: string;
};



interface Folder {
  name: string;
}

interface ObjectItem {
    key: string;
    size: string;
    lastModified: string;
  }
  
  interface TableItem {
    name: string;
    type: "Folder" | "File"; // ✅ Enforcing exact string literals
    size: string;
    lastModified: string;
  }
  

type DataItem = {
  folderName: string;
  date: string;
  sessionId: string;
};

export default function ImportPage() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const totalEntries = 30; // Total entries
  const itemsPerPage = 9;
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [folders, setFolders] = useState<string[]>([]);
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [tableData, setTableData] = useState<TableItem[]>([]);
  

  const fullData: DataItem[] = Array.from({ length: totalEntries }, (_, i) => ({
    folderName: `Folder ${i + 1}`,
    date: `05-0${(i % 9) + 1}-2024`,
    sessionId: `session-${i + 1}`,
  }));

  const useData = (page: number, search: string) => {
    const searchQueries = search
      .split(/\s+(?=\w+:)/)
      .map((query) => {
        const [key, ...valueParts] = query.split(":");a
        return [key.trim(), valueParts.join(":").trim()];
      })
      .filter(([key, value]) => key && value)
      .reduce((acc, [key, value]) => {
        acc[key as keyof DataItem] = value.toLowerCase();
        return acc;
      }, {} as Partial<Record<keyof DataItem, string>>);

      const filteredData = tableData.filter((item) =>
        Object.entries(searchQueries).every(([key, value]) => {
          // ✅ Explicitly assert `key` as keyof TableItem
          const itemValue = String(item[key as keyof TableItem] || "");
          return itemValue.toLowerCase().includes(value.toLowerCase());
        })
      );
      

    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return {
      data: paginatedData,
      totalPages: Math.ceil(filteredData.length / itemsPerPage),
    };
  };

  const useData1 = (page: number, search: string) => {
    const searchQueries = search
      .split(/\s+(?=\w+:)/)
      .map((query) => {
        const [key, ...valueParts] = query.split(":");
        return [key.trim(), valueParts.join(":").trim()];
      })
      .filter(([key, value]) => key && value)
      .reduce((acc, [key, value]) => {
        acc[key as keyof DataItem] = value.toLowerCase();
        return acc;
      }, {} as Partial<Record<keyof DataItem, string>>);

      const filteredData = tableData.filter((item) =>
        Object.entries(searchQueries).every(([key, value]) => {
          // ✅ Explicitly assert `key` as keyof TableItem
          const itemValue = String(item[key as keyof TableItem] || "");
          return itemValue.toLowerCase().includes(value.toLowerCase());
        })
      );
      

    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return {
      data: paginatedData,
      totalPages: Math.ceil(filteredData.length / itemsPerPage),
    };
  };

  const handleCreateFolder = (name: string) => {
    console.log("Creating folder:", name);
  };

  useEffect(() => {
    // Fetch buckets on component mount
    const fetchBuckets = async () => {
      try {
        const response = await fetch(
          `${API_URL}/fitnearn/web/admin/s3-explorer/list`,
          {
            headers: new Headers({
              Authorization: `Bearer ${id_token}`,
              "x-username": username || "",
              "x-refresh-token": refresh_token || "",
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setBuckets(data.buckets);
          console.log("Buckets:", data.buckets);
        }
      } catch (error) {
        console.error("Error fetching buckets:", error);
      }
    };

    fetchBuckets();
  }, []);

  
  const handleBucketSelect = async (bucketName: string) => {
    setSelectedBucket(bucketName);
  
    try {
      const response = await fetch(
        `${API_URL}/fitnearn/web/admin/s3-explorer/list?bucket=${bucketName}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
            "x-username": username || "",
            "x-refresh-token": refresh_token || "",
          },
        }
      );
  
      const data = await response.json();
  
      if (!data.success) {
        console.error("API call failed", data);
        return;
      }
  
      console.log("Fetched Data:", data); // Debugging step
  
      // Ensure folders and objects are arrays
      const foldersArray = Array.isArray(data.folders) ? data.folders : [];
      const objectsArray = Array.isArray(data.objects) ? data.objects : [];
  
      setFolders(foldersArray);
      setObjects(objectsArray);
  
      // Combine folders and objects for the table
      const combinedData: TableItem[] = [
        ...folders.map((folder: string): TableItem => ({
          name: folder,
          type: "Folder", // ✅ Correctly assigning "Folder"
          size: "-",
          lastModified: "-",
        })),
        ...objects.map((object: ObjectItem): TableItem => ({
          name: object.key || "Unknown",
          type: "File", // ✅ Correctly assigning "File"
          size: object.size || "0",
          lastModified: object.lastModified ? new Date(object.lastModified).toLocaleString() : "-",
        })),
      ];
      
      setTableData(combinedData);
      console.log("Combined Table Data:", combinedData); // Debugging step
    } catch (error) {
      console.error("Error fetching bucket details:", error);
    }
  };
  

  return (
   
    <div className="w-full min-h-screen bg-black-900 text-white">
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

    {/* Main Content */}
    <div
      className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${
        isOpen ? "pl-60" : "pl-16"
      }`} // Adjust padding based on sidebar state
    >
      <Header isOpen={isOpen} setIsOpen={setIsOpen}  />
      <div className="container mx-auto py-10 pt-24 pr-5 pl-[280px]">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 flex items-center space-x-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M16.707 9.48C16.5195 9.28772 16.2652 9.17971 16 9.17971C15.7348 9.17971 15.4805 9.28772 15.293 9.48L13 11.8318V3.02564C13 2.75362 12.8946 2.49275 12.7071 2.3004C12.5196 2.10806 12.2652 2 12 2C11.7348 2 11.4804 2.10806 11.2929 2.3004C11.1054 2.49275 11 2.75362 11 3.02564V11.8318L8.707 9.48C8.61475 9.38204 8.50441 9.30391 8.3824 9.25015C8.2604 9.1964 8.12918 9.16811 7.9964 9.16692C7.86362 9.16574 7.73194 9.19169 7.60905 9.24326C7.48615 9.29483 7.3745 9.37099 7.2806 9.46729C7.18671 9.56359 7.11246 9.6781 7.06218 9.80415C7.0119 9.9302 6.9866 10.0653 6.98775 10.2014C6.9889 10.3376 7.01649 10.4722 7.0689 10.5973C7.12131 10.7225 7.19749 10.8356 7.293 10.9303L11.293 15.0328C11.3859 15.1283 11.4962 15.2041 11.6177 15.2558C11.7392 15.3075 11.8695 15.3341 12.001 15.3341C12.1325 15.3341 12.2628 15.3075 12.3843 15.2558C12.5058 15.2041 12.6161 15.1283 12.709 15.0328L16.709 10.9303C16.8962 10.7376 17.0012 10.4767 17.0008 10.2047C17.0004 9.93274 16.8947 9.67206 16.707 9.48Z"
              fill="#FAFAFA"
            />
            <path
              d="M20 13.7949H17.45L14.475 16.8462C14.15 17.1795 13.7641 17.444 13.3395 17.6244C12.9148 17.8048 12.4597 17.8977 12 17.8977C11.5403 17.8977 11.0852 17.8048 10.6605 17.6244C10.2359 17.444 9.85001 17.1795 9.525 16.8462L6.55 13.7949H4C3.46957 13.7949 2.96086 14.011 2.58579 14.3957C2.21071 14.7804 2 15.3021 2 15.8462V19.9487C2 20.4928 2.21071 21.0145 2.58579 21.3992C2.96086 21.7839 3.46957 22 4 22H20C20.5304 22 21.0391 21.7839 21.4142 21.3992C21.7893 21.0145 22 20.4928 22 19.9487V15.8462C22 15.3021 21.7893 14.7804 21.4142 14.3957C21.0391 14.011 20.5304 13.7949 20 13.7949ZM17.5 19.9487C17.2033 19.9487 16.9133 19.8585 16.6666 19.6894C16.42 19.5204 16.2277 19.2801 16.1142 18.999C16.0007 18.7179 15.9709 18.4086 16.0288 18.1101C16.0867 17.8117 16.2296 17.5376 16.4393 17.3224C16.6491 17.1072 16.9164 16.9607 17.2074 16.9014C17.4983 16.842 17.7999 16.8725 18.074 16.9889C18.3481 17.1053 18.5824 17.3025 18.7472 17.5555C18.912 17.8085 19 18.106 19 18.4103C19 18.8183 18.842 19.2096 18.5607 19.4981C18.2794 19.7866 17.8978 19.9487 17.5 19.9487Z"
              fill="#FAFAFA"
            />
          </svg>
          <span className="text-lg text-white">Media Management</span>
          <span className="text-lg text-white">›</span>
          <span className="text-lg text-white">Import</span>
        </div>

        {/* Border Container */}
        <div className="border border-gray-600 rounded-md">
          {/* Back Navigation */}
          <div className="p-4 flex items-center space-x-3">
            <button
              onClick={() => router.push("/mediaManagement-table")}
              className="flex items-center text-white hover:text-gray-400"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.6 3.00005C15.9142 3.00005 16.2124 3.12325 16.4343 3.34515C16.6562 3.56705 16.7794 3.8653 16.7794 4.17952C16.7794 4.49373 16.6562 4.79198 16.4343 5.01388L8.45193 12.9962L16.4343 20.9785C16.6562 21.2004 16.7794 21.4987 16.7794 21.8129C16.7794 22.1271 16.6562 22.4254 16.4343 22.6473C16.2124 22.8692 15.9142 22.9924 15.6 22.9924C15.2858 22.9924 14.9876 22.8692 14.7657 22.6473L6.06234 13.9439C5.84045 13.722 5.71725 13.4238 5.71725 13.1096C5.71725 12.7954 5.84045 12.4972 6.06234 12.2753L14.7657 3.57193C14.9876 3.35004 15.2858 3.22684 15.6 3.22684V3.00005Z"
                  fill="#FAFAFA"
                />
              </svg>
            </button>
            <span className="text-2xl font-bold text-white">S3 Explorer</span>
          </div>

          {/* Progress Bar */}
          <div className="relative flex items-center p-4 border-t border-gray-600">
            <span className="text-sm text-gray-400">Choose Destination</span>
            <div className="flex-grow h-px bg-gray-600 mx-4"></div>
            <span className="text-sm text-gray-400">Upload .CSV</span>
            <div className="flex-grow h-px bg-gray-600 mx-4"></div>
            <span className="text-sm text-gray-400">Bulk Upload</span>
            <div className="flex-grow h-px bg-gray-600 mx-4"></div>
            <span className="text-sm text-gray-400">Complete</span>
          </div>

          {/* Dropdown */}
          <div className="px-4 py-3">
            <Select onValueChange={handleBucketSelect}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Choose Bucket" />
              </SelectTrigger>
              <SelectContent>
                {buckets.map((bucket) => (
                  <SelectItem key={bucket.Name} value={bucket.Name}>
                    {bucket.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bucket Name */}
          <div className="px-4 py-2 text-white text-[24px] flex items-center space-x-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.7189 11.2929L19.7165 9.29286L12.7079 2.29279C12.5201 2.10532 12.2655 2 12 2C11.7345 2 11.4799 2.10532 11.2921 2.29279L4.28352 9.29286L2.28106 11.2929C2.09867 11.4815 1.99776 11.7341 2.00004 11.9963C2.00232 12.2585 2.10762 12.5093 2.29325 12.6947C2.47889 12.8801 2.73001 12.9853 2.99253 12.9876C3.25505 12.9899 3.50796 12.8891 3.6968 12.7069L3.99016 12.4139V20C3.99016 20.5304 4.20113 21.0391 4.57666 21.4142C4.9522 21.7893 5.46153 22 5.99262 22H8.99631C9.26185 22 9.51652 21.8946 9.70429 21.7071C9.89205 21.5196 9.99754 21.2652 9.99754 21V16.9999C9.99754 16.7347 10.103 16.4804 10.2908 16.2928C10.4786 16.1053 10.7332 15.9999 10.9988 15.9999H13.0012C13.2668 15.9999 13.5214 16.1053 13.7092 16.2928C13.897 16.4804 14.0025 16.7347 14.0025 16.9999V21C14.0025 21.2652 14.1079 21.5196 14.2957 21.7071C14.4835 21.8946 14.7381 22 15.0037 22H18.0074C18.5385 22 19.0478 21.7893 19.4233 21.4142C19.7989 21.0391 20.0098 20.5304 20.0098 20V12.4139L20.3032 12.7069C20.492 12.8891 20.7449 12.9899 21.0075 12.9876C21.27 12.9853 21.5211 12.8801 21.7067 12.6947C21.8924 12.5093 21.9977 12.2585 22 11.9963C22.0022 11.7341 21.9013 11.4815 21.7189 11.2929Z"
                fill="#FAFAFA"
              />
            </svg>
            <span>Bucket Name</span>
            <span className="text-gray-400">›</span>
            <span>Folder</span>
          </div>

          {/* Create Folder Button */}
          <div className="flex justify-end px-4 py-3">
            <Button
              onClick={() => setOpen(true)}
              className="bg-neutral-900 text-white hover:bg-gray-700 flex items-center space-x-2"
            >
              <span>Create Folder</span>
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 9.5H15V11.5H11V15.5H9V11.5H5V9.5H9V5.5H11V9.5ZM10 20.5C7.34784 20.5 4.8043 19.4464 2.92893 17.5711C1.05357 15.6957 0 13.1522 0 10.5C0 7.84784 1.05357 5.3043 2.92893 3.42893C4.8043 1.55357 7.34784 0.5 10 0.5C12.6522 0.5 15.1957 1.55357 17.0711 3.42893C18.9464 5.3043 20 7.84784 20 10.5C20 13.1522 18.9464 15.6957 17.0711 17.5711C15.1957 19.4464 12.6522 20.5 10 20.5ZM10 18.5C12.1217 18.5 14.1566 17.6571 15.6569 16.1569C17.1571 14.6566 18 12.6217 18 10.5C18 8.37827 17.1571 6.34344 15.6569 4.84315C14.1566 3.34285 12.1217 2.5 10 2.5C7.87827 2.5 5.84344 3.34285 4.34315 4.84315C2.84285 6.34344 2 8.37827 2 10.5C2 12.6217 2.84285 14.6566 4.34315 16.1569C5.84344 17.6571 7.87827 18.5 10 18.5Z"
                  fill="#FAFAFA"
                />
              </svg>
            </Button>
          </div>

          <CreateFolderDialog
            open={open}
            onOpenChange={setOpen}
            onCreateFolder={handleCreateFolder}
          />

          {/* Dynamic Table */}

          {selectedBucket && (
            <DynamicTable
              columns={[
                { key: "name", header: "Folder Name" },
                { key: "lastModified", header: "Date" },
              ]}
              headerColor="#262626"
              useData={useData}
              showBorder={false} // Ensuring no border
              onDetailsClick={(item) => console.log("Details clicked:", item)}
              uniqueKey="id"
            />
          )}

          {!selectedBucket && (
            <DynamicTable
              columns={[
                { key: "Name", header: "Folder Name" },
                { key: "CreationDate", header: "Date" },
              ]}
              headerColor="#262626"
              useData={useData1}
              showBorder={false} // Ensuring no border
              onDetailsClick={(item) => console.log("Details clicked:", item)}
              uniqueKey="id"
            />
          )}

          {/* Next Button */}
          <div className="px-4 py-4 flex justify-end">
            <Button className="bg-white text-black px-6 py-2 hover:bg-gray-300">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
