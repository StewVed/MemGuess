/*
  A simple memory and guessing game by StewVed.

  ToDo:

  allow the user to change the speed of the overall game.
  user change colour scheme of the game.
*/
var nums = []
  , mem = 1
  , buttons = 4
  , level = 1
  , turns = 1
  , turn = 0
  , score = 0
  , t = 600 //for how long something takes to animate... pause time.
  , threshold = 3
  , playing = null ;
/*
window.addEventListener('resize', resize);
window.addEventListener('click', userClick);
window.addEventListener('dblclick', noBubble, false); //not triggered by double tapping touch :(
*/
/*
because there is a pause with touch tapping, I think I should
implement the entire touch and mouse down, move, up stuff after all.
Also, it would be better to have the buttons change colour only when pressed,
instead of an arbitrary time.

window.addEventListener('mouseDown', userMdown);
window.addEventListener('mousemove', userMmove);
window.addEventListener('mouseup', userMup);
*/
function InitMain() {
  //load inputs file
  /*
    create the amount of circles that the user will play.
    give user the choice between simon-says, and lets-guess.

    have an array of random numbers pushed into it
    array is populated before the user chooses, so it is fixed...
    not ased on when the user clicks and other factors.

  */
  var sdf = '';
  //create empty string
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
  var butLeft = 'style="width:50%;"';
  var butRight = 'style="width:40%;padding-left:4px;margin-left:-1px;"';
  document.getElementById('score').innerHTML = 
  '<div id="scoreInner">' + 
  '<button id="set" type="button" class="uButtons uButtonsDisabled" style="float:left;margin-left:5%;">Settings</button>' + 
  '<div id="fs" class="fsButton fsu">&#9974;</div>' +
  '<br>' +
  '<button id="mem" type="button" class="uButtonLeft uButtons uButtonGreen" style="clear: both;" ' + butLeft + '>Memory</button>' + 
  '<button id="ges" type="button" class="uButtons uButtonGrey uButtonRight" ' + butRight + '>Guess</button>' + 
  '<br>' +
  '<span id="scoreText">Turn:0</span>' +
  '<br>' +
  '<button id="pc" type="button" class="uButtons">&nbsp;' + '<div id="pa">&nbsp;' + '<div id="pi"></div>' + '<div id="pf"></div>' + '</div>' + '<div id="pt" >Level: 1</div>' + '</div>' + '</button>' + '';
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
  document.getElementById('game').style.width = document.getElementById('game').style.height = a + 'px';
  /*
    make the circles the correct size.
  */
  if (document.getElementById('0')) {
    for (var x = 0; x < buttons; x++) {
      var y = document.getElementById(x).style;
      y.width = y.height = y.borderRadius = // (document.body.offsetWidth / buttons) + 'px';
      y.lineHeight = Math.floor((a / 2) - (a * .1)) + 'px';
      y.padding = y.borderWidth = Math.floor(a * .02) + 'px';
      y.margin = Math.floor(a * .01) + 'px';
    }
  }
  if (portraitLayout) {
    document.getElementById('score').style.width = a + 'px';
    document.getElementById('score').style.height = (b - a) + 'px';
    document.getElementById('score').style.fontSize = a + '%';
  } else {
    //score is beside the game
    document.getElementById('score').style.width = (b - a) + 'px';
    document.getElementById('score').style.height = a + 'px';
    document.getElementById('score').style.fontSize = (b - a) + '%';
  }
  document.getElementById('scoreInner').style.top = ((document.getElementById('score').offsetHeight / 2) - (document.getElementById('scoreInner').offsetHeight / 2)) + 'px';
}
function randNums() {
  nums = [];
  for (var x = 0; x < level; x++) {
    // randomize which button is 'pressed' for each 'tick'
    nums.push(Math.round(Math.random() * (buttons - 1)));
  }
}
function newGame() {
  Win = 1;
  turn = 0;
  randNums();
  //generate random array
  if (mem) {
    playing = window.setTimeout(function() {
      playSequence(0);
    }, (t * 2));
  }
}
function playSequence(x) {
  ButtonBackColor(nums[x], 'hsla(210, 100%, 50%, 1)');
  x++;
  if (x < level) {
    playing = window.setTimeout(function() {
      playSequence(x);
    }, t);
  }
}
function updateScore() {
  document.getElementById('scoreText').innerHTML = 'Turns: ' + turns;
  document.getElementById('pt').innerHTML = 'Level: ' + level;
}
function updateProgress() {
  var num = 0;
  //new version is a div with the green and red divs inside it. This means I only have to 
  //move that single div left or right
  //the entire div is 300% the size of the level div
  //middle is -100% = 0
  //100% green is 0% to 100%
  //100%  red  is -200% to -300%
  //score is positive or negative, and 0 would equate to -100%
  var t1 = score;
  var t2 = threshold;
  var t3 = t1 / t2;
  var t4 = t3 * 100;
  num = t4 - 100;
  //right then, if threshold = 10, then -10 should be -200
  document.getElementById('pa').style.left = num.toFixed(2) + '%';
}
function endTurn() {
  //scores.played ++;
  turns++;
  if (Win) {
    score++;
    if (score > threshold) {
      end1(1, '100%');
    } else {
      updateProgress();
    }
  } else {
    score--;
    if (score < -threshold) {
      end1(-1, '-300%');
    } else {
      updateProgress();
    }
  }
  updateScore();
  newGame();
}
function end1(num, x) {
  level += num;
  if (level < 1) {
    level = 1;
  }
  score = 0;
  document.getElementById('pa').style.left = x;
  window.setTimeout(function() {
    levelChange();
  }, t);
}
function levelChange() {
  // hide the progressbars, move to center, show bars again
  document.getElementById('pa').style.opacity = '0';
  document.getElementById('pa').style.left = '-100%';
  window.setTimeout(function() {
    document.getElementById('pa').style.opacity = '1';
  }, t);
}
function endY() {
  document.getElementById('pi').style.left = '100%';
  levelChange();
}
function endN() {
  document.getElementById('pf').style.left = '-300%';
  levelChange();
}
function ButtonBackColor(a, zColor) {
  document.getElementById(a).style.transition = '0s';
  document.getElementById(a).style.backgroundColor = zColor;
  window.setTimeout(function() {
    document.getElementById(a).style.transition = '.3s';
    document.getElementById(a).style.backgroundColor = 'transparent';
  }, (t * .5));
}
function ButtonBackOpacity(a) {
  document.getElementById(a).style.transition = '0s';
  document.getElementById(a).style.opacity = .1;
  window.setTimeout(function() {
    document.getElementById(a).style.transition = '.3s';
    document.getElementById(a).style.opacity = 1;
  }, (t * .6));
}
function swapButton(zEnable, zDisable) {
  document.getElementById(zEnable).classList.remove('uButtonGrey');
  document.getElementById(zEnable).classList.add('uButtonGreen');
  document.getElementById(zDisable).classList.remove('uButtonGreen');
  document.getElementById(zDisable).classList.add('uButtonGrey');
  window.clearTimeout(playing);
  playing = null ;
  turns = 0;
  level = 1;
  score = 0;
  updateScore();
  newGame();
}
// fullscreen handling from webtop then simplified for this project...
function fullScreenToggle() {
  var isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

  if (isFS) {
    killFS.call(document, function() {});
    if (document.getElementById('fs')) {
      document.getElementById('fs').classList.remove('fsd')
      document.getElementById('fs').classList.add('fsu');
    }
  }
  else {
    getFS.call(document.documentElement, function() {});
    if (document.getElementById('fs')) {
      document.getElementById('fs').classList.remove('fsu')
      document.getElementById('fs').classList.add('fsd');
    }
  }
}
