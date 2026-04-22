"use client";

import React, { useEffect, useState } from "react";
// Assumes you have a server action or API route to check for new notifications.
// For the prompt, we use a simple generic polling interval targeting an imaginary endpoint or mock.
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";

export function GlobalNotificationProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    // In a real scenario, this would be a WebSocket or SSE, or a polling interval fetching `/api/notifications/unread`
    const timer = setInterval(async () => {
      try {
        const response = await fetch("/api/notifications/poll"); // Hypothetical route
        if (response.ok) {
          const notifications = await response.json();
          // Assume response returns array of notifications: { id, title, message }
          notifications.forEach((note: any) => {
            toast.info(note.message, {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            // Mark as read after displaying
            fetch("/api/notifications/read", {
              method: "POST",
              body: JSON.stringify({ id: note.id })
            });
          });
        }
      } catch (err) {
        // ignore errors to avoid noise
      }
    }, 15000); // 15 second poll

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {children}
      <ToastContainer 
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </>
  );
}
