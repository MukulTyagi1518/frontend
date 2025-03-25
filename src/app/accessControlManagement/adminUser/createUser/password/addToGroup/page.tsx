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
  { key: "groupName", header: "GROUP NAME" },
  { key: "description", header: "DESCRIPTION" },
  { key: "mailId", header: "MAIL ID" }, // Add the MAIL ID column
];

export default function addToGroup() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

  // Define the steps for the progress bar
  const progressBarSteps = [
    {
      name: "User Details",
      color: "#0E9F6E", // Green
    },
    {
      name: "Password",
      color: "#0E9F6E", // Green
    },
    {
      name: "Add to Group",
      color: "#FAFAFA", // Gray
    },
    {
      name: "Add to Role",
      color: "#A3A3A3", // Gray
    },
  ];

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
            "Access Control Management",
            "Create Users",
            "Password",
            "Add to Group",
          ]}
          breadcrumbLinks={[
            "/accessControlManagement/adminUser/table",
            "/accessControlManagement/adminUser/createUser",
            "/accessControlManagement/adminUser/createUser/password",
            "/accessControlManagement/adminUser/createUser/password/addToGroup",
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
                d="M10.042 12L15.683 6.73096C16.086 6.35396 16.108 5.72096 15.731 5.31696C15.355 4.91296 14.72 4.89196 14.318 5.26896L8.617 10.595C8.219 10.967 8 11.465 8 12C8 12.535 8.219 13.033 8.616 13.405L14.317 18.731C14.51 18.911 14.755 19 15 19C15.268 19 15.534 18.894 15.73 18.683C16.107 18.279 16.085 17.647 15.682 17.269L10.042 12Z"
                fill="#FAFAFA"
              />
            </svg>,
          ]}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          headerTitle="Add to Group"
          showBackArrow={true}
          showDropdown={false}
          showButton={false}
          statusBarSteps={progressBarSteps.map((step, index) => (
            <div className="flex items-center space-x-2" key={index}>
              {index > 0 && (
                <div
                  className="flex-grow h-px"
                  style={{
                    backgroundColor: progressBarSteps[index - 1].color,
                  }}
                ></div>
              )}
              <div
                style={{
                  color: step.color,
                }}
                className="flex items-center space-x-2 text-sm font-medium"
              >
                <span>{step.name}</span>
              </div>
            </div>
          ))}
          statusBarColorOverride={{
            1: progressBarSteps[0].color, // Create - Password
            2: progressBarSteps[0].color, // Password - Add to Group
          }}
        >
          <DynamicTable
            columns={columns}
            headerColor="#1a1a1a"
            useData={useGroupData} // Correct hook for group data
            showBorder={false}
            showDetailsColumn={false}
            uniqueKey="groupName"
          />

          <div className="flex justify-end pt-8">
            <Button
              variant="ghost"
              className="rounded-lg bg-[#FAFAFA] text-[#262626] px-4 py-2 flex items-center space-x-2"
              onClick={() =>
                router.push(
                  "/accessControlManagement/adminUser/createUser/password/addToGroup/addToRole"
                )
              }
            >
              Next
            </Button>
          </div>
        </LiveSessionForm>
      </div>
    </>
  );
}