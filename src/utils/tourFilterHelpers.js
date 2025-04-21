/**
 * Helper functions for filtering tours by status
 */

// Constants for filter keys
export const FILTER_KEYS = {
  ALL: 'all',
  UPCOMING: 'sapKhoiHanh',
  IN_PROGRESS: 'dangKhoiHanh',
  COMPLETED: 'daHoanThanh',
  NOT_STARTED: 'chuaKhoiHanh'
};

// Constants for occupancy filter options
export const OCCUPANCY_FILTERS = {
  LEAST_AVAILABLE: 'leastAvailable',
  MOST_AVAILABLE: 'mostAvailable'
};

// Calculate date ranges for filtering
const calculateDateRanges = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparisons
  
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);
  
  return { today, oneWeekFromNow };
};

/**
 * Filter tours based on their status relative to the current date
 * @param {string} filterStatus - The status key to filter by
 * @returns {Function} - A filter function that takes a tour and returns boolean
 */
export const filterToursByStatus = (filterStatus) => {
  return (tour) => {
    // Return all tours if no status filter is applied
    if (!filterStatus || filterStatus === FILTER_KEYS.ALL) {
      return true;
    }

    const { today, oneWeekFromNow } = calculateDateRanges();
    
    // Handle case where tour has no start date
    if (!tour.start_date) {
      return filterStatus === FILTER_KEYS.NOT_STARTED;
    }
    
    const startDate = new Date(tour.start_date);
    startDate.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparisons
    
    const endDate = new Date(tour.end_date);
    endDate.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparisons
    // console.log("startDate > today", startDate > today);
    // console.log("today >= startDate", today >= startDate);
    // console.log("today <= endDate", today <= endDate);
    
    switch (filterStatus) {
      case FILTER_KEYS.UPCOMING:
        // Tours starting within the next 7 days
        return startDate > today && startDate <= oneWeekFromNow;
        
      case FILTER_KEYS.IN_PROGRESS:
        // Tours starting today
        return today >= startDate && today <= endDate;
        
      case FILTER_KEYS.COMPLETED:
        // Tours that have already started (in the past)
        return startDate < today;
        
      case FILTER_KEYS.NOT_STARTED:
        // Tours starting more than a week from now
        return startDate > oneWeekFromNow;
        
      default:
        return true;
    }
  };
};

/**
 * Filter tours based on text search
 * @param {string} searchTerm - The search term to filter by
 * @returns {Function} - A filter function that takes a tour and returns boolean
 */
export const filterToursBySearchTerm = (searchTerm) => {
  return (tour) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return true;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    // Search in tour name, ID, and destination
    return (
      (tour.name && tour.name.toLowerCase().includes(term)) ||
      (tour.tour_id && tour.tour_id.toString().includes(term)) ||
      (tour.destination && tour.destination.toLowerCase().includes(term))
    );
  };
};

/**
 * Sort tours by available spots
 * @param {string} sortOrder - The sort order ('leastAvailable' or 'mostAvailable')
 * @returns {Function} - A sort function that takes two tours and returns a number
 */
export const sortToursByAvailability = (sortOrder) => {
  return (tourA, tourB) => {
    // Calculate available spots
    const availableA = tourA.max_guests - (tourA.booked_guests || 0);
    const availableB = tourB.max_guests - (tourB.booked_guests || 0);
    
    // Sort according to specified order
    if (sortOrder === OCCUPANCY_FILTERS.LEAST_AVAILABLE) {
      return availableA - availableB; // Ascending (fewest spots first)
    } else {
      return availableB - availableA; // Descending (most spots first)
    }
  };
};

/**
 * Combine multiple filter functions
 * @param {...Function} filters - Filter functions to combine
 * @returns {Function} - A combined filter function
 */
export const combineFilters = (...filters) => {
  return (tour) => filters.every(filter => filter(tour));
};

/**
 * Get all available tour status filters with labels
 * @returns {Array} - Array of filter objects with key and label
 */
export const getTourStatusFilters = () => [
  { key: FILTER_KEYS.ALL, label: "Tất cả" },
  { key: FILTER_KEYS.UPCOMING, label: "Sắp khởi hành" },
  { key: FILTER_KEYS.IN_PROGRESS, label: "Đang khởi hành" },
  { key: FILTER_KEYS.COMPLETED, label: "Đã hoàn thành" },
  { key: FILTER_KEYS.NOT_STARTED, label: "Chưa khởi hành" },
];

/**
 * Get occupancy filter options with labels
 * @returns {Array} - Array of filter objects with key and label
 */
export const getOccupancyFilters = () => [
  { key: OCCUPANCY_FILTERS.LEAST_AVAILABLE, label: "Còn ít chỗ trống nhất" },
  { key: OCCUPANCY_FILTERS.MOST_AVAILABLE, label: "Còn nhiều chỗ trống nhất" },
]; 