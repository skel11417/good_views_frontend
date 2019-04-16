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

function renderSearchPosters(omdbObj){
  let posterDiv = document.querySelector("#posters");
  posterDiv.innerHTML = "";
  let movies = omdbObj["Search"]
  movies.forEach(renderSearchPoster)
}

function renderSearchPoster(movieObj){
  let posterContainer = document.querySelector("#posters");

  // let link = document.createElement('a');
  // link.dataset.lightbox = movieObj["Poster"]
  // link.pathname = movieObj["Poster"]
  // '<a href="images/image-1.jpg" data-lightbox="image-1" data-title="My caption">Image #1</a>'

  // let image = document.createElement("img");
  // image.dataset.id = movieObj["imdbID"]
  // image.src = movieObj["Poster"];
  // image.alt = movieObj["Title"]
  posterContainer.appendChild(link);
}

// function renderPoster(movie) {
//   let posterDiv = document.querySelector("#poster");
//   let image = document.createElement("img");
//   posterDiv.innerHTML = "";
//   image.src = movie.poster;
//   posterDiv.appendChild(image);
// }
