"use client";

import { useRouter } from "next/navigation";
import {useState} from "react";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { useGroupData, Group } from "./useGroupData";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const columns: { key: keyof Omit<Group, "details">; header: string }[] = [
  { key: "name", header: "GROUP NAME" },
  { key: "description", header: "DESCRIPTION" },
  { key: "groupEmail", header: "GROUP EMAIL" },
  { key: "createdAt", header: "CREATED AT" },
];

export default function AccessControlManagementPage() {
  const router = useRouter();
const [isOpen, setIsOpen] = useState(true);
  const handleDetailsClick = (item: Group) => {
    router.push(
      `/accessControlManagement/groupManagement/groupDetails/${encodeURIComponent(
        item.groupId
      )}`
    );
  };

  const handleRemoveGroup = () => {
    console.log("Remove Group button clicked");
  };

  const handleAddGroup = () => {
    router.push(`/accessControlManagement/groupManagement/createGroup/`);
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
      <div className="container mx-auto py-10 pt-24 pr-5 pl-[280px]">
        {/* Header */}
        <div className="flex items-center mb-6 space-x-4">
          <span
            className="cursor-pointer flex items-center"
            onClick={() => router.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M14.653 19C14.3001 18.9999 13.9617 18.8526 13.7122 18.5903L8.3896 12.9972C8.14014 12.735 8 12.3794 8 12.0086C8 11.6378 8.14014 11.2822 8.3896 11.02L13.7122 5.42688C13.835 5.29333 13.9818 5.1868 14.1441 5.11352C14.3065 5.04024 14.4811 5.00167 14.6578 5.00005C14.8345 4.99844 15.0097 5.03382 15.1732 5.10412C15.3368 5.17443 15.4853 5.27826 15.6103 5.40955C15.7352 5.54084 15.834 5.69696 15.9009 5.8688C15.9678 6.04064 16.0015 6.22477 16 6.41043C15.9984 6.5961 15.9617 6.77958 15.892 6.95017C15.8222 7.12077 15.7209 7.27506 15.5938 7.40405L11.2119 12.0086L15.5938 16.6131C15.7798 16.8087 15.9065 17.0578 15.9578 17.329C16.0091 17.6002 15.9828 17.8813 15.8821 18.1368C15.7814 18.3922 15.6109 18.6106 15.3921 18.7643C15.1733 18.9179 14.9161 18.9999 14.653 19Z"
                fill="#FAFAFA"
              />
            </svg>
          </span>
          <h1 className="text-xl font-bold">Access Control Management</h1>
          <span className="text-white text-2xl font-bold">›</span>
          <h1 className="text-xl font-bold text-white">Group Management</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 ml-2 mr-2">
          {/* Remove Group Button */}
          <Button
            variant="ghost"
            className="rounded-lg bg-[var(--Neutral-800,#262626)] text-white px-4 py-2 flex items-center"
            onClick={handleRemoveGroup}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <path
                d="M16.6667 5.6754H13.3333V3.92101C13.3333 3.45572 13.1577 3.00948 12.8452 2.68047C12.5326 2.35146 12.1087 2.16663 11.6667 2.16663H8.33333C7.89131 2.16663 7.46738 2.35146 7.15482 2.68047C6.84226 3.00948 6.66667 3.45572 6.66667 3.92101V5.6754H3.33333C3.11232 5.6754 2.90036 5.76782 2.74408 5.93232C2.5878 6.09683 2.5 6.31994 2.5 6.55259C2.5 6.78524 2.5878 7.00835 2.74408 7.17286C2.90036 7.33737 3.11232 7.42978 3.33333 7.42978H4.16667V17.0789C4.16667 17.5442 4.34226 17.9904 4.65482 18.3194C4.96738 18.6485 5.39131 18.8333 5.83333 18.8333H14.1667C14.6087 18.8333 15.0326 18.6485 15.3452 18.3194C15.6577 17.9904 15.8333 17.5442 15.8333 17.0789V7.42978H16.6667C16.8877 7.42978 17.0996 7.33737 17.2559 7.17286C17.4122 7.00835 17.5 6.78524 17.5 6.55259C17.5 6.31994 17.4122 6.09683 17.2559 5.93232C17.0996 5.76782 16.8877 5.6754 16.6667 5.6754ZM8.33333 3.92101H11.6667V5.6754H8.33333V3.92101ZM9.16667 15.3245C9.16667 15.5572 9.07887 15.7803 8.92259 15.9448C8.76631 16.1093 8.55435 16.2017 8.33333 16.2017C8.11232 16.2017 7.90036 16.1093 7.74408 15.9448C7.5878 15.7803 7.5 15.5572 7.5 15.3245V9.18417C7.5 8.95152 7.5878 8.72841 7.74408 8.5639C7.90036 8.3994 8.11232 8.30698 8.33333 8.30698C8.55435 8.30698 8.76631 8.3994 8.92259 8.5639C9.07887 8.72841 9.16667 8.95152 9.16667 9.18417V15.3245ZM12.5 15.3245C12.5 15.5572 12.4122 15.7803 12.2559 15.9448C12.0996 16.1093 11.8877 16.2017 11.6667 16.2017C11.4457 16.2017 11.2337 16.1093 11.0774 15.9448C10.9211 15.7803 10.8333 15.5572 10.8333 15.3245V9.18417C10.8333 8.95152 10.9211 8.72841 11.0774 8.5639C11.2337 8.3994 11.4457 8.30698 11.6667 8.30698C11.8877 8.30698 12.0996 8.3994 12.2559 8.5639C12.4122 8.72841 12.5 8.95152 12.5 9.18417V15.3245Z"
                fill="white"
              />
            </svg>
            Remove Group
          </Button>

          {/* Add Group Button */}
          <Button
            variant="ghost"
            className="rounded-lg bg-[var(--Neutral-800,#262626)] text-white px-4 py-2 flex items-center"
            onClick={handleAddGroup}
          >
            Add Group
            <PlusCircle size={16} />
          </Button>
        </div>

        {/* Dynamic Table */}
        <DynamicTable
          columns={columns}
          headerColor="#1a1a1a"
          useData={useGroupData}
          showBorder={false}
          showDetailsColumn={true}
          onDetailsClick={handleDetailsClick}
          uniqueKey="groupId"
          showTimeRange={false}
        />
      </div>
      </div>
    </>
  );
}
