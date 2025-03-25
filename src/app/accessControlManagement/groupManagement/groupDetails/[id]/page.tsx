"use client";

import LiveSessionForm from "@/components/ui/LiveSessionForm";
import { Input } from "@/components/ui/input";
import { User, PlusCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useReducer, useState, useEffect } from "react";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { useGroupData } from "./useGroupData";
import { useRolesData, RoleDetails } from "./useRolesData ";
import { usePermissionData } from "./usePermissionData";
import { usePermissionBoundary } from "./usePermissionBoundary";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import admin_img from "@/images/admin_img.webp";

export default function GroupDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [groupData, setGroupData] = useState<any>(null);
  const [activeSwitch, setActiveSwitch] = useReducer(
    (_: string, newValue: string) => newValue,
    "Group Members"
  );
  // Resolve params and set the sessionId
  useEffect(() => {
    params.then((resolvedParams) => {
      setGroupId(decodeURIComponent(resolvedParams.id)); // ✅ Correctly extract `groupId`
    });
  }, [params]);

  // Wrapper function to pass groupId to usePermissionData
  const fetchPermissions = (page: number, search: string) => {
    return usePermissionData(page, search, groupId); // ✅ Ensure search is passed
  };

  // Wrapper function to pass groupId to usePermissionBoundary
  const fetchPermissionBoundaries = (page: number, search: string) => {
    return usePermissionBoundary(page, search, groupId); // ✅ Ensure search is passed
  };

  const fetchRoles = (page: number, search: string) => {
    return useRolesData(page, search, groupId); // Ensure groupId is passed
  };

  const fetchGroupMembers = (page: number, search: string) => {
    return useGroupData(page, search, groupId); // Ensure groupId is passed correctly
  };

  useEffect(() => {
    if (groupId) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/group/get/${groupId}` // ✅ Updated API endpoint
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setGroupData(result.data);
            setStatus(result.data.status);
          }
        })
        .catch((error) =>
          console.error("Error fetching group details:", error)
        );
    }
  }, [groupId]);
  // Set "Created At" date
  useEffect(() => {
    const currentDate = new Date()
      .toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-"); // Replace slashes with dashes
    setCreatedAt(currentDate);
  }, []);
  const handleDetailsClick = (item: RoleDetails) => {
    console.log("Navigating to Role Permission with Role ID:", item.roleId);
    router.push(
      `/accessControlManagement/groupManagement/groupDetails/${groupId}/rolePermission/${item.roleId}`
    );
  };

  const [gender, setGender] = useState("Male");

  const genderOptions = ["Female", "Male", "Other"];
  const [application, setApplication] = useState<string>("Admin Panel");
  const [status, setStatus] = useState<boolean>(true); // Default Active
  const [loading, setLoading] = useState<boolean>(false); // Manages the loader
  const createdByOptions = ["Aniruddha", "Jitanshu", "Zoffi"];
  const [createdBy, setCreatedBy] = useState(createdByOptions[0]);
  const [isEditable, setIsEditable] = useState(false);

  const [selectedEntities, setSelectedEntities] = useState<{
    users: string[];
    roles: string[];
    permissions: string[];
    permissionBoundaries: string[];
  }>({
    users: [],
    roles: [],
    permissions: [],
    permissionBoundaries: [],
  });

  const handleRemoveSelected = async (
    type: "users" | "roles" | "permissions" | "permissionBoundaries"
  ) => {
    if (!groupId || selectedEntities[type].length === 0) {
      alert("No entities selected or invalid group ID.");
      return;
    }

    const apiMap: Record<typeof type, string> = {
      users: "group/remove-user",
      roles: "group/remove-role",
      permissions: "group/remove-permission",
      permissionBoundaries: "group/remove-permission-boundary",
    };

    // Ensure correct key name is used in requestBody
    const requestBody = {
      groupId: groupId,
      [type === "permissionBoundaries"
        ? "permissionBoundaryId"
        : `${type.slice(0, -1)}Id`]: selectedEntities[type], // ✅ FIXED
    };

    console.log("Sending API request with data:", requestBody); // ✅ Debugging the request body

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/${apiMap[type]}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log("API Response:", result); // ✅ Log API response

      if (response.ok && result.success) {
        alert(`${type} removed successfully!`);

        // ✅ Ensure the UI updates properly after removal
        setSelectedEntities((prev) => ({
          ...prev,
          [type]: prev[type].filter(
            (id) => !selectedEntities[type].includes(id)
          ),
        }));
      } else {
        alert(`Failed to remove ${type}: ` + result.message);
      }
    } catch (error) {
      console.error("Error removing entity:", error);
      alert("An error occurred while removing.");
    }
  };

  const handleSaveChanges = async () => {
    if (!groupId) {
      alert("Invalid group ID.");
      return;
    }
  
    // Ensure all array fields are properly formatted
    const updatedData = {
      groupId: groupId,
      name: groupName || groupData?.name || "", // Ensure it doesn't become undefined
      description: description || groupData?.description || "",
      createdBy: createdBy || groupData?.createdBy || "",
      groupEmail: groupEmail || groupData?.groupEmail || "",
  
      // Ensure array fields are always sent as an array, even if empty
      groupMembers: Array.isArray(groupData?.groupMemberId)
        ? groupData.groupMemberId
        : [],
      permissions: Array.isArray(groupData?.permissionId)
        ? groupData.permissionId
        : [],
      roles: Array.isArray(groupData?.roleId) ? groupData.roleId : [],
      permissionBoundaryId: Array.isArray(groupData?.permissionBoundaryId)
        ? groupData.permissionBoundaryId
        : [],
    };
  
    console.log("Sending Save Request:", updatedData); // ✅ Debugging before API call
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/group/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
  
      const result = await response.json();
      console.log("Save API Response:", result);
  
      if (response.ok && result.success) {
        alert("Group updated successfully!");
      } else {
        alert("Failed to update group: " + result.message);
      }
    } catch (error) {
      console.error("Error updating group:", error);
      alert("An error occurred while updating the group.");
    }
  };
  

  const handleDeleteGroup = async () => {
    if (!groupId) {
      alert("Invalid group ID.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/group/delete/${groupId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Group deleted successfully!");
        router.push("/accessControlManagement/groupManagement/table");
      } else {
        alert("Failed to delete group.");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("An error occurred while deleting the group.");
    }
  };

  const [groupName, setGroupName] = useState(groupData?.name || "");
  const [groupEmail, setGroupEmail] = useState(groupData?.groupEmail || "");
  const [description, setDescription] = useState(groupData?.description || "");

  // Load data into editable states when `groupData` updates
  useEffect(() => {
    if (groupData) {
      setGroupName(groupData.name || "");
      setGroupEmail(groupData.groupEmail || "");
      setDescription(groupData.description || "");
    }
  }, [groupData]);

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
        breadcrumb={["Access Control Management", "Group Details"]}
        breadcrumbLinks={[
          "/accessControlManagement/groupManagement/table", // Path for "Live Session Management"
          `/accessControlManagement/groupManagement/groupDetails/${groupId}`, // Current page
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
        isEditable={isEditable} // isEditable to the form
        setIsEditable={setIsEditable} // Pass setter to control edit state
        headerTitle={`${userId} Details`}
        showButton={false}
        showBackArrow={true}
        actionButtonLabel="Save"
        onActionButtonClick={handleSaveChanges}
        onDeleteClick={handleDeleteGroup}
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
        {/* Status Checkbox */}
        <div className="pb-4 flex items-center space-x-4">
          <label className="text-sm font-medium text-neutral-50">Status:</label>
          <Checkbox
            checked={groupData?.status || false} // Use `status` from API
            onCheckedChange={(checked) => setStatus(!!checked)}
            className="form-checkbox h-5 w-5 text-green-500 bg-gray-700 border-neutral-600"
          />
          <span className="text-white">
            {groupData?.status ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-x-32 gap-y-4">
          {/* Group ID */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Group ID
            </label>
            <Input
              type="text"
              value={groupData?.groupId || "Loading..."}
              readOnly
              className="mt-2"
              state="ReadOnly"
            />
          </div>

          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Group Name
            </label>
            <Input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              readOnly={!isEditable}
              className={`mt-2`}
              state={isEditable ? "Normal" : "ReadOnly"}
            />
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium">Created At</label>
            <Input
              type="text"
              value={
                groupData?.createdAt
                  ? new Date(groupData.createdAt).toLocaleDateString("en-US")
                  : "Loading..."
              }
              readOnly
              state="ReadOnly"
              className="mt-2"
            />
          </div>

          {/* Created By */}
          <div className="space-y-2">
            <label
              htmlFor="created"
              className="text-sm font-medium text-gray-400"
            >
              Created By
            </label>
            <Select onValueChange={setCreatedBy} value={createdBy}>
              <SelectTrigger
                id="created"
                className="w-full bg-neutral-800 text-gray-400 border-neutral-600"
              >
                <SelectValue placeholder="Select Creator" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-950 text-white border-neutral-600">
                {createdByOptions.map((option, index, array) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="hover:bg-gray-700"
                    style={{
                      borderBottom:
                        index !== array.length - 1
                          ? "1px solid var(--Neutral-600, #525252)"
                          : "none",
                      borderRadius: "0",
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span>{option}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group Email */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Group Email
            </label>
            <Input
              type="text"
              value={groupEmail}
              onChange={(e) => setGroupEmail(e.target.value)}
              readOnly={!isEditable}
              className={`mt-2`}
              state={isEditable ? "Normal" : "ReadOnly"}
            />
          </div>

          {/* Description */}
          <div className="col-span-2 max-w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <Input
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              readOnly={!isEditable}
              className={`w-full resize-none mt-2 p-2 rounded-md border `}
              state={isEditable ? "Normal" : "ReadOnly"}
            />
          </div>
        </div>

        {/* Switch Buttons */}
        <div className="mt-6 relative py-2">
          <div className="flex justify-between items-center space-x-4 relative z-10 ">
            {[
              "Group Members",
              "Permissions",
              "Permission Boundaries",
              "Roles",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveSwitch(item)}
                className={`px-6 py-2 relative z-10 text-sm font-medium focus:outline-none ${
                  activeSwitch === item
                    ? "border-b-2 border-white text-white"
                    : "border-b-2 border-neutral-600 text-neutral-50"
                }`}
                style={{
                  marginBottom: "-2px",
                }}
              >
                {item}
                {activeSwitch === item && (
                  <span className="text-red-500">*</span>
                )}
                {activeSwitch !== item && (
                  <span className="text-neutral-50">*</span>
                )}
              </button>
            ))}
          </div>
          {/* Connector Line */}
          <div
            className="absolute left-6 h-[2px] bg-gray-600 z-0"
            style={{
              right: "0",
              marginTop: "0px",
            }}
          ></div>
        </div>

        {/* Switch Context */}
        <div className="mt-6 max-w-full">
          {/* Groups */}
          {activeSwitch === "Group Members" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Group Members
              </h2>
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    router.push(
                      `/accessControlManagement/groupManagement/groupDetails/${groupId}/addUser`
                    )
                  }
                  className="flex items-center space-x-2 px-4 py-2 bg-[#262626] text-white rounded-lg focus:outline-none hover:opacity-90"
                >
                  <PlusCircle size={18} />
                  <span>Add Users</span>
                </button>
                <button
                  onClick={() => handleRemoveSelected("users")}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none hover:opacity-90"
                >
                  <span>Remove Users</span>
                </button>
              </div>
              <DynamicTable
                columns={[
                  { key: "userName", header: "USER NAME" },
                  { key: "userId", header: "USER ID" },
                  { key: "mailId", header: "MAIL ID" },
                  { key: "application", header: "APPLICATION" },
                  { key: "adminType", header: "ADMIN TYPE" },
                ]}
                headerColor="#1a1a1a"
                useData={fetchGroupMembers}
                showBorder={false}
                showDetailsColumn={false}
                uniqueKey="userId"
                onSelectionChange={(selectedIds) =>
                  setSelectedEntities((prev) => ({
                    ...prev,
                    users: Array.isArray(selectedIds) ? selectedIds : [],
                  }))
                }
              />
            </div>
          )}

          {/* Roles */}
          {activeSwitch === "Roles" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">Roles</h2>
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    router.push(
                      `/accessControlManagement/groupManagement/groupDetails/${groupId}/roles`
                    )
                  }
                  className="flex items-center space-x-2 px-4 py-2 bg-[#262626] text-white rounded-lg focus:outline-none hover:opacity-90"
                >
                  <PlusCircle size={18} />
                  <span>Add Roles</span>
                </button>
                <button
                  onClick={() => handleRemoveSelected("roles")}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none hover:opacity-90"
                >
                  <span>Remove Roles</span>
                </button>
              </div>
              <DynamicTable
                columns={[
                  { key: "roleName", header: "ROLE NAME" },
                  { key: "description", header: "DESCRIPTION" },
                ]}
                headerColor="#1a1a1a"
                useData={fetchRoles}
                showBorder={false}
                showDetailsColumn={true}
                onDetailsClick={handleDetailsClick}
                uniqueKey="roleId"
                onSelectionChange={(selectedIds) =>
                  setSelectedEntities((prev) => ({
                    ...prev,
                    roles: Array.isArray(selectedIds) ? selectedIds : [],
                  }))
                }
              />
            </div>
          )}

          {/* Permissions */}
          {activeSwitch === "Permissions" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Permissions
              </h2>
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    router.push(
                      `/accessControlManagement/groupManagement/groupDetails/${groupId}/permissions`
                    )
                  }
                  className="flex items-center space-x-2 px-4 py-2 bg-[#262626] text-white rounded-lg focus:outline-none hover:opacity-90"
                >
                  <PlusCircle size={18} />
                  <span>Add Permissions</span>
                </button>
                <button
                  onClick={() => handleRemoveSelected("permissions")}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none hover:opacity-90"
                >
                  <span>Remove Permissions</span>
                </button>
              </div>
              <DynamicTable
                columns={[
                  { key: "permissionsName", header: "PERMISSION NAME" },
                  { key: "permissionsId", header: "PERMISSION ID" },
                  { key: "description", header: "DESCRIPTION" },
                  { key: "moduleName", header: "MODULE NAME" },
                ]}
                headerColor="#1a1a1a"
                useData={fetchPermissions}
                showBorder={false}
                showDetailsColumn={false}
                uniqueKey="permissionsId"
                onSelectionChange={(selectedIds) =>
                  setSelectedEntities((prev) => ({
                    ...prev,
                    permissions: Array.isArray(selectedIds) ? selectedIds : [],
                  }))
                }
              />
            </div>
          )}

          {/* Permission Boundaries */}
          {activeSwitch === "Permission Boundaries" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Permission Boundaries
              </h2>
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    router.push(
                      `/accessControlManagement/groupManagement/groupDetails/${groupId}/permissionBoundaries`
                    )
                  }
                  className="flex items-center space-x-2 px-4 py-2 bg-[#262626] text-white rounded-lg focus:outline-none hover:opacity-90"
                >
                  <PlusCircle size={18} />
                  <span>Add Permissions</span>
                </button>
                <button
                  onClick={() => handleRemoveSelected("permissionBoundaries")}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none hover:opacity-90"
                >
                  <span>Remove Permissions</span>
                </button>
              </div>
              {groupId ? (
                <DynamicTable
                  columns={[
                    { key: "permissionsName", header: "PERMISSION NAME" },
                    { key: "permissionBoundaryId", header: "PERMISSION ID" },
                    { key: "description", header: "DESCRIPTION" },
                    { key: "moduleName", header: "MODULE NAME" },
                  ]}
                  headerColor="#1a1a1a"
                  useData={fetchPermissionBoundaries}
                  showBorder={false}
                  showDetailsColumn={false}
                  uniqueKey="permissionBoundaryId" // ✅ FIXED
                  onSelectionChange={(selectedIds) => {
                    console.log("Selected Permission Boundaries:", selectedIds); // ✅ Debugging
                    setSelectedEntities((prev) => ({
                      ...prev,
                      permissionBoundaries: Array.isArray(selectedIds)
                        ? selectedIds
                        : [],
                    }));
                  }}
                />
              ) : (
                <p className="text-gray-400">No Group ID provided</p>
              )}
            </div>
          )}
        </div>
      </LiveSessionForm>
      </div>
    </>
  );
}
