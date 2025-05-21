// main.js

// Import necessary functions and state variables from other modules.
import { currentDate, normalizeDate, getLikedImages, setCurrentDate } from './storage.js';
import { updateLikedImagesList } from './eventHandlers.js'; // Move the UI update logic there.
import { fetchAndDisplayAPOD } from './api.js';

/**
 * Initializes the application once the window has fully loaded.
 */
window.onload = async () => {
  // Normalize today's date to ensure consistency in date formatting.
  const today = normalizeDate(new Date());
  
  // Check if the currentDate is set to a future date.
  if (currentDate.getTime() > today.getTime()) {
    setCurrentDate(today); // Reset currentDate to today if it's in the future.
  }

  // Fetch and display the Astronomy Picture of the Day (APOD) for the current date.
  const success = await fetchAndDisplayAPOD(currentDate);
  
  // If fetching the APOD was unsuccessful, alert the user.
  if (!success) {
    alert("Today's content is not available yet. Try exploring earlier dates.");
  }

  // Update the list of liked images in the UI.
  updateLikedImagesList();
};
