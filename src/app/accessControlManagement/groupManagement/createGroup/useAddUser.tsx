import { useState, useEffect } from "react";

const apiForTable = process.env.NEXT_PUBLIC_API_URL;

export type User = {
  userName: string;
  userId: string;
  mailId: string;
  application: string;
  adminType: string;
  select?: boolean;
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
      acc[key as keyof User] = value;
      return acc;
    }, {} as Partial<Record<keyof User, string>>);
};

// Fetch Users from API
const fetchUsers = async (
  page: number,
  search: string
): Promise<{ data: User[]; totalPages: number }> => {
  try {
    const response = await fetch(
      `${apiForTable}/fitnearn/web/admin/access/users/get/all`
    );
    const result = await response.json();

    if (!result.success) {
      console.error("Failed to fetch users:", result.message);
      return { data: [], totalPages: 0 };
    }

    let allUsers: User[] = result.data.map((user: any) => ({
      userName: user.name,
      userId: user.USR_ID,
      mailId: user.email,
      application: user.appType,
      adminType: user.role,
    }));

    // Apply search filtering
    const searchQueries = parseSearchQuery(search);
    const filteredUsers = allUsers.filter((user) =>
      Object.entries(searchQueries).every(([key, value]) => {
        const userValue = user[key as keyof User];
        return userValue
          ? userValue.toString().toLowerCase().includes(value)
          : false;
      })
    );

    // Implement pagination
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    return { data: paginatedUsers, totalPages };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: [], totalPages: 0 };
  }
};

export function useAddUser(
  page: number,
  search: string
): { data: User[]; totalPages: number } {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsers(page, search).then(({ data, totalPages }) => {
      setUsers(data);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  return { data: users, totalPages };
}
