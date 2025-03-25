"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import Link from "next/link";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
export default function ImportPage() {
  const router = useRouter();
  const [totalEntries, setTotalEntries] = useState(30); // Total entries
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const FolderName = Cookie.get("folderName");
  const [isOpen, setIsOpen] = useState(true);
  // Full Dummy Data
  const fullData = Array.from({ length: totalEntries }, (_, i) => ({
    folderName: `Folder ${i + 1}`,
    date: `05-0${(i % 9) + 1}-2024`,
    isChecked: false, // Checkbox state
  }));

  const [filteredData, setFilteredData] = useState(fullData);
  const [folderSearch, setFolderSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // Instant Filtering Logic
  useEffect(() => {
    if (!folderSearch && !dateSearch) {
      setFilteredData(fullData); // Reset to original data when search bars are cleared
    } else {
      const filtered = fullData.filter(
        (item) =>
          item.folderName.toLowerCase().includes(folderSearch.toLowerCase()) &&
          item.date.includes(dateSearch)
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [folderSearch, dateSearch]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle header checkbox toggle
  const handleSelectAll = (isChecked: boolean) => {
    setSelectAll(isChecked);
    const updatedData = filteredData.map((item, index) => {
      if (index >= startIndex && index < endIndex) {
        return { ...item, isChecked };
      }
      return item;
    });
    setFilteredData(updatedData);
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

      <div className="container mx-auto py-10 pt-10 pr-10 pl-[60px]">
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
              d="M13 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H13C14.1046 19 15 18.1046 15 17V7C15 5.89543 14.1046 5 13 5Z"
              fill="#FAFAFA"
            />
            <path
              d="M21.5 6.3C21.3485 6.21132 21.1763 6.16408 21.0008 6.16302C20.8253 6.16197 20.6525 6.20714 20.5 6.294L17 8.284V15.817L20.465 18.017C20.6166 18.113 20.7912 18.1664 20.9706 18.1717C21.15 18.177 21.3275 18.1339 21.4844 18.047C21.6414 17.9601 21.7721 17.8325 21.8628 17.6777C21.9535 17.5228 22.0009 17.3464 22 17.167V7.167C22.0002 6.9913 21.954 6.81865 21.8663 6.66645C21.7785 6.51424 21.6522 6.38785 21.5 6.3Z"
              fill="#FAFAFA"
            />
          </svg>
          <span className="text-lg text-white">Media Management</span>
          <span className="text-lg text-white">›</span>
          <span className="text-lg text-white">Import</span>
        </div>

        {/* Border Container */}
        <div className="border border-gray-600 rounded-md">
          {/* Header with Back Navigation */}
          <div className="p-4 flex items-center space-x-3">
            <button
              onClick={() => router.push("/mediaManagement-table/import")}
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
            <button
              onClick={() => router.push("/mediaManagement-table/import")}
              className="text-2xl font-bold text-white hover:text-gray-400"
            >
              S3 Explorer
            </button>
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
          {/* <div className="px-4 py-3">
            <select className="bg-neutral-800 text-white border border-gray-600 rounded-md px-4 py-2">
              <option>Choose Bucket</option>
            </select>
          </div> */}

          {/* Breadcrumb */}
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
            <span>
              Bucket Name <span className="text-gray-400">›</span> Folder
            </span>
            <span className="text-neutral-500">› {FolderName}</span>
          </div>

          {/* Create Folder Button */}
          <div className="flex justify-end px-4 py-3">
            <Button className="bg-neutral-800 text-white hover:bg-gray-700 flex items-center space-x-2">
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

          {/* Next Button */}
          <div className="px-4 py-4 flex justify-end">
            <Link href="/mediaManagement-table/import/excelPreview">
              <Button className="bg-white text-black px-6 py-2 hover:bg-gray-300">
                Next
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
