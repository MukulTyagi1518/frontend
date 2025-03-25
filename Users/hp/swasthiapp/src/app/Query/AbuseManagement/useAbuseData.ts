import { useState, useEffect } from "react";

export type Session = {
  reportId: string;
  Name: string;
  EmailId: string;
  DateTime: string;
  PhoneNo: string;
  status: string;
};

const apiForTable = process.env.NEXT_PUBLIC_API_URL_2;

// Function to format date and time range properly
const formatTimeRange = (date: string, startTime?: string, endTime?: string) => {
  if (!date || !startTime) {
    return "Invalid Date/Time";
  }
  return endTime ? `${date} | ${startTime} - ${endTime}` : `${date} | ${startTime}`;
};

// Function to parse search queries (Fix for filtering issue)
const parseSearchQuery = (search: string) => {
  return search
    .split(/\s+(?=\w+:)/) // Match key:"value with spaces" or key:value
    .map((query) => {
      const [key, ...valueParts] = query.split(":");
      return [key.trim(), valueParts.join(":").trim().toLowerCase()];
    })
    .filter(([key, value]) => key && value)
    .reduce((acc, [key, value]) => {
      acc[key as keyof Session] = value;
      return acc;
    }, {} as Partial<Record<keyof Session, string>>);
};

// Function to fetch sessions from API
const fetchSessions = async (
  page: number,
  search: string
): Promise<{ sessions: Session[]; totalPages: number }> => {
  try {
    const response = await fetch(`${apiForTable}/live-session/get`);
    const result = await response.json();

    if (!result.success || !result.data) {
      console.error("Failed to fetch session data.");
      return { sessions: [], totalPages: 0 };
    }

    // Map raw API data to `Session` type
    const allSessions: Session[] = result.data.map((item: any) => ({
      reportId: item.reportId || `Unknown-${Math.random()}`, // Ensure unique key
      Name: item.name || "No Name",
      EmailId: item.emailId || "No Email",
      DateTime: formatTimeRange(item.date, item.startTime, item.endTime),
      PhoneNo: item.phoneNo || "No Phone Number",
      status: item.status || "Unknown Status",
    }));

    // Apply improved search filtering
    const searchQueries = parseSearchQuery(search);

    const filteredSessions = allSessions.filter((session) =>
      Object.entries(searchQueries).every(([key, value]) => {
        const sessionValue = session[key as keyof Session];
        return sessionValue ? sessionValue.toString().toLowerCase().includes(value) : false;
      })
    );

    // Implement pagination
    const sessionsPerPage = 9;
    const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
    const paginatedSessions = filteredSessions.slice(
      (page - 1) * sessionsPerPage,
      page * sessionsPerPage
    );

    return { sessions: paginatedSessions, totalPages };
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return { sessions: [], totalPages: 0 };
  }
};

export function useSessionData(page: number, search: string): {
  data: Session[];
  totalPages: number;
} {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setSessions([]); // Clear old data before fetching new data
    fetchSessions(page, search).then(({ sessions, totalPages }) => {
      setSessions(sessions);
      setTotalPages(totalPages);
    });
  }, [page, search]);

  return { data: sessions, totalPages };
}
