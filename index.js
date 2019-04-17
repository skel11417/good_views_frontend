document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  const form = document.querySelector("form");
  form.addEventListener("submit", searchMovies);

  loadRecent();
}

function loadRecent() {
  fetch("http://localhost:3000/users/?recent=true")
    .then(resp => resp.json())
    .then(movies => {
      movies.forEach(renderRecentMovie);
    });
}

function renderRecentMovie(movie) {
  let mainDiv = document.querySelector("#main");
  let image = document.createElement("img");
  image.src = movie.poster;
  image.dataset.id = movie.imdb_id;
  image.addEventListener("click", posterClickHandler);
  mainDiv.appendChild(image);
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

function renderSearchPosters(movies) {
  let mainDiv = document.querySelector("#main");
  mainDiv.innerHTML = "";
  movies.forEach(renderSearchPoster);
}

function renderSearchPoster(movieObj) {
  let mainDiv = document.querySelector("#main");
  let card = document.createElement("article");
  card.className = "card";
  mainDiv.appendChild(card);

  let thumbnail = document.createElement('figure')
  thumbnail.className = "thumbnail"

  let image = document.createElement("img");
  image.src = movieObj["Poster"];
  image.alt = movieObj["Title"];
  image.dataset.id = movieObj["imdbID"];

  thumbnail.appendChild(image)

  let cardContent = document.createElement('div')
  cardContent.className = "card-content"

  let movieTitle = document.createElement('p')
  movieTitle.innerText = movieObj["Title"]
  
  cardContent.appendChild(movieTitle)
  card.append(thumbnail, cardContent)
  image.addEventListener("click", posterClickHandler);
}

function posterClickHandler(event) {
  event.preventDefault();
  let imdbID = event.target.dataset.id;
  const url = `http://localhost:3000/movies/${imdbID}`;
  fetch(url)
    .then(resp => resp.json())
    .then(showMovie);
}

function showMovie(movie) {
  // Clear container div
  let mainDiv = document.getElementById("main");
  mainDiv.innerHTML = "";
  // Create movie elements
  let movieDiv = document.createElement("div");
  let titleH = document.createElement("h2");
  let poster = document.createElement("img");
  let movieDetails = document.createElement("ul");
  let year = document.createElement("li");
  let rated = document.createElement("li");
  let director = document.createElement("li");
  let actors = document.createElement("li");
  let plot = document.createElement("li");

  movieDiv.id = "movie";
  movieDiv.dataset.id = movie.id;
  titleH.innerText = movie.title;
  year.innerText = `Released: ${movie.year}`;
  rated.innerText = `Rated: ${movie.rated}`;
  director.innerText = `Directed by: ${movie.director}`;
  actors.innerText = `Starring: ${movie.actors}`;
  plot.innerText = `Summary: ${movie.plot}`;
  poster.src = movie.poster;
  let ratingDiv = document.createElement("div");
  ratingDiv.id = "rating";

  let star1 = document.createElement("span");
  let star2 = document.createElement("span");
  let star3 = document.createElement("span");
  let star4 = document.createElement("span");
  let star5 = document.createElement("span");
  let ratingHead = document.createElement("h5");

  // Stars
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

  movieDetails.append(year, rated, director, actors, plot);
  movieDiv.append(titleH, poster, movieDetails, ratingDiv);
  mainDiv.appendChild(movieDiv);

  // Review Logic
  let review = ratedByUser(movie, 1);
  if (review) {
    renderStars(review);
    ratingDiv.dataset.id = review.id;
  } else {
    document.querySelectorAll(".fa").forEach(star => {
      star.addEventListener("click", rateMovie);
    });
  }
  // Show review / review form
  if (review.content) {
    renderContent(review);
  } else if (review && !review.content) {
    renderReviewForm();
  }
}

function renderContent(review) {
  let ratingDiv = document.querySelector("#rating");
  let reviewContent = document.createElement("div");
  reviewContent.innerText = review.content;
  ratingDiv.appendChild(reviewContent);
}

function renderReviewForm() {
  let ratingDiv = document.querySelector("#rating");
  let reviewForm = document.createElement("form");
  reviewForm.id = "review-form";
  reviewForm.addEventListener("submit", addReviewContent);

  let formLabel = document.createElement("label");
  formLabel.innerText = "Add your review:";

  let reviewContent = document.createElement("textarea");
  reviewContent.type = "text";
  reviewContent.name = "content";

  let submitButton = document.createElement("input");
  submitButton.type = "submit";

  reviewForm.append(formLabel, reviewContent, submitButton);
  ratingDiv.appendChild(reviewForm);
}

// Add text to a review
function addReviewContent(event) {
  event.preventDefault();
  let reviewId = event.target.parentElement.dataset.id;
  let content = event.target.content.value;
  const url = `http://localhost:3000/reviews/${reviewId}`;
  fetch(url, {
    method: "PATCH",
    headers: { "Content-type": "application/json", Allow: "application/json" },
    body: JSON.stringify({ content: content })
  })
    .then(resp => resp.json())
    .then(renderContent);
  event.target.remove();
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
      // add reviewId to reviewDiv
      let ratingDiv = document.querySelector("#rating");
      ratingDiv.dataset.id = review.id;
      document.querySelectorAll(".fa").forEach(star => {
        star.removeEventListener("click", rateMovie);
      });
    });
  renderReviewForm();
}

// function ratingCheck() {}
