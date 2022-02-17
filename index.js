/*----------Variables----------*/
let selected_tile = null;
let selected_num = null;

window.onload = function () {
  getbyID("new-game").addEventListener("click", generateCleanBoard); // Add functionality to the button
  AddNumbersFunctionality();
};

function generateCleanBoard() {
  cleanPrevBoard(); //first wipe out the previous board

  let idCount = 1;
  for (let i = 0; i < 81; i++) {
    //Create new empty tiles and add them to the board
    let temp = document.createElement("p");
    temp.classList.add("tile");
    temp.id = idCount;
    temp.textContent = " ";

    if ((idCount >= 19 && idCount <= 27) || (idCount >= 46 && idCount <= 54))
      //Adding the extra bottom border every 3rd row
      temp.classList.add("bottom-border");

    if (idCount % 3 === 0 && idCount % 9 !== 0)
      //Adding extra right border every 3rd column
      temp.classList.add("right-border");

    getbyID("board").appendChild(temp);
    idCount++;
  }

  AddTilesFunctionality();
}

function cleanPrevBoard() {
  let tiles = qsa(".tile");
  for (let n = 0; n < tiles.length; n++) {
    //removing the old tiles
    tiles[n].remove();
  }

  for (let n = 0; n < 9; n++) {
    //de-selecting all the number tiles
    getbyID("numbers").children[n].classList.remove("selected");
  }

  selected_num = null;
  selected_tile = null;
}

function AddNumbersFunctionality() {
  let nums = getbyID("numbers").children; //Add click functionality to the numbers
  for (let j = 0; j < 10; j++) {
    nums[j].addEventListener("click", function () {
      if (this.classList.contains("selected")) {
        // Its already selected
        this.classList.remove("selected");
        selected_num = null;
      } else {
        if (selected_num) selected_num.classList.remove("selected");

        this.classList.add("selected");
        selected_num = this;
        updateMove();
      }
    });
  }
}

function AddTilesFunctionality() {
  let tiles = qsa(".tile");
  for (let i = 0; i < 81; i++) {
    tiles[i].addEventListener("click", function () {
      if (this.classList.contains("selected")) {
        this.classList.remove("selected");
        selected_tile = null;
      } else {
        if (selected_tile) selected_tile.classList.remove("selected");

        this.classList.add("selected");
        selected_tile = this;
        updateMove();
      }
    });
  }
}

function updateMove() {
  if (selected_num && selected_tile) {
    if (selected_num.textContent != "clear")
      selected_tile.textContent = selected_num.textContent;
    else selected_tile.textContent = " ";

    setTimeout(function () {
      selected_num.classList.remove("selected");
      selected_num = null;
    }, 200);
    //check if its valid or not later
  }
}
/*----------Helper functions----------*/

function getbyID(id) {
  return document.getElementById(id);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}
