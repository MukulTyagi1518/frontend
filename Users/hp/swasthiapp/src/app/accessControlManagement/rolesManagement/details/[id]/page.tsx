"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { PlusCircle, Trash } from "lucide-react";

// Define types for the API response
interface Permission {
  _id: string;
  permissionName: string;
  permissionID: string;
  moduleID: string;
  description: string;
  status: string;
  access: string[];
}

interface Role {
  roleName: string;
  roleId: string;
  roleDesc: string;
  status: string;
  isActive: boolean;
  permissions: Permission[];
}

interface ApiResponse {
  success: boolean;
  data: Role;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AccessControlManagementPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // State for form data
  const [status, setStatus] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string[]>([]);
  const [roleName, setRoleName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [description, setDescription] = useState("");
  const [tableData, setTableData] = useState<Permission[]>([]);

  // Table Columns
  const columns = [
    { key: "permissionName", header: "Permission Name" },
    { key: "permissionID", header: "Permission ID" },
    { key: "moduleID", header: "Module ID" },
    { key: "description", header: "Description" },
    { key: "status", header: "Status" },
    { key: "access", header: "Access" },
  ];

  // Fetch permission data
  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        if (!id) return; // Ensure id is valid before fetching

        const response = await fetch(
          `${API_URL}/fitnearn/web/admin/access/role/get/${id}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.data) {
          // Extract permissions
          const formattedPermissions = data.data.permissions.map((perm) => ({
            _id: perm._id,
            permissionName: perm.permissionName,
            permissionID: perm.permissionID,
            moduleID: perm.moduleID,
            description: perm.description,
            status: perm.status,
            access: perm.access, // Ensure this is an array of strings
          }));

          setTableData(formattedPermissions);
          console.log("data", data);

          // Set form values
          setStatus(data.data.isActive); // Fix: Use `isActive`
          setRoleName(data.data.roleName);
          setRoleId(data.data.roleId);
          setDescription(data.data.roleDesc);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch role details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoleData();
  }, [id]); // Fix: Add `id` as a dependency

  const useMediaData = (page: number, search: string) => {
    const searchQueries = search
      .split(/\s+(?=\w+:)/)
      .map((query) => {
        const [key, ...valueParts] = query.split(":");
        return [key, valueParts.join(":")];
      })
      .filter(([key, value]) => key && value)
      .reduce((acc, [key, value]) => {
        acc[key as keyof Permission] = value.toLowerCase();
        return acc;
      }, {} as Partial<Record<keyof Permission, string>>);

    const filteredData = tableData.filter((item) =>
      Object.entries(searchQueries).every(([key, value]) => {
        const itemValue = item[key as keyof Permission];
        return itemValue?.toString().toLowerCase().includes(value);
      })
    );

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(start, start + pageSize);

    return {
      data: paginatedData,
      totalPages: Math.ceil(filteredData.length / pageSize),
    };
  };

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validate required fields
      if (!roleName.trim() || !description.trim()) {
        setError("Please fill in all required fields");
        return;
      }

      const updateData = {
        roleName: roleName.trim(),
        description: description.trim(),
        status: status ? "Active" : "Inactive",
      };

      const response = await fetch(
        `${API_URL}/fitnearn/web/admin/access/role/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setIsEditMode(false);
        // Optionally refresh the data
        router.refresh();
      } else {
        throw new Error("Failed to update role");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setIsSaving(false);
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
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="container mx-auto py-10 pt-10 pr-10 pl-[60px]">
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
            <h1 className="text-xl font-bold text-white">Roles</h1>
          </div>

          {/* Action Buttons */}

          <div className="min-h-screen bg-zinc-950 text-zinc-100  border border-neutral-600 rounded-md">
            <div className="max-w-auto  mx-auto space6">
              <div className="flex items-center justify-between p-5">
                <h1 className="text-2xl  font-semibold">Role Details</h1>
                <div className="flex items-center space-x-2">
                  {isEditMode ? (
                    <>
                      <Button
                        onClick={() => setIsEditMode(false)}
                        variant="outline"
                        className="bg-transparent mx-2 text-white"
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdate}
                        className=""
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditMode(true)} className="">
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              <div className=" h-[0px] border border-neutral-600"></div>
              <div className="space-y-6 p-6">
                {/* Status */}
                <div className=" flex items-center space-x-2">
                  <label className="text-sm font-medium text-neutral-50">
                    Status:
                  </label>
                  <Checkbox
                    checked={status}
                    onCheckedChange={(checked) => setStatus(!!checked)}
                    className="form-checkbox h-5 w-5 text-green-500 bg-neutral-800 border-neutral-600"
                  />
                  <span className="text-white">
                    {status ? "Active" : "Inactive"}
                  </span>
                </div>
                {/* Permission Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 w-2/3">
                    <Label htmlFor="permission-name">
                      Role Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="role-name"
                      placeholder="Enter Role Name"
                      value={roleName}
                      readOnly={!isEditMode}
                      onChange={(e) => setRoleName(e.target.value)}
                      className="bg-zinc-900 border-zinc-800 w-full"
                    />
                  </div>

                  <div className="space-y-2 w-2/3">
                    <Label htmlFor="role-id">
                      Role ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="role-id"
                      value={roleId}
                      readOnly
                      className="bg-zinc-900 border-zinc-800 w-full"
                    />
                  </div>
                </div>
                {/* Permission Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Role Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    disabled={!isEditMode}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-neutral-800 border-zinc-800 min-h-[80px]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>Role Permission </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      className="bg-[rgba(38,38,38,1)] text-white flex items-center space-x-2 hover:bg-gray-700"
                      onClick={() =>
                        router.push(
                          "/accessControlManagement/rolesManagement/create"
                        )
                      }
                    >
                      <Trash className="h-4 w-4" />
                      <span>Remove Permission</span>
                    </Button>
                    <Button
                      className="bg-[rgba(38,38,38,1)] text-white flex items-center space-x-2 hover:bg-gray-700"
                      onClick={() =>
                        router.push(
                          "/accessControlManagement/rolesManagement/create"
                        )
                      }
                    >
                      <span>New</span>
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <DynamicTable
                  columns={columns}
                  headerColor="#1a1a1a"
                  useData={useMediaData}
                  showBorder={false}
                  showDetailsColumn={false}
                  uniqueKey="permissionID"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
