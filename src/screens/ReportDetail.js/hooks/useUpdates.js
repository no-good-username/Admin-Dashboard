import { useState, useCallback } from "react";
import { useAlert } from "../../../context/AlertContext";

export default function useUpdates(report) {
  const { showAlert } = useAlert();
  
  // Initialize updates from report data
  const [updates, setUpdates] = useState(() => {
    if (Array.isArray(report.updates)) {
      return report.updates.map((update, index) => {
        if (typeof update === 'string') {
          return {
            id: `update-${index}-${Date.now()}`,
            text: update,
            timestamp: new Date().toISOString()
          };
        }
        return {
          ...update,
          id: update.id || `existing-update-${index}-${Date.now()}`
        };
      });
    }
    return [];
  });
  
  const [statusUpdate, setStatusUpdate] = useState("");
  
  // Send update to the user
  const sendUpdate = useCallback(() => {
    if (statusUpdate.trim()) {
      const newUpdate = {
        id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: statusUpdate,
        timestamp: new Date().toISOString(),
      };

      // Optimistic update
      setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);

      fetch(`https://streetlightfix-backend-1.onrender.com/admin/updateStatus`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskid: report.taskId,
          status: statusUpdate.trim()
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to send update');
          }
          setStatusUpdate("");
        })
        .catch(error => {
          console.error("Failed to save update:", error);
          // Rollback on error
          setUpdates(prevUpdates => prevUpdates.filter(update => update.id !== newUpdate.id));
          
          showAlert({
            type: 'error',
            title: "Update Failed",
            message: "Failed to send the update. Please try again.",
            buttons: [{ text: "OK" }]
          });
        });
    }
  }, [statusUpdate, report.taskId, showAlert]);

  // Add a new update to the list
  const addUpdate = useCallback((text) => {
    const newUpdate = {
      id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      timestamp: new Date().toISOString(),
    };
    
    setUpdates(prevUpdates => [newUpdate, ...prevUpdates]);
  }, []);

  return {
    updates,
    setUpdates,
    statusUpdate,
    setStatusUpdate,
    sendUpdate,
    addUpdate
  };
}