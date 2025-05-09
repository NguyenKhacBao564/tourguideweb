export const OCCUPANCY_FILTERS = {
    IS_ACTIVE: 'is_active',
    UPCOMING: 'upcoming',
    EXPIRED: 'expired',
};

export const getOccupancyFilters = () => [
    {key: OCCUPANCY_FILTERS.IS_ACTIVE, label: 'Đang hoạt động'},
    {key: OCCUPANCY_FILTERS.UPCOMING, label: 'Sắp diễn ra'},
    {key: OCCUPANCY_FILTERS.EXPIRED, label: 'Đã hết hạn'},
]
    
// export const 

