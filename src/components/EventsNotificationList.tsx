import prisma from "@/lib/prisma";
import type { NotificationItem } from "@/components/animate-ui/components/community/notification-list";
import { EventsNotificationListClient } from "@/components/EventsNotificationListClient";

function formatTime(startDate: Date, endDate: Date): string {
  const start = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const end = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${start} - ${end}`;
}

const EventsNotificationList = async ({
  dateParam,
}: {
  dateParam?: string;
}) => {
  // Default to today when no date param (matches calendar initial selection)
  const date = dateParam ? new Date(dateParam) : new Date();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  // Always query the selected/default day's events
  const data = await prisma.event.findMany({
    where: { startTime: { lte: dayEnd }, endTime: { gte: dayStart } },
    orderBy: { startTime: "asc" },
  });

  const all: NotificationItem[] = data.map((event) => ({
    id: event.id,
    title: event.title,
    subtitle: event.description,
    time: formatTime(event.startTime, event.endTime),
  }));

  const preview: NotificationItem[] =
    all.length > 0
      ? all.slice(0, 5)
      : [{ id: 0, title: "No events", subtitle: dateParam ? "No events for this date" : "No upcoming events", time: "" }];

  // For the dialog, show empty state item if no events
  const allForDialog: NotificationItem[] =
    all.length > 0
      ? all
      : [{ id: 0, title: "No events", subtitle: dateParam ? "No events for this date" : "No upcoming events", time: "" }];

  return (
    <EventsNotificationListClient preview={preview} all={allForDialog} />
  );
};

export default EventsNotificationList;
