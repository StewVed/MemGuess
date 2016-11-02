var nums = []
  , scores = {correct:0, inARow:0, played:0}
  , buttons = 4
  , turns = 1
  , threshold = 2
  , turn = 0;

window.addEventListener('resize', resize);
window.addEventListener('click', userClick);
window.addEventListener('dblclick', noBubble, false); //not triggered by double tapping touch :(
/*
window.addEventListener('mouseDown', userMdown);
window.addEventListener('mousemove', userMmove);
window.addEventListener('mouseup', userMup);
*/

Init();

function Init() {
  /*
    create the amount of circles that the user will play.
    give user the choice between simon-says, and lets-guess.

    have an array of random numbers pushed into it
    array is populated before the user chooses, so it is fixed...
    not ased on when the user clicks and other factors.

  */

  var sdf = ''; //create empty string

  for (var x = 0; x < buttons; x++) {
    //add element to be a button
    sdf += '<div id = "' + x + '" class="ting">' + (x + 1) + '</div>';
  }

  document.getElementById('game').innerHTML = sdf;
  createSettings();
  resize();

  newGame();
}

function createSettings() {
  var butLeft = 'style="font-size:.7em;width:50%;margin-left:4px"';
  var butRight = 'style="font-size:.7em;width:40%;margin-right:4px"';

  document.getElementById('score').innerHTML = 
  '<div id="scoreInner">' +
    '<button id="mem" type="button" class="uButtonLeft uButtons uButtonGreen " ' + butLeft + ' value="1">Memory</button>' +
    '<button id="ges" type="button" class="uButtons uButtonGrey uButtonRight" ' + butRight + ' value="0">Guess</button>' +
    '<br>' + 
    '<span id="scoreText">Turn:0</span>' +

    '<div id="pc">&nbsp;' +
      '<div id="pi"></div>' +
      '<div id="pf"></div>' +
      '<div id="pt" >Level: 1</div>' +
    '</div>' +
  '</div>' +
  '';

}

function resize() {
  //maybe I should make the game bit a squre, then have the scores bit
  //however amount of space is left? what if the available area is squre?
  
  //regardless, let's begin by finding the smallest size out of length and width:
  var a = window.innerWidth;
  var b = window.innerHeight;

  document.body.style.width = a + 'px';
  document.body.style.height = b + 'px';
  var portraitLayout = 1;

  if (a > b) {
    var c = a;
    a = b;
    b = c;
    portraitLayout = 0;
  }

  document.getElementById('game').style.fontSize = a * 1.5 + '%';

  document.getElementById('game').style.width = 
  document.getElementById('game').style.height = a + 'px';


  /*
    make the circles the correct size.
  */
  for (var x = 0; x < buttons; x++) {
    var y = document.getElementById(x).style;
    y.width = y.height = y.borderRadius = // (document.body.offsetWidth / buttons) + 'px';
    y.lineHeight = Math.floor((a / 2) - (a * .1)) + 'px';
    
    y.padding = y.borderWidth = Math.floor(a * .02) + 'px';
    y.margin = Math.floor(a * .01) + 'px';
  }

  if (portraitLayout) {
    document.getElementById('score').style.width = a + 'px';
    document.getElementById('score').style.height = (b - a) + 'px';
    document.getElementById('score').style.fontSize = a + '%';
  }
  else {
    //score is beside the game
    document.getElementById('score').style.width = (b - a) + 'px';
    document.getElementById('score').style.height = a + 'px';
    document.getElementById('score').style.fontSize = (b - a) + '%';
  }

  document.getElementById('scoreInner').style.top = 
  ((document.getElementById('score').offsetHeight / 2) -
  (document.getElementById('scoreInner').offsetHeight / 2)) + 'px';

}

function randNums() {
  nums = [];
  for (var x = 0; x < turns; x++) {
    // randomize which button is 'pressed' for each 'tick'
    nums.push(Math.round(Math.random() * (buttons - 1)));
  }
}

function newGame() {
  Win = 1;
  turn = 0;
  randNums(); //generate random array

  if (parseInt(document.getElementById('mem').value) == 1) {
    window.setTimeout(function(){playSequence(0);}, 500);
  }
}

function playSequence(x) {
  if (x < turns) {
    ButtonBackColor(nums[x], 'hsla(220, 100%, 75%, 1)');
    window.setTimeout(function(){playSequence(x + 1);}, 500);
  }
}

function score() {
/*
  var a = 0;
  if (scores.played > 0) {
    a = Math.floor((scores.correct / scores.played) * 100);
  }
*/
  document.getElementById('scoreText').innerHTML = 'Turns: ' + scores.played;
  document.getElementById('pt').innerHTML = 'Level: ' + turns;
}

function levelProgress() {
  var num = 0;
  if (scores.inARow > 0) {
    num = scores.inARow;
    document.getElementById('pi').style.left = (Math.round((num / threshold) *100) - 100) + '%';
    document.getElementById('pf').style.left = '100%';
  }
  else if (scores.inARow < 0) {
    num = -scores.inARow;
    var a = Math.round((num / threshold) *100);
    var b = 100 - a;
    document.getElementById('pi').style.left = '-100%';
    document.getElementById('pf').style.left = (100 - Math.round((num / threshold) *100)) + '%';
  }
  else {
    document.getElementById('pf').style.left = '100%';
    document.getElementById('pi').style.left = '-100%';
  }

}



function endTurn() {
  scores.played ++;
  
  if (Win) {
    zColor = 'green';
    scores.correct ++;
    ButtonBackColor('game', 'hsla(127,66%,50%, 0.2)');

    if (scores.inARow == threshold) {
      end1(1);
      endY();
    }
    else {
      scores.inARow ++;
      levelProgress();
    }
  }
  else {
    if (scores.inARow == -threshold) {
      end1(-1);
      endN();
    }
    else {
      scores.inARow --;
      levelProgress();
    }
  }

  score();
  newGame();
}

function end1(num) {
      turns += num;

      if (turns < 1) {
        turns = 1;
      }
      
      scores.inARow = 0;
}

function endY() {
    document.getElementById('pi').style.left = '100%';
    document.getElementById('pi').style.width = '0%';

    window.setTimeout(function(){
      document.getElementById('pi').style.left = '-100%';
      window.setTimeout(function(){
        document.getElementById('pi').style.width = '100%';
      }, 500);
    }, 500);
}

function endN() {
    document.getElementById('pf').style.left = '-100%';
    document.getElementById('pf').style.width = '0%';

    window.setTimeout(function(){
      document.getElementById('pf').style.left = '100%';
      window.setTimeout(function(){
        document.getElementById('pf').style.width = '100%';
      }, 500);
    }, 500);
}


function ButtonBackColor(a, zColor) {
  document.getElementById(a).style.transition = '0s';
  document.getElementById(a).style.backgroundColor = zColor;
  window.setTimeout(function(){
    document.getElementById(a).style.transition = '.3s';
    document.getElementById(a).style.backgroundColor = 'transparent';
  }, 300);
}

function ButtonBackOpacity(a) {
  document.getElementById(a).style.transition = '0s';
  document.getElementById(a).style.opacity = .1;
  window.setTimeout(function(){
    document.getElementById(a).style.transition = '.3s';
    document.getElementById(a).style.opacity = 1;
  }, 300);
}

function userClick(e) {
  var targ = findTarg(e);

  if (isFinite(targ.id)) {
    //is a button
    for (var x = 0; x < buttons; x++) {
      if (x != nums[turn]) {
        ButtonBackOpacity(x);
      }
      else {
        ButtonBackColor(nums[turn], 'hsla(127,66%,50%, 1)');
      }
    }
    
    if (targ.id != nums[turn]) {
      ButtonBackColor(targ.id, 'hsla(0,100%,50%, 1)');
      ButtonBackColor('game', 'hsla(0,100%,50%, .2)');
      Win = 0; //you only lose if you get one wrong
      turn = (turns - 1); //end the round.
    }

    turn ++;
    if (turn == turns) {
        endTurn();
    }
  }
  else if (targ.id === 'mem'){
    targ.value = 1;
    swapButton('mem', 'ges');
  }
  else if (targ.id === 'ges'){
    document.getElementById('mem').value = 0;
    swapButton('ges', 'mem');
  }
}

function findTarg(e) {
  if (!e) {
    var e = window.event;
  }

  targ = e.target || e.srcElement;

  if (targ.nodeType != 1) {//element nodes are 1, attribute, text, comment, etc. nodes are other numbers... I want the element.
    targ = targ.parentNode;
  }

  return targ;
}

function swapButton(zEnable, zDisable) {
  document.getElementById(zEnable).classList.remove('uButtonGrey');
  document.getElementById(zEnable).classList.add('uButtonGreen');
  document.getElementById(zDisable).classList.remove('uButtonGreen');
  document.getElementById(zDisable).classList.add('uButtonGrey');
  newGame();
}

function userMdown(e) {

}


function userMmove(e) {
  return;
  var targ = findTarg(e);

  if (isFinite(targ.id)) {
    //is a button
    if (targ.id == nums[turn]) {
      //user is correct
      ButtonBackColor(nums[turn], 'green');
    }
  }
}


function userMup(e) {
  var targ = findTarg(e);

  if (isFinite(targ.id)) {
    //is a button
    ButtonMup(nums[turn]);
  }
}

function noBubble(e) {
	try {
		e.preventDefault();
		e.stopPropagation();
	}
	catch(ex) {} //this can fail on touch if scrolling is running on an element at the time...like the uLauncher
}