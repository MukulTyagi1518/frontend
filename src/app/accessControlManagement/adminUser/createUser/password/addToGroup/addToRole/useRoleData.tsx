import { useState, useEffect } from "react";

export type Roles = {
  roleName: string; // Group name column
  description: string; // Description column
  select?: boolean; // Optional field for selection
};

// Simulate an API call
const fetchGroups = async (
  page: number,
  search: string
): Promise<{ groups: Roles[]; totalPages: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const groupsPerPage = 10;

  // Generate mock data with auto-generated email addresses
  const allGroups: Roles[] = Array.from({ length: 100 }, (_, i) => ({
    roleName: `Role_${100 + i}`,
    description: `Description for Role_${100 + i}`,   
  }));

  const searchQueries = search
    .split(/\s+(?=\w+:)/)
    .map((query) => {
      const [key, ...valueParts] = query.split(":");
      return [key.trim(), valueParts.join(":").trim()];
    })
    .filter(([key, value]) => key && value)
    .reduce((acc, [key, value]) => {
      const typedKey = key as keyof Roles;
      acc[typedKey] = value.toLowerCase();
      return acc;
    }, {} as Partial<Record<keyof Roles, string>>);

  const filteredGroups = allGroups.filter((group) =>
    Object.entries(searchQueries).every(([key, value]) => {
      const groupValue = group[key as keyof Roles];
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

export function useRoleData(
  page: number,
  search: string
): { data: Roles[]; totalPages: number } {
  const [groups, setGroups] = useState<Roles[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchGroups(page, search).then(({ groups, totalPages }) => {
      setGroups(groups);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  return { data: groups, totalPages };
}
