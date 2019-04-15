document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  const form = document.querySelector("form");
  form.addEventListener("submit", getMovies);
}

function getMovies(event) {
  event.preventDefault();
  const title = event.target.title.value;
  const url = `http://localhost:3000/movies/?title=${title}`;
  fetch(url)
    .then(resp => resp.json())
    .then(renderPoster);
  event.target.reset();
}

function renderPoster(movie) {
  let posterDiv = document.querySelector("#poster");
  let image = document.createElement("img");
  posterDiv.innerHTML = "";
  image.src = movie.poster;

  posterDiv.appendChild(image);
}
