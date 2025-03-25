"use client";

import { useState } from "react";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { Input } from "@/components/ui/input";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

type TabType = "footer" | "contact" | "faq";


export default function ContactFooter() {
  const [activeTab, setActiveTab] = useState<TabType>("footer");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      address: "xyz",
      email: "xyz",
      helpline: "xyz",
      officeHours: "xyz"
    });
  const [isOpen, setIsOpen] = useState(true);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

  const renderContent = () => {
    switch (activeTab) {
      case "footer":
        return (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <div className="bg-neutral-800 border border-neutral-600 p-4 rounded-lg text-neutral-300">
              FitnEarn Footer content and customization options will appear
              here.
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="p-4">
            <div className="pb-6">
              <label className="block text-sm font-medium text-neutral-400">
                Address*
              </label>
              <Input
                type="text"
                value={formData.address}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`mt-2`}
              />
            </div>
            <div className="pb-6">
              <label className="block text-sm font-medium text-neutral-400">
                Email*
              </label>
              <Input
                type="text"
                value={formData.email}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`mt-2`}
              />
            </div>
            <div className="pb-6">
              <label className="block text-sm font-medium text-neutral-400">
                Helpline*
              </label>
              <Input
              type="text"
                value={formData.helpline}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`mt-2 w-full`}
              />
            </div>
            <div className="pb-6">
              <label className="block text-sm font-medium text-neutral-400">
                Office Hours*
              </label>
              <Input
                type="text"
                value={formData.officeHours}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`mt-2`}
              />
            </div>
          </div>
        );
      case "faq":
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Question 1*</h2>
            <div className="bg-neutral-800 p-4 border border-neutral-600 rounded-lg mb-5 text-neutral-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
            </div>
            <h2 className="text-lg font-semibold mb-2">Ansawer 1*</h2>
            <div className="bg-neutral-800 p-4 border border-neutral-600  rounded-lg text-neutral-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
            </div>
          </div>
        );
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
        {/* Header Section */}
        <h1 className="text-xl font-bold mb-6 flex items-center space-x-3">
          {/* Download Icon (Inline SVG) */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.707 7.48C14.5195 7.28772 14.2652 7.17971 14 7.17971C13.7348 7.17971 13.4805 7.28772 13.293 7.48L11 9.8318V1.02564C11 0.753624 10.8946 0.492748 10.7071 0.300403C10.5196 0.108058 10.2652 0 10 0C9.73478 0 9.48043 0.108058 9.29289 0.300403C9.10536 0.492748 9 0.753624 9 1.02564V9.8318L6.707 7.48C6.61475 7.38204 6.50441 7.30391 6.3824 7.25015C6.2604 7.1964 6.12918 7.16811 5.9964 7.16692C5.86362 7.16574 5.73194 7.19169 5.60905 7.24326C5.48615 7.29483 5.3745 7.37099 5.2806 7.46729C5.18671 7.56359 5.11246 7.6781 5.06218 7.80415C5.0119 7.9302 4.9866 8.06525 4.98775 8.20144C4.9889 8.33762 5.01649 8.47221 5.0689 8.59734C5.12131 8.72247 5.19749 8.83564 5.293 8.93026L9.293 13.0328C9.38589 13.1283 9.49624 13.2041 9.61773 13.2558C9.73922 13.3075 9.86947 13.3341 10.001 13.3341C10.1325 13.3341 10.2628 13.3075 10.3843 13.2558C10.5058 13.2041 10.6161 13.1283 10.709 13.0328L14.709 8.93026C14.8962 8.73765 15.0012 8.47667 15.0008 8.2047C15.0004 7.93274 14.8947 7.67206 14.707 7.48Z"
              fill="#FAFAFA"
            />
            <path
              d="M18 11.7949H15.45L12.475 14.8462C12.15 15.1795 11.7641 15.444 11.3395 15.6244C10.9148 15.8048 10.4597 15.8977 10 15.8977C9.54034 15.8977 9.08519 15.8048 8.66053 15.6244C8.23586 15.444 7.85001 15.1795 7.525 14.8462L4.55 11.7949H2C1.46957 11.7949 0.960859 12.011 0.585786 12.3957C0.210714 12.7804 0 13.3021 0 13.8462V17.9487C0 18.4928 0.210714 19.0145 0.585786 19.3992C0.960859 19.7839 1.46957 20 2 20H18C18.5304 20 19.0391 19.7839 19.4142 19.3992C19.7893 19.0145 20 18.4928 20 17.9487V13.8462C20 13.3021 19.7893 12.7804 19.4142 12.3957C19.0391 12.011 18.5304 11.7949 18 11.7949ZM15.5 17.9487C15.2033 17.9487 14.9133 17.8585 14.6666 17.6894C14.42 17.5204 14.2277 17.2801 14.1142 16.999C14.0007 16.7179 13.9709 16.4086 14.0288 16.1101C14.0867 15.8117 14.2296 15.5376 14.4393 15.3224C14.6491 15.1072 14.9164 14.9607 15.2074 14.9014C15.4983 14.842 15.7999 14.8725 16.074 14.9889C16.3481 15.1053 16.5824 15.3025 16.7472 15.5555C16.912 15.8085 17 16.106 17 16.4103C17 16.8183 16.842 17.2096 16.5607 17.4981C16.2794 17.7866 15.8978 17.9487 15.5 17.9487Z"
              fill="#FAFAFA"
            />
          </svg>
          {/* Heading Text */}
          <span>Content Management System › Contact Us & Footer</span>
        </h1>

        <div className="border-neutral-700 border-2 h-screen rounded-2xl">
          <div className="flex justify-between items-center border-b border-neutral-600 p-4">
            <h1>Contact Us & Footer</h1>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="cursor-pointer">
                  <svg width="40" height="37" viewBox="0 0 40 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8C0 3.58172 3.58172 0 8 0H32C36.4183 0 40 3.58172 40 8V29C40 33.4183 36.4183 37 32 37H8C3.58172 37 0 33.4183 0 29V8Z" fill="#262626"/>
                    <path d="M16.8001 18.5C16.8001 18.9244 16.6315 19.3313 16.3315 19.6314C16.0314 19.9315 15.6244 20.1 15.2001 20.1C14.7758 20.1 14.3688 19.9315 14.0687 19.6314C13.7687 19.3313 13.6001 18.9244 13.6001 18.5C13.6001 18.0757 13.7687 17.6687 14.0687 17.3687C14.3688 17.0686 14.7758 16.9 15.2001 16.9C15.6244 16.9 16.0314 17.0686 16.3315 17.3687C16.6315 17.6687 16.8001 18.0757 16.8001 18.5ZM21.6001 18.5C21.6001 18.9244 21.4315 19.3313 21.1315 19.6314C20.8314 19.9315 20.4244 20.1 20.0001 20.1C19.5758 20.1 19.1688 19.9315 18.8687 19.6314C18.5687 19.3313 18.4001 18.9244 18.4001 18.5C18.4001 18.0757 18.5687 17.6687 18.8687 17.3687C19.1688 17.0686 19.5758 16.9 20.0001 16.9C20.4244 16.9 20.8314 17.0686 21.1315 17.3687C21.4315 17.6687 21.6001 18.0757 21.6001 18.5ZM24.8001 20.1C25.2244 20.1 25.6314 19.9315 25.9315 19.6314C26.2315 19.3313 26.4001 18.9244 26.4001 18.5C26.4001 18.0757 26.2315 17.6687 25.9315 17.3687C25.6314 17.0686 25.2244 16.9 24.8001 16.9C24.3758 16.9 23.9688 17.0686 23.6687 17.3687C23.3687 17.6687 23.2001 18.0757 23.2001 18.5C23.2001 18.9244 23.3687 19.3313 23.6687 19.6314C23.9688 19.9315 24.3758 20.1 24.8001 20.1Z" fill="#FAFAFA"/>
                  </svg>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-neutral-800 border-neutral-700">
                <DropdownMenuItem 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-white hover:bg-neutral-700 cursor-pointer"
                >
                  {isEditing ? "Save" : "Edit"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between border-b border-neutral-600 m-6">
            <button
              className={`pb-1 ${
                activeTab === "footer"
                  ? "text-white border-b-2 border-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              onClick={() => setActiveTab("footer")}
            >
              FitnEarn Footer
            </button>
            <button
              className={`pb-1 ${
                activeTab === "contact"
                  ? "text-white border-b-2 border-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              onClick={() => setActiveTab("contact")}
            >
              Contact Details
            </button>
            <button
              className={`pb-1 ${
                activeTab === "faq"
                  ? "text-white border-b-2 border-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              Frequently Asked Questions
            </button>
          </div>

          {/* Content Section */}
          <div className="">{renderContent()}</div>
        </div>
      </div>
      </div>
    </>
  );
}
