import { useState, useEffect } from "react";

// Define the structure of role permissions data
export type RolePermission = {
  permissionsName: string; // Permissions Name
  permissionsId: string; // Permissions ID
  description: string; // Description
  moduleName: string; // Module Name
  select?: boolean; // Optional for selection in the table
};

// Function to parse search queries
const parseSearchQuery = (search: string) => {
  return search
    .split(/\s+(?=\w+:)/)
    .map((query) => {
      const [key, ...valueParts] = query.split(":");
      return [key.trim(), valueParts.join(":").trim().toLowerCase()];
    })
    .filter(([key, value]) => key && value)
    .reduce((acc, [key, value]) => {
      acc[key as keyof RolePermission] = value;
      return acc;
    }, {} as Partial<Record<keyof RolePermission, string>>);
};

// Fetch Role Permissions from API
const fetchRolePermissions = async (
  roleId: string,
  page: number,
  search: string
): Promise<{ data: RolePermission[]; totalPages: number }> => {
  try {
    if (!roleId) {
      console.error("No roleId provided");
      return { data: [], totalPages: 0 };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/role/get/${roleId}`
    );

    const result = await response.json();
    console.log("Fetched API Result:", result);

    if (!result.success) {
      console.error("Failed to fetch role permissions:", result.message);
      return { data: [], totalPages: 0 };
    }

    const allPermissions = result.data?.permissions || [];

    // Format API response into table-friendly structure
    const formattedPermissions: RolePermission[] = allPermissions.map(
      (perm: any) => ({
        permissionsName: perm.permissionName,
        permissionsId: perm.permissionID,
        description: perm.description,
        moduleName: perm.moduleID, // Mapping API field moduleID to moduleName
      })
    );

    // Apply search filtering
    const searchQueries = parseSearchQuery(search);
    const filteredPermissions = formattedPermissions.filter((perm) =>
      Object.entries(searchQueries).every(([key, value]) => {
        const permValue = perm[key as keyof RolePermission];
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
    console.error("Error fetching role permissions:", error);
    return { data: [], totalPages: 0 };
  }
};

export function useRolesData(
  roleId: string,
  page: number,
  search: string
): { data: RolePermission[]; totalPages: number } {
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (roleId) {
      fetchRolePermissions(roleId, page, search).then(
        ({ data, totalPages }) => {
          console.log("Setting Role Permissions Data:", data);
          setPermissions(data);
          setTotalPages(totalPages);
        }
      );
    }
  }, [roleId, page, search]);

  return { data: permissions, totalPages };
}
