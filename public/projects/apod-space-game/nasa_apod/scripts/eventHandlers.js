// eventHandlers.js

// Import necessary functions and elements from other modules.
import { fetchAndDisplayAPOD, changeDate } from './api.js';
import { currentDate, setCurrentDate, formatDate, normalizeDate, getLikedImages, setLikedImages, saveBackground, getBackgrounds } from './storage.js';
import { apodImage, apodTitle, apodDate, apodDescription, currentMediaType } from './ui.js';

// Select DOM elements for interaction.
const prevBtn = document.getElementById('prev-btn'); // Previous button element.
const nextBtn = document.getElementById('next-btn'); // Next button element.
const likeBtn = document.getElementById('like-btn'); // Like button element.
const likedImagesList = document.getElementById('liked-images-list'); // List container for liked images.
const dateInput = document.getElementById('date-input'); // Date input field.
const searchBtn = document.getElementById('search-btn'); // Search button element.
const sortOptions = document.getElementById('sort-options'); // Sort options dropdown.

const backgroundLevelSelect = document.getElementById('background-level'); // Background level selection dropdown.
const setBackgroundBtn = document.getElementById('set-background-btn'); // Set background button element.

// -----------------------------------------------------------------------------
// Functions Related to Liked Images and Updating the UI
// -----------------------------------------------------------------------------

/**
 * Updates the list of liked images in the UI.
 */
export function updateLikedImagesList() {
  likedImagesList.innerHTML = ''; // Clear the existing list.
  const likedImages = getLikedImages(); // Retrieve liked images from storage.
  
  likedImages.forEach(image => {
    const listItem = document.createElement('li'); // Create a list item element.
    listItem.className = 'liked-image-item'; // Assign a class for styling.

    const imgElement = document.createElement('img'); // Create an image element.
    imgElement.src = image.isVideo ? 'assets/images/video_icon.png' : image.url; // Set the source based on media type.
    imgElement.alt = image.title; // Set alt text for accessibility.
    imgElement.className = 'liked-thumbnail'; // Assign a class for styling.

    const textElement = document.createElement('span'); // Create a span element for text.
    textElement.textContent = `${image.date}: ${image.title}`; // Set the text content.

    const deleteButton = document.createElement('button'); // Create a delete button.
    deleteButton.textContent = 'Delete'; // Set the button text.
    deleteButton.className = 'delete-btn'; // Assign a class for styling.
    deleteButton.addEventListener('click', (e) => { // Add click event listener.
      e.stopPropagation(); // Prevent event bubbling.
      removeLikedImage(image.date); // Remove the liked image.
    });

    listItem.addEventListener('click', async () => { // Add click event listener to list item.
      const dateComponents = image.date.split('-'); // Split the date string.
      const utcDate = new Date(Date.UTC(
        parseInt(dateComponents[0], 10),
        parseInt(dateComponents[1], 10) - 1,
        parseInt(dateComponents[2], 10)
      )); // Create a UTC date object.

      const success = await fetchAndDisplayAPOD(utcDate, true); // Fetch and display the APOD.
      if (success) {
        setCurrentDate(utcDate); // Update the current date state.
      } else {
        alert('Failed to load the selected image. Try another.'); // Alert the user on failure.
      }
    });

    listItem.appendChild(imgElement); // Append the image to the list item.
    listItem.appendChild(textElement); // Append the text to the list item.
    listItem.appendChild(deleteButton); // Append the delete button to the list item.
    likedImagesList.appendChild(listItem); // Append the list item to the liked images list.
  });
}

/**
 * Saves the list of liked images and updates the UI.
 *
 * @param {Array} images - The array of liked images to save.
 */
function saveLikedImagesList(images) {
  setLikedImages(images); // Save the liked images to storage.
  updateLikedImagesList(); // Update the liked images list in the UI.
}

/**
 * Removes a liked image based on its date.
 *
 * @param {string} imageDate - The date of the image to remove.
 */
function removeLikedImage(imageDate) {
  const likedImages = getLikedImages().filter(image => image.date !== imageDate); // Filter out the image to remove.
  saveLikedImagesList(likedImages); // Save the updated list.
}

/**
 * Adds the current image to the list of liked images.
 */
function likeCurrentImage() {
  const likedImages = getLikedImages(); // Retrieve liked images from storage.
  const currentDateStr = apodDate.textContent; // Get the current APOD date.
  if (!currentDateStr) return; // Exit if no date is present.

  const currentImage = {
    date: currentDateStr, // Set the image date.
    title: apodTitle.textContent, // Set the image title.
    url: (apodImage.style.display === 'none') ? 'assets/images/video_icon.png' : apodImage.src, // Set the image URL based on media type.
    isVideo: apodImage.style.display === 'none', // Determine if the media is a video.
  };

  const isDuplicate = likedImages.some(image => image.date === currentImage.date); // Check for duplicates.
  if (!isDuplicate) {
    likedImages.push(currentImage); // Add the new image to the list.
    saveLikedImagesList(likedImages); // Save and update the UI.
  } else {
    console.warn("Image already liked:", currentImage); // Log a warning for duplicates.
  }
}

/**
 * Sorts the liked images based on the selected criteria.
 *
 * @param {string} criteria - The criteria to sort by.
 */
function sortLikedImages(criteria) {
  const likedImages = getLikedImages(); // Retrieve liked images from storage.
  switch (criteria) { // Determine sorting based on criteria.
    case 'date-asc':
      likedImages.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by ascending date.
      break;
    case 'date-desc':
      likedImages.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by descending date.
      break;
    case 'type-image':
      likedImages.sort((a, b) => (a.isVideo === b.isVideo ? 0 : a.isVideo ? 1 : -1)); // Sort images before videos.
      break;
    case 'type-video':
      likedImages.sort((a, b) => (a.isVideo === b.isVideo ? 0 : a.isVideo ? -1 : 1)); // Sort videos before images.
      break;
  }
  saveLikedImagesList(likedImages); // Save and update the UI.
}

// -----------------------------------------------------------------------------
// Event Listeners for Sorting, Navigation, and Interactions
// -----------------------------------------------------------------------------

// Add change event listener to the sort options dropdown.
sortOptions.addEventListener('change', (e) => {
  sortLikedImages(e.target.value); // Sort the liked images based on selected value.
});

// Add click event listeners to the previous and next buttons.
prevBtn.addEventListener('click', () => changeDate(-1, currentDate, setCurrentDate, fetchAndDisplayAPOD)); // Navigate to the previous date.
nextBtn.addEventListener('click', () => changeDate(1, currentDate, setCurrentDate, fetchAndDisplayAPOD)); // Navigate to the next date.

// Add click event listener to the like button.
likeBtn.addEventListener('click', likeCurrentImage); // Like the current image.

// Add keydown event listener for arrow key navigation.
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') changeDate(-1, currentDate, setCurrentDate, fetchAndDisplayAPOD); // Navigate to the previous date with left arrow.
  if (event.key === 'ArrowRight') changeDate(1, currentDate, setCurrentDate, fetchAndDisplayAPOD); // Navigate to the next date with right arrow.
});

// Add click event listener to the search button.
searchBtn.addEventListener('click', async () => {
  const inputDate = dateInput.value.trim(); // Get the input date.
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(inputDate); // Validate the date format.

  if (isValidDate) {
    const [year, month, day] = inputDate.split('-').map(Number); // Split the date components.
    const selectedDate = normalizeDate(new Date(year, month - 1, day)); // Create a normalized date object.
    const today = normalizeDate(new Date()); // Get today's date.

    if (selectedDate.getTime() > today.getTime()) { // Check if the selected date is in the future.
      alert("Our telescopes can't look into the future!!"); // Alert the user.
      return; // Exit the function.
    }

    const success = await fetchAndDisplayAPOD(selectedDate, true); // Fetch and display the APOD for the selected date.
    if (success) {
      setCurrentDate(selectedDate); // Update the current date state.
    }
  } else {
    alert('Please enter a valid date in the format YYYY-MM-DD.'); // Alert the user for invalid date format.
  }
});

// Add keydown event listener to the date input for handling the Enter key.
dateInput.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') { // Check if the Enter key was pressed.
    const inputDate = dateInput.value.trim(); // Get the input date.
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(inputDate); // Validate the date format.

    if (isValidDate) {
      const [year, month, day] = inputDate.split('-').map(Number); // Split the date components.
      const selectedDate = normalizeDate(new Date(year, month - 1, day)); // Create a normalized date object.
      const today = normalizeDate(new Date()); // Get today's date.

      if (selectedDate.getTime() > today.getTime()) { // Check if the selected date is in the future.
        alert("Our telescopes can't look into the future!!"); // Alert the user.
        return; // Exit the function.
      }

      const success = await fetchAndDisplayAPOD(selectedDate, true); // Fetch and display the APOD for the selected date.
      if (success) {
        setCurrentDate(selectedDate); // Update the current date state.
      }
    } else {
      alert('Please enter a valid date in the format YYYY-MM-DD.'); // Alert the user for invalid date format.
    }
  }
});

// Add click event listener to the set background button.
setBackgroundBtn.addEventListener('click', () => {
  if (currentMediaType.type === 'video') { // Check if the current media is a video.
    alert('Cannot set a video as a background. Please select an image.'); // Alert the user.
    return; // Exit the function.
  }
  const selectedLevel = backgroundLevelSelect.value; // Get the selected background level.
  const selectedDate = apodDate.textContent; // Get the current APOD date.
  if (!selectedDate) { // Check if a date is selected.
    alert('No image selected. Please navigate to a valid date.'); // Alert the user.
    return; // Exit the function.
  }
  saveBackground(selectedLevel, selectedDate); // Save the selected background.
  const formattedLevel = selectedLevel.replace('level', 'Level '); // Format the background level text.
  alert(`Image set to ${formattedLevel}`); // Alert the user of the successful background set.
});

// -----------------------------------------------------------------------------
// Initialization Function to Set Up Event Handlers and Initial State
// -----------------------------------------------------------------------------

/**
 * Initializes event handlers and updates the liked images UI.
 *
 * @param {Function} initialFetchFunc - The initial function to fetch and display APOD.
 * @param {Function} updateLikedImagesUI - The function to update the liked images UI.
 */
export function initializeEventHandlers(initialFetchFunc, updateLikedImagesUI) {
  // Update the liked images list in the UI.
  updateLikedImagesUI();
  
  // Perform the initial fetch to display today's APOD.
  initialFetchFunc();
}
