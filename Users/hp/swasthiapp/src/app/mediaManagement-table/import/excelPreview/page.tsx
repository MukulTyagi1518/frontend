"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { Upload } from "lucide-react";
import { read, utils } from "xlsx";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast/toast-context";
import Cookies from "js-cookie";
interface TableData {
  id: string;
  mediaName: string;
  date: string;
  category: string;
  deviceType: string;
  dimensions: string;
  format: string;
  destination: string;
  isChecked: boolean;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const idToken = Cookies.get("id_token");
const refreshToken = Cookies.get("refresh_token");
const username = Cookies.get("username");
export default function ImportPage() {
  const router = useRouter();
  const [totalEntries, setTotalEntries] = useState(30); // Total entries
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  // Full Dummy Data
  const fullData = Array.from({ length: totalEntries }, (_, i) => ({
    folderName: `Folder ${i + 1}`,
    date: `05-0${(i % 9) + 1}-2024`,
    isChecked: false, // Checkbox state
    category: `Category ${i + 1}`,
    device: "desktop",
    dimensions: "800 × 400",
    format: "PNG",
    destination: "Public ",
  }));

  // const [filteredData, setFilteredData] = useState(fullData);
  // const [folderSearch, setFolderSearch] = useState("");
  // const [categorySearch, setCategorySearch] = useState("");
  // const [dateSearch, setDateSearch] = useState("");
  // const [selectAll, setSelectAll] = useState(false);

  // Instant Filtering Logic
  // useEffect(() => {
  //   if (!folderSearch && !dateSearch) {
  //     setFilteredData(fullData); // Reset to original data when search bars are cleared
  //   } else {
  //     const filtered = fullData.filter(
  //       (item) =>
  //         item.folderName.toLowerCase().includes(folderSearch.toLowerCase()) &&
  //         item.date.includes(dateSearch)
  //     );
  //     setFilteredData(filtered);
  //   }
  //   setCurrentPage(1); // Reset to first page on search
  // }, [folderSearch, dateSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  // const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle header checkbox toggle
  // const handleSelectAll = (isChecked: boolean) => {
  //   setSelectAll(isChecked);
  //   const updatedData = filteredData.map((item, index) => {
  //     if (index >= startIndex && index < endIndex) {
  //       return { ...item, isChecked };
  //     }
  //     return item;
  //   });
  //   setFilteredData(updatedData);
  // };

  const [data, setData] = useState<TableData[]>([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [filters, setFilters] = useState({
    mediaName: "",
    date: "",
    category: "",
    deviceType: "",
    dimensions: "",
    format: "",
    destination: "",
  });
  const [selectAll, setSelectAll] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const result = e.target?.result;
          const workbook = read(result, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet);

          const formattedData: TableData[] = jsonData.map(
            (row: any, index) => ({
              id: index.toString(),
              mediaName: String(row.MEDIA_NAME || row["Media Name"] || ""),
              date: String(row.date || row["Date"] || ""),
              category: String(row.CATEGORY || row["CATEGORY"] || ""),
              deviceType: String(
                row.DISPLAY_DEVICE_TYPE || row["Device Type"] || ""
              ),
              dimensions: String(
                row.MEDIA_DIMENSION || row["Dimensions"] || ""
              ),
              format: String(row.MEDIA_FORMAT || row["Format"] || ""),
              destination: String(row.destination || row["Destination"] || ""),
              isChecked: false,
            })
          );
          setIsUploaded(true);
          setData(formattedData);
          setCsvFile(file);
        } catch (err) {
          setError(
            "Error parsing file. Please make sure it's a valid Excel or CSV file."
          );
        }
      };

      fileReader.readAsArrayBuffer(file);
    } catch (err) {
      setError("Error reading file");
    } finally {
      setLoading(false);
    }
  };
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const mediaNameMatch = String(item.mediaName)
        .toLowerCase()
        .includes(filters.mediaName.toLowerCase());

      const dateMatch = String(item.date)
        .toLowerCase()
        .includes(filters.date.toLowerCase());

      const categoryMatch = String(item.category)
        .toLowerCase()
        .includes(filters.category.toLowerCase());

      const deviceTypeMatch = String(item.deviceType)
        .toLowerCase()
        .includes(filters.deviceType.toLowerCase());

      const dimensionsMatch = String(item.dimensions)
        .toLowerCase()
        .includes(filters.dimensions.toLowerCase());

      const formatMatch = String(item.format)
        .toLowerCase()
        .includes(filters.format.toLowerCase());

      const destinationMatch = String(item.destination)
        .toLowerCase()
        .includes(filters.destination.toLowerCase());

      return (
        mediaNameMatch &&
        dateMatch &&
        categoryMatch &&
        deviceTypeMatch &&
        dimensionsMatch &&
        formatMatch &&
        destinationMatch
      );
    });
  }, [data, filters]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setData(data.map((item) => ({ ...item, isChecked: checked })));
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, isChecked: checked } : item
      )
    );
  };
  // Function to handle CSV upload
  const uploadCSV = async () => {
    const csvFormData = new FormData();
    // const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    if (csvFile) {
      csvFormData.append("file", csvFile);
    }

    try {
      const response = await fetch(`${API_URL}/fitnearn/web/admin/upload-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "x-refresh-token": refreshToken || "",
          "x-username": username || "",
        },
        body: csvFormData,
      });

      const data = await response.json();
      Cookies.set("redisKey", data.redisKey);
      router.push("/mediaManagement-table/import/bulkUpload");
      showToast({
        type: "success",
        title: "CSV Uploaded!",
        description: "Your details have been saved successfully.",
        actionText: "OK",
      });
      console.log("Data:", data);
      if (!data.success) {
        throw new Error(data.message || "Failed to upload CSV");
      }
      return data;
    } catch (error) {
      console.error("Error uploading CSV:", error);
      throw error;
    }
  };

  return (
    <div className="w-full min-h-screen bg-black-900 text-white">
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

    {/* Main Content */}
    <div
      className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${
        isOpen ? "pl-60" : "pl-16"
      }`}
    >
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />


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
              onClick={() => router.push("/mediaManagement-table/import")}
              className="text-2xl font-bold text-white hover:text-gray-400"
            >
              Preview Excel Files
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative flex items-center p-8 border-t border-gray-600 ">
            <span className="text-sm text-green-600">Choose Destination</span>
            <div className="flex-grow h-px bg-green-600 mx-4"></div>
            <span className="text-sm text-gray-400">Upload .CSV</span>
            <div className="flex-grow h-px bg-gray-600 mx-4"></div>
            <span className="text-sm text-gray-400">Bulk Upload</span>
            <div className="flex-grow h-px bg-gray-600 mx-4"></div>
            <span className="text-sm text-gray-400">Complete</span>
          </div>

          {/* Breadcrumb */}

          {/* Create Folder Button */}

          <div className="space-y-8">
            {/* File Upload Section */}
            {!isUploaded && (
              <div className="flex items-center justify-center w-[600px] m-auto py-20">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-[400px]
            border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-950 hover:bg-neutral-700 transition-colors duration-200"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">
                        Click to upload meta data
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      XLS, XLSX or CSV (MAX. 30 MB)
                    </p>
                    {loading && (
                      <p className="mt-2 text-sm text-blue-400">
                        Processing file...
                      </p>
                    )}
                    {error && (
                      <p className="mt-2 text-sm text-red-400">{error}</p>
                    )}
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}

            {/* Table Section */}

            {isUploaded && (
              <div className="rounded-md border border-neutral-700 w-[1150px] mx-5">
                <Table className="table-auto w-full border-collapse  border-neutral-700 text-sm">
                  <TableHeader className="bg-neutral-950 text-white">
                    <TableRow className="bg-neutral-950 text-white">
                      <TableHead className="w-12 text-center border-neutral-700">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={(checked) =>
                            handleSelectAll(Boolean(checked))
                          }
                          className="h-4 w-4 rounded  border-neutral-600 focus:ring-2 focus:ring-blue-500"
                        />
                      </TableHead>
                      <TableHead className="px-4 py-2 text-center border-neutral-700">
                        Media Name
                      </TableHead>
                      <TableHead className="px-4 py-2 text-center border-neutral-700">
                        Date
                      </TableHead>
                      <TableHead className="px-4 py-2 text-center border-neutral-700">
                        Category
                      </TableHead>
                      <TableHead className="px-4 py-2 text-center border-neutral-700">
                        Device Type
                      </TableHead>
                      <TableHead className="px-4 py-2 text-center border-neutral-700">
                        Dimensions
                      </TableHead>
                      <TableHead className="px-4 py-2 text-center border-neutral-700">
                        Format
                      </TableHead>
                
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Search Filters */}
                    <TableRow className="bg-neutral-900 text-gray-300">
                      <TableCell className="text-center border-neutral-700">
                        <Checkbox
                          disabled
                          className="h-4 w-4 rounded border border-neutral-600"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2  border-neutral-700">
                        <Input
                          placeholder="Search "
                          value={filters.mediaName}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              mediaName: e.target.value,
                            }))
                          }
                          className="w-full bg-neutral-950 text-white px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2  border-neutral-700">
                        <Input
                          placeholder="Search "
                          value={filters.date}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                          className="w-full bg-neutral-950 text-white px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2  border-neutral-700">
                        <Input
                          placeholder="Search "
                          value={filters.category}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="w-full bg-neutral-950 text-white px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2  border-neutral-700">
                        <Input
                          placeholder="Search  "
                          value={filters.deviceType}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              deviceType: e.target.value,
                            }))
                          }
                          className="w-full bg-neutral-950 text-white px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2  border-neutral-700">
                        <Input
                          placeholder="Search "
                          value={filters.dimensions}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              dimensions: e.target.value,
                            }))
                          }
                          className="w-full bg-neutral-950 text-white px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2  border-neutral-700">
                        <Input
                          placeholder="Search "
                          value={filters.format}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              format: e.target.value,
                            }))
                          }
                          className="w-full bg-neutral-950 text-white px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </TableCell>
                 
                    </TableRow>

                    {/* Data Rows */}
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-gray-400 py-8  border-neutral-700"
                        >
                          {loading
                            ? "Loading..."
                            : "No data available. Upload a file to get started."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row) => (
                        <TableRow
                          key={row.id}
                          className="hover:bg-neutral-950 transition-colors"
                        >
                          <TableCell className=" border-neutral-700">
                            <Checkbox
                              checked={row.isChecked}
                              onCheckedChange={(checked) =>
                                handleSelectRow(row.id, Boolean(checked))
                              }
                              className="h-4 w-4 rounded  border-neutral-600 focus:ring-2 focus:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="px-4 py-2 text-center border-neutral-700 text-white">
                            {row.mediaName}
                          </TableCell>
                          <TableCell className="px-4 py-2 text-center border-neutral-700 text-white">
  {new Date(
    (Number(row.date) - 25569) * 86400 * 1000
  ).toLocaleDateString()}
</TableCell>


                          <TableCell className="px-4 py-2 text-center  border-neutral-700 text-white">
                            {row.category}
                          </TableCell>
                          <TableCell className="px-4 py-2 text-center  border-neutral-700 text-white">
                            {row.deviceType}
                          </TableCell>
                          <TableCell className="px-4 py-2 text-center  border-neutral-700 text-white">
                            {row.dimensions}
                          </TableCell>
                          <TableCell className="px-4 py-2 text-center  border-neutral-700 text-white">
                            {row.format}
                          </TableCell>
                          
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Table Footer */}

          {isUploaded && (
            <div className="px-4 py-2 flex justify-between items-center text-sm text-gray-400">
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
                    currentPage ===
                    Math.ceil(filteredData.length / itemsPerPage)
                  }
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-2 py-1 text-gray-400 hover:text-white disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="px-4 py-4 mt-8 flex gap-4 justify-end">
            {isUploaded && (
              <Button
                onClick={() => {
                  location.reload();
                }}
                className="bg-neutral-900 text-white border border-neutral-700 px-6 py-2 hover:bg-neutral-950"
              >
                Reupload
              </Button>
            )}

            <Button
              onClick={() => {
                uploadCSV();
              }}
              className="bg-white text-black px-6 py-2 hover:bg-gray-300"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
</div>
  );
}
