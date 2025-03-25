"use client";

import LiveSessionForm from "@/components/ui/LiveSessionForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import {
  usePermissionData,
  Permission,
} from "../../../createGroup/usePermissionData";
import DynamicTable from "@/components/ui/DynamicSessionTable";

const columns: { key: keyof Permission; header: string }[] = [
  { key: "permissionsName", header: "PERMISSIONS NAME" },
  { key: "permissionsId", header: "PERMISSIONS ID" },
  { key: "description", header: "DESCRIPTION" },
  { key: "moduleName", header: "MODULE NAME" },
];

export default function AddPermission({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [isOpen , setIsOpen] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [groupId, setGroupId] = useState<string>("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    params.then((resolvedParams) => {
      setGroupId(decodeURIComponent(resolvedParams.id)); // Extract groupId
    });
  }, [params]);

  const handlePermissionSelectionChange = (selectedIds: string[]) => {
    setSelectedPermissionIds(selectedIds);
  };

  const handleSavePermissions = async () => {
    if (!groupId || selectedPermissionIds.length === 0) {
      alert("No permissions selected or invalid group ID.");
      return;
    }

    const requestBody = {
      groupId: groupId,
      permissionId: selectedPermissionIds,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/group/add-permission`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok && result.success) {
        alert("Permissions added successfully!");
      } else {
        alert("Failed to add permissions: " + result.message);
      }
    } catch (error) {
      console.error("Error adding permissions:", error);
      alert("An error occurred while adding permissions.");
    }
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
  <Header isOpen={isOpen} setIsOpen={setIsOpen}  />
      <LiveSessionForm
        breadcrumb={[
          "Access Control Management",
          "Create Group",
          "Add Permission",
        ]}
        breadcrumbLinks={[
          "/accessControlManagement/adminUser/table",
          "/accessControlManagement/groupManagement/groupDetails",
          "/accessControlManagement/groupManagement/groupDetails",
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
        headerTitle="Add Permission"
        showBackArrow={true}
        showDropdown={false}
        showButton={false}
        actionButtonLabel="Save"
        onActionButtonClick={handleSavePermissions}
        actionButtonIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
          >
            <path
              d="M5 2.5V5C5 5.39782 5.15804 5.77936 5.43934 6.06066C5.72064 6.34196 6.10218 6.5 6.5 6.5H8.5C8.89782 6.5 9.27936 6.34196 9.56066 6.06066C9.84196 5.77936 10 5.39782 10 5V2.5H10.379C10.9094 2.50011 11.418 2.7109 11.793 3.086L13.414 4.707C13.7891 5.08199 13.9999 5.59061 14 6.121V12.5C14 13.0304 13.7893 13.5391 13.4142 13.9142C13.0391 14.2893 12.5304 14.5 12 14.5V10C12 9.60218 11.842 9.22064 11.5607 8.93934C11.2794 8.65804 10.8978 8.5 10.5 8.5H5.5C4.673 8.5 4 9.169 4 9.998V14.5C3.46957 14.5 2.96086 14.2893 2.58579 13.9142C2.21071 13.5391 2 13.0304 2 12.5V4.5C2 3.96957 2.21071 3.46086 2.58579 3.08579C2.96086 2.71071 3.46957 2.5 4 2.5H5ZM6 2.5V5C6 5.13261 6.05268 5.25979 6.14645 5.35355C6.24021 5.44732 6.36739 5.5 6.5 5.5H8.5C8.63261 5.5 8.75979 5.44732 8.85355 5.35355C8.94732 5.25979 9 5.13261 9 5V2.5H6ZM5 14.5H11V10C11 9.86739 10.9473 9.74021 10.8536 9.64645C10.7598 9.55268 10.6326 9.5 10.5 9.5H5.5C5.223 9.5 5 9.723 5 9.998V14.5Z"
              fill="#FAFAFA"
            />
          </svg>
        }
      >
        <DynamicTable
          columns={columns}
          headerColor="#1a1a1a"
          useData={usePermissionData}
          showBorder={false}
          showDetailsColumn={false}
          uniqueKey="permissionsId"
          onSelectionChange={handlePermissionSelectionChange}
        />
      </LiveSessionForm>
      </div>
    </>
  );
}
