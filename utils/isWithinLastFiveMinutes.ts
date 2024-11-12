export const isWithinLastFiveMinutes = (timestamp: number): boolean =>{
    const now = Date.now(); // Current time in milliseconds
    const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes in milliseconds
  
    return now - timestamp <= fiveMinutesInMs;
  }
  