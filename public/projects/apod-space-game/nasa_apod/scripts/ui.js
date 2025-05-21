// ui.js

// Select and export the APOD image element from the DOM.
export const apodImage = document.getElementById('apod-image');

// Select and export the APOD title element from the DOM.
export const apodTitle = document.getElementById('apod-title');

// Select and export the APOD date element from the DOM.
export const apodDate = document.getElementById('apod-date');

// Select and export the APOD description element from the DOM.
export const apodDescription = document.getElementById('apod-description');

// Export an object to track the current media type (image or video).
export const currentMediaType = { type: '' };

/**
 * Displays the loading state in the UI by hiding the image and showing loading messages.
 */
export function showLoadingState() {
  apodImage.style.display = 'none'; // Hide the APOD image.
  apodTitle.textContent = 'Loading...'; // Set the title to indicate loading.
  apodDate.textContent = ''; // Clear the date text.
  apodDescription.textContent = 'Please wait while we fetch the data.'; // Show a loading message.
}

/**
 * Displays a state indicating that no image is available for the selected date.
 *
 * @param {Date} date - The date for which no image is available.
 */
export function showNoImageState(date) {
  apodImage.style.display = 'none'; // Hide the APOD image.
  apodTitle.textContent = 'No image available.'; // Set the title to indicate absence of image.
  apodDate.textContent = date.toISOString().split('T')[0]; // Display the selected date.
  apodDescription.textContent = 'Try navigating to a different date.'; // Suggest navigating to another date.
}

/**
 * Clears the video container from the UI by removing the video iframe if it exists.
 */
export function clearVideoContainer() {
  const videoContainer = document.getElementById('video-container'); // Select the video container element.
  if (videoContainer) { // Check if the video container exists.
    videoContainer.remove(); // Remove the video container from the DOM.
  }
}
