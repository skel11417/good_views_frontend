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
  let titleH = document.createElement("h2");
  let poster = document.createElement("img");
  let movieDetails = document.createElement("ul");
  let year = document.createElement("li");
  let rated = document.createElement("li");
  let director = document.createElement("li");
  let actors = document.createElement("li");

  movieDiv.dataset.id = movie.id;
  titleH.innerText = movie.title;
  year.innerText = `Released: ${movie.year}`;
  rated.innerText = `Rated: ${movie.rated}`;
  director.innerText = `Directed by: ${movie.director}`;
  actors.innerText = `Starring: ${movie.actors}`;
  poster.src = movie.poster;
  let ratingDiv = document.createElement("div");
  let star1 = document.createElement("span");
  let star2 = document.createElement("span");
  let star3 = document.createElement("span");
  let star4 = document.createElement("span");
  let star5 = document.createElement("span");
  let ratingHead = document.createElement("h5");

  star1.dataset.id = "1";
  star1.className = "fa fa-star";
  star2.dataset.id = "2";
  star2.className = "fa fa-star";
  star3.dataset.id = "3";
  star3.className = "fa fa-star";
  star4.dataset.id = "4";
  star4.className = "fa fa-star";
  star5.dataset.id = "5";
  star5.className = "fa fa-star";
  ratingHead.innerText = "Rate this Movie!";

  ratingDiv.append(ratingHead, star1, star2, star3, star4, star5);

  movieDetails.append(year, rated, director, actors);
  movieDiv.append(titleH, poster, movieDetails, ratingDiv);
  main.appendChild(movieDiv);
  let review = ratedByUser(movie, 1);
  if (review) {
    renderStars(review);
  } else {
    document.querySelectorAll(".fa").forEach(star => {
      star.addEventListener("click", rateMovie);
    });
  }
}

function ratedByUser(movie, user) {
  let rated = false;
  movie.reviews.forEach(review => {
    if (review.user_id == user) {
      rated = review;
    }
  });
  return rated;
}

function renderStars(review) {
  let rating = review.rating;
  let stars = Array.prototype.slice
    .call(document.querySelectorAll(".fa"))
    .slice(0, rating);
  stars.forEach(star => {
    star.className += " checked";
  });
}

function rateMovie(event) {
  let rating = event.target.dataset.id;
  let movieId = event.target.parentElement.parentElement.dataset.id;

  const url = `http://localhost:3000/reviews`;
  fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json", Allow: "application/json" },
    body: JSON.stringify({ user_id: "1", movie_id: movieId, rating: rating })
  })
    .then(resp => resp.json())
    .then(review => {
      renderStars(review);
      document.querySelectorAll(".fa").forEach(star => {
        star.removeEventListener("click", rateMovie);
      });
    });
}

// function ratingCheck() {}
