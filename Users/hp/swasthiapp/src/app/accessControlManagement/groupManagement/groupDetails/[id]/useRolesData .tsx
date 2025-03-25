import { useState, useEffect } from "react";

export type RoleDetails = {
  roleId: string;
  roleName: string; // Role Name
  description: string; // Description (Mapped from roleDesc)
};

const fetchRoles = async (
  page: number,
  search: string,
  groupId: string
): Promise<{ roles: RoleDetails[]; totalPages: number }> => {
  try {
    if (!groupId) {
      console.error("No groupId provided");
      return { roles: [], totalPages: 0 };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/group/get/${groupId}`
    );
    const result = await response.json();

    if (!result.success || !result.data) {
      console.error("Failed to fetch roles:", result.message);
      return { roles: [], totalPages: 0 };
    }

    // Extract roles
    const allRoles = result.data.roles || [];

    // Map API response to table fields
    const formattedRoles: RoleDetails[] = allRoles.map((role: any) => ({
      roleId: role.roleId,
      roleName: role.roleName,
      description: role.roleDesc, // Mapping roleDesc to description
    }));

    // Implement search filtering
    const searchQuery = search.toLowerCase();
    const filteredRoles = formattedRoles.filter((role) =>
      Object.values(role).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(searchQuery)
      )
    );

    // Implement pagination
    const rolesPerPage = 10;
    const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);
    const paginatedRoles = filteredRoles.slice(
      (page - 1) * rolesPerPage,
      page * rolesPerPage
    );

    return { roles: paginatedRoles, totalPages };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { roles: [], totalPages: 0 };
  }
};

export function useRolesData(
  page: number,
  search: string,
  groupId: string
): { data: RoleDetails[]; totalPages: number } {
  const [roles, setRoles] = useState<RoleDetails[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (groupId) {
      fetchRoles(page, search, groupId).then(({ roles, totalPages }) => {
        setRoles(roles);
        setTotalPages(totalPages);
      });
    }
  }, [page, search, groupId]);

  return { data: roles, totalPages };
}
