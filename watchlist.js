document.addEventListener("DOMContentLoaded", function() {
    const watchListSection = document.querySelector(".watch-list");
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  
    if (watchlist.length === 0) {
      watchListSection.innerHTML = `
        <p>Your watchlist is looking a little empty...</p>
        <div>
          <a class="add-content" href="index.html">
            <img class="add-icon" src="images/add-icon-light.png" alt="add-icon" />
            <p>Let’s add some movies!</p>
          </a>
        </div>
      `;
    } else {
      watchListSection.innerHTML = '';
      watchlist.forEach(movie => {
        watchListSection.innerHTML += `
          <div class="movie-item" data-id="${movie.id}">
            <div class="movie-poster">
              <img src="${movie.poster}" alt="movie-poster" />
            </div>
            <div class="movie-list-container">
              <div class="movie-list-contents">
                <div class="movie-name">
                  <h3>${movie.title}</h3>
                </div>
                <div class="movie-about">
                  <p>${movie.plot}</p>
                </div>
                <div class="remove-watchlist">
                  <button class="remove-watchlist-btn" data-id="${movie.id}">Remove from watchlist</button>
                </div>
              </div>
            </div>
            <hr>
          </div>
        `;
      });
  
      configureRemoveButtons(); // Configure the remove buttons after the list is updated
    }
  });
  
  function configureRemoveButtons() {
    const removeButtons = document.querySelectorAll(".remove-watchlist-btn");
    removeButtons.forEach(button => {
      button.addEventListener("click", removeFromWatchlist);
    });
  }
  
  function removeFromWatchlist(event) {
    const movieId = event.target.getAttribute("data-id");
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(movie => movie.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  
    // Remove the movie item from the DOM
    const movieItem = document.querySelector(`.movie-item[data-id="${movieId}"]`);
    movieItem.parentElement.removeChild(movieItem);
  
    // If the watchlist is now empty, display the empty message
    const watchListSection = document.querySelector(".watch-list");
    if (watchlist.length === 0) {
      watchListSection.innerHTML = `
        <p>Your watchlist is looking a little empty...</p>
        <div>
          <a class="add-content" href="index.html">
            <img class="add-icon" src="images/add-icon-light.png" alt="add-icon" />
            <p>Let’s add some movies!</p>
          </a>
        </div>
      `;
    }
  }
  