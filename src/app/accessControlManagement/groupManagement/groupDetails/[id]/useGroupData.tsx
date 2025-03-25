import { useState, useEffect } from "react";

export type GroupMember = {
  userName: string;
  userId: string;
  mailId: string;
  application: string;
  adminType: string;
};

// ✅ Function to parse search queries
const parseSearchQuery = (search: string) => {
  return search
    .split(/\s+(?=\w+:)/) // Match key:value format
    .map((query) => {
      const [key, ...valueParts] = query.split(":");
      return [key.trim(), valueParts.join(":").trim().toLowerCase()];
    })
    .filter(([key, value]) => key && value)
    .reduce((acc, [key, value]) => {
      acc[key as keyof GroupMember] = value;
      return acc;
    }, {} as Partial<Record<keyof GroupMember, string>>);
};

// ✅ Fetch Group Members from API with search functionality
const fetchGroupMembers = async (
  page: number,
  search: string,
  groupId: string
): Promise<{ data: GroupMember[]; totalPages: number }> => {
  try {
    if (!groupId) {
      console.error("No groupId provided");
      return { data: [], totalPages: 0 };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/fitnearn/web/admin/access/group/get/${groupId}`
    );

    const result = await response.json();
    console.log("Fetched API Result:", result);

    if (!result.success) {
      console.error("Failed to fetch group members:", result.message);
      return { data: [], totalPages: 0 };
    }

    const allMembers = result.data?.groupMembers || [];

    // ✅ Format API data to match table fields
    const formattedMembers: GroupMember[] = allMembers.map((member: any) => ({
      userName: member.name,
      userId: member.USR_ID, // ✅ API's USR_ID is User ID
      mailId: member.email,
      application: member.appType, // ✅ API's appType is Application
      adminType: member.role, // ✅ API's role is Admin Type
    }));

    // ✅ Apply search filtering
    const searchQueries = parseSearchQuery(search);
    const filteredMembers = formattedMembers.filter((member) =>
      Object.entries(searchQueries).every(([key, value]) => {
        const memberValue = member[key as keyof GroupMember];
        return memberValue
          ? memberValue.toString().toLowerCase().includes(value)
          : false;
      })
    );

    // ✅ Apply pagination AFTER filtering
    const membersPerPage = 10;
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
    const paginatedMembers = filteredMembers.slice(
      (page - 1) * membersPerPage,
      page * membersPerPage
    );

    return { data: paginatedMembers, totalPages };
  } catch (error) {
    console.error("Error fetching group members:", error);
    return { data: [], totalPages: 0 };
  }
};

// ✅ Hook to manage Group Members data
export function useGroupData(
  page: number,
  search: string,
  groupId: string
): { data: GroupMember[]; totalPages: number } {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (groupId) {
      fetchGroupMembers(page, search, groupId).then(({ data, totalPages }) => {
        console.log("Setting Group Members Data:", data);
        setMembers(data);
        setTotalPages(totalPages);
      });
    }
  }, [page, search, groupId]);

  return { data: members, totalPages };
}
