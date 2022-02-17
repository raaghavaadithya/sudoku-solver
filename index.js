/*----------Variables----------*/  
let selected_tile = null;
let selected_num = null;


window.onload = function() {
    getbyID("new-game").addEventListener("click", generateCleanBoard);
}

function generateCleanBoard() {
    cleanPrevBoard(); //first wipe out the previous board

    let idCount = 1;
    for(let i = 0; i < 81; i++) {  //Create new empty tiles and add them to the board
        let temp = document.createElement("p");
        temp.classList.add("tile");
        temp.id = idCount;
        temp.textContent = 1;
        
        if((idCount >= 19 && idCount <= 27) || (idCount >= 46 && idCount <= 54)) //Adding the extra bottom border every 3rd row
            temp.classList.add("bottom-border");

        if(idCount%3 === 0 && (idCount)%9 !== 0) //Adding extra right border every 3rd column
            temp.classList.add("right-border");
            

        getbyID("board").appendChild(temp);
        idCount++;
    }
}

function cleanPrevBoard() {
    let tiles = qsa(".tile");
    for(let n = 0; n < tiles.length; n++) { //removing the old tiles
        tiles[n].remove();
    }

    for(let n = 0; n < 9; n++) { //de-selecting all the number tiles
        getbyID('numbers').children[n].classList.remove("selected");
    }

    selected_num = null;
    selected_tile = null;
}




/*----------Helper functions----------*/  

function getbyID(id) {
    return document.getElementById(id);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}