"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
// import LiveSessionForm from "@/components/ui/LiveSessionForm";
import ReportForm from "./[reportComponent]/reportForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast/toast-context";
import MultiSelectDropdown from "./[reportComponent]/MultiSelectComponent";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import ColorSelectionInput from "./ColorSelectionInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, File } from "lucide-react";

interface ReportData {
  name: string;
  reportType: string;
  module: string;
}

const Page = () => {
  const [isEditable, setIsEditable] = useState(true);
  const [initialData, setInitialData] = useState<ReportData>({
    name: "",
    reportType: "",
    module: "",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const { showToast } = useToast();
  const statusBarSteps = ["General", "Resource table", "Filter", "Styling"];
  const statusBarColorOverride = statusBarSteps.map((_, index) =>
    index <= currentStep ? "#0E9F6E" : "#525252"
  );
  const stepNameColorOverride = statusBarSteps.map((_, index) =>
    index <= currentStep ? "#0E9F6E" : "#A1A1AA"
  );

  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  // const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
  // const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [selectedSource, setSelectedSource] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [dashboardBtn, setDashboardBtn] = useState(true);
  const [shareBtn, setShareBtn] = useState(true);
  const [generateReportBtn, setGenerateReportBtn] = useState(true);
  const [entries, setEntries] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedInputs, setSelectedInputs] = useState<Record<string, string[]>>({});
  const [generateDialog,setGenerateDialog] = useState(false);



  const reportTypes = ["Bar Chart", "Pie Chart", "Radial Chart", "Table"];
  const modules = ["Coach Management", "Live session Management", "Workout Video Management", "Post Management"];
  const liveSessionSourceNames = ["All", "Session Id", "Coach Name", "Date & Time of Creation", "Session Name", "Category", "Level", "Date & Time of Execution", "Description", "Focus Areas", "States", "Session Link"];
  const coachSourceNames = ["Category", "Gender", "Years of Experience", "Level", "Date"];
  const videoSourceNames = ["Category", "Level", "Stages", "Date"];
  const postSourceNames = ["Category", "Social", "Post Time", "Date"];
  const levelOptions = ["beginner", "Intermediate", "Advanced"];
  const genders = ["Male", "Female"];
  const colorInputs = [{ label: "Category", color: "#F05252" }, { label: "Gender", color: "#A3A3A3" }, { label: "Level", color: "#0E9F6E" }, { label: "Text", color: "#FAFAFA" }, { label: "Border", color: "#262626" }];

  const validateStep1 = () => {
    if (!initialData.name || initialData.name.length < 5 || initialData.name.length > 40) {
      showToast({
        type: "error",
        title: "Error",
        description: "Name should be between 5 and 40 characters.",
      });
      return false;
    }
    if (!initialData.reportType) {
      showToast({
        type: "error",
        title: "Error",
        description: "You have not selected any report type.",
      });
      return false;
    }
    if (!initialData.module) {
      showToast({
        type: "error",
        title: "Error",
        description: "You have not selected any module.",
      });
      return false;
    }
    if (initialData.module === "Coach Management") {
      setSelectedSource(coachSourceNames);
    } else if (initialData.module === "Live session Management") {
      setSelectedSource(liveSessionSourceNames);
    } else if (initialData.module === "Workout Video Management") {
      setSelectedSource(videoSourceNames);
    } else if (initialData.module === "Post Management") {
      setSelectedSource(postSourceNames);
    }
    return true;
  };

  const validateStep2 = () => {
    showToast({
      type: "success",
      title: "success",
      description: "You have successfully on next 3.",
    });
    return true;
  };

  const validateStep3 = () => {
    showToast({
      type: "success",
      title: "success",
      description: "You have successfully on next 4.",
    });
    return true;
  };

  useEffect(() => {
    if (currentStep === 3) {
      setGenerateReportBtn(false);
    }
  },[currentStep]);

  const validateStep4 = () => {
    showToast({
      type: "success",
      title: "success",
      description: "You have successfully completed final step.",
    });
    return true;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 0) {
      isValid = validateStep1();
    } else if (currentStep === 1) {
      isValid = validateStep2();
    } else if (currentStep === 2) {
      isValid = validateStep3();
    } 
    console.log(isValid, currentStep);
    if (isValid && currentStep < statusBarSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // useEffect(() => {
  //   console.log(selectedModules);
  // }, [selectedModules]);

  useEffect(() => {
    console.log(entries, selectedInputs);
  }, [selectedInputs]);

  const sendOptions = (item: string) => {
    if (item === "Gender") {
      return ["All", "Male", "Female"]
    } else if (item === "Category") {
      return ["Yoga", "Cardio", "General", "Meditation", "Strength"]
    } else if (item === "Level") {
      return ["beginner", "Intermediate", "Advanced"]
    } else if (item === "Years of Experience") {
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    } else {
      return ["a", "b", "c", "d", "e"]
    }
  }


  return (
    <div >
<Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

{/* Main Content */}
<div
  className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${
    isOpen ? "pl-60" : "pl-16"
  }`} // Adjust padding based on sidebar state
>
  <Header isOpen={isOpen} setIsOpen={setIsOpen} />
  <div className="container mx-auto py-10 pt-6 pr-10 pl-[60px] flex items-center gap-2">
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
        <h1 className="text-[24px] text-[#FAFAFA] font-semibold leading-[36px]">Report Management</h1>
      </div>
      <ReportForm
        isEditable={isEditable} // isEditable to the form
        setIsEditable={setIsEditable} // Pass setter to control edit state
        headerTitle="Report Generation"
        buttons={[
          {
            label: "Add to Dashboard",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path d="M8.66667 6.5V2.5H14V6.5H8.66667ZM2 9.16667V2.5H7.33333V9.16667H2ZM8.66667 14.5V7.83333H14V14.5H8.66667ZM2 14.5V10.5H7.33333V14.5H2Z" fill="#404040" />
            </svg>,
            onClick: () => {
              console.log("Add to Dashboard btn clicked");
            },
            isDisabled: dashboardBtn
          },
          {
            label: "Share",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path d="M12.0683 10.5005C11.619 10.5025 11.1847 10.6677 10.8412 10.9672C10.8054 10.9296 10.7657 10.8962 10.723 10.8673L6.01727 8.31901C5.96989 8.29829 5.92037 8.28328 5.86968 8.27426C5.87509 8.21672 5.88668 8.16158 5.88668 8.10325C5.88668 8.09606 5.88668 8.08967 5.88668 8.08327C5.93755 8.07778 5.98776 8.06707 6.03659 8.05131L10.6001 6.02561C10.6454 6.00025 10.6879 5.96998 10.7269 5.93531C11.0477 6.25547 11.4657 6.45101 11.9101 6.48876C12.3544 6.52652 12.7977 6.40416 13.1648 6.14245C13.5318 5.88073 13.8 5.49577 13.9239 5.05286C14.0478 4.60995 14.0197 4.13635 13.8445 3.7124C13.6692 3.28846 13.3575 2.94025 12.9623 2.72685C12.5671 2.51346 12.1127 2.448 11.6761 2.54159C11.2396 2.63518 10.8478 2.88206 10.5671 3.24034C10.2865 3.59863 10.1344 4.04626 10.1365 4.50733C10.1361 4.51398 10.1361 4.52065 10.1365 4.52731C10.0856 4.53306 10.0354 4.54404 9.98662 4.56007L5.42306 6.58497C5.37795 6.61052 5.33549 6.64078 5.29634 6.67527C5.02931 6.40282 4.69151 6.21645 4.324 6.1388C3.95648 6.06115 3.57506 6.09556 3.2261 6.23785C2.87713 6.38015 2.57565 6.6242 2.35827 6.94035C2.1409 7.2565 2.017 7.63114 2.00163 8.01873C1.98626 8.40633 2.08007 8.79021 2.27168 9.1237C2.46329 9.4572 2.74444 9.72596 3.08096 9.89733C3.41749 10.0687 3.7949 10.1353 4.16733 10.089C4.53976 10.0428 4.89119 9.88563 5.17889 9.63671C5.21474 9.67427 5.25438 9.70775 5.29711 9.7366L10.0028 12.2849C10.0493 12.3097 10.0983 12.329 10.1489 12.3424C10.1489 12.3952 10.1334 12.4463 10.1334 12.5023C10.1334 12.8974 10.2467 13.2836 10.459 13.6121C10.6713 13.9407 10.973 14.1967 11.3259 14.3479C11.6789 14.4991 12.0673 14.5387 12.442 14.4616C12.8168 14.3845 13.161 14.1943 13.4311 13.9149C13.7013 13.6355 13.8853 13.2795 13.9598 12.892C14.0343 12.5045 13.9961 12.1028 13.8499 11.7378C13.7037 11.3727 13.4561 11.0607 13.1384 10.8412C12.8207 10.6217 12.4472 10.5045 12.0652 10.5045L12.0683 10.5005Z" fill="#404040" />
            </svg>,
            onClick: () => {
              console.log("Share btn clicked");
            },
            isDisabled: shareBtn
          },
          {
            label: "Generate Report",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path d="M5 2.5V5C5 5.39782 5.15804 5.77936 5.43934 6.06066C5.72064 6.34196 6.10218 6.5 6.5 6.5H8.5C8.89782 6.5 9.27936 6.34196 9.56066 6.06066C9.84196 5.77936 10 5.39782 10 5V2.5H10.379C10.9094 2.50011 11.418 2.7109 11.793 3.086L13.414 4.707C13.7891 5.08199 13.9999 5.59061 14 6.121V12.5C14 13.0304 13.7893 13.5391 13.4142 13.9142C13.0391 14.2893 12.5304 14.5 12 14.5V10C12 9.60218 11.842 9.22064 11.5607 8.93934C11.2794 8.65804 10.8978 8.5 10.5 8.5H5.5C4.673 8.5 4 9.169 4 9.998V14.5C3.46957 14.5 2.96086 14.2893 2.58579 13.9142C2.21071 13.5391 2 13.0304 2 12.5V4.5C2 3.96957 2.21071 3.46086 2.58579 3.08579C2.96086 2.71071 3.46957 2.5 4 2.5H5ZM6 2.5V5C6 5.13261 6.05268 5.25979 6.14645 5.35355C6.24021 5.44732 6.36739 5.5 6.5 5.5H8.5C8.63261 5.5 8.75979 5.44732 8.85355 5.35355C8.94732 5.25979 9 5.13261 9 5V2.5H6ZM5 14.5H11V10C11 9.86739 10.9473 9.74021 10.8536 9.64645C10.7598 9.55268 10.6326 9.5 10.5 9.5H5.5C5.223 9.5 5 9.723 5 9.998V14.5Z" fill="#404040" />
            </svg>,
            onClick: () => setGenerateDialog(true),
            isDisabled: generateReportBtn
          },
        ]}
        showDropdown={false}
        showButton={false}
        statusBarSteps={statusBarSteps}
        statusBarColorOverride={statusBarColorOverride}
        stepNameColorOverride={stepNameColorOverride}
      >

        <div className={`${currentStep === 0 ? "grid" : "hidden"} grid-cols-1 gap-x-32 gap-y-4`}>
          <div>
            <label htmlFor="reportName" className="block text-sm font-medium text-gray-400">
              Report Name
            </label>
            <Input
              id="reportName"
              type="text"
              value={initialData?.name || ""}
              onChange={(e) =>
                setInitialData((prev) => ({
                  ...prev,
                  name: e.target.value, // If prev is null, it will cause an error
                }))
              }
              required
              className="mt-2 bg-neutral-800 text-gray-300"
              placeholder="Enter report name"
            />
          </div>

          {/* Report Type */}
          <div className="space-y-2">
            <label
              htmlFor="reportType"
              className="block text-sm font-medium text-gray-400"
            >
              Report Type
            </label>
            <Select
              value={initialData?.reportType || ""}
              onValueChange={(value) =>
                setInitialData((prev) => ({
                  ...prev,
                  reportType: value,
                }))
              }
            >
              <SelectTrigger
                id="reportType"
                className="w-full bg-[#262626] text-gray-400 border-gray-600"
              >
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent className="bg-[#262626] text-white border-gray-600">
                {reportTypes.map((option, index, array) => (
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

          {/* Module */}
          <div className="space-y-2">
            <label
              htmlFor="modules"
              className="block text-sm font-medium text-gray-400"
            >
              Module
            </label>
            <Select
              value={initialData?.module || ""}
              onValueChange={(value) =>
                setInitialData((prev) => ({
                  ...prev,
                  module: value,
                }))
              }
            >
              <SelectTrigger
                id="modules"
                className="w-full bg-[#262626] text-gray-400 border-gray-600"
              >
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent className="bg-[#262626] text-white border-gray-600">
                {modules.map((option, index, array) => (
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
        </div>

        <div className={`${currentStep === 1 ? "grid" : "hidden"} grid-cols-1 gap-x-32 gap-y-4`}>
          <MultiSelectDropdown
            label="Source Name"
            options={selectedSource}
            placeholder="Select Source Names"
            onChange={setSelectedModules}
          />
        </div>

        <div className={`${currentStep === 2 ? "grid" : "hidden"} grid-cols-1 gap-x-32 gap-y-4`}>
          {/* <div>
            <label htmlFor="entries" className="block text-sm font-medium text-gray-400">
              No. of Entries <span className="text-red-500">*</span>
            </label>
            <Input
              id="entries"
              type="text"
              value={""}
              required
              className="mt-2 bg-neutral-800 text-gray-300"
              placeholder="Enter number of entries eg. 1-200"
            />
          </div>

          {currentStep === 2 && selectedModules.length > 0 && selectedModules.map((item) => {
            if (item === "Date" || item === "Date & Time of Creation" || item === "Date & Time of Execution") {
              return (
                <div>
                  <label className="block text-sm font-medium text-neutral-50">
                    {item} <span className="text-red-500">*</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Input
                        type="text"
                        value={date ? format(date, "PPP") : ""}
                        placeholder="Select a date"
                        className="mt-2 w-full rounded-lg border border-neutral-600 bg-neutral-900 text-white"
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
              )
            } else {
              const options = sendOptions(item);
              return (
                <MultiSelectDropdown
                  label={item}
                  options={options}
                  placeholder={`Select ${item}`}
                  onChange={setSelectedInputs}
                />
              )
            }
          })} */}

          <div>
            <label htmlFor="entries" className="block text-sm font-medium text-gray-400">
              No. of Entries <span className="text-red-500">*</span>
            </label>
            <Input
              id="entries"
              type="text"
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              required
              className="mt-2 bg-neutral-800 text-gray-300"
              placeholder="Enter number of entries eg. 1-200"
            />
            <label htmlFor="entries" className="block text-sm font-medium text-gray-400">
             Category  <span className="text-red-500">*</span>
            </label>
            <Input
              id="entries"
              type="text"
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              required
              className="mt-2 bg-neutral-800 text-gray-300"
              placeholder="Enter number of entries eg. 1-200"
            />
            <label htmlFor="entries" className="block text-sm font-medium text-gray-400">
              Date <span className="text-red-500">*</span>
            </label>
            <Input
              id="entries"
              type="Date"
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              required
              className="mt-2 bg-neutral-800 text-gray-300"
              placeholder="Enter number of entries eg. 1-200"
            />
            <label htmlFor="entries" className="block text-sm font-medium text-gray-400">
              Level <span className="text-red-500">*</span>
            </label>
            <Input
              id="entries"
              type="text"
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              required
              className="mt-2 bg-neutral-800 text-gray-300"
              placeholder="Enter number of entries eg. 1-200"
            />
            <label htmlFor="entries" className="block text-sm font-medium text-gray-400">
              Level <span className="text-red-500">*</span>
            </label>
            <Input
              id="entries"
              type="text"
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              required
              className="mt-2 bg-neutral-800 text-gray-300"
              placeholder="Enter number of entries eg. 1-200"
            />
            <label htmlFor="entries" className="block text-sm font-medium text-gray-400">
              Focus  <span className="text-red-500">*</span>
            </label>
            <Input
              id="entries"
              type="text"
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              required
              className="mt-2 bg-neutral-800 text-gray-300"
              placeholder="Enter number of entries eg. 1-200"
            />
          </div>

          {/* Dynamic Fields */}
          {currentStep === 2 && selectedModules.length > 0 && selectedModules.map((item, index) => {
            if (item === "Date" || item === "Date & Time of Creation" || item === "Date & Time of Execution") {
              return (
                <div key={item}>
                  <label className="block text-sm font-medium text-neutral-50">
                    {item} <span className="text-red-500">*</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Input
                        type="text"
                        value={date ? format(date, "PPP") : ""}
                        placeholder="Select a date"
                        className="mt-2 w-full rounded-lg border border-neutral-600 bg-neutral-900 text-white"
                        readOnly
                      />
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date || undefined}
                        onSelect={(selectedDate) => {
                          if (selectedDate !== date) {
                            setDate(selectedDate ?? undefined);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              );
            } else {
              const options = sendOptions(item);
              return (
                <MultiSelectDropdown
                  key={item}
                  label={item}
                  options={options}
                  placeholder={`Select ${item}`}
                  onChange={(selectedValues) => {
                    if (selectedInputs[item] !== selectedValues) {
                      setSelectedInputs((prev) => ({ ...prev, [item]: selectedValues }));
                    }
                  }}
                />
              );
            }
          })}
        </div>

        <div className={`${currentStep === 3 ? "grid" : "hidden"} grid-cols-1 gap-x-32 gap-y-4`}>
          {[
            ...Object.entries(selectedInputs),
            ['Entries', entries], // Add the entries input as a separate item
          ].map(([label], index) => (
            <ColorSelectionInput
              key={index}
              label={`${label} Color`}
              defaultColor={`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`}
              onChange={(selectedColor) => console.log("Selected Color:", selectedColor)}
            />
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-end pl-6 pt-8">
          {currentStep !== 3 ? (
            <Button
              variant="ghost"
              className="rounded-lg bg-[#FAFAFA] text-[#262626] px-4 py-2"
              onClick={handleNext}
            >
              Next
            </Button>
          ) :
            ("")}
        </div>
      </ReportForm>

      {/* dialog */}
      <Dialog open={generateDialog} onOpenChange={setGenerateDialog}>
        <DialogContent className="sm:max-w-[425px] bg-[#1E1E1E]">
          <DialogHeader>
            <DialogTitle className="text-[#FAFAFA] text-2xl font-semibold">Download Report</DialogTitle>
            <DialogDescription className="text-[#FAFAFA] text-sm font-normal">
              Select a report to download. The CSV lets you import
            </DialogDescription>
          </DialogHeader>

          <div className="bg-[#2A2A2A] rounded-xl p-4 space-y-2">
            {/* CSV Report Row */}
            <div className="flex items-center justify-between border-b border-gray-600 pb-2">
              <div className="flex items-center space-x-2">
                <FileText className="text-gray-400" />
                <p className="text-[#E5E5E5] font-normal text-sm leading-[21px]">CSV report</p>
              </div>
              <Button variant="outline" className="w-[132px] border-white text-[#E5E5E5] font-normal text-sm leading-[21px]">
                Generate report
              </Button>
            </div>

            {/* PDF Report Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <File className="text-gray-400" />
                <p className="text-[#E5E5E5] font-normal text-sm leading-[21px]">PDF report</p>
              </div>
              <Button variant="default" className="w-[132px] bg-white text-[#262626] font-m text-sm leading-[21px]">
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </div>
    
  )
};

export default Page;
