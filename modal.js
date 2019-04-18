// modal.js

  function showModal(event){
    console.log('sfsgsw')
    const modal = document.getElementById('myModal');
    modal.style.display = "block";
  }

  function hideModal(event){
    const closeBtn = document.getElementsByClassName("close")[0];
    const modal = document.getElementById('myModal');
    if (event.target == modal || event.target == closeBtn) {
      modal.style.display = "none";
    }
  }

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function(event) {
  //   debugger
  //   if (event.target == modal) {
  //     modal.style.display = "none";
  //   }
  // }

// COPIED CODE
// When the user clicks on the button, open the modal
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }
