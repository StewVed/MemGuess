/*
  A simple memory and guessing game by StewVed.
*/
var nums = []
  , globVol = .33
  , randing = 0
  , mem = 1
  , buttons = 4
  , level = 1
  , turns = 1
  , turn = 0
  , score = 0
  , t = 600 //for how long something takes to animate... pause time.
  , threshold = 3
  , playing = null ;
function InitMain() {
  //load inputs file
  /*
    create the amount of circles that the user will play.
    give user the choice between simon-says, and lets-guess.

    have an array of random numbers pushed into it
    array is populated before the user chooses, so it is fixed...
    not ased on when the user clicks and other factors.
*/
  document.body.innerHTML = '<div id="cont">' + '<div id="game">' + createButtons() + '</div>' + '<div id="score">' + createScore() + '</div>' + '<div id="settns" style="visibility:hidden;">' + createSettings() + '</div>' + '</div>' + '';
  resize();
  newGame();
}
function createButtons() {
  var sdf = '';
  //create empty string
  for (var x = 0; x < buttons; x++) {
    //add element to be a button
    sdf += '<div id = "' + x + '" class="ting">' + (x + 1) + '</div>';
  }
  return sdf;
}
function createScore() {
  //document.getElementById('score').innerHTML =
  return '<div id="scoreInner">' + '<button id="set" type="button" class="uButtons uButtonGrey">&#9776;</button>' + '<button id="pc" type="button" class="uButtons">&nbsp;' + '<div id="pa">' + '<div id="pi"></div>' + '<div id="pf"></div>' + '</div>' + '<div id="pt">Level: 1</div>' + '</button>' + '</div>' + '<div style="float:left;margin-right:6px;font-size:100%;transform:scaleX(2);">&#9698;</div>' + '';
}
function createSettings() {
  return '<div id="scoreText">Turn:0</div>' + '<button id="mem" type="button" class="uButtonLeft uButtons uButtonGreen" style="clear:both;width:50%;">Memory</button>' + '<button id="ges" type="button" class="uButtons uButtonGrey uButtonRight" ' + 'style="width:40%;padding-left:4px;margin-left:-1px;">Guess</button>' + '<div id="fs" class="uButtons uButtonGrey fsButton">' + '<span id="fsI" class="fsInner">&#9974;</span> Fullscreen' + '</div>' + '<br>' + '<div class="vImg">&#9698;</div>' + '<div id="vol%" style="display:inline-block;">33%</div>' + '<div id="vol-Cv" class="sliderCont">&nbsp;' + '<div id="vol-Iv" class="sliderInner">&nbsp;</div>' + //Off ♫ &#128266;
  '</div>' + '';
}
function resize() {
  //maybe I should make the game bit a squre, then have the scores bit
  //however amount of space is left? what if the available area is square?
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
  //simple method of scaling the entire thing - make the font size a percent of the space.
  document.getElementById('game').style.width = document.getElementById('game').style.height = document.getElementById('settns').style.width = document.getElementById('settns').style.height = document.getElementById('scoreInner').style.width = document.getElementById('scoreInner').style.height = a + 'px';
  document.getElementById('game').style.fontSize = a * 1.5 + '%';
  /* 
     make the circles the correct size.
  */
  if (document.getElementById('0')) {
    for (var x = 0; x < buttons; x++) {
      var y = document.getElementById(x).style;
      y.width = y.height = y.borderRadius = y.lineHeight = Math.floor((a / 2) - (a * .1)) + 'px';
      y.padding = y.borderWidth = Math.floor(a * .02) + 'px';
      y.margin = Math.floor(a * .01) + 'px';
    }
  }
  document.getElementById('scoreInner').style.fontSize = document.getElementById('settns').style.fontSize = a + '%';
  if (portraitLayout) {
    document.getElementById('scoreInner').style.transform = 'rotate(0deg)';
    document.getElementById('score').style.width = '100%';
    document.getElementById('score').style.height = document.getElementById('pc').offsetHeight + Math.round(b * .03) + 'px';
    document.getElementById('cont').style.top = Math.round((b / 2) - (document.getElementById('cont').offsetHeight / 2)) + 'px';
    document.getElementById('cont').style.left = '0px';
  } else {
    //score is beside the game
    document.getElementById('scoreInner').style.transform = 'rotate(-90deg)';
    document.getElementById('score').style.height = '100%';
    document.getElementById('score').style.width = document.getElementById('pc').offsetHeight + Math.round(b * .03) + 'px';
    document.getElementById('cont').style.left = Math.round((b / 2) - (document.getElementById('cont').offsetWidth / 2)) + 'px';
    document.getElementById('cont').style.top = '0px';
  }
}
function randNums() {
  nums = [];
  for (var x = 0; x < level; x++) {
    // randomize which button is 'pressed' for each 'tick'
    nums.push(Math.round(Math.random() * (buttons - 1)));
  }
}
function newGame() {
  window.clearTimeout(playing);
  playing = null ;
  Win = 1;
  turn = 0;
  randing = 1;
  randNums();
  //generate random array
  if (mem) {
    playing = window.setTimeout(function() {
      playSequence(0);
    }, (t * 2));
  } else {
    randing = 0;
  }
}
function playSequence(x) {
  ButtonBackColor(nums[x], 'hsla(210, 100%, 50%, 1)');
  soundBeep('sine', 500, 1, 100);
  x++;
  if (x < level) {
    playing = window.setTimeout(function() {
      playSequence(x);
    }, t);
  } else {
    randing = 0;
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
    setTimeout(function() {
      soundBeep('sine', 1000, 1, 100)
    }, 100);
    if (score > threshold) {
      setTimeout(function() {
        soundBeep('sine', 1500, 1, 100)
      }, 200);
      end1(1, '100%');
    } else {
      updateProgress();
    }
  } else {
    score--;
    setTimeout(function() {
      soundBeep('sine', 500, 1, 100)
    }, 100);
    if (score < -threshold) {
      setTimeout(function() {
        soundBeep('sine', 330, 1, 100)
      }, 200);
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
function ButtonBackColor(a, zColor) {
  document.getElementById(a).style.transition = '0s';
  document.getElementById(a).style.backgroundColor = zColor;
  window.setTimeout(function() {
    document.getElementById(a).style.transition = '.3s';
    document.getElementById(a).style.backgroundColor = 'transparent';
  }, (t * .5));
}
function swapButton(zEnable, zDisable) {
  document.getElementById(zEnable).classList.remove('uButtonGrey');
  document.getElementById(zEnable).classList.add('uButtonGreen');
  document.getElementById(zDisable).classList.remove('uButtonGreen');
  document.getElementById(zDisable).classList.add('uButtonGrey');
  window.clearTimeout(playing);
  playing = null;
  turns = 0;
  level = 1;
  score = 0;
  updateScore();
  updateProgress();
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
  } else {
    getFS.call(document.documentElement, function() {});
    if (document.getElementById('fs')) {
      document.getElementById('fs').classList.remove('fsu')
      document.getElementById('fs').classList.add('fsd');
    }
  }
}
function toggleSettings() {
  if (document.getElementById('settns').style.visibility === 'hidden') {
    document.getElementById('settns').style.visibility = 'visible';
  } else {
    document.getElementById('settns').style.visibility = 'hidden';
  }
  newGame();
}
// example: soundBeep('sine', 500, 1, 100);setTimeout(function(){soundBeep('sine', 750, 1, 100)}, 100);
function soundBeep(type, frequency, volume, duration) {
  //make the volume comform to the globally set volume
  volume *= globVol;
  //create a HTML5 audio occilator thingy
  var zOscillator = WinAudioCtx.createOscillator();
  //create a HTML5 audio volume thingy
  var zGain = WinAudioCtx.createGain();
  //link the volume to the occilator
  zOscillator.connect(zGain);
  zGain.connect(WinAudioCtx.destination);
  //set up the audio beep to what is needed:
  zOscillator.type = type;
  //default = 'sine' — other values are 'square', 'sawtooth', 'triangle' and 'custom'
  zOscillator.frequency.value = frequency;
  zGain.gain.value = volume;
  //start the audio beep, and set a timeout to stop it:
  zOscillator.start();
  setTimeout(function() {
    setTimeout(function() {
      zOscillator.stop()
    }, 25);
    //stop once the volume is riiiight down.
    zGain.gain.value = 0.001;
    //hopefully stop that cilck at the end that can happen.
  }, duration);
  //default to qurter of a second for the beep if no time is specified
}
