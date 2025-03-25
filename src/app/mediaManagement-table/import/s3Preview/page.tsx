"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/toast-context";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
export default function ImportPage() {
  const router = useRouter();
  const [totalEntries, setTotalEntries] = useState(30); // Total entries
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(true);

  // Full Dummy Data
  // const fullData = Array.from({ length: totalEntries }, (_, i) => ({
  //   folderName: `Yoga`,

  //   isChecked: false, // Checkbox state
  // }));
  // Your data array
  type FolderData = {
    folderName: string;
    isChecked: boolean;
    date?: string; // Make sure `date` is optional if not always present
  };
  
  const fullData: FolderData[] = [
    { folderName: "Project A", isChecked: false, date: "2024-02-18" },
    { folderName: "Project B", isChecked: true, date: "2024-02-19" },
    { folderName: "Project C", isChecked: false }, // No date (optional field)
  ];

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
          (!item.date || item.date.includes(dateSearch)) // Ensure `date` exists before filtering
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [folderSearch, dateSearch, fullData]); // Added `fullData` to dependencies
  

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
          <div className="p-4 flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-2">
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

              <button
                onClick={() => router.push("/mediaManagement-table")}
                className="text-2xl font-bold text-white hover:text-gray-400"
              >
                Preview S3 Explorer
              </button>
            </div>
            <button
              onClick={() => {
                router.push("/mediaManagement-table/import/bulkUpload");
              }}
              className="flex items-center gap-2 bg-neutral-800  border-neutral-600 px-2 py-1 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <g clipPath="url(#clip0_4591_3999)">
                  <path
                    d="M8.8 7.7H12V9.3H8.8V12.5H7.2V9.3H4V7.7H7.2V4.5H8.8V7.7ZM8 16.5C5.87827 16.5 3.84344 15.6571 2.34315 14.1569C0.842855 12.6566 0 10.6217 0 8.5C0 6.37827 0.842855 4.34344 2.34315 2.84315C3.84344 1.34285 5.87827 0.5 8 0.5C10.1217 0.5 12.1566 1.34285 13.6569 2.84315C15.1571 4.34344 16 6.37827 16 8.5C16 10.6217 15.1571 12.6566 13.6569 14.1569C12.1566 15.6571 10.1217 16.5 8 16.5ZM8 14.9C9.69739 14.9 11.3253 14.2257 12.5255 13.0255C13.7257 11.8253 14.4 10.1974 14.4 8.5C14.4 6.80261 13.7257 5.17475 12.5255 3.97452C11.3253 2.77428 9.69739 2.1 8 2.1C6.30261 2.1 4.67475 2.77428 3.47452 3.97452C2.27428 5.17475 1.6 6.80261 1.6 8.5C1.6 10.1974 2.27428 11.8253 3.47452 13.0255C4.67475 14.2257 6.30261 14.9 8 14.9Z"
                    fill="#FAFAFA"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4591_3999">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              Add Media
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative flex items-center p-4 border-t border-gray-600">
            <span className="text-sm text-green-600">Choose Destination</span>
            <div className="flex-grow h-px bg-green-600 mx-4"></div>
            <span className="text-sm text-green-600">Upload .CSV</span>
            <div className="flex-grow h-px bg-green-600 mx-4"></div>
            <span className="text-sm text-gray-400">Bulk Upload</span>
            <div className="flex-grow h-px bg-gray-600 mx-4"></div>
            <span className="text-sm text-gray-400">Complete</span>
          </div>
          {/* 
          <div className="w-[508px] py-6 h-9 flex justify-center items-center ml-4">
            <div className="w-full h-9 flex justify-between border-b border-neutral-600">
              <div className="h-[34px] px-1 pb-4 border-b-2 border-neutral-50 flex items-center">
                <span className="text-neutral-50 text-sm font-medium  leading-[21px]">
                  Success 80/100
                </span>
              </div>
              <div className="h-[34px] px-1 pb-4 flex items-center">
                <span className="text-neutral-400 text-sm font-medium leading-[21px]">
                  Failed 20/100
                </span>
              </div>
            </div>
          </div> */}

          {/* Table */}
          <div className="p-4">
            <table className="w-full text-sm text-gray-400">
              {/* Table Header */}
              {/* <thead>
                <tr className="border-b border-gray-600 bg-[#262626]">
                  <th className="px-4 py-3 text-left rounded-tl-md uppercase">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={(checked) =>
                        handleSelectAll(Boolean(checked))
                      }
                    />
                  </th>
                  <th className="px-4 py-3 text-center uppercase">
               
                  </th>
                  <th className="px-4 py-3 text-center uppercase rounded-tr-md">
                 
                  </th>
                </tr>
              </thead> */}

              {/* Table Body */}
              <tbody>
                {/* Search Row */}
                {/* <tr className="border-b border-gray-600">
                  <td className="px-4 py-2 text-left">
                    <Checkbox disabled />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="relative w-full flex justify-center">
                      <input
                        type="text"
                        placeholder="Search Folder"
                        value={folderSearch}
                        onChange={(e) => setFolderSearch(e.target.value)}
                        className="bg-gray-800 text-white px-4 py-1 rounded w-[180px]"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="relative w-full flex justify-center">
                      <input
                        type="text"
                        placeholder="Search Date"
                        value={dateSearch}
                        onChange={(e) => setDateSearch(e.target.value)}
                        className="bg-gray-800 text-white px-4 py-1 rounded w-[180px]"
                      />
                    </div>
                  </td>
                </tr> */}

                {/* Data Rows */}
                {paginatedData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="px-4 py-2 text-left">
                      <Checkbox
                        checked={item.isChecked}
                        onCheckedChange={(checked) => {
                          const updatedData = [...filteredData];
                          updatedData[startIndex + index].isChecked =
                            Boolean(checked);
                          setFilteredData(updatedData);
                        }}
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-100 text-center">
                      {item.folderName}
                    </td>
                    <td className="px-4 py-2 text-center flex gap-5 justify-end">
                      <Button className="bg-neutral-950 text-white border border-neutral-300 px-6 py-2 hover:bg-neutral-800">
                        Download
                      </Button>
                      <Button className="bg-neutral-950 text-white border border-neutral-300 px-6 py-2 hover:bg-neutral-800">
                        Delete
                      </Button>
                      <Button className="bg-neutral-950 text-white border border-neutral-300 px-6 py-2 hover:bg-neutral-800">
                        Preview{" "}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-2 flex justify-between items-center text-sm text-gray-400">
            <span>
              Showing {startIndex + 1} to {endIndex} of {filteredData.length}{" "}
              Entries
            </span>

            {/* Pagination */}
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-2 py-1 text-gray-400 hover:text-white disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({
                length: Math.ceil(filteredData.length / itemsPerPage),
              })
                .slice(0, 4)
                .map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-2 py-1 ${
                      currentPage === i + 1
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              <span className="px-2 py-1 text-gray-400">...</span>
              <button
                onClick={() =>
                  handlePageChange(
                    Math.ceil(filteredData.length / itemsPerPage)
                  )
                }
                className="px-2 py-1 text-gray-400 hover:text-white"
              >
                {Math.ceil(filteredData.length / itemsPerPage)}
              </button>
              <button
                disabled={
                  currentPage === Math.ceil(filteredData.length / itemsPerPage)
                }
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-2 py-1 text-gray-400 hover:text-white disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* upload reupload Button */}
          <div className="px-4 py-4 mt-8 flex gap-4 justify-end">
            <Button
              onClick={() => {
                router.push("/mediaManagement-table/import/excelPreview");
              }}
              className="bg-neutral-900 text-white border border-neutral-700 px-6 py-2 hover:bg-neutral-800"
            >
              Reupload
            </Button>
            <Button
              onClick={() => {
                showToast({
                  type: "success",
                  title: "Saved",
                  description: "Your details have been saved successfully.",
                  actionText: "OK",
                  onAction: () => {
                    router.push("/mediaManagement-table/import");
                  },
                });
              }}
              className="bg-white text-black px-6 py-2 hover:bg-gray-300"
            >
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
