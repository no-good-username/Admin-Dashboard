import { useState, useEffect, useCallback } from "react";
import { useAlert } from "../../../context/AlertContext";

export default function useLinesmen(report) {
  const [selectedLinesmen, setSelectedLinesmen] = useState([]);
  const [linesmen, setLinesmen] = useState([]);
  const [loadingLinesmen, setLoadingLinesmen] = useState(false);
  const [linesmenError, setLinesmenError] = useState(null);
  const [originalAssignedLinesmen, setOriginalAssignedLinesmen] = useState([]);
  const [assigningTask, setAssigningTask] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { showAlert } = useAlert();

  // Fetch linesmen data
  const fetchLinesmen = useCallback(async () => {
    setLoadingLinesmen(true);
    setLinesmenError(null);

    try {
      // For now using hardcoded area ID 13
      const response = await fetch('https://streetlightfix-backend-1.onrender.com/admin/linemen/13');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform data to match your component's expected format
      const formattedLinesmen = data.map(lineman => ({
        label: lineman.Lineman_Name,
        value: lineman.linemen_id.toString(),
        areaId: lineman.area_id,
        subdivisionId: lineman.subdivision_id
      }));

      setLinesmen(formattedLinesmen);

      // Check if we have assigned linesmen data
      if (report.assignedLinesmen &&
        Array.isArray(report.assignedLinesmen) &&
        report.assignedLinesmen[0]?.id) {

        const assignedIds = report.assignedLinesmen[0].id;
        
        // Find the linesmen objects that match the assigned IDs
        const preselectedLinesmen = formattedLinesmen.filter(linesman =>
          assignedIds.includes(parseInt(linesman.value))
        );

        if (preselectedLinesmen.length > 0) {
          setSelectedLinesmen(preselectedLinesmen);
          setOriginalAssignedLinesmen(preselectedLinesmen);
        }
      }
    } catch (error) {
      console.error("Failed to fetch linesmen:", error);
      setLinesmenError("Failed to load linesmen data. Please try again later.");
    } finally {
      setLoadingLinesmen(false);
    }
  }, [report.assignedLinesmen]);

  // Check if linesmen selection has changed
  const hasLinesmenSelectionChanged = useCallback(() => {
    if (originalAssignedLinesmen.length !== selectedLinesmen.length) return true;
    
    const originalIds = originalAssignedLinesmen.map(l => l.value).sort();
    const selectedIds = selectedLinesmen.map(l => l.value).sort();
    
    for (let i = 0; i < originalIds.length; i++) {
      if (originalIds[i] !== selectedIds[i]) return true;
    }
    
    return false;
  }, [originalAssignedLinesmen, selectedLinesmen]);

  // Toggle linesmen selection
  const toggleLinesman = useCallback((item) => {
    const isRemovingLast = selectedLinesmen.length === 1 && 
                          selectedLinesmen[0].value === item.value;
    
    if (isRemovingLast) {
      showAlert({
        type: 'warning',
        title: "Unassign Task",
        message: "Are you sure you want to unassign all linesmen from this task?",
        buttons: [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes, Unassign",
            style: "destructive",
            onPress: () => {
              setSelectedLinesmen([]);
              // onUnassign would be passed as a prop from parent
            }
          }
        ]
      });
    } else {
      setSelectedLinesmen((current) =>
        current.some((l) => l.value === item.value)
          ? current.filter((l) => l.value !== item.value)
          : [...current, item]
      );
    }
  }, [selectedLinesmen, showAlert]);

  useEffect(() => {
    fetchLinesmen();
  }, [fetchLinesmen]);

  return {
    selectedLinesmen,
    setSelectedLinesmen,
    linesmen,
    loadingLinesmen,
    linesmenError,
    originalAssignedLinesmen,
    setOriginalAssignedLinesmen,
    assigningTask,
    setAssigningTask,
    modalVisible,
    setModalVisible,
    toggleLinesman,
    hasLinesmenSelectionChanged,
    fetchLinesmen
  };
}