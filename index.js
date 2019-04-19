// index.js
document.addEventListener("DOMContentLoaded", initialize);

// Add event listeners and load recent reviews
function initialize() {
  const form = document.querySelector("form");
  form.addEventListener("submit", searchMovies);

  const homeLink = document.querySelector('#home-link')
  homeLink.addEventListener('click', loadAllRecentReviews)

  const myMoviesLink = document.querySelector("#my-movies-link")
  myMoviesLink.addEventListener('click', loadRecentUserReviews)
  // Show all recently rated movies
  loadAllRecentReviews();
}

function loadAllRecentReviews(){
  let main = document.querySelector('#main')
  main.innerHTML = "<div style='width:800px'><h2>Recent Reviews</h2></div>"

  fetch("http://localhost:3000/reviews")
    .then(resp => resp.json())
    .then(movies => {
      movies.forEach(renderReview);
    });
}

function renderReview(review) {
  let main = document.querySelector('#main')
  // Create main card
  let reviewDiv = document.createElement('div')
  reviewDiv.className = "review-card"
  reviewDiv.id = review.id
  reviewDiv.dataset.id = review.movie.imdb_id
  reviewDiv.addEventListener('click', movieClickHandler)

  // Poster
  let poster = document.createElement('img')
  poster.src = review.movie.poster

  // Title
  let title = document.createElement('p')
  title.innerText = review.movie.title
  title.className = 'review-title'

  let user = document.createElement('p')
  user.innerText = `${review.user.name}:`
  user.className = "review-user"

  // Rating
  let ratingDiv = document.createElement("div");
  ratingDiv.classList.add("rating");

  // Stars
  let stars = createStars()
  stars.forEach(star => ratingDiv.append(star))
  reviewDiv.append(poster, title, ratingDiv, user)
  main.appendChild(reviewDiv)

  // Review Content (added if it exists)
  let reviewContent = document.createElement('p')
  reviewContent.className = "review-content"
  if (review.content) {
    reviewContent.innerText = review.content.trunc(140)
    reviewDiv.appendChild(reviewContent)
  }

  // Assign star rating based on rating integer value
  let rating = review.rating;
  let selectStars = Array.prototype.slice
  .call(stars)
  .slice(0, rating);
  selectStars.forEach(star => {
    star.className += " checked";
  });
}

function loadRecentUserReviews(event) {
  event.preventDefault()
  let mainDiv = document.querySelector("#main");
  mainDiv.innerHTML = ""
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
  image.addEventListener("click", movieClickHandler);
  mainDiv.appendChild(image);
}

// Search for movies and render results
function searchMovies(event) {
  event.preventDefault();
  const title = event.target.title.value;
  const url = `http://localhost:3000/movies/?title=${title}`;
  fetch(url)
    .then(resp => resp.json())
    .then(renderSearchPosters)
    .then(renderAverageReviews);
  event.target.reset();
}

function renderAverageReviews(){
  getAverageReviews()
  .then(ratings => {
    let cards = document.querySelectorAll('.card')
    // iterate through each movie card id key
    // and assign a rating based on value

    // purge ratings of all false values
    cards.forEach(card => {
      let cardId = card.dataset.id
      if (ratings[cardId]){
        let stars = Array.prototype.slice
        .call(card.querySelectorAll(".fa"))
        .slice(0, ratings[cardId]);

        stars.forEach(star => {
          star.className += " checked";
        });
      }
      })
    })
}

function getAverageReviews(){
  const cards = document.querySelectorAll('.card')
  let ids = []
  cards.forEach(card => ids.push(card.dataset.id))

  const url = `http://localhost:3000/movies/avg`
  options = {
    method: "POST",
    headers: { "Content-type": "application/json", Allow: "application/json" },
    body: JSON.stringify({ids: ids})
  }

  return fetch(url, options)
  .then(resp => resp.json())
}

function renderSearchPosters(movies) {
  let mainDiv = document.querySelector("#main");
  mainDiv.innerHTML = `<!-- The Modal -->
    <div id="myModal" class="modal">
      <!-- Modal content -->
      <div id="modal-content small-width" class="modal-content">
        <span class="close">&times;</span>
      </div>
    </div>
  `;

  document.addEventListener('click', hideModal)
  movies.forEach(renderSearchPoster);
}

function renderSearchPoster(movieObj) {
  let mainDiv = document.querySelector("#main");
  let card = document.createElement("article");
  card.className = "card";
  card.dataset.id = movieObj["imdbID"];
  mainDiv.appendChild(card);

  let thumbnail = document.createElement('figure')
  thumbnail.className = "thumbnail"

  let image = document.createElement("img");
  image.src = movieObj["Poster"];
  image.alt = movieObj["Title"];

  thumbnail.appendChild(image)

  let cardContent = document.createElement('div')
  cardContent.className = "card-content"

  let movieTitle = document.createElement('p')
  movieTitle.innerText = movieObj["Title"]

  // Create div for star rating and add stars
  let ratingDiv = document.createElement("div");
  let stars = createStars()
  stars.forEach(star => ratingDiv.append(star))

  cardContent.append(movieTitle, ratingDiv)
  card.append(thumbnail, cardContent)
  card.addEventListener("click", showModal);
}

// Helper method to generate star Elements
function createStars(){
  let star1 = document.createElement("span");
  let star2 = document.createElement("span");
  let star3 = document.createElement("span");
  let star4 = document.createElement("span");
  let star5 = document.createElement("span");

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

  return [star1, star2, star3, star4, star5]
}

function movieClickHandler(event) {
  event.preventDefault();
  let imdbID = event.currentTarget.dataset.id;
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

  let stars = createStars()
  let ratingHead = document.createElement("h5");
  ratingHead.innerText = "Rate this Movie!";

  ratingDiv.append(ratingHead)
  stars.forEach(star => ratingDiv.append(star))

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

// Truncator helper function
String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
      };
