let deckId = ""; //global variable

// when the page first loads do this. This is the first thing that happens when the page loads
window.addEventListener("load", loadNames);

let input1 = document.getElementById("name1");
let input2 = document.getElementById("name2");

// If names exist in storage. Load them into the dom on the inputs
function loadNames() {
  const name1Local = localStorage.getItem("name1");
  const name2Local = localStorage.getItem("name2");
  // If the name exists , get the name from the localStorage
  if (name1Local !== null || name2Local !== null) {
    input1.value = name1Local;
    input2.value = name2Local;
  }

  // if they don't exist, nothing happens
}


// It grabs the deckId from the API. have as many deck as you want by changing the "count="
fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  .then((res) => res.json()) // parse response as JSON
  .then((data) => {
    console.log(data);
    deckId = data.deck_id;
  })
  .catch((err) => {
    console.log(`error ${err}`);
  });

// Scores are set as '0'
let score1 = 0;
let score2 = 0;
document.querySelector("#player1Score").innerText = `Total Score: ${score1}`;
document.querySelector("#player2Score").innerText = `Total Score: ${score2}`;



document.querySelector("button").addEventListener("click", saveName);
// Before the start of the game names are entered.


// This gets triggered everytime the play button is pressed
function saveName() {
  let input1 = document.getElementById("name1");
  let input2 = document.getElementById("name2");

  //if there are names in the inputs save
  
  if ((input1.value !== "" || input2.value !== "") && (input1.value !== localStorage.getItem("name1") || input2.value !== localStorage.getItem("name2"))) {
     // If during a game the names are changed.
    
    // when you run setItem overwrites on there
    score1 = 0;
    score2 = 0;

    localStorage.setItem("name1", input1.value);
    localStorage.setItem("name2", input2.value);
  }
  
  //then draw the cards
  drawTwo();
}

function drawTwo() {
  // Instead of hard coding deck Id each time,  we plug in "${deckId} and made the count=2"
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;

  fetch(url)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      console.log(data);

      // Show the images in the DOM
      document.querySelector("#player1").src = data.cards[0].image;
      document.querySelector("#player2").src = data.cards[1].image;
    
      // because the card values were strings (can be seen in the console),
      //had to be converted to numbers
      let player1Val = convertToNum(data.cards[0].value); //run the covertToNum function
      let player2Val = convertToNum(data.cards[1].value); //run the covertToNum function

      if (player1Val > player2Val) {
        document.querySelector("h3").innerText = "Player 1 Wins!";
        score1 += 1;
        document.querySelector(
          "#player1Score"
        ).innerText = `Total Score: ${score1}`;
      } else if (player1Val < player2Val) {
        document.querySelector("h3").innerText = "Player 2 Wins!";
        score2 += 1;
        document.querySelector(
          "#player2Score"
        ).innerText = `Total Score: ${score2}`;
      } else {
        document.querySelector("h3").innerText = "No Winner!";
        return "no winner";
      }
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

// we create a helper function which converts the values to a number
function convertToNum(val) {
  if (val === "ACE") {
    return 14;
  } else if (val === "KING") {
    return 13;
  } else if (val === "QUEEN") {
    return 12;
  } else if (val === "JACK") {
    return 11;
  } else {
    return Number(val);
  }
}
