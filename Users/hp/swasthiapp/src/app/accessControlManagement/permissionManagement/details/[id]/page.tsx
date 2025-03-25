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
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

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

interface Module {
  _id: string;
  moduleName: string;
  moduleDescription: string;
  moduleID: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    permission: Permission;
    module: Module;
  };
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Access level mapping
const ACCESS_MAP: { [key: string]: string } = {
  "ACCESS-10": "Viewer",
  "ACCESS-20": "Editor",
  "ACCESS-30": "Creator",
  "ACCESS-40": "Owner",
};

// Module mapping based on provided JSON data
const MODULE_MAP: { [key: string]: string } = {
  "User Management": "MODULE-1",
  "Media Management": "MODULE-2",
  "Access Management": "MODULE-3",
  "Query Management": "MODULE-4",
  "Workout Management": "MODULE-5",
  "Live Session Management": "MODULE-6",
  "Subscription Management": "MODULE-7",
  "Category Management": "MODULE-8",
  "Report Management": "MODULE-9",
  "Report Abuse Management": "MODULE-10",
};

const REVERSE_MODULE_MAP: { [key: string]: string } = Object.entries(
  MODULE_MAP
).reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

// Reverse access mapping
const REVERSE_ACCESS_MAP: { [key: string]: string } = {
  Viewer: "ACCESS-10",
  Editor: "ACCESS-20",
  Creator: "ACCESS-30",
  Owner: "ACCESS-40",
};

export default function AccessControlManagementPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isOpen, setIsOpen] =  useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // State for form data
  const [status, setStatus] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string[]>([]);
  const [permissionName, setPermissionName] = useState("");
  const [permissionId, setPermissionId] = useState("");
  const [description, setDescription] = useState("");

  // Fetch permission data
  useEffect(() => {
    const fetchPermissionData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/fitnearn/web/admin/access/permissions/get/${id}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.data.permission) {
          const { permission, module } = data.data;

          // Set form values
          setStatus(permission.status === "Active");
          setPermissionName(permission.permissionName);
          setPermissionId(permission.permissionID);
          setDescription(permission.description);

          // Set module selection

          if (module) {
            const moduleName =
              REVERSE_MODULE_MAP[permission.moduleID] || module.moduleName;
            setSelectedModule([moduleName]);
          }

          // Map access codes to readable names and set selection
          const accessNames = permission.access.map(
            (code) => ACCESS_MAP[code] || code
          );
          setSelectedPermission(accessNames);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch permission details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPermissionData();
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validate required fields
      if (
        !permissionName.trim() ||
        selectedModule.length === 0 ||
        !description.trim() ||
        selectedPermission.length === 0
      ) {
        setError("Please fill in all required fields");
        return;
      }

      const moduleId = MODULE_MAP[selectedModule[0]];
      // const moduleIds = selectedModule.map(module => MODULE_MAP[module]);
      const accessCodes = selectedPermission.map(
        (perm) => REVERSE_ACCESS_MAP[perm]
      );

      const updateData = {
        permissionName: permissionName.trim(),
        moduleID: MODULE_MAP[selectedModule[0]] || "",
        // moduleId:moduleIds
        description: description.trim(),
        status: status ? "Active" : "Inactive",
        access: accessCodes,
      };
      console.log("updateData", updateData);
      const response = await fetch(
        `${API_URL}/fitnearn/web/admin/access/permissions/update/${id}`,
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
        throw new Error("Failed to update permission");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update permission"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-white">Permissions</h1>
        </div>

        {/* Action Buttons */}

        <div className="min-h-screen bg-zinc-950 text-zinc-100  border border-neutral-600 rounded-md">
          <div className="max-w-auto  mx-auto space6">
            <div className="flex items-center justify-between p-5">
              <h1 className="text-2xl  font-semibold">Permission details</h1>
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
                    Permission Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="permission-name"
                    placeholder="Enter Permission Name"
                    value={permissionName}
                    readOnly={!isEditMode}
                    onChange={(e) => setPermissionName(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 w-full"
                  />
                </div>

                <div className="space-y-2 w-2/3">
                  <Label htmlFor="permission-id">
                    Permission ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="permission-id"
                    value={permissionId}
                    readOnly
                    className="bg-zinc-900 border-zinc-800 w-full"
                  />
                </div>
              </div>

              {/* Module Name */}
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-50">
                    Module Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-1/3">
                    <Combobox
                      options={[
                        "User Management",
                        "Media Management",
                        "Access Management",
                        "Query Management",
                        "Workout Management",
                        "Live Session Management",
                        "Subscription Management",
                        "Category Management",
                        "Report Management",
                        "Report Abuse Management",
                      ]}
                      disabled={!isEditMode}
                      selectedOptions={selectedModule}
                      onSelectionChange={(selected) =>
                        setSelectedModule(selected)
                      }
                      placeholder="Select Module"
                      placeholderBgColor="bg-neutral-950"
                      className="mt-2"
                    />
                    {/* {errors.focusArea && (
                                   <p className="text-red-500 text-sm mt-1">
                                     {errors.focusArea}
                                   </p>
                                 )} */}
                  </div>
                </div>
              </div>

              {/* Permission Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Permission Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  disabled={!isEditMode}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 min-h-[80px]"
                />
              </div>

              {/* Permission Access */}
              <div className="space-y-4">
                <div className="w-[508px] h-9 justify-center items-center inline-flex">
                  <div className="w-[508px] h-9 pt-px justify-center items-center inline-flex">
                    <div className="grow shrink basis-0 self-stretch border-b border-neutral-600 justify-start items-start gap-8 inline-flex">
                      <div className="h-[34px] px-1 pb-4 border-b-2 border-neutral-50 flex-col justify-center items-center inline-flex">
                        <div>
                          <span className="text-neutral-50 text-sm font-medium  leading-[21px]">
                            Permission Access
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-50">
                      Permission <span className="text-red-500">*</span>
                    </label>
                    <div className="w-1/3">
                      <Combobox
                        options={["Viewer", "Editor", "Creator", "Owner"]}
                        selectedOptions={selectedPermission}
                        onSelectionChange={(selected) =>
                          setSelectedPermission(selected)
                        }
                        disabled={!isEditMode}
                        placeholder="Select Module"
                        placeholderBgColor="bg-neutral-950"
                        className="mt-2"
                      />
                      {/* {errors.focusArea && (
                                   <p className="text-red-500 text-sm mt-1">
                                     {errors.focusArea}
                                   </p>
                                 )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
