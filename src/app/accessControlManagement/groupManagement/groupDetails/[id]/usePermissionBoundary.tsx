import { useState, useEffect } from "react";

export type PermissionBoundary = {
  permissionsName: string;
  permissionBoundaryId: string;
  description: string;
  moduleName: string;
};

// Function to parse search queries
const parseSearchQuery = (search: string) => {
  return search
    .split(/\s+(?=\w+:)/) // Match key:value format
    .map((query) => {
      const [key, ...valueParts] = query.split(":");
      return [key.trim(), valueParts.join(":").trim().toLowerCase()];
    })
    .filter(([key, value]) => key && value)
    .reduce((acc, [key, value]) => {
      acc[key as keyof PermissionBoundary] = value;
      return acc;
    }, {} as Partial<Record<keyof PermissionBoundary, string>>);
};

// Fetch Permission Boundaries from API
const fetchPermissionBoundaries = async (
  page: number,
  search: string,
  groupId: string
): Promise<{ data: PermissionBoundary[]; totalPages: number }> => {
  try {
    if (!groupId) {
      return { data: [], totalPages: 0 };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/group/get/${groupId}`
    );

    const result = await response.json();
    if (!result.success) {
      return { data: [], totalPages: 0 };
    }

    const allPermissions = result.data?.permissionBoundary || [];

    // Map API response to table fields
    const formattedPermissions: PermissionBoundary[] = allPermissions.map(
      (perm: any) => ({
        permissionsName: perm.permissionName,
        permissionBoundaryId: perm.permissionID,
        description: perm.description,
        moduleName: perm.moduleID, // API field moduleID mapped to moduleName
      })
    );

    // Apply search filtering
    const searchQueries = parseSearchQuery(search);
    const filteredPermissions = formattedPermissions.filter((perm) =>
      Object.entries(searchQueries).every(([key, value]) => {
        const permValue = perm[key as keyof PermissionBoundary];
        return permValue
          ? permValue.toString().toLowerCase().includes(value)
          : false;
      })
    );

    // Implement pagination
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
    const paginatedPermissions = filteredPermissions.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    return { data: paginatedPermissions, totalPages };
  } catch (error) {
    console.error("Error fetching permission boundaries:", error);
    return { data: [], totalPages: 0 };
  }
};

export function usePermissionBoundary(
  page: number,
  search: string,
  groupId: string
): { data: PermissionBoundary[]; totalPages: number } {
  const [permissions, setPermissions] = useState<PermissionBoundary[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (groupId) {
      fetchPermissionBoundaries(page, search, groupId).then(
        ({ data, totalPages }) => {
          setPermissions(data);
          setTotalPages(totalPages);
        }
      );
    }
  }, [page, search, groupId]);

  return { data: permissions, totalPages };
}
