import { useState, useEffect } from "react";

export type Role = {
  roleId: string; // Unique Role ID
  roleName: string;
  roleDesc: string; // Renamed from roleDescription to match API
  isActive: boolean;
};

// Simulate an API call
const fetchRoles = async (
  page: number,
  search: string
): Promise<{ data: Role[]; totalPages: number }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/role/get-all`
    );
    const result = await response.json();

    if (!result.success || !result.data) {
      console.error("Failed to fetch roles.");
      return { data: [], totalPages: 0 };
    }

    // Transform API response to match table structure
    let formattedRoles: Role[] = result.data.map((role: any) => ({
      roleId: role.roleId,
      roleName: role.roleName,
      roleDesc: role.roleDesc, // Use roleDesc as Role Description
      isActive: role.isActive,
    }));

    // Apply search filtering
    if (search) {
      const searchQuery = search.toLowerCase().trim();
      formattedRoles = formattedRoles.filter((role) =>
        Object.values(role).some((value) =>
          value.toString().toLowerCase().includes(searchQuery)
        )
      );
    }

    // Pagination logic
    const itemsPerPage = 10;
    const totalPages = Math.ceil(formattedRoles.length / itemsPerPage);
    const paginatedRoles = formattedRoles.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    return { data: paginatedRoles, totalPages };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { data: [], totalPages: 0 };
  }
};

export function useRolesData(
  page: number,
  search: string
): { data: Role[]; totalPages: number } {
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchRoles(page, search).then(({ data, totalPages }) => {
      setRoles(data);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  return { data: roles, totalPages };
}
