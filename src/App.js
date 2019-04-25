import React from 'react';
import './App.css';
import {useState} from 'react';
import {useEffect} from 'react';

//Creating an empty array with arrays inside, for the 'boardColors' state
let emptyArray = new Array(7);
emptyArray.fill([]);

for(let array of emptyArray) {
  array.length = 6;
  array.fill(null);
}

//Creating a variable for checking which players turn it is
let currentPlayer = 'yellow';

//Creating a variable for counting turns
let turnsPlayed = 0;

function App() {
  let [boardColors, updateBoardColors] = useState(emptyArray); //Board colors is an array of 7 arrays, each one containing 6 values.

  //When boardColors is changed, check for a winner
  useEffect(checkWinner, [boardColors]);

  function checkWinner() {
    //OBS Do not change state 'boardColors' in this function. Will create an endless loop.

    //Defining variables
    let startCol;
    let col2;
    let col3;
    let col4;
    let cell1;
    let cell2;
    let cell3;
    let cell4;

    //Starting to check for a winner after 7 turns
    if(turnsPlayed > 6) {
      // 1: Checking horizonally
      // Outer loop - looping through columns 1-4
      for(let i = 0; i <= 3; i++) {
        startCol = boardColors[i];
        col2 = boardColors[i+1];
        col3 = boardColors[i+2];
        col4 = boardColors[i+3];

        // Inner loop - looping through cells 4 and 4 horizonally
        for(let j = 0; j <= 5; j++) {

          cell1 = startCol[j];
          cell2 = col2[j];
          cell3 = col3[j];
          cell4 = col4[j];

          if(cell1 === currentPlayer && cell2 === cell1 && cell3 === cell1 && cell4 === cell1) {
            console.log(currentPlayer + ' player won!');
          }
        }
      }

      // 2: Checking vertically
      // Outer loop - looping through all columns
      for(let column of boardColors) {
        // Inner loop - looping through cells 4 and 4 vertically
        for(let i = 0; i <= 2; i++) {

          cell1 = column[i];
          cell2 = column[i+1];
          cell3 = column[i+2];
          cell4 = column[i+3];

          if(cell1 === currentPlayer && cell2 === cell1 && cell3 === cell1 && cell4 === cell1) {
            console.log(currentPlayer + ' player won!');
          }
        }
      }

      // 3: Checking diagonally - down-to-right
      // Outer loop - looping through rows 1-3
      for(let i = 0; i <= 2; i++) {
        //Inner loop - looping through columns 1-4
        for(let j = 0; j <= 3; j++) {

          startCol = boardColors[j];
          col2 = boardColors[j+1];
          col3 = boardColors[j+2];
          col4 = boardColors[j+3];

          cell1 = startCol[i];
          cell2 = col2[i+1];
          cell3 = col3[i+2];
          cell4 = col4[i+3];

          if(cell1 === currentPlayer && cell2 === cell1 && cell3 === cell1 && cell4 === cell1) {
            console.log(currentPlayer + ' player won!');
          }
        }
      }

      // 4: Checking diagonally - up-to-right
      // Outer loop - looping through rows 4-6
      for(let i = 3; i <= 5; i++) {
        // Inner loop - looping through columns 1-4
        for(let j = 0; j <= 3; j++) {

          startCol = boardColors[j];
          col2 = boardColors[j+1];
          col3 = boardColors[j+2];
          col4 = boardColors[j+3];

          cell1 = startCol[i];
          cell2 = col2[i-1];
          cell3 = col3[i-2];
          cell4 = col4[i-3];

          if(cell1 === currentPlayer && cell2 === cell1 && cell3 === cell1 && cell4 === cell1) {
            console.log(currentPlayer + ' player won!');
          }
        }
      }
    }

    //Change player
    if(turnsPlayed > 0) { //Checking if any turns are played (no need to change player on 'componentDidMount').
      if(currentPlayer === 'yellow') {
        currentPlayer = 'red';
      }
      else {
        currentPlayer = 'yellow';
      }
    }
  }

  function onClickAddDisc(event) {
    let id = event.target.id;
    let columnNr = parseInt(id.charAt(6));
    let index = columnNr - 1;
    let emptyCellFound = false;

    //Finding out which array in 'boardColors' to loop through
    // (making a copy of the array to work with)
    let updatedArray = boardColors[index].slice();

    //Making changes in array
    let color;
    for(let i = updatedArray.length-1; i >= 0; i--) {
      color = updatedArray[i]; // <-- Q: Can't use 'color' to change the color...why?
      if(updatedArray[i] === null) {
        //Changing the value from null to 'yellow' or 'red'
        updatedArray[i] = currentPlayer;
        // Set emptyCellFound to true and end the loop
        emptyCellFound = true;
        break;
      }
    }

    //If the column is full, do nothing
    if(emptyCellFound === false) {
      return;
    }

    //Making a copy of 'boardColors' and inserting the updated array
    let updatedBoardColors = boardColors.slice();
    updatedBoardColors[index] = updatedArray;

    //Increasing 'turns played' variable
    turnsPlayed++;

    //Finally, updating state:boardColors
    //This will trigger useEffect (and check for a winner)
    updateBoardColors(updatedBoardColors);
  }

  function onClickReset(event) {
    //Creating a copy of 'boardColors' to work with
    let newBoard = boardColors.slice();

    //Setting all values in new board to null
    for(let array of newBoard) {
      array.fill(null);
    }

    //Updating state:boardColors
    updateBoardColors(newBoard);
  }

  return (
    <div className="App">
      <div className="board-container">
        <Board className="board" boardColors={boardColors} onClickAddDisc={onClickAddDisc}/>
        <ResetButton className="reset-button" onClickReset={onClickReset}/>
      </div>
    </div>
  );
}

// ------------ Function component: Board ------------------------
function Board(props) {
  let boardColors = props.boardColors;
  let columnNr = 1;
  let columnId;
  let cellNr = 1;
  let cellId;

  //1: Outer loop - looping through columns
  const boardStructure = boardColors.map(column => {
    //Defining column id
    //Don't change the naming without checking that the onClick function is still working (it will look for the 7th character in the id)
    columnId = 'column' + columnNr;
    columnNr++;

    //2: Inner loop - looping through array of cell colors
    const cells = column.map(color => {
      //Defining cell id
      cellId = columnId + '_c' + cellNr;
      cellNr++;
      //Returning cells
      return <Cell color={color} id={cellId} key={cellId}/>
    });
    //End of inner loop

    //Returning columns
    return(
      <div className="column" id={columnId} key={columnId} onClick={props.onClickAddDisc}>
        {cells}
      </div>
    );
  });

  return <div className="board">{boardStructure}</div>;
}

// ---------- Function component: Cell (stateless) ----------------------
function Cell(props) {
  let color = props.color;
  let id = props.id;
  let colorStyling = {backgroundColor: color};
  return <div className="cell" id={id} style={colorStyling}></div>;
}

// ---------- Function component: Reset button (stateless) ----------------------
function ResetButton(props) {
  let onClickReset = props.onClickReset;
  return <button className="reset-button" onClick={onClickReset}>Restart</button>;
}

// ---------- Function component: Winner message (stateless) ----------------------
function WinnerMessage(props) {
  let winningColor = props.winningColor;
  let message = winningColor + ' player won!';
  return <p>{message}</p>;
}

// ---------- Function component: Draw message (stateless) ----------------------
function DrawMessage(props) {
  return <p>It's a draw!</p>;
}

export default App;
