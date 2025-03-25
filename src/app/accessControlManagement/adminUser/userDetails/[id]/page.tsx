"use client";

import LiveSessionForm from "@/components/ui/LiveSessionForm";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import adminImage from "@/images/admin_img.webp";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, Copy, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducer, useState, useEffect } from "react";
import DynamicTable from "@/components/ui/DynamicSessionTable";
import { useGroupsData, GroupDetails } from "./useGroupData";
import { useRolesData, RoleDetails } from "./useRolesData ";
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
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";

// Add new interface for user data
interface UserData {
  _id: string;
  USR_ID: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  gender: string;
  status: string;
  permissions: string[];
  permissionBoundary: string[];
  groups: string[];
  appType: string;
  imageUrl: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UnderReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
   const [isOpen, setIsOpen] = useState(true);
  const [userId, setUserId] = useState<string>("SES561");

  const [activeSwitch, setActiveSwitch] = useReducer(
    (_: string, newValue: string) => newValue,
    "Focus Area"
  );
  // Resolve params and set the sessionId
  useEffect(() => {
    params.then((resolvedParams) => {
      setUserId(resolvedParams.id);
    });
  }, [params]);
  const [gender, setGender] = useState("Male");

  const genderOptions = ["Female", "Male", "Other"];
  const [application, setApplication] = useState<string>("Admin Panel");

  const [thumbnail, setThumbnail] = useState<File | null>(null); // Stores the selected file
  const [previewURL, setPreviewURL] = useState<string | null>(null); // Stores preview URL
  const [loading, setLoading] = useState<boolean>(false); // Manages the loader
  const createdByOptions = ["Aniruddha", "Jitanshu", "Zoffi"];
  const [createdBy, setCreatedBy] = useState(createdByOptions[0]);
  const [isEditable, setIsEditable] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Add this function to fetch user data
  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/fitnearn/web/admin/access/users/get/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("id_token")}`,
            "x-refresh-token": Cookies.get("refresh_token"),
            "x-username": Cookies.get("username"),
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        type: "error",
        title: "Error",
        description: "Failed to fetch user data",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle user data updates
  const handleUpdateUser = async () => {
    if (!userData) return;

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("phoneNumber", userData.phoneNumber);
      formData.append("gender", userData.gender);
      formData.append("appType", userData.appType);
      // Add any other fields you want to update

      const response = await axios.put(
        `${API_URL}/fitnearn/web/admin/access/users/edit/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("id_token")}`,
            "x-refresh-token": Cookies.get("refresh_token"),
            "x-username": Cookies.get("username"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast({
          type: "success",
          title: "Success",
          description: "User details updated successfully",
        });
        setIsEditable(false);
        fetchUserData(userId); // Refresh data
      }
    } catch (err) {
      toast({
        type: "error",
        title: "Error",
        description: "Failed to update user details",
      });
    }
  };

  // Add this useEffect to fetch data when component mounts
  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

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
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        onSaveChanges={handleUpdateUser}
        breadcrumb={["Access Control Management", "Users Details"]}
        breadcrumbLinks={[
          "/accessControlManagement/adminUser/table", // Path for "Live Session Management"
          "/accessControlManagement/adminUser/userDetails", // Current page
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
        headerTitle="Admin User Details"
        onActionButtonClick={() => setIsEditable(false)} // Disable edit mode on analytics button click
        showButton={false}
      >
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-x-32 gap-y-4">
          {/* Image and Button Component */}
          <div className="row-span-3 flex flex-col items-start pl-5">
            {/* Label for the Image */}
            <label className="block text-sm font-medium text-gray-400 mb-1 ">
              Admin Image
            </label>

            {/* Image Container */}
            <div className="w-48 h-48 bg-gray-800 rounded-md flex items-center justify-center">
              <Image
                src={userData?.imageUrl || adminImage}
                alt="Admin Image"
                className="w-full h-full object-cover rounded-md"
                width={192}
                height={192}
              />
            </div>

            {/* Buttons Below the Image */}
            <div className="flex justify-start items-center w-full mt-2 -ml-3 space-x-2">
              <Button
                variant="ghost"
                className="rounded-lg bg-[#FAFAFA] text-[#262626] px-4 py-2 flex items-center space-x-2"
              >
                {/* SVG for Update */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M11.3387 2.4659L10.3808 3.47763L12.586 5.80671L13.5432 4.79499C13.688 4.64207 13.8029 4.46052 13.8813 4.26071C13.9597 4.06089 14 3.84673 14 3.63045C14 3.41416 13.9597 3.2 13.8813 3.00018C13.8029 2.80037 13.688 2.61882 13.5432 2.4659C13.2461 2.16683 12.8514 2 12.441 2C12.0305 2 11.6358 2.16683 11.3387 2.4659Z"
                    fill="#262626"
                  />
                  <path
                    d="M11.7042 6.73808L9.49904 4.409L6.55243 7.51862C6.46525 7.61052 6.4058 7.72764 6.38156 7.8552L6.05353 9.60201C6.03335 9.70838 6.03836 9.81836 6.0681 9.92219C6.09784 10.026 6.15141 10.1205 6.22403 10.1972C6.29666 10.2739 6.38609 10.3305 6.4844 10.3619C6.5827 10.3933 6.68683 10.3986 6.78754 10.3773L8.44138 10.0282C8.56192 10.0025 8.67258 9.93966 8.75943 9.8477L11.7042 6.73808Z"
                    fill="#262626"
                  />
                  <path
                    d="M6.55243 7.51862C6.46525 7.61052 6.4058 7.72764 6.38156 7.8552L6.05353 9.60201C6.03335 9.70838 6.03836 9.81836 6.0681 9.92219C6.09784 10.026 6.15141 10.1205 6.22403 10.1972C6.29666 10.2739 6.38609 10.3305 6.4844 10.3619C6.5827 10.3933 6.68683 10.3986 6.78754 10.3773L8.44138 10.0282C8.56192 10.0025 8.67258 9.93966 8.75943 9.8477L11.7042 6.73808L9.49904 4.409L6.55243 7.51862Z"
                    fill="#262626"
                  />
                  <path
                    d="M9.35436 10.617C9.18011 10.8008 8.9584 10.9261 8.71702 10.9773L6.51189 11.443C6.31059 11.4855 6.10248 11.4748 5.90602 11.412C5.70955 11.3491 5.53082 11.236 5.38566 11.0827C5.24051 10.9294 5.13343 10.7406 5.07392 10.5331C5.01441 10.3256 5.00431 10.1058 5.04452 9.89315L5.48542 7.56407C5.53393 7.30911 5.65259 7.07494 5.82654 6.8909L8.89475 3.65021C8.87768 3.5888 8.86887 3.52517 8.86856 3.46117H3.35139C2.99308 3.46152 2.64954 3.61201 2.39618 3.87962C2.14281 4.14722 2.00033 4.51007 2 4.88852V12.5726C2.00033 12.9511 2.14281 13.3139 2.39618 13.5816C2.64954 13.8492 2.99308 13.9997 3.35139 14H10.6265C10.9849 13.9997 11.3284 13.8492 11.5818 13.5816C11.8351 13.3139 11.9776 12.9511 11.9779 12.5726V7.84598L9.35436 10.617Z"
                    fill="#262626"
                  />
                </svg>
                Update
              </Button>
              <Button
                variant="ghost"
                className="rounded-lg bg-[#FAFAFA] text-[#262626] px-4 py-2 flex items-center space-x-2"
              >
                {/* SVG for Remove */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M5.66671 7.64929C7.32356 7.64929 8.66671 6.23545 8.66671 4.49139C8.66671 2.74733 7.32356 1.3335 5.66671 1.3335C4.00985 1.3335 2.66671 2.74733 2.66671 4.49139C2.66671 6.23545 4.00985 7.64929 5.66671 7.64929Z"
                    fill="#262626"
                  />
                  <path
                    d="M6.66671 8.35104H4.66671C3.78298 8.35215 2.93575 8.72219 2.31085 9.37997C1.68596 10.0377 1.33443 10.9296 1.33337 11.8598V13.9651C1.33337 14.1512 1.40361 14.3297 1.52864 14.4613C1.65366 14.5929 1.82323 14.6668 2.00004 14.6668H9.33337C9.51019 14.6668 9.67975 14.5929 9.80478 14.4613C9.9298 14.3297 10 14.1512 10 13.9651V11.8598C9.99898 10.9296 9.64745 10.0377 9.02256 9.37997C8.39767 8.72219 7.55044 8.35215 6.66671 8.35104Z"
                    fill="#262626"
                  />
                  <path
                    d="M14 7.64929H10C9.82323 7.64929 9.65366 7.57535 9.52864 7.44375C9.40361 7.31214 9.33337 7.13365 9.33337 6.94753C9.33337 6.76141 9.40361 6.58292 9.52864 6.45132C9.65366 6.31971 9.82323 6.24578 10 6.24578H14C14.1769 6.24578 14.3464 6.31971 14.4714 6.45132C14.5965 6.58292 14.6667 6.76141 14.6667 6.94753C14.6667 7.13365 14.5965 7.31214 14.4714 7.44375C14.3464 7.57535 14.1769 7.64929 14 7.64929Z"
                    fill="#262626"
                  />
                </svg>
                Remove
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Name
            </label>
            <Input
              type="text"
              value={userData?.name || ""}
              onChange={(e) =>
                setUserData((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              readOnly={!isEditable}
              className="mt-2 bg-neutral-800 text-gray-300"
            />
          </div>

          {/* Email ID */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Email ID
            </label>
            <Input
              type="text"
              value={userData?.email || ""}
              onChange={(e) =>
                setUserData((prev) =>
                  prev ? { ...prev, email: e.target.value } : null
                )
              }
              readOnly={!isEditable}
              className="mt-2 bg-neutral-800 text-gray-300"
            />
          </div>

          {/* Phone No. */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-400"
            >
              Phone No.
            </label>
            <Input
              type="text"
              value={userData?.phoneNumber || ""}
              onChange={(e) =>
                setUserData((prev) =>
                  prev ? { ...prev, phoneNumber: e.target.value } : null
                )
              }
              readOnly={!isEditable}
              className="mt-2 bg-neutral-800 text-gray-300"
            />
          </div>

          {/* Admin Type */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Admin Type
            </label>
            <Input
              type="text"
              value={userData?.role || ""}
              readOnly
              className="mt-2 bg-[#262626] text-gray-300"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-400"
            >
              Gender
            </label>
            <Select
              value={userData?.gender || ""}
              onValueChange={(value) =>
                setUserData((prev) =>
                  prev ? { ...prev, gender: value } : null
                )
              }
            >
              <SelectTrigger
                id="gender"
                className="w-full bg-[#262626] text-gray-400 border-gray-600"
              >
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-[#262626] text-white border-gray-600">
                {genderOptions.map((option, index, array) => (
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
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Application Field */}
          <div className="space-y-2">
            <label
              htmlFor="application"
              className="block text-sm font-medium text-gray-400"
            >
              Application
            </label>
            <Input
              type="text"
              value={userData?.appType || ""}
              onChange={(e) =>
                setUserData((prev) =>
                  prev ? { ...prev, appType: e.target.value } : null
                )
              }
              readOnly={!isEditable}
              className="w-full bg-[#262626] text-gray-400"
            />
          </div>

          {/* Admin User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Admin User ID
            </label>
            <Input
              type="text"
              value={userData?.USR_ID || "Loading..."}
              readOnly
              className="mt-2"
            />
          </div>
        </div>

        {/* Switch Buttons */}
        <div className="mt-6 relative py-2">
          <div className="flex justify-between items-center space-x-4 relative z-10 max-w-[50%]">
            {["Groups", "Roles", "Password"].map((item) => (
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
              right: "50%",
              marginTop: "0px",
            }}
          ></div>
        </div>

        {/* Switch Context */}
        <div className="mt-6 max-w-full">
          {/* Groups */}
          {activeSwitch === "Groups" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">Groups</h2>
              <DynamicTable
                columns={[
                  { key: "groupName", header: "GROUP NAME" },
                  { key: "description", header: "DESCRIPTION" },
                  { key: "groupMailId", header: "GROUP MAIL ID" },
                  { key: "date", header: "DATE" },
                ]}
                headerColor="#1a1a1a"
                useData={useGroupsData} // Replace with your custom hook for fetching group data
                showBorder={false}
                showDetailsColumn={false}
                uniqueKey="groupName"
              />
            </div>
          )}

          {/* Roles */}
          {activeSwitch === "Roles" && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-white">Roles</h2>
              <DynamicTable
                columns={[
                  { key: "roleName", header: "ROLE NAME" },
                  { key: "description", header: "DESCRIPTION" },
                ]}
                headerColor="#1a1a1a"
                useData={useRolesData} // Replace with your custom hook for fetching role data
                showBorder={false}
                showDetailsColumn={true}
                uniqueKey="roleName"
              />
            </div>
          )}

          {/* Password */}
          {activeSwitch === "Password" && (
            <div className="w-1/3">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      value="********" // Encrypted placeholder value
                      className="w-full bg-[#262626] text-gray-400 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      readOnly
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3"
                      onClick={() => {
                        const input = document.getElementById(
                          "password"
                        ) as HTMLInputElement; // Cast to HTMLInputElement
                        if (input) {
                          input.type =
                            input.type === "password" ? "text" : "password";
                        }
                      }}
                    >
                      <Eye className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </LiveSessionForm>
      </div>
    </>
  );
}
