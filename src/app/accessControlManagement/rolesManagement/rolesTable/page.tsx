"use client";
import { DataTableDemo } from "@/app/accessControlManagement/rolesManagement/rolesTable/data-table";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
       <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

{/* Main Content */}
<div
  className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${
    isOpen ? "pl-60" : "pl-16"
  }`} // Adjust padding based on sidebar state
>
  <Header isOpen={isOpen} setIsOpen={setIsOpen}  />
      <div className="container mx-auto py-10 pt-10 pr-10 pl-[60px]">
        {/* Updated Heading */}
        <h1 className="text-xl font-bold mb-6 flex items-center space-x-3">
          {/* Download Icon (Inline SVG) */}
          <svg
            className="cursor-pointer"
            onClick={() => {
              router.back();
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M10.042 12.0004L15.683 6.73145C16.086 6.35445 16.108 5.72145 15.731 5.31745C15.355 4.91345 14.72 4.89245 14.318 5.26945L8.617 10.5954C8.219 10.9674 8 11.4654 8 12.0004C8 12.5354 8.219 13.0334 8.616 13.4054L14.317 18.7314C14.51 18.9114 14.755 19.0004 15 19.0004C15.268 19.0004 15.534 18.8944 15.73 18.6834C16.107 18.2794 16.085 17.6474 15.682 17.2694L10.042 12.0004Z"
              fill="#FAFAFA"
            />
          </svg>
          {/* Heading Text */}
          <span>Access Control Management</span>
          <span>{">"}</span>
          <span>Roles</span>
        </h1>
        <DataTableDemo />
      </div>
      </div>
    </>
  );
}
