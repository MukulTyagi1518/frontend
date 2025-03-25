"use client";

import LiveSessionForm from "@/components/ui/LiveSessionForm";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useReducer, useState, useEffect } from "react";
import ReasonBox from "@/components/ui/Reason-box";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/toast/toast-context";

import { Checkbox } from "@/components/ui/checkbox";

const apiendpoint2 = process.env.NEXT_PUBLIC_API_URL_2;

export default function SubscriptionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [subsId, setSubsId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setSubsId(resolvedParams.id);
    });
  }, [params]);

  // **State Management**
  const [isEditable, setIsEditable] = useState(false);
  const [activeSwitch, setActiveSwitch] = useReducer(
    (_: string, newValue: string) => newValue,
    "Features*"
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
const [isOpen, setIsOpen]= useState(true);
  // **Editable Fields**
  const [planId, setPlanId] = useState("");
  const [planName, setPlanName] = useState("");
  const [planDuration, setPlanDuration] = useState("");
  const [price, setPrice] = useState("");
  const [liveSessionDiscount, setLiveSessionDiscount] = useState("");
  const [bookingDiscount, setBookingDiscount] = useState("");
  const [subscriptionDiscount, setSubscriptionDiscount] = useState("");
  const [effectivePrice, setEffectivePrice] = useState("");

  // State for selected features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // **Determine Subscription Type for Dynamic Header & Breadcrumb**
  const getSubscriptionType = (planName: string) => {
    if (planName.toLowerCase().includes("pro")) return "Pro";
    if (planName.toLowerCase().includes("elite")) return "Elite";
    if (planName.toLowerCase().includes("free")) return "Free";
    if (planName.toLowerCase().includes("other")) return "Other";
    if (planName.toLowerCase().includes("offer")) return "Offer";
    return "Beginner"; // Default
  };

  // **Fetch Subscription Details**
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await fetch(
          `${apiendpoint2}/subscription-plan/getPlan/${subsId}`
        );
        const result = await response.json();

        if (result.success && result.plan) {
          const planData = result.plan;

          // Set form fields with API data
          setPlanId(planData.plan_id);
          setPlanName(planData.plan_name);
          setPlanDuration(planData.period);
          setPrice(`${planData.price}`);
          setLiveSessionDiscount(`${planData.discountLiveSessionPercent}%`);
          setBookingDiscount(`${planData.bookingDiscount || 0}%`);
          setSubscriptionDiscount(`${planData.discountPercent}%`);
          setEffectivePrice(`${planData.effectivePrice}`);
          setSelectedFeatures(planData.features || []);

          // Set status based on price
          setIsActive(planData.price > 0);
        } else {
          console.error("Failed to fetch plan details:", result.message);
        }
      } catch (error) {
        console.error("Error fetching subscription details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [subsId]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  const { showToast } = useToast();

  // **Handlers (Empty for now)**
  const handleDeleteSession = async () => {};
  const handleCopySession = async () => {};

  // **API Call to Save Changes**
  const handleSaveChanges = async () => {
    try {
      const updateData = {
        plan_name: planName,
        features: selectedFeatures,
        period: planDuration,
        price: parseFloat(price.replace("$", "")), // Remove $ and convert to number
        discountPercent: parseFloat(subscriptionDiscount.replace("%", "")), // Remove % and convert to number
        bookingDiscount: parseFloat(bookingDiscount.replace("%", "")), // Remove % and convert to number
        discountLiveSessionPercent: parseFloat(
          liveSessionDiscount.replace("%", "")
        ), // Remove % and convert to number
      };

      const response = await fetch(
        `${apiendpoint2}/subscription-plan/edit/${subsId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update subscription plan."
        );
      }

      showToast({
        type: "success",
        title: "Subscription Updated",
        description: "Changes have been saved successfully.",
        actionText: "OK",
      });

      setIsEditable(false); // Exit edit mode after saving
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      console.error("Error updating subscription:", errorMessage);

      showToast({
        type: "error",
        title: "Update Failed",
        description: errorMessage,
        actionText: "Retry",
      });
    }
  };

  // **Dynamic Subscription Type**
  const subscriptionType = getSubscriptionType(planName);

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
      <LiveSessionForm
        breadcrumb={[
          "Subscription Management",
          `${subscriptionType} Subscription Details`,
        ]}
        breadcrumbLinks={[
          "/subscriptionManagement",
          `/subscriptionManagement/details/${subsId}`,
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
              d="M3 7.25C2.0335 7.25 1.25 8.0335 1.25 9V20C1.25 20.9665 2.0335 21.75 3 21.75H21C21.9665 21.75 22.75 20.9665 22.75 20V9C22.75 8.0335 21.9665 7.25 21 7.25H3Z"
              fill="#FAFAFA"
            />
            <path
              d="M10.4301 10.3856C10.201 10.2252 9.90169 10.2056 9.65364 10.3348C9.40559 10.4639 9.25 10.7203 9.25 11V18C9.25 18.2797 9.40559 18.5361 9.65364 18.6652C9.90169 18.7944 10.201 18.7748 10.4301 18.6144L15.4301 15.1144C15.6306 14.9741 15.75 14.7447 15.75 14.5C15.75 14.2553 15.6306 14.0259 15.4301 13.8856L10.4301 10.3856Z"
              fill="#262626"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.25 5.5C3.25 5.08579 3.58579 4.75 4 4.75H20C20.4142 4.75 20.75 5.08579 20.75 5.5C20.75 5.91421 20.4142 6.25 20 6.25H4C3.58579 6.25 3.25 5.91421 3.25 5.5ZM5.25 3C5.25 2.58579 5.58579 2.25 6 2.25H18C18.4142 2.25 18.75 2.58579 18.75 3C18.75 3.41421 18.4142 3.75 18 3.75H6C5.58579 3.75 5.25 3.41421 5.25 3Z"
              fill="#FAFAFA"
            />
          </svg>,
        ]}
        isEditable={isEditable} // `isEditable` to the form
        setIsEditable={setIsEditable} // Pass setter to control edit state
        actionButtonLabel="Analytics"
        onActionButtonClick={
          () => setIsEditable(false) // Disable edit mode on analytics button click
        }
        onDeleteClick={handleDeleteSession} // ✅ DELETE FUNCTION
        onCopyClick={handleCopySession} // ✅ COPY FUNCTION
        showButton={false}
        headerTitle={`${subscriptionType} Subscription Details`}
      >
        {/* Status and Free Checkboxes */}
        <div className="flex justify-between items-center mt-4 mb-10">
          <div className="flex items-center">
            <label
              htmlFor="status-checkbox"
              className="text-sm font-medium text-gray-400"
            >
              Status:
            </label>
            <Checkbox
              id="status-checkbox"
              className="ml-2 text-gray-300"
              checked={isActive}
              onCheckedChange={() => setIsActive((prev) => !prev)}
            />
            <span className="ml-2 text-sm font-medium text-gray-400">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-x-32 gap-y-4">
          {/* Plan ID */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Plan ID
            </label>
            <Input
              type="text"
              value={planId}
              readOnly
              className="mt-2"
              state="ReadOnly"
            />
          </div>

          {/* Plan Name (Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Plan Name
            </label>
            <Input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              readOnly={!isEditable}
              className="mt-2"
              state={isEditable ? "Normal" : "ReadOnly"}
            />
          </div>

          {/* Plan Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Plan Duration
            </label>
            <Input
              type="text"
              value={planDuration}
              readOnly
              className="mt-2"
              state="ReadOnly"
            />
          </div>

          {/* Price (Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Price
            </label>
            <Input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              readOnly={!isEditable}
              className="mt-2"
              state={isEditable ? "Normal" : "ReadOnly"}
            />
          </div>

          {/* Discounts */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-400">
              Live Session Discount
            </label>
            <Input
              type="text"
              value={liveSessionDiscount}
              onChange={(e) => setLiveSessionDiscount(e.target.value)}
              readOnly={!isEditable}
              className="mt-2"
              state={isEditable ? "Normal" : "ReadOnly"}
            />
          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-gray-400">
              Booking Discount
            </label>
            <Input
              type="text"
              value={bookingDiscount}
              onChange={(e) => setBookingDiscount(e.target.value)}
              readOnly={!isEditable}
              className="mt-2"
              state={isEditable ? "Normal" : "ReadOnly"}
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Subscription Discount
            </label>
            <Input
              type="text"
              value={subscriptionDiscount}
              onChange={(e) => setSubscriptionDiscount(e.target.value)}
              readOnly={!isEditable}
              className="mt-2"
              state={isEditable ? "Normal" : "ReadOnly"}
            />
          </div>

          {/* Effective Price */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Effective Price
            </label>
            <Input
              type="text"
              value={effectivePrice}
              readOnly
              className="mt-2"
              state="ReadOnly"
            />
          </div>
        </div>

        {/* Switch Button - Only "Features*" */}
        <div className="mt-6">
          <div className="flex justify-start relative">
            <button
              onClick={() => setActiveSwitch("Features*")}
              className={`px-4 py-2 ${
                activeSwitch === "Features*"
                  ? "border-b-2 border-white text-white"
                  : "text-gray-400"
              }`}
            >
              Features*
            </button>

            {/* Connector Line - Now Half Width */}
            <div className="absolute bottom-0 left-0 h-[1px] w-1/2 bg-gray-600 z-0"></div>
          </div>
        </div>

        {/* Switch Context */}
        <div className="mt-6">
          {/* Features* */}
          {activeSwitch === "Features*" && (
            <div className="flex justify-between items-start max-w-full">
              {/* Left Column */}
              <div className="space-y-2">
                {[
                  "Get Exclusive Access to 14+ Health Calculator",
                  "Monitor weekly/monthly health history with annual reports",
                  "No Ads",
                  "Exclusive Early Access to new features and contents",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={() =>
                        setSelectedFeatures((prev) =>
                          prev.includes(feature)
                            ? prev.filter((f) => f !== feature)
                            : [...prev, feature]
                        )
                      }
                      disabled={!isEditable} // Editable only in edit mode
                    />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              {/* <div className="space-y-2">
                {[
                  "Get Exclusive Access to 14+ Health Calculator",
                  "Monitor weekly/monthly health history with annual reports",
                  "No Ads",
                  "Exclusive Early Access to new features and contents",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={() =>
                        setSelectedFeatures((prev) =>
                          prev.includes(feature)
                            ? prev.filter((f) => f !== feature)
                            : [...prev, feature]
                        )
                      }
                      disabled={!isEditable} // Editable only in edit mode
                    />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div> */}
            </div>
          )}
        </div>

        {/* Edit Button */}
        <div className="flex justify-end pl-6 pt-8">
          <Button
            variant="ghost"
            className="rounded-lg bg-[#FAFAFA] text-[#262626] px-4 py-2 flex items-center space-x-2"
            onClick={() =>
              isEditable ? handleSaveChanges() : setIsEditable(true)
            }
          >
            {isEditable ? "Save" : "Edit"}
          </Button>
        </div>
      </LiveSessionForm>
      </div>
    </>
  );
}
