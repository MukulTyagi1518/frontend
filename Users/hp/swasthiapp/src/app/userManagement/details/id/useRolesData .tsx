import { useState, useEffect } from "react";

export type RoleDetails = {
  roleName: string; // Role Name
  description: string; // Description
  details: string; // Additional details
  select?: boolean; // Optional for selection in the table
};

// Simulate an API call
const fetchRoleDetails = async (
  page: number,
  search: string
): Promise<{ roles: RoleDetails[]; totalPages: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

  const rolesPerPage = 10;
  const allRoles: RoleDetails[] = Array.from({ length: 100 }, (_, i) => ({
    roleName: `Role ${i + 1}`,
    description: `Description for Role ${i + 1}`,
    details: `Details for Role ${i + 1}`,
  }));

  const totalPages = Math.ceil(allRoles.length / rolesPerPage);
  const paginatedRoles = allRoles.slice(
    (page - 1) * rolesPerPage,
    page * rolesPerPage
  );

  return { roles: paginatedRoles, totalPages };
};

export function useRolesData(
  page: number,
  search: string
): { data: RoleDetails[]; totalPages: number } {
  const [roles, setRoles] = useState<RoleDetails[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchRoleDetails(page, search).then(({ roles, totalPages }) => {
      setRoles(roles);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  return { data: roles, totalPages };
}
