import { useState, useEffect } from "react";

export type AdminUser = {
  userName: string; // Renamed from bookingSessionId
  roleName: string; // New field for role
  mailId: string; // New field for mail ID
  phoneNumber: string; // New field for phone number
  date: string; // Renamed from dateTime
  status: string; // Renamed from stage
  select?: boolean;
};

// Simulate an API call
const fetchAdminUsers = async (
  page: number,
  search: string
): Promise<{ adminUsers: AdminUser[]; totalPages: number }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const usersPerPage = 10;

  // Helper function to format date
  const formatDate = (year: number, month: number, day: number): string => {
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");
    return `${formattedMonth}-${formattedDay}-${year}`;
  };

  const allAdminUsers: AdminUser[] = Array.from({ length: 100 }, (_, i) => {
    const year = 2025;
    const month = 2; // February
    const day = (i % 30) + 1; // Generate day of the month

    return {
      userName: `User_${1000 + i}`,
      roleName: ["Admin", "Moderator", "User"][(i + 1) % 3],
      mailId: `user${1000 + i}@example.com`,
      phoneNumber: `+123456789${(i % 10).toString().padStart(1, "0")}`,
      date: formatDate(year, month, day), // Format the date using the helper function
      status: ["Active", "Inactive"][(i + 1) % 2],
    };
  });

  // Parse search queries
  const searchQueries = search
    .split(/\s+(?=\w+:)/) // Split by space followed by a key-value format
    .map((query) => {
      const [key, ...valueParts] = query.split(":");
      return [key.trim(), valueParts.join(":").trim()];
    })
    .filter(([key, value]) => key && value)
    .reduce((acc, [key, value]) => {
      const typedKey = key as keyof AdminUser;
      acc[typedKey] = value.toLowerCase();
      return acc;
    }, {} as Partial<Record<keyof AdminUser, string>>);

  // Filter admin users
  const filteredAdminUsers = allAdminUsers.filter((user) =>
    Object.entries(searchQueries).every(([key, value]) => {
      const userValue = user[key as keyof AdminUser];
      return userValue?.toString().toLowerCase().includes(value);
    })
  );

  const totalPages = Math.ceil(filteredAdminUsers.length / usersPerPage);
  const paginatedAdminUsers = filteredAdminUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  return {
    adminUsers: paginatedAdminUsers,
    totalPages,
  };
};

export function useAdminUserData(
  page: number,
  search: string
): { data: AdminUser[]; totalPages: number } {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAdminUsers(page, search).then(({ adminUsers, totalPages }) => {
      setAdminUsers(adminUsers);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  return { data: adminUsers, totalPages };
}
