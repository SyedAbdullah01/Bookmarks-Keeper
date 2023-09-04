// Get DOM elements
const modal = document.getElementById('modal'); // Modal element
const modalShow = document.getElementById('show-modal'); // Button to show the modal
const closeModal = document.getElementById('close-modal'); // Button to close the modal
const bookmarkForm = document.getElementById('bookmark-form'); // Bookmark form element
const websiteNameEl = document.getElementById('website-name'); // Input for website name
const websiteUrlEl = document.getElementById('website-url'); // Input for website URL
const bookmarksContainer = document.getElementById('bookmarks-container'); // Container for bookmarks

let bookmarks = []; // Array to store bookmark objects

// Show the modal
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Event listeners for showing and closing the modal
modalShow.addEventListener('click', showModal);
closeModal.addEventListener('click', () => modal.classList.remove('show-modal'));

// Close the modal if clicked outside the modal content
window.addEventListener('click', (e) =>
  e.target === modal ? modal.classList.remove('show-modal') : false
);

// Validate the website name and URL
function Validate(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit both fields.');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid web address');
    return false;
  }
  return true;
}

// Build the bookmarks in the UI
function buildBookmarks() {
  bookmarksContainer.textContent = ''; // Clear the container
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    const item = document.createElement('div'); // Create a div for each bookmark
    item.classList.add('item');
    const closeIcon = document.createElement('i'); // Create a delete icon
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`); // Set onclick event to delete the bookmark
    const linkInfo = document.createElement('div'); // Create a div to hold the link information
    linkInfo.classList.add('name');
    const favicon = document.createElement('img'); // Create an image for the favicon
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');
    const link = document.createElement('a'); // Create a link for the bookmark
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    linkInfo.append(favicon, link); // Append the favicon and link to the linkInfo div
    item.append(closeIcon, linkInfo); // Append the delete icon and linkInfo to the bookmark div
    bookmarksContainer.appendChild(item); // Append the bookmark div to the bookmarks container
  });
}

// Fetch bookmarks from local storage
function fetchBookmarks() {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  }
  buildBookmarks();
}

// Delete a bookmark
function deleteBookmark(url) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1); // Remove the bookmark from the array
    }
  });
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); // Update the bookmarks in local storage
  fetchBookmarks(); // Rebuild the bookmarks in the UI
}

// Store a new bookmark
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('http' || 'https')) {
    urlValue = `https://${urlValue}`;
  }
  if (!Validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark); // Add the new bookmark to the array
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); // Update the bookmarks in local storage
  fetchBookmarks(); // Rebuild the bookmarks in the UI
  bookmarkForm.reset(); // Reset the form
  websiteNameEl.focus(); // Set focus to the website name input
}

// Event listener for submitting the bookmark form
bookmarkForm.addEventListener('submit', storeBookmark);

// Fetch bookmarks when the page loads
fetchBookmarks();
