"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/toast-context";
import { MoreHorizontal, ChevronDown, Save } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";
const idToken = Cookies.get("id_token");
const refreshToken = Cookies.get("refresh_token");
import axios from "axios";

const username = Cookies.get("username");
const API_URL = process.env.NEXT_PUBLIC_API_URL_2;

const Respond = ({ params }: any) => {
  const router = useRouter();
  const [threeDotDropdownOpen, setThreeDotDropdownOpen] = useState(false);
  const { showToast } = useToast();
  console.log("Response", params.respond, API_URL);

  interface QueryDataType {
    _id: string;
    fullName: string;
    email: string;
    issueType: string;
    message: string;
    query_ID: string;
    query_status: string;
    attachment?: string;
    createdAt: string;
    responses: any[];
    userId: string;
  }

  const [fullname, setFullName] = useState<string>();
  const [email, setemail] = useState<string>();
  const [issueType, setIssueType] = useState<string>();
  const [queryId, setQueryId] = useState<string>();
  const [queryStatus, setQueryStatus] = useState<string>();
  const [createdAt, setCreatedAt] = useState<string>();
  const [phone, setPhone] = useState<number>();
  const [responses, setResponses] = useState<string[]>();
  const [responsiblePerson, setResponsiblePerson] = useState<string>();
  const [attachment, setAttachment] = useState<string>();
  const [userResponse, setUserResponse] = useState<string>("");
  const [urgencyLevel, setUrgencyLevel] = useState<string>("");
  const [queryDescription, setQueryDescription] = useState<string>("");
  const [_id, setID] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [editable, setEditable] = useState(false);
  const [queryData, setQueryData] = useState<QueryDataType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await axios.get(
          `${API_URL}/queryManagement/getQuery/${params.respond}`
        );
        console.log("responseData", responseData.data.data);

        if (responseData.data.success === true) {
          setFullName(responseData.data.data.fullName);
          setemail(responseData.data.data.email);
          setIssueType(responseData.data.data.issueType);
          setQueryDescription(responseData.data.data.message);
          setQueryId(responseData.data.data.query_ID);
          setQueryStatus(responseData.data.data.query_status);
          setCreatedAt(responseData.data.data.createdAt);
          setResponses(responseData.data.data.responses);
          setUrgencyLevel(responseData.data.data.urgency_level);
          setResponsiblePerson(responseData.data.data.responsiblePerson);
          setAttachment(responseData.data.data.attachment);

          setPhone(responseData.data.data.mubNum);
          setID(responseData.data.data._id);
        }
      } catch (error) {
        console.error("Error fetching query data:", error);
      }
    };

    fetchData();
  }, [params.respond]); // Include dependency

  const handleDelete = async () => {
    try {
      console.log("delete", _id);
      const response1 = await fetch(
        `${API_URL}/queryManagement/deleteQuery/${queryId}`,
        {
          method: "DELETE",
        }
      );
      console.log("deleted response", response1);

      if (!response1.ok) {
        throw new Error(`Failed to delete media: ${_id}`);
      }
      showToast({
        type: "success",
        title: "Deleted",
        description: "Selected media deleted successfully.",
        actionText: "OK",
        onAction() {
          window.location.reload();
        },
      });

      router.push(`/queryManagement`);
    } catch (error) {
      console.error("Delete error:", error);
      showToast({
        type: "error",
        title: "Error",
        description: "Error in deleting.",
        actionText: "OK",
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updatedData = {
        responsiblePerson: "USR_12345",
        issueType,
        response: userResponse,
        query_status: queryStatus,
        urgencyLevel,
      };

      const res = await axios.put(
        `${API_URL}/queryManagement/edit/${queryId}`,
        updatedData, // Send data directly
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
            "x-refresh-token": refreshToken,
            "x-username": username,
          },
        }
      );

      // Correct status check
      if (res.status === 200 || res.status === 201) {
        setEditable(false);
        showToast({
          type: "success",
          title: "Saved",
          description: "Your details have been saved successfully.",
          actionText: "OK",
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
      console.error("Error updating query details:", error);
      showToast({
        type: "error",
        title: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while updating query details",
        actionText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseSubmit = async (e: any) => {
    e.preventDefault();

    if (!queryId || !userResponse || userResponse.trim() === "") {
      showToast({
        type: "error",
        title: "Validation Error",
        description: "Please enter a valid response before submitting.",
        actionText: "OK",
      });
      return;
    }

    try {
      console.log(`Submitting response for query ID: ${queryId}...`);

      const response = await axios.post(
        `${API_URL}/queryManagement/respond/${queryId}`,
        { response: userResponse } // Ensure correct request format
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Response saved successfully:", response.data);

        showToast({
          type: "success",
          title: "Saved",
          description: "Your response has been saved successfully.",
          actionText: "OK",
        });

        // Optional: Clear the input after submission
        setUserResponse("");
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error submitting response:", error);

      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while sending the response.";

      showToast({
        type: "error",
        title: "Error",
        description: errorMessage,
        actionText: "OK",
      });
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

      <div className="container h-auto mx-auto py-10 pt-10 pr-10 pl-[60px]">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm m-auto text-neutral-500 flex items-center space-x-2">
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
            onClick={() => router.push("/queryManagement")}
          >
            Query Management
          </button>

          <span className="text-2xl text-white">›</span>
          <span className="text-lg text-white">Query Respond</span>
        </div>

        {/* Main Component */}
        <div className="border border-neutral-700 rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-700">
            <h1 className="text-xl font-bold text-white">Query Details</h1>
            <div className="flex gap-2">
              {/* // Save Button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#262626] text-neutral-100 px-4 py-2 rounded-md shadow focus:outline-none"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    {/* <Save/> */}
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save />
                    Save
                  </>
                )}
              </Button>
              <div className="flex flex-col relative">
                <Button
                  variant="ghost"
                  className="px-4 py-2 rounded-md shadow focus:outline-none bg-neutral-800 flex items-center justify-center"
                  onClick={() => setThreeDotDropdownOpen((prev) => !prev)}
                >
                  <MoreHorizontal className="h-6 w-6 text-neutral-100" />
                </Button>
                {threeDotDropdownOpen ? (
                  <div className="absolute mt-10 w-40 bg-[#262626] rounded-md shadow-lg z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-red-500 rounded-md hover:bg-neutral-700"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-neutral-400 rounded-md hover:bg-neutral-700"
                      onClick={() => {
                        setEditable(true);
                        setThreeDotDropdownOpen(false); // Close menu
                      }}
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-4">
            {/* <div>
              Status:{"  "}
              <input type="checkbox" />
              {"  "}
              <label>Activate</label>
            </div> */}

            <div className="flex justify-between">
              <div className="w-[50%]">
                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    Query Id
                  </label>
                  <Input
                    type="text"
                    value={queryId}
                    readOnly={true}
                    className="mt-2 bg-[#262626] text-neutral-500"
                  />
                </div>
                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    Urgency Level
                  </label>
                  {editable ? (
                    <div className="mt-2">
                      <Select onValueChange={(value) => setUrgencyLevel(value)}>
                        <SelectTrigger className="w-full bg-neutral-950  text-gray-400 border border-gray-600 rounded-md cursor-pointer">
                          <SelectValue placeholder="Select Urgency Level" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#262626] text-white">
                          {["Low", "Moderate", "High"].map((level, index) => (
                            <SelectItem
                              key={index}
                              value={level}
                              className="hover:bg-gray-700"
                            >
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={urgencyLevel ? urgencyLevel : "NA"}
                      readOnly={true}
                      className="mt-2  bg-[#262626] text-neutral-500"
                    />
                  )}
                </div>
                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    Created By
                  </label>
                  <Input
                    type="text"
                    value={fullname}
                    readOnly={true}
                    className="mt-2  bg-[#262626] text-neutral-500"
                  />
                </div>
                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    Phone No.
                  </label>
                  <Input
                    type="text | number"
                    maxLength={10}
                    value={phone ? phone : "NA"}
                    placeholder="99-99-99-99-99"
                    readOnly={true}
                    className="mt-2  bg-[#262626] text-neutral-500"
                  />
                </div>

                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    Attachment
                  </label>
                  <div className="w-full mt-2 flex">
                    <Input
                      type="text"
                      value={attachment}
                      readOnly
                      className="rounded-l-md rounded-r-none w-[90%] bg-[#262626] text-neutral-500 cursor-pointer"
                      onClick={() => setIsOpen(true)} // Open modal on click
                    />
                    <div
                      className="w-[10%] px-3 flex justify-center items-center bg-neutral-700 rounded-r cursor-pointer"
                      onClick={() => setIsOpen(true)}
                    >
                      <svg
                        width="12"
                        height="20"
                        viewBox="0 0 10 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.00001 16.8333C3.80695 16.832 2.66312 16.3574 1.81948 15.5138C0.975787 14.6701 0.501253 13.5262 0.5 12.333V5.66663C0.5 5.57822 0.535119 5.49344 0.597631 5.43092C0.660143 5.36841 0.744928 5.33329 0.833333 5.33329C0.921738 5.33329 1.00652 5.36841 1.06904 5.43092C1.13155 5.49344 1.16667 5.57822 1.16667 5.66663V12.3333C1.16667 13.35 1.57053 14.325 2.28942 15.0439C3.00831 15.7628 3.98334 16.1666 5 16.1666C6.01666 16.1666 6.99169 15.7628 7.71058 15.0439C8.42947 14.325 8.83333 13.35 8.83333 12.3333V4.41663C8.83333 3.73148 8.56116 3.0744 8.07669 2.58993C7.59222 2.10546 6.93514 1.83329 6.25 1.83329C5.56486 1.83329 4.90778 2.10546 4.42331 2.58993C3.93884 3.0744 3.66667 3.73148 3.66667 4.41663V11.5C3.66667 11.8536 3.80714 12.1927 4.05719 12.4428C4.30724 12.6928 4.64638 12.8333 5 12.8333C5.35362 12.8333 5.69276 12.6928 5.94281 12.4428C6.19286 12.1927 6.33333 11.8536 6.33333 11.5V5.66663C6.33333 5.57822 6.36845 5.49344 6.43096 5.43092C6.49348 5.36841 6.57826 5.33329 6.66667 5.33329C6.75507 5.33329 6.83986 5.36841 6.90237 5.43092C6.96488 5.49344 7 5.57822 7 5.66663V11.5C7 12.0304 6.78929 12.5391 6.41421 12.9142C6.03914 13.2892 5.53043 13.5 5 13.5C4.46957 13.5 3.96086 13.2892 3.58579 12.9142C3.21071 12.5391 3 12.0304 3 11.5V4.41663C3 3.55467 3.34241 2.72802 3.9519 2.11853C4.5614 1.50904 5.38805 1.16663 6.25 1.16663C7.11195 1.16663 7.9386 1.50904 8.5481 2.11853C9.15759 2.72802 9.5 3.55467 9.5 4.41663V12.3328C9.49881 13.526 9.02427 14.6701 8.18052 15.5138C7.33689 16.3574 6.19307 16.832 5.00001 16.8333Z"
                          fill="#FAFAFA"
                          stroke="#FAFAFA"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Modal */}
                  {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-neutral-900 p-5 rounded-lg shadow-lg max-w-lg">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="absolute top-52 right-52 text-xl"
                        >
                          ✖
                        </button>
                        <img
                          src={attachment}
                          alt="Attachment not accessible"
                          className="h-52 w-52 rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-[50%]">
                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    Query Status
                  </label>
                  {editable ? (
                    <div className="mt-2">
                      <Select
                        onValueChange={(value) => {
                          setQueryStatus(value);
                        }}
                      >
                        <SelectTrigger className="w-full bg-neutral-950  text-gray-400 border border-gray-600 rounded-md cursor-pointer">
                          <SelectValue placeholder="Select Query Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#262626] text-white">
                          {["In Progress", "Pending", "Complete"].map(
                            (level, index) => (
                              <SelectItem
                                key={index}
                                value={level}
                                className="hover:bg-gray-700"
                              >
                                {level}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={queryStatus}
                      readOnly={true}
                      className="mt-2  bg-[#262626] text-neutral-500"
                    />
                  )}
                </div>
                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    Created At
                  </label>
                  <Input
                    type="text"
                    value={createdAt}
                    readOnly={true}
                    className="mt-2  bg-[#262626] text-neutral-500"
                  />
                </div>
                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    E-mail ID
                  </label>
                  <Input
                    type="text"
                    value={email}
                    readOnly={true}
                    placeholder="abc@gmail.com"
                    className="mt-2  bg-[#262626] text-neutral-500"
                  />
                </div>
                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    Issue Type
                  </label>
                  {editable ? (
                    <div className="mt-2">
                      <Select
                        onValueChange={(value) => setIssueType(value)}
                        value={issueType}
                      >
                        <SelectTrigger className="w-full bg-neutral-950 text-gray-400 border border-gray-600 rounded-md cursor-pointer">
                          <SelectValue placeholder="Select Issue Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#262626] text-white">
                          {[
                            "Technical",
                            "Plan Related",
                            "General",
                            "Payment Related",
                            "Booking Related",
                            "Other",
                          ].map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="hover:bg-gray-700"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={issueType}
                      readOnly={true}
                      className="mt-2  bg-[#262626] text-neutral-500"
                    />
                  )}
                </div>
                <div className="py-4 w-[85%] m-auto">
                  <label className="block text-sm font-medium text-neutral-400">
                    Responsible Person
                  </label>
                  {editable ? (
                    <div className="mt-2">
                      <Select
                        onValueChange={(value) => setResponsiblePerson(value)}
                      >
                        <SelectTrigger className="w-full bg-neutral-950  text-gray-400 border border-gray-600 rounded-md cursor-pointer">
                          <SelectValue placeholder="Select Responsible Person" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#262626] text-white">
                          {[
                            "Person 1",
                            "Person 2",
                            "Person 3",
                            "Person 4",
                            "Person 5",
                          ].map((person, index) => (
                            <SelectItem
                              key={index}
                              value={person}
                              className="hover:bg-gray-700"
                            >
                              {person}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={responsiblePerson ? responsiblePerson : "NA"}
                      readOnly={true}
                      className="mt-2 bg-[#262626] text-neutral-500"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="py-4 w-[93%] m-auto">
              <label className="text-sm font-medium text-neutral-400">
                Query Description
              </label>
              <Input
                type="text"
                value={queryDescription ? queryDescription : "NA"}
                readOnly={true}
                className="mt-2  bg-[#262626] text-neutral-500"
              />
            </div>
            <div className="w-[55%] pl-6 scrollbar-hide scrollbar-thumb-neutral-500 scrollbar-track-neutral-950 scrollbar-thin">
              <h1 className="mb-2">
                <div className="w-[608px] h-9 justify-center items-center inline-flex">
                  <div className="w-[608px] h-9 pt-px justify-center items-center inline-flex">
                    <div className="grow shrink basis-0 self-stretch border-b border-neutral-600 justify-start items-start gap-8 inline-flex">
                      <div className="h-[34px] px-1 pb-4 border-b-2 border-neutral-50 flex-col justify-center items-center inline-flex">
                        <div className="text-neutral-50 text-sm font-medium  leading-[21px]">
                          Response{" "}
                          <span className="text-red-500 text-xl mb-2">
                            {editable ? "*" : ""}
                          </span>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </h1>
              <div
                className={`${
                  responses ? "border-b" : ""
                } h-96 overflow-y-auto border-neutral-700`}
              >
                {responses && responses.length > 0 ? (
                  responses.map((response, index) => (
                    <div className="flex gap-2">
                      <img
                        src="https://randomuser.me/api/portraits/women/75.jpg"
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />

                      <div className="bg-neutral-800 mb-2 text-white p-6 rounded-b-2xl rounded-r-2xl w-80">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-white">
                              Bonnie Green {"   "} 11:46
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-gray-300">{response}</p>
                        <p className="text-gray-500 text-xs mt-2">08-09-2024</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full m-auto pl-6">
                    <div className="flex flex-col  gap-0">
                      <textarea
                        placeholder="Write text here..."
                        value={userResponse}
                        onChange={(e) => setUserResponse(e.target.value)}
                        className="bg-transparent border px-2 py-4 bg-neitral-900 border-neutral-400 w-full h-32 mt-2 rounded-t-lg"
                      ></textarea>
                      <div className="w-full flex justify-end gap-0 border border-neutral-400 rounded-b-lg p-2 text-right">
                        <button 
                        onClick={()=> setUserResponse("")}
                        className="flex items-center gap-2 bg-neutral-700 px-2 py-1 rounded-lg">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_7525_40)">
                              <path
                                d="M14.6667 2H4.66672C4.20672 2 3.84672 2.23333 3.60672 2.58667L0.246719 7.63333C0.100052 7.86 0.100052 8.14667 0.246719 8.37333L3.60672 13.4133C3.84672 13.76 4.20672 14 4.66672 14H14.6667C15.4001 14 16.0001 13.4 16.0001 12.6667V3.33333C16.0001 2.6 15.4001 2 14.6667 2ZM12.2001 10.8667C12.1384 10.9285 12.0651 10.9775 11.9845 11.011C11.9038 11.0444 11.8174 11.0616 11.7301 11.0616C11.6427 11.0616 11.5563 11.0444 11.4756 11.011C11.395 10.9775 11.3217 10.9285 11.2601 10.8667L9.33339 8.94L7.40672 10.8667C7.28207 10.9913 7.113 11.0613 6.93672 11.0613C6.76043 11.0613 6.59137 10.9913 6.46672 10.8667C6.34207 10.742 6.27204 10.573 6.27204 10.3967C6.27204 10.2204 6.34207 10.0513 6.46672 9.92667L8.39339 8L6.46672 6.07333C6.34207 5.94868 6.27204 5.77962 6.27204 5.60333C6.27204 5.51605 6.28923 5.42961 6.32263 5.34897C6.35604 5.26833 6.405 5.19505 6.46672 5.13333C6.52844 5.07161 6.60171 5.02265 6.68236 4.98925C6.763 4.95585 6.84943 4.93865 6.93672 4.93865C7.113 4.93865 7.28207 5.00868 7.40672 5.13333L9.33339 7.06L11.2601 5.13333C11.3218 5.07161 11.395 5.02265 11.4757 4.98925C11.5563 4.95585 11.6428 4.93865 11.7301 4.93865C11.8173 4.93865 11.9038 4.95585 11.9844 4.98925C12.0651 5.02265 12.1383 5.07161 12.2001 5.13333C12.2618 5.19505 12.3107 5.26833 12.3441 5.34897C12.3775 5.42961 12.3947 5.51605 12.3947 5.60333C12.3947 5.69062 12.3775 5.77705 12.3441 5.8577C12.3107 5.93834 12.2618 6.01161 12.2001 6.07333L10.2734 8L12.2001 9.92667C12.4534 10.18 12.4534 10.6067 12.2001 10.8667Z"
                                fill="#FAFAFA"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_7525_40">
                                <rect width="16" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {responses && responses.length > 0 ? (
              <div className="w-[60%] p-8">
                <label className="text-gray-400 text-sm">Comment</label>
                <div className="flex items-center gap-2 mt-2 bg-neutral-900 p-2 rounded-lg">
                  <Input
                    type="text"
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Write text here ..."
                    className="bg-transparent text-white outline-none flex-1"
                  />
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#262626] text-white px-4 py-2 rounded-md shadow hover:bg-neutral-700 focus:outline-none"
                  >
                    ➤
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end text-end mt-2">
                <Button
                  onClick={handleSubmit}
                  className="bg-[#262626] text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 focus:outline-none"
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Respond;
