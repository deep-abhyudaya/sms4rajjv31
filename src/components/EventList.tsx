import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  let data = await prisma.event.findMany({
    where: {
      ...(dateParam
        ? {
          startTime: {
            lte: dayEnd,
          },
          endTime: {
            gte: dayStart,
          }
        }
        : {
          startTime: {
            gte: new Date(),
          },
        }),
    },
    take: 3,
    orderBy: {
      startTime: "asc",
    },
  });

  return (
    <>
      {data.length === 0 && (
        <p className="text-muted-foreground text-sm  mt-4">No events for this date.</p>
      )}
      {data.map((event) => (
        <div
          className="p-5 rounded-md bg-card border border-border border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
          key={event.id}
        >
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-foreground">
              {event.title}
            </h1>
            <div className="flex flex-col items-end gap-1">
              <span className="text-muted-foreground text-xs text-right">
                {event.startTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {" - "}
                {event.endTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground text-sm">
            {event.description}
          </p>
        </div>
      ))}
    </>
  );
};

export default EventList;
