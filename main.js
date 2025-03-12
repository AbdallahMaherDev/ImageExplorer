const accessKey = "7zo66wlXeJZ-_hmT1x_1wLGHz0e-J3oy_alUk_31Mbw";

const formEl = document.querySelector(".search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const showMoreButton = document.getElementById("show-more-button");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const resultsCountEl = document.getElementById("results-count");
const clearResultsButton = document.getElementById("clear-results");
const themeToggle = document.getElementById("theme-toggle");
const resultsInfo = document.querySelector(".results-info");

let inputData = "";
let page = 1;
let totalResults = 0;

// Debounce function to limit API calls during typing
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Fetch and display images from Unsplash API
async function searchImages() {
  inputData = searchInput.value.trim();
  if (!inputData) {
    errorEl.textContent = "Please enter a search term!";
    errorEl.classList.remove("hidden");
    searchResults.classList.remove("visible");
    showMoreButton.classList.remove("visible");
    resultsInfo.classList.remove("visible");
    return;
  }

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}&per_page=12`;

  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch images");
    const data = await response.json();
    totalResults = data.total;

    if (page === 1) {
      searchResults.innerHTML = "";
      resultsCountEl.textContent = "0";
    }

    if (data.results.length === 0) {
      errorEl.textContent = "No images found for this search.";
      errorEl.classList.remove("hidden");
      searchResults.classList.remove("visible");
      showMoreButton.classList.remove("visible");
      resultsInfo.classList.remove("visible");
      return;
    }

    data.results.forEach((result) => {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("search-result");
      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description || "Image";
      image.loading = "lazy";
      const imageLink = document.createElement("a");
      imageLink.href = result.links.html;
      imageLink.target = "_blank";
      imageLink.textContent = result.alt_description || "View on Unsplash";

      imageWrapper.appendChild(image);
      imageWrapper.appendChild(imageLink);
      searchResults.appendChild(imageWrapper);
    });

    const currentCount = document.querySelectorAll(".search-result").length;
    resultsCountEl.textContent = currentCount;

    // Show results, "Show More", and "Results Info" only if there are results
    searchResults.classList.add("visible");
    resultsInfo.classList.add("visible");
    showMoreButton.classList.toggle("visible", currentCount < totalResults);

    page++;
  } catch (error) {
    errorEl.textContent = `Error: ${error.message}`;
    errorEl.classList.remove("hidden");
    searchResults.classList.remove("visible");
    showMoreButton.classList.remove("visible");
    resultsInfo.classList.remove("visible");
  } finally {
    loadingEl.classList.add("hidden");
  }
}

// Event Listeners
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

showMoreButton.addEventListener("click", searchImages);

clearResultsButton.addEventListener("click", () => {
  searchResults.innerHTML = "";
  page = 1;
  searchInput.value = "";
  searchResults.classList.remove("visible");
  showMoreButton.classList.remove("visible");
  resultsInfo.classList.remove("visible");
  errorEl.classList.add("hidden");
});

// Debounced search on input typing
searchInput.addEventListener(
  "input",
  debounce(() => {
    page = 1;
    searchImages();
  }, 500)
);

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "light" : "dark";
  themeToggle.querySelector("i").classList.toggle("fa-moon");
  themeToggle.querySelector("i").classList.toggle("fa-sun");
});
