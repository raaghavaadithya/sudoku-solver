/*----------Variables----------*/
let selected_tile = null;
let selected_num = null;
let solutionBoard = null;

window.onload = function () {
  generateCleanBoard();
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
  getbyID("done").addEventListener("click", DoneClicked);
  getbyID("solve").classList.add("hidden");
  getbyID("done").classList.remove("hidden");
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
    tiles[i].addEventListener("click", handleTileClick);
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

function handleTileClick() {
  if (this.classList.contains("selected")) {
    this.classList.remove("selected");
    selected_tile = null;
  } else {
    if (selected_tile) selected_tile.classList.remove("selected");

    this.classList.add("selected");
    selected_tile = this;
    updateMove();
  }
}

function DoneClicked() {
  if (selected_tile) {
    //deselect all tiles
    selected_tile.classList.remove("selected");
    selected_tile = null;
  }

  if (generateSolutionBoard()) {
    // generateSolutionBoard returns a bool, True if the solution can be found, false if no solution can be found
    // a.k.a the input board is unsolvable
    // if it's unsolvable, the ability to change the board will still be there to correct the input
    // if it's solvable, then all the inputs will be locked since they are correctly placed
    // They will be locked by disabling clickability
    let tiles = qsa(".tile");
    for (let i = 0; i < 81; i++) {
      //Remove clickability from all the correct tiles
      if (tiles[i].textContent != " ") {
        tiles[i].removeEventListener("click", handleTileClick);
      }
    }
    getbyID("done").classList.add("hidden");
    getbyID("solve").classList.remove("hidden");
    console.log("valid and solvable board");
  } else {
    //If the board is unsolvable
    alert("The board is invalid / unsolvable! Please enter a valid board");
    solutionBoard = null;
    //Can still alter everything
  }
}

function generateSolutionBoard() {
  solutionBoard = [];
  let tiles = qsa(".tile");
  let idx = 0;
  for (let p = 0; p < 9; p++) {
    let tempRow = [];
    for (let q = 0; q < 9; q++) {
      tempRow.push(tiles[idx++].textContent);
    }
    solutionBoard.push(tempRow);
  }

  // for(let x = 0; x < 9; x++) {
  //   console.log(...solutionBoard[x]);
  //   console.log();
  // }

  if (!validBoard()) {
    solutionBoard = null;
    return false;
  } else {
    let b = solveSudoku();
    return b;
  }
}

function solveSudoku() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (solutionBoard[i][j] == " ") {
        for (let c = "1"; c <= "9"; c++) {
          if (isSafePlacement(c, i, j)) {
            solutionBoard[i][j] = c;
            if (solveSudoku()) return true;
            solutionBoard[i][j] = " ";
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isSafePlacement(num, row, col) {
  for (let i = 0; i < 9; i++) {
    if (solutionBoard[row][i] == num) return false;
    if (solutionBoard[i][col] == num) return false;
  }

  let localBoxRow = row - (row % 3);
  let localBoxCol = col - (col % 3);

  for (let i = localBoxRow; i < localBoxRow + 3; i++) {
    for (let j = localBoxCol; j < localBoxCol + 3; j++) {
      if (solutionBoard[i][j] == num) return false;
    }
  }
  return true;
}

function validBoard() {
  for (let i = 0; i < 9; i++) {
    let row = new Set(),
      col = new Set(),
      box = new Set();

    for (let j = 0; j < 9; j++) {
      let _row = solutionBoard[i][j];
      let _col = solutionBoard[j][i];
      let m = 3 * Math.floor(i / 3) + Math.floor(j / 3);
      let n = 3 * (i % 3) + (j % 3);
      let _box = solutionBoard[m][n];

      if (_row != " ") {
        if (row.has(_row)) return false;
        row.add(_row);
      }
      if (_col != " ") {
        if (col.has(_col)) return false;
        col.add(_col);
      }

      if (_box != " ") {
        if (box.has(_box)) return false;
        box.add(_box);
      }
    }
  }
  return true;
}

/*----------Helper functions----------*/

function getbyID(id) {
  return document.getElementById(id);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}
