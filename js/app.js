/* Create a list that holds all of your cards
*/

var card = document.getElementsByClassName('card');
var allCards = Array.from(card);
var guess = 0;
var time = 0;
var min = 0;
var sec = 0;
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

newGame();

//show and open classes toggled on when card is flipped
function flipCard() {
  this.classList.toggle('show');
  this.classList.toggle('open');
}

//called from clicking on a card
function showCard() {
  //add the card to the end of the openCards array
  openCards.push(this);
  //take away ability to click on an open card
  deactivateClick(openCards);
  if (openCards.length === 2) {
    //stop clicking ability on all cards when 2 are open
    deactivateClick(allCards);
    checkMatch();
    //add a guess for each pair of cards guessed
    countGuess();
    //start timer when the first 2 cards are open
    if (!timer){
      timer = setInterval(function(){ startTimer() }, 1000);
    }
  }
}

function checkMatch() {
  //checking if data-ids match
  if (openCards[0].dataset.id === openCards[1].dataset.id) {
    matches();
  } else {
    //cards remain open for 1 second
    setTimeout(notMatches,1000);
  }
}

function matches() {
  //add match class to matched cards and add them to matchedCards array
  for (var i=0; i<openCards.length; i++) {
    openCards[i].classList.toggle('match');
    matchedCards.push(openCards[i]);
  }
  //once matchedCards has 16 the timer stops and the game ends
  if (matchedCards.length === 16) {
    clearInterval(timer);
    win();
  }
  //reactivate the ability to click on cards
  activateClick(allCards);
  openCards = [];
}

function notMatches() {
  //if cards don't match flip them over
  for (var i=0; i<openCards.length; i++) {
    openCards[i].classList.toggle('show');
    openCards[i].classList.toggle('open');
  }
  activateClick(allCards);
  openCards = []
}

//modal for when all cards are matched
function win() {
  var victoryWindow = document.getElementById('victoryWindow');
  var yes = document.getElementById('yes');
  var no = document.getElementById('no');
  var finalStars = document.getElementsByClassName('stars')[0];
  var finalTimer = document.getElementsByClassName('timer')[0];
  document.querySelector('.finalStars').innerHTML = finalStars.innerHTML;
  document.querySelector('.finalTimer').innerHTML = finalTimer.innerHTML;
  victoryWindow.style.display = 'block';
  yes.onclick = function() {
    newGame();
    victoryWindow.style.display = 'none';
  }
  no.onclick = function() {
    victoryWindow.style.display = 'none';
  }
}

function activateClick(array) {
  for (var i=0; i<array.length; i++) {
    var currentCard = array[i];
    //only reactivate the ability to click on cards that aren't matched
    if(!currentCard.classList.contains('match')) {
      array[i].addEventListener('click',flipCard);
      array[i].addEventListener('click',showCard);
    }
  }
}

function deactivateClick(array) {
  //take away ability to click on cards
  for (var i=0; i<array.length; i++) {
    array[i].removeEventListener('click',flipCard);
    array[i].removeEventListener('click',showCard);
  }
}

function countGuess() {
  guess++;
  document.querySelector('.moves').innerHTML = guess;
  //3 stars for 12 or fewer guesses, 2 stars for 13-16 guesses, 1 star for 17+
  if (guess>12 && guess<17) {
    starList[0].classList.remove('fa-star');
    starList[0].classList.add('fa-star-o');
  } else if (guess>16 /*&& guess<21*/) {
    starList[1].classList.remove('fa-star');
    starList[1].classList.add('fa-star-o');
  } /*else if (guess>20){
    starList[2].classList.remove('fa-star');
    starList[2].classList.add('fa-star-o');
  }*/
}

function startTimer() {
  time++;
  min = Math.floor(time/60);
  sec = time%60;
  //game ends if it takes longer than an hour
  if (min>59){
    var timeoutWindow = document.getElementById('timeoutWindow');
    var ok = document.getElementById('ok');
    timeoutWindow.style.display = 'block';
    ok.onclick = function () {
      newGame();
      timeoutWindow.style.display = 'none';
    }
  } else {
    document.querySelector('.minutes').innerHTML = min;
    document.querySelector('.seconds').innerHTML = sec;
  }
}

function newGame() {
  //reset all classes on cards for a new game
  for (var i=0; i<card.length; i++) {
    allCards[i].classList.remove('show');
    allCards[i].classList.remove('open');
    allCards[i].classList.remove('match');
  }
  var shuffledCards = shuffle(allCards);
  var deckElement = document.getElementById('deck');
  deckElement.innerHTML = '';
  //create array using the shuffled card results
  for (i=0; i<shuffledCards.length; i++) {
    deckElement.appendChild(shuffledCards[i]);
  }
  matchedCards = [];
  guess = 0;
  clearInterval(timer);
  //set timer to undefined since timer start checks if !timer
  timer = undefined;
  time = 0;
  min = 0;
  sec = 0;
  document.querySelector('.moves').innerHTML = guess;
  document.querySelector('.minutes').innerHTML = min;
  document.querySelector('.seconds').innerHTML = sec;
  //reset stars to all full
  for (var i=0; i<starList.length; i++) {
    starList[i].classList.add('fa-star');
    starList[i].classList.remove('fa-star-o');
  }
  //reset all cards to be able to be clicked on
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
