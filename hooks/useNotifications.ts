"use client";

import { useEffect, useState } from "react";

export function useNotifications() {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    const es = new EventSource("/api/sse/notifications");

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setNotification(data);
      } catch (err) {
        console.error("Erreur SSE :", err);
      }
    };

    es.onerror = () => {
      console.warn("SSE déconnecté");
      es.close();
    };

    return () => es.close();
  }, []);

  return notification;
}
