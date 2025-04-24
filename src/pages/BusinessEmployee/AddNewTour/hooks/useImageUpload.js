import { useState } from 'react';
import { MAX_IMAGES } from "../../../../utils/maxImageUpload";
export const useImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [displayImages, setDisplayImages] = useState([]);
  
  console.log("selectedImages: ", selectedImages);
  console.log("displayImages: ", displayImages);
  // Handle file input change
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
  };

  // Process image files
  const processFiles = (files) => {
    const newImages = [];
    const newUrls = [];
    
    Array.from(files).forEach(file => {
      if (file.type.match('image.*')) {
        newImages.push(file);
        newUrls.push(URL.createObjectURL(file));
      } else {
        alert('Chỉ chấp nhận file ảnh. File "' + file.name + '" không phải là ảnh.');
      }
    });
    
    // Check maximum image count
    if (selectedImages.length + newImages.length > MAX_IMAGES) {
      alert(`Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }
    
    setSelectedImages([...selectedImages, ...newImages]);
    setDisplayImages([...displayImages, ...newUrls]);
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };
  
  // Handle drag leave event
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };
  
  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  // Remove image at specific index
  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    const updatedDisplayImages = [...displayImages];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(updatedDisplayImages[index]);
    
    updatedImages.splice(index, 1);
    updatedDisplayImages.splice(index, 1);
    
    setSelectedImages(updatedImages);
    setDisplayImages(updatedDisplayImages);
  };

  return {
    selectedImages,
    displayImages,
    setSelectedImages,
    setDisplayImages,
    handleImageUpload,
    processFiles,
    removeImage,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}; 