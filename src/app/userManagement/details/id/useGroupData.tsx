import { useState, useEffect } from "react";

export type GroupDetails = {
  groupName: string; // Group Name
  description: string; // Description
  groupMailId: string; // Group Mail ID
  date: string; // Date
  select?: boolean; // Optional for selection in the table
};

// Simulate an API call
const fetchGroupDetails = async (
  page: number,
  search: string
): Promise<{ groups: GroupDetails[]; totalPages: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

  const groupsPerPage = 10;
  const allGroups: GroupDetails[] = Array.from({ length: 100 }, (_, i) => ({
    groupName: `Group ${1000 + i}`,
    description: `This is the description for Group ${1000 + i}`,
    groupMailId: `group${1000 + i}@example.com`,
    date: `2025-01-${(i % 30) + 1}`,
  }));

  const totalPages = Math.ceil(allGroups.length / groupsPerPage);
  const paginatedGroups = allGroups.slice(
    (page - 1) * groupsPerPage,
    page * groupsPerPage
  );

  return { groups: paginatedGroups, totalPages };
};

export function useGroupsData(
  page: number,
  search: string
): { data: GroupDetails[]; totalPages: number } {
  const [groups, setGroups] = useState<GroupDetails[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchGroupDetails(page, search).then(({ groups, totalPages }) => {
      setGroups(groups);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  return { data: groups, totalPages };
}
