"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/toast-context";
// Define types for form data
interface FormData {
  permissionName: string;
  moduleID: string;
  description: string;
  status: string;
  access: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

const ACCESS_MAP: { [key: string]: string } = {
  Viewer: "ACCESS-10",
  Editor: "ACCESS-20",
  Creator: "ACCESS-30",
  Owner: "ACCESS-40",
};

export default function AccessControlManagementPage() {
  const router = useRouter();
  const [isOpen , setIsOpen] = useState(true);
  const { showToast } = useToast();
  const [status, setStatus] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string[]>([]);
  const [permissionName, setPermissionName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!permissionName.trim()) {
      setError("Permission name is required");
      return;
    }
    if (selectedModule.length === 0) {
      setError("Module selection is required");
      return;
    }
    if (selectedPermission.length === 0) {
      setError("Permission access is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    const formData: FormData = {
      permissionName: permissionName.trim(),
      moduleID: MODULE_MAP[selectedModule[0]] || "",
      description: description.trim(),
      status: status ? "Active" : "Inactive",
      access: selectedPermission.map((perm) => ACCESS_MAP[perm] || ""),
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${API_URL}/fitnearn/web/admin/access/permissions/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        showToast({
          type: "error",
          title: "Error ",
          description: `Your Details has been
            successfully.`,
          actionText: "OK",
          onAction: () => {},
        });
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      showToast({
        type: "success",
        title: "Saved Successfully",
        description: `Your Details has been
        successfully.`,
        actionText: "OK",
        onAction: () => {},
      });
      // Handle success - you might want to show a success message or redirect
      router.push("/accessControlManagement/permissionManagement/table"); // Adjust the route as needed
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-xl font-bold text-white">Permissions</h1>
        </div>

        {/* Action Buttons */}

        <form
          onSubmit={handleSubmit}
          className="min-h-screen bg-zinc-950 text-zinc-100  border border-neutral-600 rounded-md"
        >
          <div className="max-w-auto  mx-auto space-y-6">
            <h1 className="text-2xl px-7 pt-6 font-semibold">
              Permission details
            </h1>
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
                    value={permissionName}
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
                    value=""
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
                      options={Object.keys(MODULE_MAP)}
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
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
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
                        options={Object.keys(ACCESS_MAP)}
                        selectedOptions={selectedPermission}
                        onSelectionChange={(selected) =>
                          setSelectedPermission(selected)
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
                {/* Submit Button */}
                {error && <div className="px-7 text-red-500">{error}</div>}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg"
                  >
                    {isSubmitting ? "Saving..." : "Create Permission"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      </div>
    </>
  );
}
