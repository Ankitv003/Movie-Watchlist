const movieList = document.querySelector(".movie-list");

fetch("https://www.omdbapi.com/?i=tt3896198&apikey=78687159")
  .then((res) => res.json())
  .then((data) =>
    console.log(data)(
      (movieList.innerHTML = `
        <div class="movie-poster">
            <img src="${data.Poster}" alt="movie-poster" />
        </div>
    <div class="movie-list-container">
        <div class="movie-list-contents">
            <div class="movie-name">
                <h3>${data.Title}</h3>
                <div class="movie-rating">
                    <img src="images/imdb-rating.png" alt="star-rating" />
                    <p>${data.imdbRating}</p>
                </div>
            </div>
            <div class="movie-details">
                <p>${data.Runtime}</p>
                <p>${data.Genre}</p>
            </div>
            <div class="movie-about">
                <p>${data.Plot}</p>
            </div>
            <div class="add-watchlist">
                <button>Add to watchlist</button>
            </div>
        </div>
    </div>
    
    <hr>

`)
    )
  );
