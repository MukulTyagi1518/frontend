"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast/toast-context";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import Cookies from "js-cookie";

import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Get authentication details from cookies
const idToken = Cookies.get("id_token");
const refreshToken = Cookies.get("refresh_token");
const username = Cookies.get("username");
const userSchema = z.object({
  mediaName: z.string().min(3, "MediaName is required"),
  deviceType: z.string().nonempty("Please select a Device Type."),
  mediaDimensions: z.string().nonempty("Please select Media Dimensions."),

  mediaDescription: z.string().min(3, "Please Enter valid Description"),
});
interface MediaDetailsPageProps {
  params: {
    id: string;
  };
}

export default function MediaDetailsPage({ params }: MediaDetailsPageProps) {
  const [mediaType, setMediaType] = useState<string>("Image"); // Default to "Image"
  const router = useRouter();
  const [editable, setEditable] = useState(false); // For toggling edit mode
  const [threeDotDropdownOpen, setThreeDotDropdownOpen] = useState(false);
  const [deviceTypeDropdownOpen, setDeviceTypeDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [mediaDimensionDropdownOpen, setMediaDimensionDropdownOpen] =
    useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null); // URL for preview
  const [loading, setLoading] = useState(false); // Track upload progress
  const [isSaved, setIsSaved] = useState(false); // To track final saved state
  const { showToast } = useToast();

  const [status, setStatus] = useState<boolean>(true);
  const [mediaFormat, setMediaFormat] = useState<string>("");

  const [categories] = useState<string[]>([
    "Yoga",
    "Meditation",
    "Cardio",
    "Kick Boxing",
  ]);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [mediaName, setMediaName] = useState<string>("Cardio Squads");
  const [apiData, setApiData] = useState<any>(null);
  const [selectedMediaDimensions, setSelectedMediaDimensions] =
    useState("1920x1080");
  const [errors, setErrors] = useState({
    mediaName: "",
    mediaDimensions: "",
    category: "",
    deviceType: "",
    mediaDescription: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mediaDescription, setMediaDescription] =
    useState<string>("Media Description");
  const [deviceTypes] = useState<string[]>(["Mobile", "Desktop"]);
  const [selectedDeviceType, setSelectedDeviceType] =
    useState<string>("Mobile");

  // Fetch media details from searchParams or API (mocked for now)
  const mediaDetails = {
    createdAt: "2024-12-10",
    mediaName: "Breaking News",
    category: "Yoga",
    displayDeviceType: "Mobile",
    mediaDimension: "1920x1080",
    mediaFormat: "MP4",
    mediaType: "Video",
    mediaDescription: "Cardio Squads.",
    status: true,
    previewUrl: "https://via.placeholder.com/300", // Default preview image
  };

  const [details, setDetails] = useState(apiData);

  const handleDelete = () => {
    // Handle delete logic (API call)
    alert("Media deleted!");
    router.push("/mediaManagement-table");
  };

  const handleSave = () => {
    try {
      userSchema.parse({
        mediaName: mediaName,
        deviceType: selectedDeviceType,
        mediaDimensions: selectedMediaDimensions,
        mediaDescription: mediaDescription,
      });

      // Validation passed
      console.log("Form submitted successfully");
      showToast({
        type: "success",
        title: "Saved",
        description: "Your details have been saved successfully.",
        actionText: "OK",
        onAction: () => {
          setEditable(false); // Make data immutable when user clicks OK
          setIsSaved(true);
        },
      });
    } catch (err) {
      // Type guard to check if `err` is a ZodError
      if (err instanceof z.ZodError) {
        // Initialize error map with default empty strings
        const initialErrors = {
          mediaName: "",
          mediaDimensions: "",
          category: "",
          deviceType: "",
          mediaDescription: "",
        };

        const errorMap = err.errors.reduce<typeof initialErrors>(
          (acc, curr) => {
            const key = curr.path[0] as keyof typeof initialErrors; // Assert that path[0] is a valid key
            if (key in acc) {
              acc[key] = curr.message;
            }
            return acc;
          },
          initialErrors
        );

        setErrors(errorMap);
      } else {
        console.error("Unexpected error", err);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      setLoading(true); // Show loader

      const fileType = file.type.startsWith("image/") ? "Image" : "Video"; // Determine media type
      const fileExtension = file.name.split(".").pop(); // Extract file extension
      const fileURL = URL.createObjectURL(file); // Create a temporary URL for preview

      setTimeout(() => {
        // setPreviewURL(fileURL); // Update preview URL
        setMediaType(fileType); // Set media type (Image/Video)
        setDetails({
          ...details,
          mediaType: fileType, // Update media type
          mediaFormat: fileExtension || "Unknown", // Update media format
        });
        setLoading(false); // Stop loader
      }, 2000); // Simulated 2-second delay
    }
  };

  useEffect(() => {
    // Fetch table data on component mount
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/fitnearn/web/admin/media?mediaId=${params.id}`,
          {
            headers: new Headers({
              Authorization: `Bearer ${idToken}`,
              "x-refresh-token": refreshToken || "",
              "x-username": username || "",
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          setApiData(data.data);
          setDetails(data.data);
          setPreviewURL(data.data.imageUrl);

          console.log("Details of media:", data.data);
        }
      } catch (error) {
        console.error("Error fetching buckets:", error);
      }
    };

    fetchData();
  }, []);

  //edit the details of the media
  // Add this state for handling the form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission
    await handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
  };
  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
  
    try {
      const formData = new FormData();
  
      // Append all the fields to formData
      formData.append("category", details.category);
      formData.append("createdAt", details.createdAt);
      formData.append("displayDeviceType", details.displayDeviceType);
      formData.append("mediaDescription", mediaDescription);
      formData.append("mediaDimensions", details.mediaDimension);
      formData.append("mediaFormat", details.mediaFormat);
      formData.append("mediaId", details.mediaId);
      formData.append("mediaName", details.mediaName);
      formData.append("mediaType", details.mediaType);
      formData.append("updatedAt", new Date().toISOString());
  
      // If there's a new file selected, append it
      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
  
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append("file", fileInput.files[0]);
      }
  
      const response = await fetch(
        `${API_URL}/fitnearn/web/admin/editMediaData/${params.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "x-refresh-token": refreshToken || "",
            "x-username": username || "",
          },
          body: formData,
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        setDetails(data.data);
        setApiData(data.data);
        setEditable(false);
        showToast({
          type: "success",
          title: "Saved",
          description: "Your details have been saved successfully.",
          actionText: "OK",
          onAction: () => {
            setEditable(false);
            setIsSaved(true);
          },
        });
      } else {
        setSubmitError(data.message || "Failed to update media details");
        console.log(data.message);
        showToast({
          type: "error",
          title: "Error",
          description: data.message || "Failed to update media details.",
          actionText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating media details:", error);
      setSubmitError("An error occurred while updating media details");
      showToast({
        type: "error",
        title: "Error",
        description: "An error occurred while updating media details.",
        actionText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  console.log(apiData);
  return (
    <div className="w-full min-h-screen bg-black-900 text-white">
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

    {/* Main Content */}
    <div
      className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${
        isOpen ? "pl-60" : "pl-16"
      }`} // Adjust padding based on sidebar state
    >
      <Header isOpen={isOpen} setIsOpen={setIsOpen}  />

      <div className="container mx-auto py-10 pt-10 pr-10 pl-[60px]">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-500 flex items-center space-x-2">
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.623 0.0129659C11.4832 -0.00892007 11.3405 -0.00305488 11.2029 0.0302266C11.0654 0.063508 10.9358 0.123554 10.8214 0.206936C10.7071 0.290318 10.6103 0.395403 10.5366 0.516192C10.4629 0.63698 10.4136 0.771107 10.3918 0.910913C10.3699 1.05072 10.3757 1.19347 10.409 1.33101C10.4423 1.46855 10.5023 1.59818 10.5857 1.71252C10.6691 1.82685 10.7742 1.92364 10.895 1.99736C11.0158 2.07108 11.1499 2.12029 11.2897 2.14218C13.2498 2.4578 15.0193 3.49939 16.2465 5.05992C17.4738 6.62045 18.0689 8.58563 17.9136 10.5648C17.7583 12.5441 16.8639 14.3924 15.4083 15.7424C13.9526 17.0924 12.0423 17.8452 10.057 17.8512C8.4726 17.8515 6.92466 17.3757 5.61401 16.4854C4.30336 15.5952 3.29048 14.3316 2.70677 12.8586C2.65775 12.723 2.58198 12.5985 2.48397 12.4927C2.38596 12.3869 2.26769 12.3018 2.13619 12.2425C2.00468 12.1832 1.86261 12.151 1.7184 12.1476C1.57419 12.1443 1.43078 12.1699 1.29666 12.223C1.16255 12.2761 1.04046 12.3556 0.937636 12.4568C0.834815 12.5579 0.753353 12.6787 0.698081 12.812C0.642809 12.9452 0.614852 13.0882 0.615867 13.2324C0.616882 13.3767 0.646849 13.5193 0.70399 13.6517C1.56712 15.8261 3.16107 17.6316 5.21161 18.7578C7.26215 19.8839 9.64106 20.2602 11.939 19.8218C14.237 19.3835 16.3104 18.158 17.8024 16.3561C19.2945 14.5542 20.1119 12.2887 20.114 9.94928C20.1139 7.55324 19.2586 5.23591 17.702 3.41435C16.1454 1.5928 13.9898 0.386642 11.623 0.0129659ZM8.85591 0.84195C8.89132 0.979118 8.89934 1.12192 8.8795 1.26219C8.85966 1.40246 8.81236 1.53744 8.7403 1.65941C8.66824 1.78138 8.57284 1.88794 8.45955 1.973C8.34626 2.05805 8.21731 2.11994 8.08008 2.15511C7.72015 2.24772 7.36726 2.36583 7.0241 2.50854C6.89344 2.56288 6.75336 2.59095 6.61186 2.59115C6.47036 2.59135 6.3302 2.56368 6.19939 2.50971C6.06858 2.45575 5.94968 2.37655 5.84948 2.27663C5.74928 2.17672 5.66974 2.05804 5.6154 1.92739C5.56106 1.79673 5.53299 1.65665 5.53279 1.51515C5.53259 1.37365 5.56026 1.23349 5.61422 1.10268C5.66819 0.971869 5.74739 0.852969 5.84731 0.752768C5.94722 0.652567 6.0659 0.573027 6.19655 0.51869C6.63044 0.337663 7.08013 0.186808 7.54419 0.0675611C7.68126 0.0323627 7.82392 0.0245097 7.96403 0.0444505C8.10413 0.0643913 8.23894 0.111735 8.36075 0.183779C8.48255 0.255823 8.58898 0.351155 8.67394 0.464331C8.7589 0.577507 8.82073 0.704875 8.85591 0.84195ZM4.57594 2.61342C4.7747 2.81849 4.88393 3.09408 4.87962 3.37964C4.87531 3.66519 4.75782 3.93736 4.55295 4.13634C4.01874 4.65701 3.55939 5.24932 3.18807 5.89631C3.11977 6.02269 3.02689 6.13413 2.9149 6.22409C2.8029 6.31404 2.67405 6.3807 2.53592 6.42013C2.39779 6.45957 2.25316 6.47098 2.11056 6.45371C1.96795 6.43644 1.83023 6.39083 1.70551 6.31956C1.58079 6.24829 1.47157 6.1528 1.38429 6.0387C1.29701 5.92461 1.23342 5.79422 1.19727 5.65519C1.16111 5.51617 1.15312 5.37131 1.17376 5.22916C1.19441 5.087 1.24327 4.9504 1.31747 4.8274C1.78801 4.0039 2.37227 3.25084 3.05302 2.59043C3.25809 2.39166 3.53368 2.28244 3.81924 2.28675C4.10479 2.29106 4.37696 2.40855 4.57594 2.61342ZM1.31603 7.47814C1.59892 7.51802 1.8544 7.66861 2.02628 7.89681C2.19817 8.12501 2.2724 8.41212 2.23265 8.69503C2.18084 9.06392 2.15491 9.43598 2.15507 9.80849C2.15507 10.0943 2.04155 10.3683 1.83947 10.5704C1.63739 10.7725 1.36332 10.886 1.07754 10.886C0.791756 10.886 0.51768 10.7725 0.315603 10.5704C0.113526 10.3683 0 10.0943 0 9.80849C0 9.33006 0.0330444 8.85738 0.0991333 8.39476C0.139018 8.11187 0.289613 7.85639 0.517808 7.68451C0.746004 7.51262 1.03312 7.43839 1.31603 7.47814ZM6.46522 12.6532V7.24539C6.46535 7.00058 6.52803 6.75987 6.64731 6.5461C6.7666 6.33232 6.93852 6.15257 7.14679 6.0239C7.35505 5.89523 7.59273 5.82191 7.83729 5.81089C8.08184 5.79988 8.32516 5.85154 8.54414 5.96096L13.9519 8.66486C14.1903 8.78431 14.3907 8.96771 14.5307 9.19454C14.6707 9.42138 14.7449 9.6827 14.7449 9.94928C14.7449 10.2159 14.6707 10.4772 14.5307 10.704C14.3907 10.9309 14.1903 11.1143 13.9519 11.2337L8.54414 13.9376C8.32516 14.047 8.08184 14.0987 7.83729 14.0877C7.59273 14.0767 7.35505 14.0033 7.14679 13.8747C6.93852 13.746 6.7666 13.5662 6.64731 13.3525C6.52803 13.1387 6.46535 12.898 6.46522 12.6532Z"
              fill="#FAFAFA"
            />
          </svg>
          {/* Breadcrumb Link */}
          <button
            className="text-lg text-white hover:underline focus:outline-none"
            onClick={() => router.push("/mediaManagement-table")}
          >
            Media Management
          </button>

          <span className="text-lg text-white">›</span>
          <span className="text-lg text-white">
            {editable ? "Edit" : "Details"}
          </span>
        </div>

        {/* Main Component */}
        <div className="border border-gray-600 rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-600">
            <h1 className="text-xl font-bold text-white">
              {editable
                ? `Edit ${details?.mediaName} Details`
                : `${details?.mediaName} Details`}
            </h1>
            <div className="relative">
              {editable ? (
                // Save Button
                <Button
                  onClick={handleButtonClick}
                  className="bg-[#262626] text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 focus:outline-none"
                >
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 0.5V3C3 3.39782 3.15804 3.77936 3.43934 4.06066C3.72064 4.34196 4.10218 4.5 4.5 4.5H6.5C6.89782 4.5 7.27936 4.34196 7.56066 4.06066C7.84196 3.77936 8 3.39782 8 3V0.5H8.379C8.90939 0.500113 9.41801 0.710901 9.793 1.086L11.414 2.707C11.7891 3.08199 11.9999 3.59061 12 4.121V10.5C12 11.0304 11.7893 11.5391 11.4142 11.9142C11.0391 12.2893 10.5304 12.5 10 12.5V8C10 7.60218 9.84196 7.22064 9.56066 6.93934C9.27936 6.65804 8.89782 6.5 8.5 6.5H3.5C2.673 6.5 2 7.169 2 7.998V12.5C1.46957 12.5 0.960859 12.2893 0.585786 11.9142C0.210714 11.5391 0 11.0304 0 10.5V2.5C0 1.96957 0.210714 1.46086 0.585786 1.08579C0.960859 0.710714 1.46957 0.5 2 0.5H3ZM4 0.5V3C4 3.13261 4.05268 3.25979 4.14645 3.35355C4.24021 3.44732 4.36739 3.5 4.5 3.5H6.5C6.63261 3.5 6.75979 3.44732 6.85355 3.35355C6.94732 3.25979 7 3.13261 7 3V0.5H4ZM3 12.5H9V8C9 7.86739 8.94732 7.74021 8.85355 7.64645C8.75979 7.55268 8.63261 7.5 8.5 7.5H3.5C3.223 7.5 3 7.723 3 7.998V12.5Z"
                      fill="#FAFAFA"
                    />
                  </svg>
                  Save
                </Button>
              ) : (
                // Three Dots Menu
                <Button
                  variant="ghost"
                  className="p-0 w-8 h-8 flex items-center justify-center"
                  onClick={() => setThreeDotDropdownOpen((prev) => !prev)}
                >
                  <MoreHorizontal className="h-6 w-6 text-gray-400" />
                </Button>
              )}
              {/* Dropdown */}
              {!editable && threeDotDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#262626] rounded-md shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-400 hover:bg-gray-700"
                    onClick={() => {
                      setEditable(true);
                      setThreeDotDropdownOpen(false); // Close menu
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-x-32 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Media ID
                </label>
                <Input
                  type="text"
                  value={details?.mediaId}
                  readOnly
                  className="mt-2 bg-[#262626] text-gray-500"
                />
              </div>
              {/* Created At */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Created At
                </label>
                <Input
                  type="text"
                  value={details?.createdAt}
                  readOnly
                  className="mt-2 bg-[#262626] text-gray-500"
                />
              </div>
              {/* Media Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Media Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={details?.mediaName}
                  readOnly={!editable}
                  onChange={(e) => {
                    setDetails({ ...details, mediaName: e.target.value });
                  }}
                  className={`mt-2 ${
                    editable ? "" : "bg-[#262626] text-gray-500"
                  }`}
                />
                {errors.mediaName && (
                  <p className="text-sm  text-red-500">{errors.mediaName}</p>
                )}
              </div>
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Category <span className="text-red-500">*</span>
                </label>
                {editable ? (
                  <Combobox
                    options={[
                      "Yoga",
                      "Cardio",
                      "Meditation",
                      "Sports",
                      "Kick Boxing",
                    ]}
                    selectedOptions={
                      details?.category ? details?.category.split(", ") : []
                    }
                    onSelectionChange={(selected) =>
                      setDetails({ ...details, category: selected.join(", ") })
                    }
                    placeholder="Select categories"
                    className="mt-2"
                  />
                ) : (
                  <Input
                    type="text"
                    value={details?.category}
                    readOnly
                    className="mt-2 bg-[#262626] text-gray-500"
                  />
                )}
              </div>
              {/* Display Device Type */}

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Device Type <span className="text-red-500">*</span>
                </label>
                {editable ? (
                  <div className="relative mt-2">
                    <Select
                      value={details?.displayDeviceType}
                      onValueChange={(value) => {
                        setDetails({ ...details, displayDeviceType: value });
                      }}
                    >
                      <SelectTrigger className="w-full bg-neutral-950  text-gray-400 border border-gray-600 rounded-md cursor-pointer">
                        <SelectValue placeholder="Select Device Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#262626] text-white">
                        {["Desktop", "Mobile"].map((device) => (
                          <SelectItem
                            key={device}
                            value={details?.displayDeviceType}
                            className="hover:bg-gray-700"
                          >
                            {device}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {
                      <p className="mt-1 text-sm text-red-500">
                        {errors.deviceType}
                      </p>
                    }
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={details?.displayDeviceType}
                    readOnly
                    className="mt-2 bg-[#262626] text-gray-500"
                  />
                )}
              </div>
              {/* Media Dimension */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Media Dimension <span className="text-red-500"></span>
                </label>
                {editable ? (
                  <div className="relative mt-2 ">
                    <Select
                      value={details?.mediaDimension}
                      onValueChange={(value) => {
                        setSelectedMediaDimensions(value);
                      }}
                    >
                      <SelectTrigger className="w-full bg-neutral-950 text-gray-400 border border-gray-600 rounded-md cursor-pointer">
                        <SelectValue placeholder="Select Dimension" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#262626] text-white ">
                        {["1920x1080", "1280x720", "1024x768", "800x600"].map(
                          (dimension) => (
                            <SelectItem
                              key={dimension}
                              value={dimension}
                              className="hover:bg-neutral-500"
                            >
                              {dimension}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    {errors.mediaDimensions && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.mediaDimensions}
                      </p>
                    )}
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={details?.mediaDimension}
                    readOnly
                    className="mt-2 bg-[#262626] text-gray-500"
                  />
                )}
              </div>
              {/* Media Format */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Media Format
                </label>
                <Input
                  type="text"
                  value={details?.mediaFormat}
                  readOnly
                  className="mt-2 bg-[#262626] text-gray-500"
                />
              </div>
              {/* Media Type */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Media Type
                </label>
                <Input
                  type="text"
                  value={details?.mediaType}
                  readOnly
                  className="mt-2 bg-[#262626] text-gray-500"
                />
              </div>
              {/* Media Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400">
                  Media Description <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={mediaDescription}
                  readOnly={!editable}
                  onChange={(e) => setMediaDescription(e.target.value)}
                  className={`mt-2 ${
                    editable ? "" : "bg-[#262626] text-gray-500"
                  }`}
                />
                {errors.mediaDescription && (
                  <p className="text-sm  text-red-500">
                    {errors.mediaDescription}
                  </p>
                )}
              </div>
              {/* Media Type Toggle */}
              <div>
                <div className="relative">
                  <div className="flex space-x-[50%]">
                    {/* Image Button */}
                    <button
                      type="button"
                      onClick={() => editable && setMediaType("Image")}
                      className={`px-6 pb-2 flex items-center relative ${
                        mediaType === "Image"
                          ? "border-b-2 border-white text-white"
                          : "border-b-2 border-gray-600 text-gray-400"
                      } ${editable ? "cursor-pointer" : "cursor-not-allowed"}`}
                      disabled={!editable}
                    >
                      Image
                      {mediaType === "Image" && (
                        <span className="text-red-500 absolute -right-4 top-0">
                          *
                        </span>
                      )}
                    </button>

                    {/* Video Button */}
                    <button
                      type="button"
                      onClick={() => editable && setMediaType("Video")}
                      className={`px-6 pb-2 flex items-center relative ${
                        mediaType === "Video"
                          ? "border-b-2 border-white text-white"
                          : "border-b-2 border-gray-600 text-gray-400"
                      } ${editable ? "cursor-pointer" : "cursor-not-allowed"}`}
                      disabled={!editable}
                    >
                      Video
                      {mediaType === "Video" && (
                        <span className="text-red-500 absolute -right-4 top-0">
                          *
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Adjusted Connected Line */}
                  <div
                    className="absolute bottom-0 h-[2px] bg-gray-600 mt-1"
                    style={{ width: "52%", left: "90px" }}
                  ></div>
                </div>

                {/* Media Preview Section */}
                <div className="mt-2 relative w-full h-[300px] bg-[#262626] rounded-md flex items-center justify-center">
                  {loading ? (
                    // Loader for when a file is being uploaded
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="animate-spin h-10 w-10 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C6.477 0 0 6.477 0 12h4z"
                        ></path>
                      </svg>
                      <span className="text-gray-400 mt-2">Uploading...</span>
                    </div>
                  ) : previewURL ? (
                    mediaType === "Image" ? (
                      // Image Preview
                      <img
                        src={previewURL}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      // Video Preview
                      <video
                        controls
                        className="w-full h-full object-cover rounded-md"
                      >
                        <source src={previewURL} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    // No File Uploaded
                    <span className="text-gray-400">No media uploaded</span>
                  )}

                  {/* Update File Button */}
                  {editable && (
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                      className="absolute bg-[#262626] text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 focus:outline-none"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block"
                      >
                        <path
                          d="M10.1382 3.2693L7.4715 0.534368C7.40957 0.470695 7.336 0.420177 7.25501 0.385708C7.17401 0.351239 7.08719 0.333496 6.9995 0.333496C6.91181 0.333496 6.82498 0.351239 6.74399 0.385708C6.66299 0.420177 6.58942 0.470695 6.5275 0.534368L3.86083 3.2693C3.73582 3.39769 3.66567 3.57175 3.66579 3.75318C3.66592 3.93462 3.73631 4.10858 3.8615 4.23678C3.98668 4.36499 4.15639 4.43694 4.3333 4.43681C4.51021 4.43669 4.67982 4.36449 4.80483 4.2361L6.3335 2.6683V8.53883C6.3335 8.72017 6.40373 8.89408 6.52876 9.0223C6.65378 9.15053 6.82335 9.22256 7.00016 9.22256C7.17697 9.22256 7.34654 9.15053 7.47157 9.0223C7.59659 8.89408 7.66683 8.72017 7.66683 8.53883V2.6683L9.1955 4.2361C9.32123 4.36065 9.48963 4.42956 9.66443 4.42801C9.83923 4.42645 10.0064 4.35454 10.13 4.22777C10.2536 4.101 10.3238 3.92951 10.3253 3.75024C10.3268 3.57097 10.2596 3.39825 10.1382 3.2693Z"
                          fill="#FAFAFA"
                        />
                        <path
                          d="M12.3335 8.19697H9.00016V8.53883C9.00016 9.08284 8.78945 9.60457 8.41438 9.98925C8.0393 10.3739 7.5306 10.59 7.00016 10.59C6.46973 10.59 5.96102 10.3739 5.58595 9.98925C5.21088 9.60457 5.00016 9.08284 5.00016 8.53883V8.19697H1.66683C1.31321 8.19697 0.974069 8.34104 0.72402 8.59749C0.473972 8.85394 0.333496 9.20176 0.333496 9.56443V12.2994C0.333496 12.662 0.473972 13.0099 0.72402 13.2663C0.974069 13.5228 1.31321 13.6668 1.66683 13.6668H12.3335C12.6871 13.6668 13.0263 13.5228 13.2763 13.2663C13.5264 13.0099 13.6668 12.662 13.6668 12.2994V9.56443C13.6668 9.20176 13.5264 8.85394 13.2763 8.59749C13.0263 8.34104 12.6871 8.19697 12.3335 8.19697ZM10.6668 12.2994C10.469 12.2994 10.2757 12.2392 10.1113 12.1265C9.94681 12.0138 9.81864 11.8536 9.74295 11.6662C9.66726 11.4788 9.64746 11.2726 9.68604 11.0737C9.72463 10.8747 9.81987 10.692 9.95972 10.5486C10.0996 10.4051 10.2778 10.3074 10.4717 10.2679C10.6657 10.2283 10.8668 10.2486 11.0495 10.3262C11.2322 10.4039 11.3884 10.5353 11.4983 10.704C11.6082 10.8726 11.6668 11.0709 11.6668 11.2738C11.6668 11.5458 11.5615 11.8066 11.3739 11.999C11.1864 12.1913 10.932 12.2994 10.6668 12.2994Z"
                          fill="#FAFAFA"
                        />
                      </svg>
                      Update File
                    </button>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
