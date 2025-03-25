"use client";

import LiveSessionForm from "@/components/ui/LiveSessionForm";
import { Input } from "@/components/ui/input";
import { User, PlusCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useReducer, useState, useEffect } from "react";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { useAddUser } from "./useAddUser";
import { useRolesData, Role } from "./useRolesData";
import { usePermissionData, Permission } from "./usePermissionData";
import { usePermissionBoundaries } from "./usePermissionBoundaries";

export default function CreateGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
   const [isOpen, setIsOpen] = useState(true);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [groupId, setgroupId] = useState<string>("");
  const [activeSwitch, setActiveSwitch] = useReducer(
    (_: string, newValue: string) => newValue,
    "Group Members"
  );

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

  const [gender, setGender] = useState("Male");
  const [groupName, setGroupName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [groupEmail, setGroupEmail] = useState<string>("");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissionBoundaryId, setPermissionBoundaryId] = useState<string[]>(
    []
  );
  const [status, setStatus] = useState<boolean>(true); // Default Active
  const [loading, setLoading] = useState<boolean>(false);
  const createdByOptions = ["Aniruddha", "Jitanshu", "Zoffi"];
  const [createdBy, setCreatedBy] = useState(createdByOptions[0]);
  const [isEditable, setIsEditable] = useState(false);
  const [showAddUsersTable, setShowAddUsersTable] = useState(false);
  const [showAddRolesTable, setShowAddRolesTable] = useState(false);
  const [showAddPermissionsTable, setShowAddPermissionsTable] = useState(false);
  const [showAddPermissionBoundaryTable, setShowAddPermissionBoundaryTable] =
    useState(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>(
    []
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedPermissionBoundaries, setSelectedPermissionBoundaries] =
    useState<string[]>([]);

  const handleCreateGroup = async () => {
    setLoading(true);

    const requestBody = {
      name: groupName,
      description: description,
      createdBy: "679dda7a3fd630b5dc2f14ef", // Replace with actual admin ID
      groupEmail: groupEmail,
      groupMemberId: selectedGroupMembers, // ✅ Send selected group members
      permissions: selectedPermissions, // ✅ Send selected permissions
      roles: selectedRoles, // ✅ Send selected roles
      isActive: status,
      permissionBoundaryId: selectedPermissionBoundaries, // ✅ Send selected permission boundaries
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/group/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok && result.success) {
        alert("Group created successfully!");
        router.push("/accessControlManagement/groupManagement/table");
      } else {
        alert("Failed to create group: " + result.message);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("An error occurred while creating the group.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = (item: Role) => {
    console.log("Navigating to Role Permission with Role ID:", item.roleId);
    router.push(
      `/accessControlManagement/groupManagement/createGroup/rolePermission/${item.roleId}`
    );
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
        breadcrumb={["Access Control Management", "Create group"]}
        breadcrumbLinks={[
          "/accessControlManagement/groupManagement/table", // Path for "Live Session Management"
          "/accessControlManagement/groupManagement/createGroup", // Current page
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
        headerTitle="Create Group"
        onActionButtonClick={
          () => setIsEditable(false) // Disable edit mode on analytics button click
        }
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
          {/* Group ID */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Group ID
            </label>
            <Input
              type="text"
              value={groupId || ""}
              readOnly
              className="mt-2"
            />
          </div>

          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Group Name
            </label>
            <Input
              type="text"
              placeholder="Enter Group Name"
              value={groupName} // ✅ Bind to state
              onChange={(e) => setGroupName(e.target.value)} // ✅ Update state
              className="mt-2"
            
            />
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium">Created At</label>
            <Input
              type="text"
              value={createdAt}
              readOnly
             
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
                          : "none", // Suppression line for all but the last item
                      borderRadius: "0", // Remove curvy borders for individual options
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
              value={groupEmail} // Bind to state
              onChange={(e) => setGroupEmail(e.target.value)} // Update state
              placeholder="Enter Group Email"
              className="mt-2"
             
            />
          </div>

          {/* Description */}
          <div className="col-span-2 max-w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <Input
              placeholder="Enter Description"
              value={description} // Bind to state
              onChange={(e) => setDescription(e.target.value)} // Update state
             
              className="w-full resize-none mt-2 p-2 rounded-md border focus:border-gray-400 focus:outline-none"
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
          {/* Group Members */}
          {activeSwitch === "Group Members" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Group Members
              </h2>

              {!showAddUsersTable ? (
                // Show Add Users Button when Table is NOT displayed
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddUsersTable(true)} // Show Table
                    className="flex items-center space-x-2 px-4 py-2 bg-[#262626] text-white rounded-lg focus:outline-none hover:opacity-90"
                  >
                    <PlusCircle size={18} />
                    <span>Add Users</span>
                  </button>
                </div>
              ) : (
                // Show Table when button is clicked
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddUsersTable(false)} // Hide Table
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
                    useData={useAddUser} // Use the same data fetching hook as Add Users page
                    showBorder={false}
                    showDetailsColumn={false}
                    uniqueKey="userId"
                    onSelectionChange={setSelectedGroupMembers}
                  />
                </>
              )}
            </div>
          )}

          {/* Roles */}
          {activeSwitch === "Roles" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">Roles</h2>
              {!showAddRolesTable ? (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddRolesTable(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#262626] text-white rounded-lg focus:outline-none hover:opacity-90"
                  >
                    <PlusCircle size={18} />
                    <span>Add Role</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddRolesTable(false)} // Hide Table
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none hover:opacity-90"
                    >
                      <span>Remove Roles</span>
                    </button>
                  </div>
                  <DynamicTable
                    columns={[
                      { key: "roleName", header: "ROLE NAME" },
                      { key: "roleDesc", header: "DESCRIPTION" },
                    ]}
                    headerColor="#1a1a1a"
                    useData={useRolesData}
                    showBorder={false}
                    showDetailsColumn={true}
                    onDetailsClick={handleDetailsClick}
                    uniqueKey="roleId"
                    onSelectionChange={setSelectedRoles}
                  />
                </>
              )}
            </div>
          )}

          {/* Permissions */}
          {activeSwitch === "Permissions" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Permissions
              </h2>
              {!showAddPermissionsTable ? (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddPermissionsTable(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#262626] text-white rounded-lg focus:outline-none hover:opacity-90"
                  >
                    <PlusCircle size={18} />
                    <span>Add Permissions</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddPermissionsTable(false)} // Hide Table
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none hover:opacity-90"
                    >
                      <span>Remove Permissions</span>
                    </button>
                  </div>
                  <DynamicTable
                    columns={[
                      { key: "permissionsName", header: "PERMISSIONS NAME" },
                      { key: "permissionsId", header: "PERMISSIONS ID" },
                      { key: "description", header: "DESCRIPTION" },
                      { key: "moduleName", header: "MODULE NAME" },
                    ]}
                    headerColor="#1a1a1a"
                    useData={usePermissionData}
                    showBorder={false}
                    showDetailsColumn={false}
                    uniqueKey="permissionsId"
                    onSelectionChange={setSelectedPermissions}
                  />
                </>
              )}
            </div>
          )}

          {/* Permissions Boundaries*/}
          {activeSwitch === "Permission Boundaries" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Permission Boundaries
              </h2>
              {!showAddPermissionBoundaryTable ? (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddPermissionBoundaryTable(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#262626] text-white rounded-lg focus:outline-none hover:opacity-90"
                  >
                    <PlusCircle size={18} />
                    <span>Add Permission Boundaries</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddPermissionBoundaryTable(false)} // Hide Table
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none hover:opacity-90"
                    >
                      <span>Remove Permission Boundaries</span>
                    </button>
                  </div>
                  <DynamicTable
                    columns={[
                      { key: "permissionsName", header: "PERMISSIONS NAME" },
                      { key: "permissionsId", header: "PERMISSIONS ID" },
                      { key: "description", header: "DESCRIPTION" },
                      { key: "moduleName", header: "MODULE NAME" },
                    ]}
                    headerColor="#1a1a1a"
                    useData={usePermissionBoundaries}
                    showBorder={false}
                    showDetailsColumn={false}
                    uniqueKey="permissionsId"
                    onSelectionChange={setSelectedPermissionBoundaries}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="flex justify-end pl-6 pt-8">
          <Button
            variant="ghost"
            className="rounded-lg bg-[#FAFAFA] text-[#262626] px-4 py-2 flex items-center space-x-2"
            onClick={handleCreateGroup}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </LiveSessionForm>
      </div>
    </>
  );
}
