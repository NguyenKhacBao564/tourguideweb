import React, { createContext, useState, useEffect } from "react";
import { getTour, deleteTour, addTour} from "../api/tourAPI";

// Tạo Context
export const TourContext = createContext();

// Provider Component
export const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy danh sách tour khi component mount
  useEffect(() => {
    console.log("tour context use effect run!")
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

  const handleAddTour = async (tourData) => {
    try {
      setIsLoading(true);
      const result = await addTour(tourData);
      
      // // Map fields to the format expected by the DataTable
      // const formattedTourData = {
      //   ...tourData,
      //   name: tourData.tourName,
      //   start_date: tourData.departureDate,
      //   max_guests: tourData.seats,
      //   created_at: new Date().toISOString()
      // };
      
      setTours((prevTours) => [...prevTours, tourData]);
      setError(null);
      return result;
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
    addTour: handleAddTour,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};