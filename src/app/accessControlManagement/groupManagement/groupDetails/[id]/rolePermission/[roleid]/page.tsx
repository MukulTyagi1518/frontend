"use client";

import LiveSessionForm from "@/components/ui/LiveSessionForm";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useReducer, useState, useEffect } from "react";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { useRolesData } from "./useRolesData";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";

export default function rolePermission({
  params,
}: {
  params: Promise<{ id: string; roleid: string }>;
}) {
  const router = useRouter();
  const [isOpen , setIsOpen] = useState(true);
  const [roleId, setRoleId] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [roleData, setRoleData] = useState<any>(null);
  const [status, setStatus] = useState<boolean>(true);
  const [isEditable, setIsEditable] = useState(false);

  // Extract roleId from URL params properly

  useEffect(() => {
    params.then((resolvedParams) => {
      if (resolvedParams?.id) {
        const extractedGroupId = decodeURIComponent(resolvedParams.id); // Extract groupId
        console.log("Extracted Group ID:", extractedGroupId);
        setGroupId(extractedGroupId);
      }
      if (resolvedParams?.roleid) {
        const extractedRoleId = decodeURIComponent(resolvedParams.roleid); // Extract roleId
        console.log("Extracted Role ID:", extractedRoleId);
        setRoleId(extractedRoleId);
      }
    });
  }, [params]);

  // Fetch role details from API
  useEffect(() => {
    if (!roleId) return; // Ensure roleId is set before making the request

    console.log(`Fetching role data for roleId: ${roleId}`);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/role/get/${roleId}`
    )
      .then((res) => res.json())
      .then((result) => {
        console.log("Fetched Role Data:", result);
        if (result.success) {
          setRoleData(result.data);
          setStatus(result.data.isActive);
        } else {
          console.error("Failed to fetch role details:", result.message);
        }
      })
      .catch((error) => console.error("Error fetching role details:", error));
  }, [roleId]);

  // Fetch permissions using useRolesData
  const { data: permissionsData, totalPages } = useRolesData(
    roleId,
    currentPage,
    searchQuery
  );
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
      <LiveSessionForm
        breadcrumb={[
          "Access Control Management",
          "Group Details",
          "Role Permissions",
        ]}
        breadcrumbLinks={[
          "/accessControlManagement/groupManagement/table",
          `/accessControlManagement/groupManagement/groupDetails/${groupId}`,
          `/accessControlManagement/groupManagement/groupDetails/${groupId}/rolePermission/${roleId}`,
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
          </svg>, // Icon for "Access Control Management"
        ]}
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        headerTitle={`${roleId} Permissions`}
        onActionButtonClick={() => setIsEditable(false)}
        showButton={false}
        showBackArrow={true}
        showDropdown={false}
      >
        {/* Status */}
        <div className="pb-4 flex items-center space-x-4">
          <label className="text-sm font-medium text-neutral-50">Status:</label>
          <Checkbox
            checked={status}
            onCheckedChange={(checked) => setStatus(!!checked)}
            className="form-checkbox h-5 w-5 text-green-500 bg-gray-700 border-neutral-600"
          />
          <span className="text-white">{status ? "Active" : "Inactive"}</span>
        </div>
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-x-32 gap-y-4">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Role Name
            </label>
            <Input
              type="text"
              value={roleData?.roleName || "Loading..."}
              readOnly={!isEditable}
              className="mt-2"
            />
          </div>
          {/* Role Description */}
          <div className="col-span-2 max-w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Role Description
            </label>
            <Input
              placeholder="Enter Description"
              value={roleData?.roleDesc || "Loading..."}
              readOnly={!isEditable}
              className="w-full resize-none mt-2 p-2 rounded-md border focus:border-gray-400 focus:outline-none"
            ></Input>
          </div>
        </div>

        {/* Roles Table */}
        <div className="mt-6 max-w-full">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Role Permissions
          </h2>
          <DynamicTable
            columns={[
              { key: "permissionsName", header: "PERMISSION NAME" },
              { key: "permissionsId", header: "PERMISSION ID" },
              { key: "description", header: "DESCRIPTION" },
              { key: "moduleName", header: "MODULE NAME" },
            ]}
            headerColor="#1a1a1a"
            useData={() => ({ data: permissionsData, totalPages })}
            showBorder={false}
            showDetailsColumn={false}
            uniqueKey="permissionsId"
          />
        </div>
      </LiveSessionForm>
      </div>
    </>
  );
}
