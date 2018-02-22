/* Create a list that holds all of your cards
*/

var card = document.getElementsByClassName('card');
var allCards = Array.from(card);
var guess = 0;
var time = 0;
var timer;
var openCards = [];
var matchedCards = [];
var s1 = document.querySelector('[data-id=star1]');
var s2 = document.querySelector('[data-id=star2]')
var s3 = document.querySelector('[data-id=star3]')
var starList = [s1,s2,s3];

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }
    return array;
}

newGame()

function flipCard() {
  this.classList.toggle('show');
  this.classList.toggle('open');
}

function showCard() {
  openCards.push(this);
  deactivateClick(openCards);
  /*openCards[0].removeEventListener('click',flipCard);
  openCards[0].removeEventListener('click',showCard);*/
  if (openCards.length === 2) {
    deactivateClick(allCards);
    checkMatch();
    countGuess();
    if (!timer){
      timer = setInterval(function(){ startTimer() }, 1000);
    }
  }
}

function checkMatch() {
  if (openCards[0].dataset.id === openCards[1].dataset.id) {
    matches();
  } else {
    setTimeout(notMatches,500);
  }
}

function matches() {
  for (var i=0; i<openCards.length; i++) {
    openCards[i].classList.toggle('match');
    matchedCards.push(openCards[i]);
  }
  if (matchedCards.length === 16) {
    clearInterval(timer);
    win();
  }
  activateClick(allCards);
  openCards = [];
}

function notMatches() {
  for (var i=0; i<openCards.length; i++) {
    openCards[i].classList.toggle('show');
    openCards[i].classList.toggle('open');
  }
  activateClick(allCards);
  openCards = []
}

function win() {
  var r = confirm("Play Again?");
  if (r==true) {
    newGame();
  } else {
    undefined;
  }
}

function activateClick(array) {
  for (var i=0; i<array.length; i++) {
    var currentCard = array[i];
    if(!currentCard.classList.contains('match')) {
      array[i].addEventListener('click',flipCard);
      array[i].addEventListener('click',showCard);
    }
  }
}

function deactivateClick(array) {
  for (var i=0; i<array.length; i++) {
    array[i].removeEventListener('click',flipCard);
    array[i].removeEventListener('click',showCard);
  }
}

function countGuess() {
  guess++;
  document.querySelector('.moves').innerHTML = guess;
  if (guess>10 && guess<15) {
    starList[0].classList.remove('fa-star');
    starList[0].classList.add('fa-star-o');
  } else if (guess>14 && guess<19) {
    starList[1].classList.remove('fa-star');
    starList[1].classList.add('fa-star-o');
  } else if (guess>18){
    starList[2].classList.remove('fa-star');
    starList[2].classList.add('fa-star-o');
  }
}

function startTimer() {
  time++;
  document.querySelector('.timer').innerHTML = time;
}

function newGame() {
  for (var i=0; i<card.length; i++) {
    allCards[i].classList.remove('show');
    allCards[i].classList.remove('open');
    allCards[i].classList.remove('match');
  }
  var shuffledCards = shuffle(allCards);
  var deckElement = document.getElementById('deck');
  deckElement.innerHTML = '';
  for (i=0; i<shuffledCards.length; i++) {
    deckElement.appendChild(shuffledCards[i]);
  }
  matchedCards = [];
  guess = 0;
  clearInterval(timer);
  timer = undefined;
  time = 0;
  document.querySelector('.moves').innerHTML = guess;
  document.querySelector('.timer').innerHTML = time;
  for (var i=0; i<starList.length; i++) {
    starList[i].classList.add('fa-star');
    starList[i].classList.remove('fa-star-o');
  }
  for (var i=0; i<allCards.length; i++) {
    allCards[i].addEventListener('click',flipCard);
    allCards[i].addEventListener('click',showCard);
  }
}

/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/
