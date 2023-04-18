// opens the file explorer / selector
function handleClick(e) {
  // the handleCLick is attached on the parent of the squares
  // ie. we are using event delegation
  // thus, we need to make sure that handleClick is only triggered byt the onClick of certain elements
  if (e.target.classList.contains("material-symbols-outlined")) {
    let currentSquare = e.target.parentElement;
    // open the file selector UI
    let fileSelector = document.createElement("input");
    fileSelector.type = "file";
    fileSelector.accept = "image/*";
    fileSelector.click();
    fileSelector.addEventListener("change", getFileFromFileSystem);
    function getFileFromFileSystem(e) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let imgSrc = e.target.result;
        let image = document.createElement("img");
        image.setAttribute("src", imgSrc);
        image.setAttribute("id", Date.now());
        image.setAttribute("draggable", true);
        image.addEventListener("dragstart", (ev) => {
          ev.dataTransfer.setData("text/plain", ev.target.id);
          ev.dataTransfer.dropEffect = "move";
        });
        image.addEventListener("dragend", () => {
          console.log("drag end yo!!");
        });
        // append it in the correct square + it will have a larger z-index
        currentSquare.appendChild(image);
      };
      reader.readAsDataURL(this.files[0]);
    }
  }
}

(() => {
  // add the squares
  let container = document.querySelector(".container");
  let squares = Array.from(document.querySelectorAll(".square"));
  squares.forEach((square, index) => {
    square.setAttribute("id", index);
    square.addEventListener("dragover", handleOnDragOver);
    function handleOnDragOver(e) {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = "red !important";
    }
    square.ondrop = (e) => {
      e.preventDefault();
      // get the thing that needs to be DND'd ( image )
      let imgId = e.dataTransfer.getData("text/plain");
      let image = document.getElementById(imgId);
      e.currentTarget.appendChild(image);
    };
  });
})();
