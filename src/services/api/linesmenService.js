/**
 * Service for fetching linesmen assignment data
 */

// Mock data for linesmen
const linesmenData = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "9876543210",
    area: "Shiroda_Area_A"
  },
  {
    id: 2,
    name: "Sunil Patil",
    phone: "8765432109",
    area: "Shiroda_Area_A"
  },
  {
    id: 3,
    name: "Prakash Naik",
    phone: "7654321098",
    area: "Shiroda_Area_A"
  },
  {
    id: 4,
    name: "Vijay Sharma",
    phone: "6543210987",
    area: "Shiroda_Area_A"
  },
  {
    id: 5,
    name: "Anand Verma",
    phone: "7890123456",
    area: "Shiroda_Area_A"
  }
];

// Generate random assignments for each day within the date range
const generateAssignments = (startDate, endDate) => {
  const assignmentData = [];
  const currentDate = new Date(startDate);
  const endDateTime = new Date(endDate).getTime();
  
  // For each day in the range
  while (currentDate.getTime() <= endDateTime) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dateTasks = [];
    
    // For each linesman, generate random assignments for this day
    linesmenData.forEach(linesman => {
      // Random number of assigned tasks (0-5)
      const assignedTasks = Math.floor(Math.random() * 6);
      
      // Random number of completed tasks (0-assigned)
      const completedTasks = Math.floor(Math.random() * (assignedTasks + 1));
      
      // Remaining tasks are in progress
      const inProgressTasks = assignedTasks - completedTasks;
      
      if (assignedTasks > 0) {
        dateTasks.push({
          linesmanId: linesman.id,
          linesmanName: linesman.name,
          date: dateStr,
          assigned: assignedTasks,
          inProgress: inProgressTasks,
          completed: completedTasks
        });
      }
    });
    
    // Add to assignment data
    if (dateTasks.length > 0) {
      assignmentData.push({
        date: dateStr,
        assignments: dateTasks
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return assignmentData;
};

// Calculate summary statistics
const calculateSummary = (assignmentData) => {
  const summary = {};
  
  // Initialize summary for each linesman
  linesmenData.forEach(linesman => {
    summary[linesman.id] = {
      id: linesman.id,
      name: linesman.name,
      phone: linesman.phone,
      totalAssigned: 0,
      totalInProgress: 0,
      totalCompleted: 0,
      completionRate: 0
    };
  });
  
  // Aggregate data
  assignmentData.forEach(day => {
    day.assignments.forEach(assignment => {
      const linesmanSummary = summary[assignment.linesmanId];
      if (linesmanSummary) {
        linesmanSummary.totalAssigned += assignment.assigned;
        linesmanSummary.totalInProgress += assignment.inProgress;
        linesmanSummary.totalCompleted += assignment.completed;
      }
    });
  });
  
  // Calculate completion rates
  Object.values(summary).forEach(linesmanSummary => {
    if (linesmanSummary.totalAssigned > 0) {
      linesmanSummary.completionRate = Math.round((linesmanSummary.totalCompleted / linesmanSummary.totalAssigned) * 100);
    }
  });
  
  return Object.values(summary);
};

/**
 * Fetch linesmen assignment data for a given date range
 * @param {Date} startDate - Start date for the report
 * @param {Date} endDate - End date for the report
 * @returns {Promise} - Promise resolving to assignment data
 */
export const fetchLinesmenAssignments = async (startDate, endDate) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate assignments data
    const assignmentData = generateAssignments(startDate, endDate);
    
    // Calculate summary statistics
    const summaryData = calculateSummary(assignmentData);
    
    return {
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      summaryData,
      dailyData: assignmentData
    };
  } catch (error) {
    console.error('Error fetching linesmen assignments:', error);
    throw error;
  }
};