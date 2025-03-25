"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { Combobox } from "@/components/ui/combobox";
import { useReducer, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Copy, User, Save } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input as CustomInput } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { parse, format, addMinutes } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast/toast-context";
import React from "react";
import { z } from "zod";

const apiendpoint2 = process.env.NEXT_PUBLIC_API_URL_2;

const userSchema = z.object({
  category: z
    .array(z.string())
    .nonempty("Please select at least one category."),
  createdBy: z.string().nonempty("Please select the creator."),
  level: z.string().nonempty("Please select a level."),
  intensity: z.string().nonempty("Please select a intensity."),
  calories: z.string().nonempty("Please select a calories."),
  equipment: z.string().nonempty("Please select a equipment."),
  sessionDate: z.string().nonempty("Please select a session date."),
  sessionTime: z.string().nonempty("Please select a session time."),
  duration: z.string().nonempty("Please select a duration."),
  sessionName: z.string().min(3, "Session name is required."),
  description: z.string().min(3, "Media description is required."),
  focusArea: z
    .array(z.string())
    .nonempty("Please select at least one focus area."),
  sessionLink: z
    .string()
    .url("Please enter a valid URL starting with http:// or https://"),
});

// Reducer for managing switch state
const switchReducer = (
  state: string,
  action: { type: "SET_SWITCH"; payload: string }
): string => {
  switch (action.type) {
    case "SET_SWITCH":
      return action.payload;
    default:
      return state;
  }
};

// Reducer for managing isEditing and dropdownOpen states
const toggleReducer = (state: boolean, action: { type: "TOGGLE" }): boolean =>
  !state;

export default function MyComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [UserId, setUserId] = useState<string>("");
  const { showToast } = useToast();
  const router = useRouter();
  useEffect(() => {
    params.then((resolvedParams) => {
      setUserId(resolvedParams.id);
    });
  }, [params]);

  const [sessionData, setSessionData] = useState<any>(null);
  const [sessionName, setSessionName] = useState<string>("");
  const [sessionDetails, setSessionDetails] = useState<any>({});
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("30 min");
  const [level, setLevel] = useState<string>("Intermediate");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [createdBy, setCreatedBy] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [Email, setEmail] = useState<string>("Intermediate");
  const [ReportReason, setReportReason] = useState<string>("Intermediate");
  // Reducers for toggle states
  const [isEditing, setIsEditing] = useReducer(toggleReducer, false);
  const [dropdownOpen, setDropdownOpen] = useReducer(toggleReducer, false);
  const [loading, setLoading] = useState<boolean>(false); // Manages the loader
  const [mediaType, setMediaType] = useState<string | null>(null);
  const editable = isEditing;
  const createdByOptions = ["Aniruddha", "Jitanshu", "Zoffi"];
  const [linkPrefix, setLinkPrefix] = useState<string>("https://");
  const [sessionLink, setSessionLink] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreviewURL(URL.createObjectURL(file)); // Create a preview URL
      setMediaType(file.type.startsWith("image") ? "Image" : "Video");
    }
  };

  // Immutable switch state management
  const [activeSwitch, dispatch] = useReducer(switchReducer, "Focus Area");

  // State management for inputs
  const [createdAt, setCreatedAt] = useReducer(
    (_: string, newValue: string) => newValue,
    ""
  );

  const durationOptions = [
    "<5 MIN",
    "5-10 MIN",
    "10-15 MIN",
    "15-20 MIN",
    "20-25 MIN",
    "25-30 MIN",
    "30-35 MIN",
    "35-40 MIN",
    "40 MIN+",
  ];

  const [intensity, setIntensity] = useState("");
  const [calories, setCalories] = useState("");
  const [equipment, setEquipment] = useState("");
  const levelOptions = ["Begineer", "Intermediate", "Advanced"];
  const intensityOptions = ["Low", "Moderate", "High"];
  const caloriesOptions = ["20", "50", "100", "150", "200", "500"];
  const equipmentOptions = [
    "Dumbbells",
    "Resistance band",
    "Pushup Board",
    "Kettlebells",
    "Yoga Mat",
  ];

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

  useEffect(() => {
    // Simulate an API response for testing
    const staticImageURL = false;
    setPreviewURL(null);
  }, []);

  // Dropdown action handler
  const handleDropdownAction = (action: string) => {
    switch (action) {
      case "edit":
        setIsEditing({ type: "TOGGLE" });
        break;
      case "copy":
        alert("Create a Copy functionality will be implemented here.");
        break;
      case "delete":
        alert("Delete functionality will be implemented here.");
        break;
      default:
        break;
    }
    setDropdownOpen({ type: "TOGGLE" });
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!UserId) return;
      try {
        const response = await fetch(
          `${apiendpoint2}/live-session/get-session/${UserId}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          setSessionData(result.data);
          setSessionName(result.data.title);
          setSelectedCategories([result.data.category]);
          setLevel(result.data.level);
          setSelectedFocusAreas(result.data.focusArea || []);

          // Correctly parsing the session date from "01-02-2025"
          setDate(parse(result.data.date, "dd-MM-yyyy", new Date()));

          // Formatting createdAt from ISO to "dd-MM-yyyy"
          setCreatedAt(format(new Date(result.data.createdAt), "dd-MM-yyyy"));

          setTime(result.data.startTime);
          setDuration(result.data.duration);
          setCreatedBy(result.data.coachName);
          setPreviewURL(result.data.thumbnailURL);

          setIntensity(result.data.intensityLevel || "");
          setCalories(result.data.calories || "");
          setEquipment(result.data.equipment || "");
        } else {
          console.error("Session data not found.");
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, [UserId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSessionDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSendForReview = async () => {
    try {
      console.log("Raw Time Value:", time);

      if (!time) {
        throw new Error("Start time is missing or invalid");
      }

      // Ensure the input time is parsed correctly
      const parsedStartTime = parse(time.trim(), "HH:mm", new Date());
      console.log("Parsed Start Time:", parsedStartTime);

      if (isNaN(parsedStartTime.getTime())) {
        throw new Error("Failed to parse start time");
      }

      // Add 30 minutes for end time
      const durationInMinutes = 30;
      const parsedEndTime = addMinutes(parsedStartTime, durationInMinutes);

      // Switch to 12-hour format with AM/PM
      const formattedStartTime = format(parsedStartTime, "hh:mma"); // 07:00AM
      const formattedEndTime = format(parsedEndTime, "hh:mma"); // 07:30AM

      console.log("Formatted Start Time:", formattedStartTime);
      console.log("Formatted End Time:", formattedEndTime);

      const formData = new FormData();
      formData.append("startTime", formattedStartTime);
      formData.append("endTime", formattedEndTime);
      formData.append("UserId", UserId);
      formData.append("adminId", "667ee37a9b29be0329005c412");
      formData.append("coachId", "667ee37a9b29be0329005c42");
      formData.append("title", sessionDetails.title || "");
      formData.append("description", sessionDetails.description || "");
      formData.append("category", sessionDetails.category || "");
      formData.append("level", sessionDetails.level || "");
      formData.append("date", sessionDetails.date || "");
      formData.append("duration", sessionDetails.duration || "");
      formData.append(
        "focusArea",
        JSON.stringify(sessionDetails.focusArea || [])
      );
      formData.append("meetLink", sessionDetails.meetLink || "");
      formData.append("thumbnailURL", sessionDetails.thumbnailURL || "");

      const response = await fetch(`${apiendpoint2}/live-session/create`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      showToast({
        type: "success",
        title: "Session Sent for Review",
        description: "Your session has been submitted for review successfully.",
        actionText: "OK",
        onAction: () => router.push("/liveSessionManagement"),
      });
    } catch (error: unknown) {
      let errorMessage = "Failed to process your request.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Error:", errorMessage);

      showToast({
        type: "error",
        title: "Error",
        description: errorMessage,
        actionText: "Retry",
      });
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleValidation = () => {
    const sessionDate = date ? date.toISOString().split("T")[0] : "";
    const sessionTime = time || "";

    const result = userSchema.safeParse({
      category: selectedCategories,
      createdBy,
      level,
      intensity,
      equipment,
      calories,
      sessionDate,
      sessionTime,
      duration,
      sessionName,
      // description,
      focusArea: selectedFocusAreas,
      thumbnail,
      sessionLink: `${linkPrefix}${sessionLink}`,
    });

    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) validationErrors[err.path[0] as string] = err.message;
      });
      console.log("Validation Errors:", validationErrors);
      setErrors(validationErrors);
      return false;
    }

    setErrors({});
    console.log("Validation successful!", result.data);
    return true;
  };
  const handleSaveOrReview = async (isSave: boolean) => {
    if (!isSave && !handleValidation()) return;

    setLoading(true);

    const formData = new FormData();

    // Add text fields to FormData
    formData.append("UserId", UserId || "");
    formData.append("adminId", "667ee37a9b29be0329005c412");
    formData.append("coachId", "667ee37a9b29be0329005c42");
    formData.append("title", sessionName);
    formData.append("description", sessionDetails.description || "");
    formData.append("category", selectedCategories[0] || "");
    formData.append("level", level);
    formData.append("date", date ? format(date, "dd-MM-yyyy") : "");
    formData.append("startTime", time || "");
    formData.append("duration", duration);
    formData.append("focusArea", JSON.stringify(selectedFocusAreas));
    formData.append("intensityLevel", intensity || "Moderate"); // ✅ Use selected intensity
    formData.append("calories", calories || "300"); // ✅ Use selected calories
    formData.append("equipment", equipment || "Yoga Mat"); // ✅ Use selected equipment
    formData.append("meetLink", `${linkPrefix}${sessionLink}`);
    // formData.append("thumbnailURL", previewURL); // ✅ thumbnail url to be inserted

    console.log("previewURL", previewURL);

    // API Endpoint & Method Selection
    const apiUrl = isSave
      ? `${apiendpoint2}/live-session/edit`
      : `${apiendpoint2}/live-session/create`;

    const method = isSave ? "PATCH" : "POST"; // ✅ Use PATCH for edits, POST for creation

    try {
      const response = await fetch(apiUrl, {
        method, // ✅ Dynamically use PATCH or POST
        body: formData, // Sending as FormData
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      showToast({
        type: "success",
        title: isSave ? "Draft Saved Successfully" : "Sent for Review",
        description: `Your session has been ${
          isSave ? "saved as draft" : "submitted for review"
        } successfully.`,
        actionText: "OK",
        onAction: () => router.push("/liveSessionManagement"),
      });
    } catch (error: unknown) {
      let errorMessage = "Failed to process your request.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Error:", errorMessage);

      showToast({
        type: "error",
        title: "Error",
        description: errorMessage,
        actionText: "Retry",
      });
    } finally {
      setLoading(false);
    }
  };
  const [response, setResponse] = useState("");
const [isOpen, setIsOpen] = useState(true);
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
   
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-500 flex items-center space-x-2">
          <button
            className="flex items-center space-x-2 text-lg text-white hover:underline focus:outline-none"
            onClick={() => router.push("/RefundManagement")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clip-rule="evenodd"
                d="M13.623 2.01297C13.4832 1.99108 13.3405 1.99695 13.2029 2.03023C13.0654 2.06351 12.9358 2.12355 12.8214 2.20694C12.7071 2.29032 12.6103 2.3954 12.5366 2.51619C12.4629 2.63698 12.4136 2.77111 12.3918 2.91091C12.3699 3.05072 12.3757 3.19347 12.409 3.33101C12.4423 3.46855 12.5023 3.59818 12.5857 3.71252C12.6691 3.82685 12.7742 3.92364 12.895 3.99736C13.0158 4.07108 13.1499 4.12029 13.2897 4.14218C15.2498 4.4578 17.0193 5.49939 18.2465 7.05992C19.4738 8.62045 20.0689 10.5856 19.9136 12.5648C19.7583 14.5441 18.8639 16.3924 17.4083 17.7424C15.9526 19.0924 14.0423 19.8452 12.057 19.8512C10.4726 19.8515 8.92466 19.3757 7.61401 18.4854C6.30336 17.5952 5.29048 16.3316 4.70677 14.8586C4.65775 14.723 4.58198 14.5985 4.48397 14.4927C4.38596 14.3869 4.26769 14.3018 4.13619 14.2425C4.00468 14.1832 3.86261 14.151 3.7184 14.1476C3.57419 14.1443 3.43078 14.1699 3.29666 14.223C3.16255 14.2761 3.04046 14.3556 2.93764 14.4568C2.83481 14.5579 2.75335 14.6787 2.69808 14.812C2.64281 14.9452 2.61485 15.0882 2.61587 15.2324C2.61688 15.3767 2.64685 15.5193 2.70399 15.6517C3.56712 17.8261 5.16107 19.6316 7.21161 20.7578C9.26215 21.8839 11.6411 22.2602 13.939 21.8218C16.237 21.3835 18.3104 20.158 19.8024 18.3561C21.2945 16.5542 22.1119 14.2887 22.114 11.9493C22.1139 9.55324 21.2586 7.23591 19.702 5.41435C18.1454 3.5928 15.9898 2.38664 13.623 2.01297ZM10.8559 2.84195C10.8913 2.97912 10.8993 3.12192 10.8795 3.26219C10.8597 3.40246 10.8124 3.53744 10.7403 3.65941C10.6682 3.78138 10.5728 3.88794 10.4596 3.973C10.3463 4.05805 10.2173 4.11994 10.0801 4.15511C9.72015 4.24772 9.36726 4.36583 9.0241 4.50854C8.89344 4.56288 8.75336 4.59095 8.61186 4.59115C8.47036 4.59135 8.3302 4.56368 8.19939 4.50971C8.06858 4.45575 7.94968 4.37655 7.84948 4.27663C7.74928 4.17672 7.66974 4.05804 7.6154 3.92739C7.56106 3.79673 7.53299 3.65665 7.53279 3.51515C7.53259 3.37365 7.56026 3.23349 7.61422 3.10268C7.66819 2.97187 7.74739 2.85297 7.84731 2.75277C7.94722 2.65257 8.0659 2.57303 8.19655 2.51869C8.63044 2.33766 9.08013 2.18681 9.54419 2.06756C9.68126 2.03236 9.82392 2.02451 9.96403 2.04445C10.1041 2.06439 10.2389 2.11174 10.3607 2.18378C10.4826 2.25582 10.589 2.35115 10.6739 2.46433C10.7589 2.57751 10.8207 2.70487 10.8559 2.84195ZM6.57594 4.61342C6.7747 4.81849 6.88393 5.09408 6.87962 5.37964C6.87531 5.66519 6.75782 5.93736 6.55295 6.13634C6.01874 6.65701 5.55939 7.24932 5.18807 7.89631C5.11977 8.02269 5.02689 8.13413 4.9149 8.22409C4.8029 8.31404 4.67405 8.3807 4.53592 8.42013C4.39779 8.45957 4.25316 8.47098 4.11056 8.45371C3.96795 8.43644 3.83023 8.39083 3.70551 8.31956C3.58079 8.24829 3.47157 8.1528 3.38429 8.0387C3.29701 7.92461 3.23342 7.79422 3.19727 7.65519C3.16111 7.51617 3.15312 7.37131 3.17376 7.22916C3.19441 7.087 3.24327 6.9504 3.31747 6.8274C3.78801 6.0039 4.37227 5.25084 5.05302 4.59043C5.25809 4.39166 5.53368 4.28244 5.81924 4.28675C6.10479 4.29106 6.37696 4.40855 6.57594 4.61342ZM3.31603 9.47814C3.59892 9.51802 3.8544 9.66861 4.02628 9.89681C4.19817 10.125 4.2724 10.4121 4.23265 10.695C4.18084 11.0639 4.15491 11.436 4.15507 11.8085C4.15507 12.0943 4.04155 12.3683 3.83947 12.5704C3.63739 12.7725 3.36332 12.886 3.07754 12.886C2.79176 12.886 2.51768 12.7725 2.3156 12.5704C2.11353 12.3683 2 12.0943 2 11.8085C2 11.3301 2.03304 10.8574 2.09913 10.3948C2.13902 10.1119 2.28961 9.85639 2.51781 9.68451C2.746 9.51262 3.03312 9.43839 3.31603 9.47814ZM8.46522 14.6532V9.24539C8.46535 9.00058 8.52803 8.75987 8.64731 8.5461C8.7666 8.33232 8.93852 8.15257 9.14679 8.0239C9.35505 7.89523 9.59273 7.82191 9.83729 7.81089C10.0818 7.79988 10.3252 7.85154 10.5441 7.96096L15.9519 10.6649C16.1903 10.7843 16.3907 10.9677 16.5307 11.1945C16.6707 11.4214 16.7449 11.6827 16.7449 11.9493C16.7449 12.2159 16.6707 12.4772 16.5307 12.704C16.3907 12.9309 16.1903 13.1143 15.9519 13.2337L10.5441 15.9376C10.3252 16.047 10.0818 16.0987 9.83729 16.0877C9.59273 16.0767 9.35505 16.0033 9.14679 15.8747C8.93852 15.746 8.7666 15.5662 8.64731 15.3525C8.52803 15.1387 8.46535 14.898 8.46522 14.6532Z"
                fill="#FAFAFA"
              />
            </svg>
            <span>Refund Management</span>
          </button>
          <span className="text-lg text-white">›</span>
          <span className="text-lg text-white">Refund Details</span>
        </div>

        {/* Main Component */}
        <div className="border border-[#525252] rounded-lg">
          {/* Header */}
          <div className="flex items-center w-full justify-between px-6 py-4 border-b border-[#525252]">
            <h1 className="text-xl font-bold text-white">Refund Details</h1>
          </div>

          {/* Progress Bar */}
          {/* <div className="relative flex items-center px-6 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <g clip-path="url(#clip0_4799_8684)">
                  <path
                    d="M11 9.5H15V11.5H11V15.5H9V11.5H5V9.5H9V5.5H11V9.5ZM10 20.5C7.34784 20.5 4.8043 19.4464 2.92893 17.5711C1.05357 15.6957 0 13.1522 0 10.5C0 7.84784 1.05357 5.3043 2.92893 3.42893C4.8043 1.55357 7.34784 0.5 10 0.5C12.6522 0.5 15.1957 1.55357 17.0711 3.42893C18.9464 5.3043 20 7.84784 20 10.5C20 13.1522 18.9464 15.6957 17.0711 17.5711C15.1957 19.4464 12.6522 20.5 10 20.5ZM10 18.5C12.1217 18.5 14.1566 17.6571 15.6569 16.1569C17.1571 14.6566 18 12.6217 18 10.5C18 8.37827 17.1571 6.34344 15.6569 4.84315C14.1566 3.34285 12.1217 2.5 10 2.5C7.87827 2.5 5.84344 3.34285 4.34315 4.84315C2.84285 6.34344 2 8.37827 2 10.5C2 12.6217 2.84285 14.6566 4.34315 16.1569C5.84344 17.6571 7.87827 18.5 10 18.5Z"
                    fill="#FAFAFA"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4799_8684">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span>Create</span>
            </div>
            <div className="flex-grow h-px bg-gray-600 mx-4"></div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <path
                  d="M15.7647 3.83317H13.4118C13.4118 3.39114 13.2465 2.96722 12.9523 2.65466C12.6581 2.3421 12.2592 2.1665 11.8431 2.1665H9.4902C9.07417 2.1665 8.67518 2.3421 8.38101 2.65466C8.08683 2.96722 7.92157 3.39114 7.92157 3.83317H5.56863C5.1526 3.83317 4.75361 4.00877 4.45944 4.32133C4.16527 4.63389 4 5.05781 4 5.49984V17.1665C4 17.6085 4.16527 18.0325 4.45944 18.345C4.75361 18.6576 5.1526 18.8332 5.56863 18.8332H15.7647C16.1807 18.8332 16.5797 18.6576 16.8739 18.345C17.1681 18.0325 17.3333 17.6085 17.3333 17.1665V5.49984C17.3333 5.05781 17.1681 4.63389 16.8739 4.32133C16.5797 4.00877 16.1807 3.83317 15.7647 3.83317ZM9.4902 3.83317H11.8431V6.33317H9.4902V3.83317ZM15.7647 17.1665H5.56863V5.49984H7.92157V6.33317C7.71356 6.33317 7.51406 6.42097 7.36698 6.57725C7.21989 6.73353 7.13725 6.94549 7.13725 7.1665C7.13725 7.38752 7.21989 7.59948 7.36698 7.75576C7.51406 7.91204 7.71356 7.99984 7.92157 7.99984H13.4118C13.6198 7.99984 13.8193 7.91204 13.9664 7.75576C14.1134 7.59948 14.1961 7.38752 14.1961 7.1665C14.1961 6.94549 14.1134 6.73353 13.9664 6.57725C13.8193 6.42097 13.6198 6.33317 13.4118 6.33317V5.49984H15.7647V17.1665Z"
                  fill="#A3A3A3"
                />
                <path
                  d="M13.4118 9.6665H7.92157C7.71356 9.6665 7.51406 9.7543 7.36698 9.91058C7.21989 10.0669 7.13725 10.2788 7.13725 10.4998C7.13725 10.7209 7.21989 10.9328 7.36698 11.0891C7.51406 11.2454 7.71356 11.3332 7.92157 11.3332H13.4118C13.6198 11.3332 13.8193 11.2454 13.9664 11.0891C14.1134 10.9328 14.1961 10.7209 14.1961 10.4998C14.1961 10.2788 14.1134 10.0669 13.9664 9.91058C13.8193 9.7543 13.6198 9.6665 13.4118 9.6665Z"
                  fill="#A3A3A3"
                />
                <path
                  d="M13.4118 12.9998H7.92157C7.71356 12.9998 7.51406 13.0876 7.36698 13.2439C7.21989 13.4002 7.13725 13.6122 7.13725 13.8332C7.13725 14.0542 7.21989 14.2661 7.36698 14.4224C7.51406 14.5787 7.71356 14.6665 7.92157 14.6665H13.4118C13.6198 14.6665 13.8193 14.5787 13.9664 14.4224C14.1134 14.2661 14.1961 14.0542 14.1961 13.8332C14.1961 13.6122 14.1134 13.4002 13.9664 13.2439C13.8193 13.0876 13.6198 12.9998 13.4118 12.9998Z"
                  fill="#A3A3A3"
                />
              </svg>
              <span>Under Review</span>
            </div>
            <div className="flex-grow h-px bg-gray-600 mx-4"></div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <path
                  d="M17.9934 8.73264L17.245 7.98347C17.0867 7.82597 17 7.61597 17 7.39347V6.33347C17 4.95514 15.8784 3.83347 14.5 3.83347H13.44C13.2209 3.83347 13.0059 3.7443 12.8509 3.5893L12.1017 2.84014C11.1267 1.86514 9.54169 1.86514 8.56669 2.84014L7.81586 3.5893C7.66086 3.7443 7.44586 3.83347 7.22669 3.83347H6.16669C4.78836 3.83347 3.66669 4.95514 3.66669 6.33347V7.39347C3.66669 7.61597 3.58002 7.82597 3.42252 7.98347L2.67336 8.7318C2.20086 9.2043 1.94086 9.83264 1.94086 10.5001C1.94086 11.1676 2.20169 11.796 2.67336 12.2676L3.42169 13.0168C3.58002 13.1743 3.66669 13.3843 3.66669 13.6068V14.6668C3.66669 16.0451 4.78836 17.1668 6.16669 17.1668H7.22669C7.44586 17.1668 7.66086 17.256 7.81586 17.411L8.56502 18.161C9.05252 18.6476 9.69252 18.891 10.3325 18.891C10.9725 18.891 11.6125 18.6476 12.1 18.1601L12.8492 17.411C13.0059 17.256 13.2209 17.1668 13.44 17.1668H14.5C15.8784 17.1668 17 16.0451 17 14.6668V13.6068C17 13.3843 17.0867 13.1743 17.245 13.0168L17.9934 12.2685C18.465 11.796 18.7259 11.1685 18.7259 10.5001C18.7259 9.8318 18.4659 9.2043 17.9934 8.73264ZM14.1292 9.5268L9.12919 12.8601C8.98836 12.9543 8.82669 13.0001 8.66669 13.0001C8.45169 13.0001 8.23836 12.9168 8.07752 12.756L6.41086 11.0893C6.08502 10.7635 6.08502 10.2368 6.41086 9.91097C6.73669 9.58514 7.26336 9.58514 7.58919 9.91097L8.77252 11.0943L13.2042 8.14014C13.5884 7.8843 14.105 7.98764 14.36 8.37097C14.6159 8.7543 14.5125 9.2718 14.1292 9.5268Z"
                  fill="#A3A3A3"
                />
              </svg>
              <span>Approval</span>
            </div>
            <div className="flex-grow h-px bg-gray-600 mx-4"></div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M16.6667 5.67528H13.3333V3.92089C13.3333 3.4556 13.1577 3.00936 12.8452 2.68035C12.5326 2.35134 12.1087 2.1665 11.6667 2.1665H8.33333C7.89131 2.1665 7.46738 2.35134 7.15482 2.68035C6.84226 3.00936 6.66667 3.4556 6.66667 3.92089V5.67528H3.33333C3.11232 5.67528 2.90036 5.76769 2.74408 5.9322C2.5878 6.09671 2.5 6.31982 2.5 6.55247C2.5 6.78512 2.5878 7.00823 2.74408 7.17274C2.90036 7.33724 3.11232 7.42966 3.33333 7.42966H4.16667V17.0788C4.16667 17.5441 4.34226 17.9903 4.65482 18.3193C4.96738 18.6483 5.39131 18.8332 5.83333 18.8332H14.1667C14.6087 18.8332 15.0326 18.6483 15.3452 18.3193C15.6577 17.9903 15.8333 17.5441 15.8333 17.0788V7.42966H16.6667C16.8877 7.42966 17.0996 7.33724 17.2559 7.17274C17.4122 7.00823 17.5 6.78512 17.5 6.55247C17.5 6.31982 17.4122 6.09671 17.2559 5.9322C17.0996 5.76769 16.8877 5.67528 16.6667 5.67528ZM8.33333 3.92089H11.6667V5.67528H8.33333V3.92089ZM14.1667 17.0788H5.83333V7.42966H14.1667V17.0788Z"
                  fill="#A3A3A3"
                />
                <path
                  d="M8.33333 8.30686C8.11232 8.30686 7.90036 8.39927 7.74408 8.56378C7.5878 8.72828 7.5 8.9514 7.5 9.18405V15.3244C7.5 15.557 7.5878 15.7802 7.74408 15.9447C7.90036 16.1092 8.11232 16.2016 8.33333 16.2016C8.55435 16.2016 8.76631 16.1092 8.92259 15.9447C9.07887 15.7802 9.16667 15.557 9.16667 15.3244V9.18405C9.16667 8.9514 9.07887 8.72828 8.92259 8.56378C8.76631 8.39927 8.55435 8.30686 8.33333 8.30686Z"
                  fill="#A3A3A3"
                />
                <path
                  d="M11.6667 8.30686C11.4457 8.30686 11.2337 8.39927 11.0774 8.56378C10.9211 8.72828 10.8333 8.9514 10.8333 9.18405V15.3244C10.8333 15.557 10.9211 15.7802 11.0774 15.9447C11.2337 16.1092 11.4457 16.2016 11.6667 16.2016C11.8877 16.2016 12.0996 16.1092 12.2559 15.9447C12.4122 15.7802 12.5 15.557 12.5 15.3244V9.18405C12.5 8.9514 12.4122 8.72828 12.2559 8.56378C12.0996 8.39927 11.8877 8.30686 11.6667 8.30686Z"
                  fill="#A3A3A3"
                />
              </svg>
              <span>Complete</span>
            </div>
          </div> */}

          {/* Status */}
          {/* <div className="px-6 py-4 flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-400">Status:</label>
            <Checkbox
              checked={status}
              onCheckedChange={(checked) => setStatus(!!checked)}
              className="form-checkbox h-5 w-5 text-green-500 bg-[#262626] border-gray-600"
            />
            <span className="text-white">{status ? "Active" : "Inactive"}</span>
          </div> */}

          {/* Form Section */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-x-32 gap-y-4">
              {/* Refund Id */}
              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-2">
                  Refund ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter Session Id"
                  readOnly
                  value={UserId || "Loading..."}
                  state={isEditing ? "ReadOnly" : "ReadOnly"}
                  className={`w-full px-4 py-2 rounded-[8px] ${
                    !isEditing ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Status
                </label>
                <Input
                  type="text"
                  value={sessionData?.status || "Loading..."}
                  placeholder="Enter State"
                  state={isEditing ? "ReadOnly" : "ReadOnly"}
                  className={`mt-2 ${
                    !isEditing ? "cursor-not-allowed" : "cursor-not-allowed"
                  }`}
                  readOnly={!isEditing}
                />
              </div>

              {/* Booking Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Booking Type
                </label>
                {isEditing ? (
                  // Editable dropdown for selecting a category
                  <Select
                    onValueChange={(value) => setSelectedCategories([value])}
                    value={selectedCategories[0] || ""}
                  >
                    <SelectTrigger
                      id="category"
                      className="w-full bg-neutral-900 text-gray-400 border border-gray-600"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#262626] text-white border border-gray-600 rounded-md">
                      {[
                        "Yoga",
                        "Meditation",
                        "Cardio",
                        "Strength",
                        "Pilates",
                      ].map((option, index, array) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="hover:bg-gray-700"
                          style={{
                            borderBottom:
                              index !== array.length - 1
                                ? "1px solid var(--Neutral-600, #525252)"
                                : "none",
                            borderRadius: "0", // Ensure no curvy borders on options
                          }}
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  // Immutable display for the selected category
                  <Input
                    type="text"
                    value={selectedCategories[0] || "No category selected"}
                    readOnly
                    onChange={handleInputChange}
                    className="w-full bg-[#262626] text-gray-400 border border-gray-600"
                  />
                )}
              </div>


              {/* Booking Id */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Booking ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter Session Id"
                  readOnly
                  value={UserId || "Loading..."}
                  state={isEditing ? "ReadOnly" : "ReadOnly"}
                  className={`w-full px-4 py-2 rounded-[8px] ${
                    !isEditing ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* User Id */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white mb-2">
                  User ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter Session Id"
                  readOnly
                  value={UserId || "Loading..."}
                  state={isEditing ? "ReadOnly" : "ReadOnly"}
                  className={`w-full px-4 py-2 rounded-[8px] ${
                    !isEditing ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* User Payment Information */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white mb-2">
                  User Payment Information
                </label>
                <Input
                  type="text"
                  placeholder="Enter Session Id"
                  readOnly
                  value={UserId || "Loading..."}
                  state={isEditing ? "ReadOnly" : "ReadOnly"}
                  className={`w-full px-4 py-2 rounded-[8px] ${
                    !isEditing ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* Transaction Id */}
              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-2">
                  Transaction ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter Session Id"
                  readOnly
                  value={UserId || "Loading..."}
                  state={isEditing ? "ReadOnly" : "ReadOnly"}
                  className={`w-full px-4 py-2 rounded-[8px] ${
                    !isEditing ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* Merchent Transaction Id */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Merchant Transaction ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter Session Id"
                  readOnly
                  value={UserId || "Loading..."}
                  state={isEditing ? "ReadOnly" : "ReadOnly"}
                  className={`w-full px-4 py-2 rounded-[8px] ${
                    !isEditing ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* Refund Amount*/}
              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-2">
                  Refund Amount
                </label>
                <Input
                  type="text"
                  placeholder="Enter Session Id"
                  readOnly
                  value={UserId || "Loading..."}
                  state={isEditing ? "ReadOnly" : "ReadOnly"}
                  className={`w-full px-4 py-2 rounded-[8px] ${
                    !isEditing ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-white"
                >
                  Refund Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      type="text"
                      state="ReadOnly"
                      value={date instanceof Date ? format(date, "PPP") : ""}
                      placeholder="Select a date"
                      className="mt-2 cursor-pointer"
                      onChange={handleInputChange}
                    />
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="created"
                  className="text-sm font-medium text-white"
                >
                  Refund By
                </label>

                {isEditing ? (
                  // Show dropdown when editing
                  <Select onValueChange={setCreatedBy} value={createdBy}>
                    <SelectTrigger
                      id="created"
                      className="w-full bg-neutral-800 text-gray-400 border-neutral-600"
                    >
                      <SelectValue placeholder="Select Creator" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 text-white border-neutral-600">
                      {createdByOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="hover:bg-gray-700 border-b border-neutral-600 py-1.5 px-3 flex items-center last:border-b-0"
                        >
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span>{option}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  // Show plain text when not editing
                  <div className="w-full bg-neutral-800 text-gray-400 border border-neutral-600 p-2 rounded">
                    {createdBy || "No creator selected"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Cancellation Time
                </label>

                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Input
                        type="text"
                        readOnly
                        value={time}
                        placeholder="Select a time"
                        className="mt-2 cursor-pointer"
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto p-2 bg-neutral-800 text-white border border-neutral-600"
                    >
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-neutral-800 text-white border border-gray-600 p-2 rounded w-full"
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div
                    className="w-full bg-neutral-800 text-gray-400 border border-neutral-600 p-2 rounded cursor-pointer"
                    
                  >
                    {time || "No time selected"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="created"
                  className="text-sm font-medium text-white"
                >
                  Mode Of Payment
                </label>

                {isEditing ? (
                  // Show dropdown when editing
                  <Select onValueChange={setCreatedBy} value={createdBy}>
                    <SelectTrigger
                      id="created"
                      className="w-full bg-neutral-800 text-gray-400 border-neutral-600"
                    >
                      <SelectValue placeholder="Select Creator" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 text-white border-neutral-600">
                      {createdByOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="hover:bg-gray-700 border-b border-neutral-600 py-1.5 px-3 flex items-center last:border-b-0"
                        >
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span>{option}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  // Show plain text when not editing
                  <div className="w-full bg-neutral-800 text-gray-400 border border-neutral-600 p-2 rounded">
                    {createdBy || "No creator selected"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Switch Buttons */}
          <div className="w-full max-w-lg ml-3 p-4 rounded-lg">
            {/* Upper Label with Underline */}
            <div className="text-white font-medium">
              {isEditing ? <>Reason for Refund</> : "Reason for Refund"}
              <div className="w-full border-b border-gray-600 mt-1"></div>
            </div>

            {/* Lower Label */}
            <label className="text-white font-medium mt-4 block">
              {isEditing ? <>Refund Reason</> : "Refund Reason"}
            </label>

            {/* Textarea */}
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write text here ..."
              className="w-full mt-2 p-3 h-32 bg-neutral-950 text-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
            ></textarea>

            {/* Clear Button */}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setResponse("")}
                className="bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-gray-600"
              >
                <span className="text-xs">✖</span>
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Edit / Send for Review Button */}
          <div className="flex justify-end px-6 py-4">
            {isEditing ? (
              <Button
                className={`px-6 py-2 rounded-md hover:opacity-90 ${
                  isEditing
                    ? "bg-[#A3A3A3] text-[#404040]" // Background for Edit mode
                    : "bg-[#FAFAFA] text-[#404040]" // Default background
                }`}
                onClick={handleSendForReview}
              >
                Make Payment
              </Button>
            ) : (
              <Button
                className={`px-6 py-2 rounded-md hover:opacity-90 ${
                  isEditing
                    ? "bg-[#A3A3A3] text-[#404040]" // Background for Edit mode
                    : "bg-[#FAFAFA] text-[#404040]" // Default background
                }`}
                onClick={() => setIsEditing({ type: "TOGGLE" })}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
      </div>
      
    </>
  );
}
