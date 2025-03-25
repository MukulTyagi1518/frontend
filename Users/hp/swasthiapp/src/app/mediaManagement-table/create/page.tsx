

"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";


export default function CreateMediaPage() {
  const router = useRouter(); // To handle redirection
  const [status, setStatus] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(true);
  const [mediaType, setMediaType] = useState<string>("Image");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mediaFormat, setMediaFormat] = useState<string>("");
  const [selectedFileName, setSelectedFileName] =
    useState<string>("No file chosen");

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

      setSelectedFileName(fileName);

      // Determine Media Type and Format
      if (
        ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(
          fileExtension
        )
      ) {
        setMediaType("Image");
      } else if (["mp4", "avi", "mkv", "mov", "wmv"].includes(fileExtension)) {
        setMediaType("Video");
      } else {
        setMediaType("Unknown");
      }

      setMediaFormat(fileExtension);
    } else {
      setSelectedFileName("No file chosen");
      setMediaType("");
      setMediaFormat("");
    }
  };

  const navigateToForm = () => {
    // Pass state as query parameters
    router.push(
      `/mediaManagement-table/create/form?mediaType=${mediaType}&mediaFormat=${mediaFormat}`
    );
  };
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
          <button
            className="text-lg text-white hover:underline focus:outline-none"
            onClick={() => router.push("/mediaManagement-table")}
          >
            Media Management
          </button>
          <span className="text-lg text-white">›</span>
          <span className="text-lg text-white">Create</span>
        </div>

        {/* Main Component */}
        <div className="border border-[#525252] rounded-lg">
          {/* Header with Dropdown Menu */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-[#525252]">
            <h1 className="text-xl font-bold text-white">Create</h1>
            <div className="relative">
              <Button
                variant="ghost"
                className="p-0 w-8 h-8 flex items-center justify-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <MoreHorizontal className="h-6 w-6 text-gray-400" />
              </Button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#262626] rounded-md shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
                    onClick={() => router.push("/mediaManagement-table")}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className=" px-6 py-4">
            {/* Status */}
            <div className="mb-6 flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-400">
                Status:
              </label>
              <Checkbox
                checked={status}
                onCheckedChange={(value) => setStatus(!!value)}
              />
              <span className="text-white">
                {status ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-400">
                  Upload Media
                </span>
                <div
                  className="flex-grow h-px mx-2 bg-dashed"
                  style={{ background: "#525252" }}
                ></div>
                <span className="text-sm font-medium text-gray-400">
                  Fill Form
                </span>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="mb-6">
              <div className="relative mt-4">
                {/* Button Group */}
                <div
                  className="flex justify-start relative z-10"
                  style={{
                    gap: "calc(25% + 50px)", // Starts with 10% of the container width + 50px
                    maxWidth: "calc(100% - 50px)", // Restricts max width of the buttons and gap
                  }}
                >
                  {/* Image Button */}
                  <button
                    type="button"
                    onClick={() => setMediaType("Image")}
                    className={`px-4 pb-2 flex items-center relative ${
                      mediaType === "Image"
                        ? "border-b-2 border-white text-white"
                        : "border-b-2 border-[#525252] text-[#525252]"
                    }`}
                  >
                    Image
                    {/* Active Asterisk */}
                    {mediaType === "Image" && (
                      <span className="text-red-500 absolute -right-3 top-0">
                        *
                      </span>
                    )}
                  </button>
                  {/* Video Button */}
                  <button
                    type="button"
                    onClick={() => setMediaType("Video")}
                    className={`px-4 pb-2 flex items-center relative ${
                      mediaType === "Video"
                        ? "border-b-2 border-white text-white"
                        : "border-b-2 border-[#525252] text-[#525252]"
                    }`}
                  >
                    Video
                    {/* Active Asterisk */}
                    {mediaType === "Video" && (
                      <span className="text-red-500 absolute -right-3 top-0">
                        *
                      </span>
                    )}
                  </button>
                </div>

                {/* Connected Line Below */}
                <div
                  className="absolute bottom-0 left-0 h-[2px]"
                  style={{
                    maxWidth: "30vw",
                    width: "calc(100% - 50px)",
                    background: "#525252",
                  }}
                ></div>
              </div>
            </div>

            {/* Custom File Upload Section */}
            <div className="mb-6">
              <label
                htmlFor="upload-file"
                className="block text-sm font-medium text-gray-400"
              >
                Upload Media <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-[#262626] rounded-md w-[348px] bg-[#171717] mt-2">
                <label
                  htmlFor="upload-file"
                  className="px-4 py-2 bg-[#262626] text-white cursor-pointer rounded-l-md"
                >
                  Choose File
                </label>
                <input
                  id="upload-file"
                  accept=".jpg, .jpeg, .png, .gif, .mp4, .mov, .webp"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelection}
                />
                <span
                  className="flex-grow text-gray-400 bg-black h-full flex items-center rounded-[5px] px-[10px] py-[8px] cursor-pointer"
                  onClick={() =>
                    document.getElementById("upload-file")?.click()
                  }
                >
                  {selectedFileName}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">Max. File Size: 30MB</p>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <Button
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200"
                onClick={navigateToForm}
                disabled={!mediaType || !mediaFormat} // Disable if media type/format not set
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
   </div>
   </div>
  );
}
