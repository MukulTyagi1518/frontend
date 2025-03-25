import { useState, useEffect } from "react";

export type Group = {
  _id: string;
  groupId: string;
  name: string;
  description: string;
  createdBy: string;
  groupEmail: string;
  groupMemberId: string[];
  permissionId: string[];
  permissionBoundaryId: string[];
  roleId: string[];
  status: boolean;
  createdAt: string;
  updatedAt: string;
  select?: boolean;
};

const fetchGroups = async (
  page: number,
  search: string
): Promise<{ groups: Group[]; totalPages: number }> => {
  try {
    const response = await fetch(
      "https://5600bev1n3.execute-api.ap-south-1.amazonaws.com/dev/api/fitnearn/web/admin/access/group/get-all"
    );
    const result = await response.json();

    if (result.success) {
      const groupsPerPage = 10;
      const allGroups = result.data;

      // Apply search filtering
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
    }
    throw new Error("Failed to fetch groups");
  } catch (error) {
    console.error("Error fetching groups:", error);
    return {
      groups: [],
      totalPages: 0,
    };
  }
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
