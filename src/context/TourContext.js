import React, { createContext, useState, useEffect } from "react";
import { getTour, addTour, updateTour, blockTour} from "../api/tourAPI";
import { getItinerary } from "../api/scheduleAPI";
import { getTourImages } from "../api/imageAPI";

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


  const handleBlockTour = async (id) => {
    try {
      setIsLoading(true);
      await blockTour(id);
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
      
      setTours((prevTours) => [...prevTours, tourData]);
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTour = async (tourData) => {
    try {
      setIsLoading(true);
      const result = await updateTour(tourData, tourData.tour_id);
      
      // Update the tour in the state
      setTours((prevTours) => 
        prevTours.map(tour => 
          tour.tour_id === tourData.tour_id ? { ...tour, ...tourData } : tour
        )
      );
      
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetImages = async (tour_id) => {
    try{
      const result = await getTourImages(tour_id);
      return result;
    }catch(err){
      setError(err.message);
      throw err;
    }
  }
  const handleGetItinerary = async (tour_id) => {
    try {
      const result = await getItinerary(tour_id);
      return result;
    } catch (error) {
      setError(error.message);
    }
  }
  // Giá trị cung cấp cho Context
  const value = {
    tours,
    isLoading,
    error,
    // deleteTour: handleDeleteTour,
    addTour: handleAddTour,
    updateTour: handleUpdateTour,
    getItinerary: handleGetItinerary,
    blockTour: handleBlockTour,
    getImages: handleGetImages,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};