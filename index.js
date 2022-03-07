/*----------Variables----------*/
let selected_tile = null;
let selected_num = null;
let solutionBoard = null;
let mode = "input";
let backtrackingSteps = null;
const numbers = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);

window.onload = function () {
  window.addEventListener(
    "keydown",
    function (e) {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
          e.code
        ) > -1
      ) {
        e.preventDefault();
      }
    },
    false
  );

  //On loading the window, a new grid is generated, the buttons and the numbers get functionality
  generateCleanBoard();
  getbyID("new-game").addEventListener("click", generateCleanBoard); // Add functionality to the button
  AddNumbersFunctionality();
};

function generateCleanBoard() {
  cleanPrevBoard(); //first wipe out the previous board
  getbyID("slider-container").classList.add("hidden");
  getbyID("slider").classList.add("hidden");
  mode = "input";
  solutionBoard = null;

  let idCount = 0;
  for (let i = 0; i < 81; i++) {
    //Create new empty tiles and add them to the board
    let temp = document.createElement("p");
    temp.classList.add("tile");
    temp.id = idCount;
    temp.textContent = " ";

    if ((idCount >= 18 && idCount <= 26) || (idCount >= 45 && idCount <= 53))
      //Adding the extra bottom border every 3rd row
      temp.classList.add("bottom-border");

    if ((idCount + 1) % 3 === 0 && (idCount + 1) % 9 !== 0)
      //Adding extra right border every 3rd column
      temp.classList.add("right-border");

    getbyID("board").appendChild(temp);
    idCount++;
  }

  AddTilesFunctionality(); //enable the tiles on the board
  EnableKeyboardInput();
  EnableArrowKeyMovement();
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

  if (selected_num) selected_num.classList.remove("selected");
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
    tiles[i].addEventListener("click", handleTileClick); //Enabling the tiles of the board
  }
}

function EnableKeyboardInput() {
  document.addEventListener("keydown", function (event) {
    if (selected_tile) {
      if (numbers.has(event.key)) {
        selected_tile.textContent = event.key;
      }
    }
  });
}

function EnableArrowKeyMovement() {
  document.addEventListener("keydown", (keyPressed) => {
    if (selected_tile) {
      tile_id = parseInt(selected_tile.id);
      switch (keyPressed.key) {
        case "ArrowRight":
          selected_tile.classList.remove("selected");
          if ((tile_id + 1) % 9 === 0) {
            getbyID(tile_id - 8).classList.add("selected");
            selected_tile = getbyID(tile_id - 8);
          } else {
            getbyID(tile_id + 1).classList.add("selected");
            selected_tile = getbyID(tile_id + 1);
          }
          break;
        case "ArrowLeft":
          selected_tile.classList.remove("selected");
          if (tile_id % 9 === 0) {
            getbyID(tile_id + 8).classList.add("selected");
            selected_tile = getbyID(tile_id + 8);
          } else {
            getbyID(tile_id - 1).classList.add("selected");
            selected_tile = getbyID(tile_id - 1);
          }
          break;
        case "ArrowUp":
          selected_tile.classList.remove("selected");
          if (tile_id <= 8 && tile_id >= 0) {
            getbyID(tile_id + 72).classList.add("selected");
            selected_tile = getbyID(tile_id + 72);
          } else {
            getbyID(tile_id - 9).classList.add("selected");
            selected_tile = getbyID(tile_id - 9);
          }
          break;
        case "ArrowDown":
          selected_tile.classList.remove("selected");
          if (tile_id >= 72 && tile_id <= 80) {
            getbyID(tile_id - 72).classList.add("selected");
            selected_tile = getbyID(tile_id - 72);
          } else {
            getbyID(tile_id + 9).classList.add("selected");
            selected_tile = getbyID(tile_id + 9);
          }
          break;
        default:
          break;
      }
    }
  });
}

function updateMove() {
  //If both a tile and a nnumber are selected at once, the tile gets updated with the new number
  //Depending on whether its input mode or solve mode, the updation happens
  if (selected_num && selected_tile) {
    let newText = selected_num.textContent;
    if (newText != "clear") selected_tile.textContent = newText;
    else selected_tile.textContent = " ";

    setTimeout(function () {
      selected_num.classList.remove("selected");
      selected_num = null;
    }, 200);

    if (mode === "solve") {
      let row = Math.floor(selected_tile.id / 9);
      let col = selected_tile.id % 9;

      if (solutionBoard[row][col] != newText) {
        selected_tile.classList.add("incorrect-number");
        setTimeout(function () {
          selected_tile.classList.remove("incorrect-number");
          selected_tile.textContent = " ";
        }, 500);
      } else {
        selected_tile.removeEventListener("click", handleTileClick);
        selected_tile.classList.remove("selected");
        selected_tile = null;
      }
    }
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
  //On clicking the "Done "button

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

    ChangeModes(); //change mode from input to solving mode
  } else {
    //If the board is unsolvable
    alert("The board is invalid / unsolvable! Please enter a valid board");
    solutionBoard = null;
    //Can still alter everything
  }
}

function ChangeModes() {
  mode = "solve";

  getbyID("done").classList.add("hidden");
  getbyID("solve").classList.remove("hidden");
  getbyID("solve").addEventListener("click", SolveClicked);

  let tiles = qsa(".tile");
  for (let i = 0; i < 81; i++) {
    //Remove clickability from all the correct tiles
    if (tiles[i].textContent != " ") {
      tiles[i].removeEventListener("click", handleTileClick);
    }
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

  if (!validBoard()) {
    solutionBoard = null;
    return false;
  } else {
    return solveSudoku();
  }
}

function solveSudoku() {
  //Once input is given, the solution is generated to compare with the entered values later
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (solutionBoard[i][j] == " ") {
        for (let c = "1"; c <= "9"; c++) {
          if (isSafePlacement(c, i, j, solutionBoard)) {
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

function isSafePlacement(num, row, col, board) {
  //Checks if a number can be placed in a certain place in the grid
  for (let i = 0; i < 9; i++) {
    if (board[row][i] == num) return false;
    if (board[i][col] == num) return false;
  }

  let localBoxRow = row - (row % 3);
  let localBoxCol = col - (col % 3);

  for (let i = localBoxRow; i < localBoxRow + 3; i++) {
    for (let j = localBoxCol; j < localBoxCol + 3; j++) {
      if (board[i][j] == num) return false; //Checks the 3x3 sub-boxes
    }
  }
  return true;
}

function validBoard() {
  //Checks if the inputted board is a valid/solvable board
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

async function SolveClicked() {
  getbyID("slider-container").classList.remove("hidden");
  getbyID("slider").classList.remove("hidden");

  disableEverything();
  backtrackingSteps = [];

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

  backtrackWithSteps();

  await visualizeSteps();

  resetBorders();
}

function disableEverything() {
  //Disables all the tiles and the "Solve" button
  let tiles = qsa(".tile");
  for (let i = 0; i < 81; i++) {
    tiles[i].removeEventListener("click", handleTileClick);
  }

  getbyID("solve").removeEventListener("click", SolveClicked);
}

function backtrackWithSteps() {
  //Stores all the steps in the backtracking process to later visualize it
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (solutionBoard[i][j] === " ") {
        for (let c = "1"; c <= "9"; c++) {
          if (isSafePlacement(c, i, j, solutionBoard)) {
            solutionBoard[i][j] = c;
            backtrackingSteps.push([i * 9 + j, "correct", c]); //Stores the id of the tile, the state its in, and its textContent
            if (backtrackWithSteps()) return true;
            else {
              solutionBoard[i][j] = " ";
              backtrackingSteps.push([i * 9 + j, "wrong", c]);
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

async function visualizeSteps() {
  //Visualizes the whole backtracking process
  let tiles = qsa(".tile");

  for (let x = 0; x < backtrackingSteps.length; x++) {
    let cur_id = backtrackingSteps[x][0];
    let cur_state = backtrackingSteps[x][1];
    let cur_content = backtrackingSteps[x][2];
    let cur_tile = tiles[cur_id];

    cur_tile.textContent = cur_content;
    if (cur_state == "correct") {
      cur_tile.classList.remove("wrong");
      cur_tile.classList.add("correct");
    } else {
      cur_tile.classList.remove("correct");
      cur_tile.classList.add("wrong");
      await sleep(50);
      cur_tile.classList.remove("wrong");
      cur_tile.textContent = " ";
    }

    let sliderVal = parseInt(getbyID("slider").value);
    let waitTime = 300 - sliderVal;
    await sleep(waitTime);
  }
}

function resetBorders() {
  //Once the visualization is done, the borders will be reset to normal
  let actual_board = qsa(".tile");
  for (let i = 0; i < 81; i++) {
    if (actual_board[i].classList.contains("correct")) {
      actual_board[i].classList.remove("correct");
    }
  }
}

/*----------Helper functions----------*/

function getbyID(id) {
  return document.getElementById(id);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
