fetch("https://www.omdbapi.com/?i=tt3896198&apikey=78687159")
  .then((res) => res.json)
  .then((data) => console.log(data));
