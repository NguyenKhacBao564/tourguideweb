import React, { createContext, useState, useEffect } from "react";
import { getTour, deleteTour } from "../api/tourAPI";

// Tạo Context
export const TourContext = createContext();

// Provider Component
export const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy danh sách tour khi component mount
  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      try {
        const data = await getTour();
        setTours(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Hàm xóa tour
  const handleDeleteTour = async (id) => {
    try {
      setIsLoading(true);
      await deleteTour(id);
      setTours((prevTours) => prevTours.filter((tour) => tour.tour_id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Giá trị cung cấp cho Context
  const value = {
    tours,
    isLoading,
    error,
    deleteTour: handleDeleteTour,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};