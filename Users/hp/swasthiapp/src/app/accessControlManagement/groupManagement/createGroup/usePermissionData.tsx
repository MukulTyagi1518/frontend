import { useState, useEffect } from "react";

const apiForTable = process.env.NEXT_PUBLIC_API_URL;

export type Permission = {
  permissionsName: string;
  permissionsId: string;
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
      acc[key as keyof Permission] = value;
      return acc;
    }, {} as Partial<Record<keyof Permission, string>>);
};

// Fetch permissions from API
const fetchPermissions = async (
  page: number,
  search: string
): Promise<{ data: Permission[]; totalPages: number }> => {
  try {
    const response = await fetch(`${apiForTable}/fitnearn/web/admin/access/permissions/get-all`);
    const result = await response.json();

    if (!result.success) {
      console.error("Failed to fetch permissions:", result.message);
      return { data: [], totalPages: 0 };
    }

    // Transform API data to match table fields
    let allPermissions: Permission[] = result.data.map((perm: any) => ({
      permissionsName: perm.permissionName,
      permissionsId: perm.permissionID,
      description: perm.description,
      moduleName: perm.moduleID, // API field moduleID mapped to moduleName
    }));

    // Apply search filtering
    const searchQueries = parseSearchQuery(search);
    const filteredPermissions = allPermissions.filter((perm) =>
      Object.entries(searchQueries).every(([key, value]) => {
        const permValue = perm[key as keyof Permission];
        return permValue ? permValue.toString().toLowerCase().includes(value) : false;
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
    console.error("Error fetching permissions:", error);
    return { data: [], totalPages: 0 };
  }
};

export function usePermissionData(
  page: number,
  search: string
): { data: Permission[]; totalPages: number } {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPermissions(page, search).then(({ data, totalPages }) => {
      setPermissions(data);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  return { data: permissions, totalPages };
}
