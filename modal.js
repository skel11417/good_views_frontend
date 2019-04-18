// modal.js

  function showModal(event){
    const modal = document.getElementById('myModal');
    modal.style.display = "block";

    const imdbID = event.currentTarget.dataset.id;
    const url = `http://localhost:3000/movies/${imdbID}`;
    // request movie data from the backend and render the content in the modal
    fetch(url)
      .then(resp => resp.json())
      .then(renderMovieInModal);
  }

  function hideModal(event){
    const closeBtn = document.getElementsByClassName("close")[0];
    const modal = document.getElementById('myModal');
    if (event.target == modal || event.target == closeBtn) {
      modal.style.display = "none";
    }
  }

  function modalClickHandler(event) {
    event.preventDefault();
    let imdbID = event.currentTarget.dataset.id;
    const url = `http://localhost:3000/movies/${imdbID}`;
    fetch(url)
      .then(resp => resp.json())
      .then(renderMovieInModal);
  }

  function renderMovieInModal(movie){
      // Get modal div
      const modal = document.querySelector('.modal-content')
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
      modal.appendChild(movieDiv);

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
