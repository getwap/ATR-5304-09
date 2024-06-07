// ****** Repetitive small scripts ****** //
const searchInput = document.getElementById('search-options');
const searchDropdown = document.getElementById('search-dropdown');

const handleSearch = debounce(async () => {
  const query = searchInput.value.trim();
  if (query) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/search-vault?query=${encodeURIComponent(query)}`, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          const searchResults = JSON.parse(xhr.responseText);
          searchDropdown.innerHTML = '';
          const sitesHeader = document.createElement('div');
          sitesHeader.classList.add('dropdown-header', 'mt-2');
          const sitesHeading = document.createElement('h6');
          sitesHeading.classList.add('text-overflow', 'text-muted', 'mb-1', 'text-uppercase');
          sitesHeading.textContent = 'Sites';
          sitesHeader.appendChild(sitesHeading);
          searchDropdown.appendChild(sitesHeader);
          searchResults.forEach((result) => {
            const resultElement = document.createElement('a');
            resultElement.classList.add('dropdown-item');
            resultElement.textContent = `${result.url}`;
            resultElement.href = result.url;
            resultElement.target = '_blank';
            searchDropdown.appendChild(resultElement);
          });
        }
      };
      xhr.send();
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  } else {
    searchDropdown.innerHTML = '';
  }
}, 300);

searchInput.addEventListener('input', handleSearch);

function debounce(func, delay) {
    let timeoutId;
  
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

// Function to format texts
function formatMTMText(text, element, maxLength, number) {
    if (text != '' && text.length > maxLength) {
        text = replaceAt(text, number, "...");
    }
    if (element != null || element != undefined) {
      element.innerHTML = text;
    } else {
        return text;
    }
}

function removeURLPrefix(url) {
    // Define regular expression to match "https://", "http://", or "www"
    const regex = /^(https?:\/\/)?(www\.)?/i;
    // Replace the matched prefixes with an empty string
    return url.replace(regex, '');
  }

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true
    };
    return date.toLocaleString(undefined, options);
}

function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);

    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    // Add leading zeros if necessary
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const formattedHours12 = hours % 12 || 12;

    // Construct the formatted date and time string
    const formattedDateTime = `${formattedMonth}/${formattedDay}/${year} ${formattedHours12}:${formattedMinutes} ${period}`;

    return formattedDateTime;
}  

// Function to replace string at a specific position
function replaceAt(string, index, replace) {
    return string.substring(0, index) + replace;
}

// Function to show the scrollbar
function resetScrollbar() {
    document.body.style.overflowY = 'auto'; 
    document.body.style.overflowX = 'none';
}

function isValidURL(url) {
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-z0-9-]+)\.([a-z]{2,})(\.[a-z]{2,})?$/i;
    return urlPattern.test(url);
}

function showSweetAlert(title, text, icon, confirmButtonText) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      buttonsStyling: false,
      confirmButtonText: confirmButtonText,
      showCloseButton: false,
      customClass: {
        confirmButton: 'btn btn-success'
      },
    });
  }