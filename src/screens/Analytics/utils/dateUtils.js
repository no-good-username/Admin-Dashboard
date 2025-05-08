// Format date for display
export const formatDate = (date) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };
  
  // Generate initial date that is 30 days before today
  export const getDefaultStartDate = () => {
    return new Date(new Date().setDate(new Date().getDate() - 30));
  };
  
  // Generate random chart data based on date range
  export const generateRandomData = (startDate, endDate, min, max) => {
    const data = [];
    const labels = [];
    const dayCount = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Generate labels based on timespan
    if (dayCount <= 7) {
      // For a week or less, show individual days
      for (let i = 0; i <= dayCount; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
    } else if (dayCount <= 31) {
      // For a month, show every few days
      const interval = Math.max(Math.floor(dayCount / 6), 1);
      for (let i = 0; i <= dayCount; i += interval) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
    } else {
      // For longer periods, show months
      const startMonth = startDate.getMonth();
      const endMonth = endDate.getMonth() + (endDate.getFullYear() - startDate.getFullYear()) * 12;
      
      for (let i = startMonth; i <= endMonth; i++) {
        const date = new Date(startDate);
        date.setMonth(i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
    }
    
    return { data, labels };
  };