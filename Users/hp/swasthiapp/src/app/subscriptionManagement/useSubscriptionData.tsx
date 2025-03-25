import { useState, useEffect } from "react";

const apiForTable = process.env.NEXT_PUBLIC_API_URL_2;

export type SubscriptionPlan = {
  planId: number; // Unique Plan ID
  planName: string; // Subscription Plan Name
  duration: string; // Plan Duration (Period)
  features: string; // Features (Converted to string)
  price: string; // Plan Price (Formatted)
  status: string; // Status (Derived from price)
  subsId: string; // Subscription ID (Used for navigation)
};

export function useSubscriptionData(
  page: number,
  searchQuery: string
): { data: SubscriptionPlan[]; totalPages: number } {
  const [data, setData] = useState<SubscriptionPlan[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Set the number of items per page

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const response = await fetch(
          `${apiForTable}/subscription-plan/getAllPlans`
        );
        const result = await response.json();

        if (result.success && Array.isArray(result.plans)) {
          let filteredData: SubscriptionPlan[] = result.plans.map(
            (plan: {
              plan_id: number;
              plan_name: string;
              features: string[];
              period: string;
              price: number;
              SUBS_ID: string;
            }) => ({
              planId: plan.plan_id,
              planName: plan.plan_name,
              duration:
                plan.period.charAt(0).toUpperCase() + plan.period.slice(1), // Capitalize period
              features: plan.features.join(", "), // Convert features array to string
              price: `${parseFloat(plan.price.toString()).toFixed(2)}`, // Format price
              status: plan.price > 0 ? "Active" : "Inactive", // Determine status based on price
              subsId: plan.SUBS_ID, // Store Subscription ID for navigation
            })
          );

          // Apply search filtering
          if (searchQuery) {
            filteredData = filteredData.filter((plan) =>
              plan.planName.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }

          // Pagination logic
          const totalItems = filteredData.length;
          setTotalPages(Math.ceil(totalItems / itemsPerPage));

          const paginatedData = filteredData.slice(
            (page - 1) * itemsPerPage,
            page * itemsPerPage
          );

          setData(paginatedData);
        } else {
          console.error("Failed to fetch subscription plans: ", result.message);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        setData([]);
      }
    };

    fetchSubscriptionPlans();
  }, [page, searchQuery]);

  return { data, totalPages };
}
