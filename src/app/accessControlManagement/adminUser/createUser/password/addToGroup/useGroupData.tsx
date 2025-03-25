import { useState, useEffect } from "react";

export type Group = {
  groupName: string; // Group name column
  description: string; // Description column
  mailId: string; // Email address column
  select?: boolean; // Optional field for selection
};

// Simulate an API call
const fetchGroups = async (
  page: number,
  search: string
): Promise<{ groups: Group[]; totalPages: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const groupsPerPage = 10;

  // Generate mock data with auto-generated email addresses
  const allGroups: Group[] = Array.from({ length: 100 }, (_, i) => ({
    groupName: `Group_${100 + i}`,
    description: `Description for Group_${100 + i}`,
    mailId: `group${100 + i}@example.com`, // Generate a unique email
  }));

  const searchQueries = search
    .split(/\s+(?=\w+:)/)
    .map((query) => {
      const [key, ...valueParts] = query.split(":");
      return [key.trim(), valueParts.join(":").trim()];
    })
    .filter(([key, value]) => key && value)
    .reduce((acc, [key, value]) => {
      const typedKey = key as keyof Group;
      acc[typedKey] = value.toLowerCase();
      return acc;
    }, {} as Partial<Record<keyof Group, string>>);

  const filteredGroups = allGroups.filter((group) =>
    Object.entries(searchQueries).every(([key, value]) => {
      const groupValue = group[key as keyof Group];
      return groupValue?.toString().toLowerCase().includes(value);
    })
  );

  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (page - 1) * groupsPerPage,
    page * groupsPerPage
  );

  return {
    groups: paginatedGroups,
    totalPages,
  };
};

export function useGroupData(
  page: number,
  search: string
): { data: Group[]; totalPages: number } {
  const [groups, setGroups] = useState<Group[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchGroups(page, search).then(({ groups, totalPages }) => {
      setGroups(groups);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  return { data: groups, totalPages };
}
