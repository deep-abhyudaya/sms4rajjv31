"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";

const localizer = momentLocalizer(moment);

interface LessonEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  teacherName: string;
  subjectName: string;
  className: string;
}

const BigCalendar = ({
  data,
}: {
  data: LessonEvent[];
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [selectedLesson, setSelectedLesson] = useState<LessonEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const handleSelectEvent = (event: LessonEvent) => {
    setSelectedLesson(event);
    setIsDialogOpen(true);
  };

  return (
    <div className="h-full w-full bg-card text-card-foreground">
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        style={{ height: "100%", width: "100%" }}
        onView={handleOnChangeView}
        onSelectEvent={handleSelectEvent}
        min={new Date(2025, 0, 1, 8, 0, 0)}
        max={new Date(2025, 0, 1, 18, 0, 0)}
        step={30}
        timeslots={2}
        components={{
          event: ({ event }: any) => (
            <div className="flex flex-col h-full p-1 overflow-hidden pointer-events-none">
              <span className="font-bold text-[12px] leading-tight break-words uppercase">
                {event.title}
              </span>
              <span className="text-[10px] opacity-60 mt-auto font-medium">
                {moment(event.start).format("h:mm")} - {moment(event.end).format("h:mm")}
              </span>
            </div>
          ),
        }}
        formats={{
          timeGutterFormat: (date, culture, localizer) =>
            localizer!.format(date, "H:mm", culture),
        }}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-black text-white border-white/10">
          <DialogHeader className="border-b border-white/5 pb-4">
            <DialogTitle className="text-xl font-light tracking-tight uppercase">
              {selectedLesson?.title}
            </DialogTitle>
            <DialogDescription className="text-white/40 text-[10px] uppercase tracking-widest mt-1">
              Lesson Information
            </DialogDescription>
          </DialogHeader>

          {selectedLesson && (
            <div className="flex flex-col gap-6 py-6 px-1">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Teacher</span>
                <span className="text-sm font-light text-white/90">{selectedLesson.teacherName}</span>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Class</span>
                  <span className="text-sm font-light text-white/90">{selectedLesson.className}</span>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Subject</span>
                  <span className="text-sm font-light text-white/90">{selectedLesson.subjectName}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-4 border-t border-white/5">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Schedule</span>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-light tracking-tighter text-white/90">
                    {moment(selectedLesson.start).format("HH:mm")}   {moment(selectedLesson.end).format("HH:mm")}
                  </span>
                  <span className="px-2 py-0.5 border border-white/20 text-[10px] font-medium text-white/60 tracking-tighter uppercase">
                    {moment(selectedLesson.start).format("dddd")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .rbc-calendar {
          background-color: transparent !important;
          color: inherit !important;
          font-family: inherit !important;
        }
        .rbc-time-view, .rbc-month-view {
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        .rbc-timeslot-group {
          min-height: 50px !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03) !important;
        }
        .rbc-off-range-bg {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .rbc-today {
          background-color: rgba(255, 255, 255, 0.03) !important;
        }
        .rbc-toolbar button {
          color: white !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          background: transparent !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
          letter-spacing: 0.1em !important;
          border-radius: 0 !important;
        }
        .rbc-toolbar button:hover, .rbc-toolbar button.rbc-active {
          background-color: white !important;
          color: black !important;
        }
        .rbc-event {
          background-color: white !important;
          color: black !important;
          border-radius: 0 !important;
          border: none !important;
          padding: 6px !important;
        }
        .rbc-event:hover {
          background-color: #e5e5e5 !important;
        }
        .rbc-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 12px 0 !important;
          font-weight: 500 !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
          letter-spacing: 0.1em !important;
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .rbc-label {
          padding: 0 12px !important;
          font-size: 10px !important;
          color: rgba(255, 255, 255, 0.3) !important;
          font-weight: 400 !important;
        }
      `}</style>
    </div>
  );
};

export default BigCalendar;
