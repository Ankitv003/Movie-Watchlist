// const movieList = document.querySelector(".movie-list");
// const inputEl = document.querySelector("input[type='text']");
// const searchBtn = document.querySelector(".search-btn");
// searchBtn.addEventListener("click", searchDatabase);

// function searchDatabase() {
//   console.log(inputEl.value);

//   fetch(`https://www.omdbapi.com/?t=${inputEl.value}&apikey=78687159`)
//     .then((res) => res.json())
//     .then((data) =>
//       console.log(data)(
//         (movieList.innerHTML = `
//         <div class="movie-poster">
//             <img src="${data.Poster}" alt="movie-poster" />
//         </div>
//     <div class="movie-list-container">
//         <div class="movie-list-contents">
//             <div class="movie-name">
//                 <h3>${data.Title}</h3>
//                 <div class="movie-rating">
//                     <img src="images/imdb-rating.png" alt="star-rating" />
//                     <p>${data.imdbRating}</p>
//                 </div>
//             </div>
//             <div class="movie-details">
//                 <p>${data.Runtime}</p>
//                 <p>${data.Genre}</p>
//             </div>
//             <div class="movie-about">
//                 <p>${data.Plot}</p>
//             </div>
//             <div class="add-watchlist">
//                 <button>Add to watchlist</button>
//             </div>
//         </div>
//     </div>

//     <hr>

// `)
//       )
//     );
//   inputEl.value = "";
// }

const movieList = document.querySelector(".movie-list");
const inputEl = document.querySelector("input[type='text']");
const searchBtn = document.querySelector(".search-btn");
searchBtn.addEventListener("click", searchDatabase);

function searchDatabase() {
  console.log(inputEl.value);

  fetch(`https://www.omdbapi.com/?s=${inputEl.value}&apikey=78687159`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.Response === "True") {
        movieList.innerHTML = ""; // Clear the list before displaying new results
        let anyMovieDisplayed = false; // Flag to track if any movie is displayed

        const moviePromises = data.Search.map((movie) =>
          fetch(`https://www.omdbapi.com/?t=${movie.Title}&apikey=78687159`)
            .then((res) => res.json())
            .then((movieData) => {
              if (
                movieData.Response === "True" &&
                movieData.Poster !== "N/A" &&
                movieData.Title !== "N/A" &&
                movieData.Plot !== "N/A"
              ) {
                anyMovieDisplayed = true; // Set flag to true if a movie is displayed

                movieList.innerHTML += `
                  <div class="movie-item">
                    <div class="movie-poster">
                      <img src="${movieData.Poster}" alt="movie-poster" />
                    </div>
                    <div class="movie-list-container">
                      <div class="movie-list-contents">
                        <div class="movie-name">
                          <h3>${movieData.Title}</h3>
                          ${
                            movieData.imdbRating &&
                            movieData.imdbRating !== "N/A"
                              ? `
                          <div class="movie-rating">
                            <img src="images/imdb-rating.png" alt="star-rating" />
                            <p>${movieData.imdbRating}</p>
                          </div>`
                              : ""
                          }
                        </div>
                        <div class="movie-details">
                          ${
                            movieData.Runtime && movieData.Runtime !== "N/A"
                              ? `<p>${movieData.Runtime}</p>`
                              : ""
                          }
                          ${
                            movieData.Genre && movieData.Genre !== "N/A"
                              ? `<p>${movieData.Genre}</p>`
                              : ""
                          }
                        </div>
                        <div class="movie-about">
                          <p>${movieData.Plot}</p>
                        </div>
                        <div class="add-watchlist">
                          <button>Add to watchlist</button>
                        </div>
                      </div>
                    </div>
                    <hr>
                  </div>
                `;
              }
            })
        );

        // Once all fetch requests are complete, check if any movie was displayed
        Promise.all(moviePromises).then(() => {
          if (!anyMovieDisplayed) {
            movieList.innerHTML = `<p class="data-error">Unable to find what you're looking for.<br>
             Please be specific and try another search.</p>`;
          }
        });
      } else {
        movieList.innerHTML = `<p class="data-error">Unable to find what you're looking for.<br>please be specific and try another search.</p>`;
      }
    });
  inputEl.value = "";
}
