const movieList = document.querySelector(".movie-list");
const inputEl = document.querySelector("input[type='text']");
const searchBtn = document.querySelector(".search-btn");
const loader = document.getElementById("loader");
document.addEventListener("DOMContentLoaded", function () {
  const inputEl = document.querySelector("input[type='text']");
  inputEl.focus();
});
searchBtn.addEventListener("click", searchDatabase);
inputEl.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    searchDatabase();
  }
});
async function searchDatabase() {
  console.log(inputEl.value);

  try {
    loader.style.display = "flex"; // Show loader

    const res = await fetch(
      `https://www.omdbapi.com/?s=${inputEl.value}&apikey=78687159`
    );
    const data = await res.json();

    if (data.Response === "True") {
      movieList.innerHTML = ""; // Clear the list before displaying new results

      const fetchMovieDetails = data.Search.map((movie) =>
        fetch(`https://www.omdbapi.com/?t=${movie.Title}&apikey=78687159`).then(
          (res) => res.json()
        )
      );

      const movieDetails = await Promise.all(fetchMovieDetails);

      let anyMovieDisplayed = false; // Flag to track if any movie is displayed

      movieDetails.forEach((movieData) => {
        if (
          movieData.Response === "True" &&
          movieData.Poster !== "N/A" &&
          movieData.Title !== "N/A" &&
          movieData.Plot !== "N/A"
        ) {
          anyMovieDisplayed = true; // Set flag to true if a movie is displayed
          console.log(movieData);
          movieList.innerHTML += `
             <div class="movie-item" data-id="${movieData.imdbID}">
               <div class="movie-poster">
                 <img src="${movieData.Poster}" alt="movie-poster" />
               </div>
               <div class="movie-list-container">
                 <div class="movie-list-contents">
                   <div class="movie-name">
                     <h3>${movieData.Title}</h3>
                     <div class="movie-rating">
                       <img src="images/imdb-rating.png" alt="star-rating" />
                       <p>${movieData.imdbRating}</p>
                     </div>
                   </div>
                   <div class="movie-details">
                         <p>${movieData.Runtime}</p>
                         <p>${movieData.Genre}</p>
                   </div>
                   <div class="movie-about">
                     <p>${movieData.Plot}</p>
                   </div>
                   <div class="add-watchlist">
                     <button class="add-watchlist-btn" data-id="${movieData.imdbID}">Add to watchlist</button>
                   </div>
                 </div>
               </div>
             </div>
             <hr>
           `;
        }
      });

      if (!anyMovieDisplayed) {
        movieList.innerHTML = `<p class="data-error">Unable to find what you're looking for.<br> Please be specific and try another search.</p>`;
      }

      configureWatchlistButtons(); // Configure the watchlist buttons after the list is updated
    } else {
      movieList.innerHTML = `<p class="data-error">Unable to find what you're looking for.<br> Please be specific and try another search.</p>`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    movieList.innerHTML = `<p class="data-error">An error occurred. Please try again later.</p>`;
  } finally {
    loader.style.display = "none"; // Hide loader
  }

  inputEl.value = "";
}

function configureWatchlistButtons() {
  const watchlistButtons = document.querySelectorAll(".add-watchlist-btn");
  watchlistButtons.forEach((button) => {
    button.addEventListener("click", addToWatchlist);
  });
}

function addToWatchlist(event) {
  const movieId = event.target.getAttribute("data-id");
  const movieItem = document.querySelector(`.movie-item[data-id="${movieId}"]`);
  const movieTitle = movieItem.querySelector(".movie-name h3").innerText;
  const moviePoster = movieItem.querySelector(".movie-poster img").src;
  const movieRating = movieItem.querySelector(".movie-rating p").innerText;
  const movieRuntime = movieItem.querySelector(
    ".movie-details p:nth-child(1)"
  ).innerText;
  const movieGenre = movieItem.querySelector(
    ".movie-details p:nth-child(2)"
  ).innerText;
  const moviePlot = movieItem.querySelector(".movie-about p").innerText;

  console.log(`Adding to watchlist: ${movieTitle}`);

  // Add the movie to the watchlist (you can store it in localStorage or send it to a backend server)
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist.push({
    id: movieId,
    title: movieTitle,
    poster: moviePoster,
    plot: moviePlot,
    runtime: movieRuntime,
    genre: movieGenre,
    imdbRating: movieRating,
  });
  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  // Replace the button with a text element
  const addWatchlistDiv = event.target.parentElement;
  addWatchlistDiv.innerHTML = `<p class="added-text">"Added to watchlist, enjoy!"</p>`;
  addWatchlistDiv.style.border = "none";
}
