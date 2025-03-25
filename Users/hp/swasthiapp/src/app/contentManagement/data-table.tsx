"use client";

import { useState } from "react";
import DynamicTable from "@/components/ui/DynamicContentTable";
import { useRouter } from "next/navigation";

// Define the type for our content data
interface ContentData {
  _id: string;
  sno: number;
  title: string;
  createdAt: string;
  lastUpdate: string;
  route?: string;
 }


  

// Create dummy data
const dummyData: ContentData[] = [
  {
    _id: "1",
    sno: 1,
    title: "About Us",
    createdAt: new Date("2025-02-28").toLocaleString(),
    lastUpdate: new Date("2025-03-01").toLocaleString(),
    route: "aboutUs",
   },
  {
    _id: "2",
    sno: 2,
    title: "Cancellation & Refund Policy",
    createdAt: new Date("2025-02-27").toLocaleString(),
    lastUpdate: new Date("2025-02-28").toLocaleString(),
    route: "cancellationAndRefundPolicy",
   },
  {
    _id: "3",
    sno: 3,
    title: "Contact Us & Footer",
    createdAt: new Date("2025-02-26").toLocaleString(),
    lastUpdate: new Date("2025-02-27").toLocaleString(),
    route: "contactUsAndFooter",
  },
  {
    _id: "4",
    sno: 4,
    title: "Data Deletion Policy",
    createdAt: new Date("2025-02-25").toLocaleString(),
    lastUpdate: new Date("2025-02-26").toLocaleString(),
    route: "dataDeletionPolicy",
  },
  {
    _id: "5",
    sno: 5,
    title: "Our Story",
    createdAt: new Date("2025-02-24").toLocaleString(),
    lastUpdate: new Date("2025-02-25").toLocaleString(),
    route: "ourStory",
  },
  {
    _id: "6",
    sno: 6,
    title: "Privacy Policy",
    createdAt: new Date("2025-02-24").toLocaleString(),
    lastUpdate: new Date("2025-02-25").toLocaleString(),
    route: "/privacyPolicy",
  },
  {
    _id: "7",
    sno: 7,
    title: "Terms & Conditions",
    createdAt: new Date("2025-02-24").toLocaleString(),
    lastUpdate: new Date("2025-02-25").toLocaleString(),
    route: "termsAndConditions",
  }
];

// Update columns definition
const columns = [
  { key: "sno", header: "S.NO." },
  { key: "title", header: "TITLE" },
  { key: "createdAt", header: "CREATED AT" },
  { key: "lastUpdate", header: "LAST UPDATED" },
];

export function DataTableDemo() {
  
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedItems(new Set(selectedIds));
  };

  const handleDetailsClick = (content: ContentData) => {
    router.push(`/contentManagement/${content.route}`);
  };

  // Mock useData function with pagination and search
  const useContentData = (page: number, search: string) => {
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    
    const filteredData = dummyData.filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
    
    return {
      data: filteredData.slice(start, start + pageSize),
      totalPages: Math.ceil(filteredData.length / pageSize),
    };
  };

  return (
    <div className="w-full">
      <DynamicTable
        columns={columns}
        headerColor="#1a1a1a"
        useData={useContentData}
        showBorder={false}
        showDetailsColumn={true}
        onDetailsClick={handleDetailsClick}
        uniqueKey="_id"
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}