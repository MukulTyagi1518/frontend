"use client";

import LiveSessionForm from "@/components/ui/LiveSessionForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { useGroupData, Group } from "./useGroupData";
import DynamicTable from "@/components/ui/DynamicSessionTable";

// Adjusted column definitions
const columns: { key: keyof Group; header: string }[] = [
  { key: "name", header: "USER SUBSCRIPTION ID" },
  { key: "description", header: "USER ID" },
  { key: "groupEmail", header: "START DATE" },
  { key: "groupEmail", header: "STATUS" },
];

export default function addToGroup() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

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
      <LiveSessionForm
        breadcrumb={[
          "Subscription Management",
          "Standard Subscription Details",
          "Analytics",
        ]}
        breadcrumbLinks={[
          "/subscriptionManagement",
          "/subscriptionManagement/details/65465",
          "/subscriptionManagement/analytics",
        ]}
        breadcrumbIcons={[
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M3 7.25C2.0335 7.25 1.25 8.0335 1.25 9V20C1.25 20.9665 2.0335 21.75 3 21.75H21C21.9665 21.75 22.75 20.9665 22.75 20V9C22.75 8.0335 21.9665 7.25 21 7.25H3Z"
              fill="#FAFAFA"
            />
            <path
              d="M10.4301 10.3856C10.201 10.2252 9.90169 10.2056 9.65364 10.3348C9.40559 10.4639 9.25 10.7203 9.25 11V18C9.25 18.2797 9.40559 18.5361 9.65364 18.6652C9.90169 18.7944 10.201 18.7748 10.4301 18.6144L15.4301 15.1144C15.6306 14.9741 15.75 14.7447 15.75 14.5C15.75 14.2553 15.6306 14.0259 15.4301 13.8856L10.4301 10.3856Z"
              fill="#262626"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.25 5.5C3.25 5.08579 3.58579 4.75 4 4.75H20C20.4142 4.75 20.75 5.08579 20.75 5.5C20.75 5.91421 20.4142 6.25 20 6.25H4C3.58579 6.25 3.25 5.91421 3.25 5.5ZM5.25 3C5.25 2.58579 5.58579 2.25 6 2.25H18C18.4142 2.25 18.75 2.58579 18.75 3C18.75 3.41421 18.4142 3.75 18 3.75H6C5.58579 3.75 5.25 3.41421 5.25 3Z"
              fill="#FAFAFA"
            />
          </svg>,
        ]}
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        headerTitle="Analytics"
        showBackArrow={true}
        showDropdown={false}
        showButton={false}
      >
        <DynamicTable
          columns={columns}
          headerColor="#1a1a1a"
          useData={useGroupData} // Correct hook for group data
          showBorder={false}
          showDetailsColumn={false}
          uniqueKey="groupId"
        />
      </LiveSessionForm>
      </div>
    </>
  );
}
