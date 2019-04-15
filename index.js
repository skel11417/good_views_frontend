document.addEventListener('DOMContentLoaded', initialize)


function initialize(){
  const form =document.querySelector('form')
  form.addEventListener('submit', getMovies)
}

function getMovies(event){
  event.preventDefault()
  const title = event.target.title.value
  const url=`http://localhost:3000/movies/?title=${title}`
  fetch(url).then(resp => resp.json()).then(json => console.log(json))
}
