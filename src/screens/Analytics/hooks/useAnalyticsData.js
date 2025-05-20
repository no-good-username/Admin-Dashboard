import { useState, useEffect, useMemo } from 'react';
import { generateRandomData, getDefaultStartDate } from '../utils/dateUtils';
import { Animated } from 'react-native';

export default function useAnalyticsData() {
  // Default dates
  const defaultStartDate = getDefaultStartDate();
  const today = new Date();
  
  // Global date filter state
  const [globalStartDate, setGlobalStartDate] = useState(defaultStartDate);
  const [globalEndDate, setGlobalEndDate] = useState(today);
  const [showGlobalStartPicker, setShowGlobalStartPicker] = useState(false);
  const [showGlobalEndPicker, setShowGlobalEndPicker] = useState(false);
  
  // Loading state and animations
  const [isLoading, setIsLoading] = useState(true);
  const [animatedValues] = useState({
    totalIssues: new Animated.Value(0),
    resolvedIssues: new Animated.Value(0),
    responseTime: new Animated.Value(0),
    priorityIssues: new Animated.Value(0),
  });

  // Generate chart data based on the global date range
  const issueReportData = useMemo(() => {
    const { data, labels } = generateRandomData(
      globalStartDate,
      globalEndDate,
      5,
      30
    );
    
    return {
      labels,
      datasets: [{ data }]
    };
  }, [globalStartDate, globalEndDate]);

  const responseTimeData = useMemo(() => {
    const { data, labels } = generateRandomData(
      globalStartDate,
      globalEndDate,
      2,
      12
    );
    
    return {
      labels,
      datasets: [{ data }]
    };
  }, [globalStartDate, globalEndDate]);
  
  // Issue type distribution data
  const issueTypeData = useMemo(() => {
    // Generate slightly different data based on the date range selected
    const randomSeed = globalStartDate.getTime() + globalEndDate.getTime();
    const random = () => (Math.sin(randomSeed * Math.random()) + 1) / 2;
    
    return [
      {
        name: "Non-functional",
        population: Math.floor(35 + random() * 15),
        color: "#FF9500",
        legendFontColor: "#7F7F7F",
        legendFontSize: 13
      },
      {
        name: "Flickering",
        population: Math.floor(20 + random() * 15),
        color: "#007AFF",
        legendFontColor: "#7F7F7F",
        legendFontSize: 13
      },
      {
        name: "Damage",
        population: Math.floor(10 + random() * 10),
        color: "#FF2D55",
        legendFontColor: "#7F7F7F",
        legendFontSize: 13
      },
      {
        name: "Dim Light",
        population: Math.floor(5 + random() * 10),
        color: "#5856D6",
        legendFontColor: "#7F7F7F",
        legendFontSize: 13
      },
      {
        name: "Other",
        population: Math.floor(3 + random() * 5),
        color: "#AAAAAA",
        legendFontColor: "#7F7F7F",
        legendFontSize: 13
      }
    ];
  }, [globalStartDate, globalEndDate]);

  // Technician data
  const technicianData = useMemo(() => {
    // Generate different data based on the global date range
    const timeDiff = globalEndDate.getTime() - globalStartDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const multiplier = Math.min(Math.max(daysDiff / 30, 0.5), 2);
    
    return [
      { 
        name: "John D.", 
        completed: Math.floor(35 * multiplier + Math.random() * 20), 
        time: `${(3 + Math.random() * 1).toFixed(1)}h` 
      },
      { 
        name: "Sarah M.", 
        completed: Math.floor(30 * multiplier + Math.random() * 15), 
        time: `${(3.8 + Math.random() * 1).toFixed(1)}h` 
      },
      { 
        name: "Mike R.", 
        completed: Math.floor(32 * multiplier + Math.random() * 20), 
        time: `${(3.5 + Math.random() * 1).toFixed(1)}h` 
      },
      { 
        name: "Lisa K.", 
        completed: Math.floor(28 * multiplier + Math.random() * 22), 
        time: `${(3.7 + Math.random() * 1).toFixed(1)}h` 
      },
    ];
  }, [globalStartDate, globalEndDate]);

  // Update global date range and show loading
  const updateGlobalDateRange = (startDate = null, endDate = null) => {
    setIsLoading(true);
    
    if (startDate !== null) {
      setGlobalStartDate(startDate);
    }
    
    if (endDate !== null) {
      setGlobalEndDate(endDate);
    }
    
    // Simulate API fetch delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Animate the summary cards
      Animated.stagger(150, [
        Animated.timing(animatedValues.totalIssues, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.resolvedIssues, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.responseTime, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.priorityIssues, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    // Date states and setters
    globalStartDate,
    setGlobalStartDate,
    globalEndDate,
    setGlobalEndDate,
    showGlobalStartPicker,
    setShowGlobalStartPicker,
    showGlobalEndPicker, 
    setShowGlobalEndPicker,
    
    // Loading state
    isLoading,
    setIsLoading,
    
    // Animation values
    animatedValues,
    
    // Actions
    updateGlobalDateRange,
    
    // Data for charts
    issueReportData,
    responseTimeData,
    issueTypeData,
    technicianData
  };
}