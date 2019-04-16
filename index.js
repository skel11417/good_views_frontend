document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  const form = document.querySelector("form");
  form.addEventListener("submit", searchMovies);
}

function searchMovies(event) {
  event.preventDefault();
  const title = event.target.title.value;
  const url = `http://localhost:3000/movies/?title=${title}`;
  fetch(url)
    .then(resp => resp.json())
    .then(renderSearchPosters);
  event.target.reset();
}

function renderSearchPosters(omdbObj) {
  let posterDiv = document.querySelector("#main");
  posterDiv.innerHTML = "";
  let movies = omdbObj["Search"];
  movies.forEach(renderSearchPoster);
}

function renderSearchPoster(movieObj) {
  let posterContainer = document.querySelector("#main");

  // let link = document.createElement('a');
  // link.dataset.id = movieObj["imdbID"]
  // link.href = movieObj["imdbID"]

  let image = document.createElement("img");
  image.src = movieObj["Poster"];
  image.alt = movieObj["Title"];
  image.dataset.id = movieObj["imdbID"];
  image.addEventListener("click", posterClickHandler);
  // link.appendChild(image)
  // posterContainer.appendChild(link);
  posterContainer.appendChild(image);
}

// function renderPoster(movie) {
//   let posterDiv = document.querySelector("#poster");
//   let image = document.createElement("img");
//   posterDiv.innerHTML = "";
//   image.src = movie.poster;
//   posterDiv.appendChild(image);
// }

function posterClickHandler(event) {
  event.preventDefault();
  let imdbID = event.target.dataset.id;
  const url = `http://localhost:3000/movies/${imdbID}`;
  fetch(url)
    .then(resp => resp.json())
    .then(showMovie);
}

function showMovie(movie) {
  let main = document.getElementById("main");
  main.innerHTML = "";
  let movieDiv = document.createElement("div");
  let poster = document.createElement("img");
  poster.src = movie.poster;
  movieDiv.appendChild(poster);
  main.appendChild(movieDiv);
}
