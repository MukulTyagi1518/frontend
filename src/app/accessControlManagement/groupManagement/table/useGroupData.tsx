import { useState, useEffect } from "react";

const apiForTable = process.env.NEXT_PUBLIC_API_URL;

export type Group = {
  groupId: string; // Unique Group ID (for navigation)
  name: string; // Group Name
  description: string; // Description
  groupEmail: string; // Group Email
  createdAt: string; // Created At
};

export function useGroupData(
  page: number,
  searchQuery: string
): { data: Group[]; totalPages: number } {
  const [data, setData] = useState<Group[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Set the number of items per page

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `${apiForTable}/fitnearn/web/admin/access/group/get-all`
        );
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          let filteredData: Group[] = result.data.map((group: { 
            groupId: string;
            name: string; 
            description: string; 
            groupEmail: string; 
            createdAt: string; 
          }) => ({
            groupId: group.groupId, // ✅ Storing Group ID for navigation
            name: group.name, 
            description: group.description,
            groupEmail: group.groupEmail,
            createdAt: new Date(group.createdAt).toLocaleDateString("en-US"),
          }));

          // Apply search filtering
          if (searchQuery) {
            filteredData = filteredData.filter((group) =>
              group.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          console.error("Failed to fetch groups: ", result.message);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setData([]);
      }
    };

    fetchGroups();
  }, [page, searchQuery]);

  return { data, totalPages };
}
