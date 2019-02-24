var zAppVersion = '2017-05-27' //because no event fires when the SW updates, likely because it is done in the background while the webpage isn't up
, zAppPrefix = 'mg' //used for global storage to differenciate between apps.
, nums = []
//, globVol = .33 //the volume of the beeps in the game. done in GlobalScripts.
, animing = 0
, randing = 0   //whether the game is generating and playing the new number sequence
, mem = 1       //memory or guessing mode
, buttons = 4   //how many buttons to use in the game - 4 by default
, level = 1     //starting/current level
, threshold = 4 //turns until the next level up/down
, turns = 0     //the total number of turns played this game
, combo = 0     //the current combo nunmber of the turn
, score = 0     //current score for this level
, t = 600       //for how long something takes to animate... pause time.
, playing       //disregard any button clicks while the combo is playing.
, saveY         //whether the user allows saving to HTML5 local storage
, clrs = ['blue', 'yellow', 'green', 'red'] //text of the colors
, hslClrs = [[215, 50], [60, 45], [120, 45], [0, 50]] //hsl values of the colors - s is always 100%.
, gameVars = {
    go: 0
  }
;
//user's choice on whether to save data - volume and memory/guess choice, etc.
function initContent() {
  //could add customisazions like colors, sounds, shapes, amount of buttons, etc. as well.
  /*
    create the amount of circles that the user will play.
    give user the choice between simon-says, and let's-guess.

    have an array of random numbers pushed into it
    array is populated before the user chooses, so it is fixed.
  */
  var stuff =
    '<div id="cont">'
      + createButtons()
      + '<button id="pc" type="button" class="uButtons">'
        + '<div id="pa">'
          + '<div id="pi"></div>'
          + '<div id="pf"></div>'
        + '</div>'
        + '<div id="pt">1</div>'
      + '</button>'
    + '</div>'
    ;
  return stuff;
}

function createButtons() {
  var sdf = '';
  //create empty string
  for (var x = 0; x < buttons; x++) {
    //add element to be a button
    sdf += '<button id = "' + x + '" class="ting" style="background-color:' + 'hsl(' + hslClrs[x][0] + ', 100%, ' + hslClrs[x][1] + '%)' + '">' + clrs[x] + '</button>';
  }
  return sdf;
}

function runApp() {
  gameVars.tone = audioCtx.createOscillator();
  gameVars.vol = audioCtx.createGain();
  gameVars.pan = audioCtx.createPanner();
  gameVars.lisn = audioCtx.listener; //this one doesn't appear to need connecting?
  //
  gameVars.tone.connect(gameVars.vol);
  gameVars.vol.connect(gameVars.pan);
  gameVars.tone.type = 'sine';

  //check to see if the user has chosen memory or guessing mode:
  dataToLoad = storageLoad('mem');
  if (dataToLoad) {
    mem = parseInt(dataToLoad);
  }
  //add event to tell when the css transition has finished
  document.getElementById('pa').addEventListener('transitionend', transEnd, false);
  animing = 0;
  resize();
  newGame();
}
function createScore() {
  return '<div id="scoreInner">' + '<button id="set" type="button" class="uButtons uButtonGrey">&#9776;</button>' + '<button id="pc" type="button" class="uButtons">&nbsp;' + '<div id="pa">' + '<div id="pi"></div>' + '<div id="pf"></div>' + '</div>' + '<div id="pt">1</div>' + '</button>' + '</div>' + '<div style="float:left;margin-right:6px;font-size:100%;transform:scaleX(2);">&#9698;</div>' + '';
}
function createSettings() {
  return '<div id="scoreText" style="clear:both;">Turn:0</div>' + '<button id="mem" type="button" class="uButtonLeft uButtons uButtonGreen" style="clear:both;width:50%;">Memory</button>' + '<button id="ges" type="button" class="uButtons uButtonGrey uButtonRight" ' + 'style="width:40%;padding-left:4px;margin-left:-1px;">Guess</button>' + '<div id="fs" class="uButtons uButtonGrey fsButton">' + '<span id="fsI" class="fsInner">&#9974;</span> Fullscreen' + '</div>' + '<br>' + '<div class="vImg">&#9698;</div>' + '<div id="vol%" style="display:inline-block;">33%</div>' + '<div id="vol-Cv" class="sliderCont">&nbsp;' + '<div id="vol-Iv" class="sliderInner">&nbsp;</div>' + '</div>';
}

function settingsExtra() {
  var newElem = document.createElement('div');
  newElem.id = 'setEx';
  newElem.style.cssText = 'margin-bottom:0.5em;';

  newElem.innerHTML =
    '<div id="scoreText">Turn:0</div>'
  + '<button id="mem" type="button" class="uButtonLeft uButtons uButtonGreen" style="clear:both;width:50%;">Memory</button>'
  + '<button id="ges" type="button" class="uButtons uButtonGrey uButtonRight" style="width:40%;padding-left:4px;margin-left:-1px;">Guess</button>';

  document.getElementById('settInner').insertBefore(newElem, document.getElementById('fs'));
  //document.getElementById('settns').appendChild(newElem);

  if (!mem) {
    swapButton('ges', 'mem');
  }

  document.getElementById('scoreText').innerHTML = 'Turns: ' + turns;
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
  //generate random array
  randNums();
  if (mem) {
    randing = 1;
    playing = window.setTimeout(function() {
      playSequence(0);
    }, (t * 2));
  }
}
function playSequence(x) {
  ButtonBackColor(nums[x], 90);
  soundBeep('sine', 500, 1, 100);
  x++;
  if (x < nums.length) {
    playing = window.setTimeout(function() {
      playSequence(x);
    }, t);
  } else {
    playing = window.setTimeout(function() {
      randing = 0;
    }, (t * .5));
  }
}
function updateScore() {
  document.getElementById('pt').innerHTML = level;
}
function updateProgress() {
  animing = 1;
  document.getElementById('pa').style.left = (((score / threshold) * 100) - 100).toFixed(2) + '%';
}
function transEnd() {
  if (animing === 2) {
    levelChange();
  }
  animing = 0;
}
function endUp(num) {
  if (!randing && !animing) {
    //turn the correct button green:
    ButtonBackColor(nums[combo], 90);
    if (num != nums[combo]) {
      //if the pressed button is not the correct button:
      //turn the presssed button red:
      ButtonBackColor(num, 25);
      //user win = false!
      Win = 0;
      //you only lose if you get one wrong
      //end the round now regardless of how many more clicks are left in this level.
      combo = (level - 1);
    }
    combo++;
    if (combo >= level) {
      endTurn();
    }
    soundBeep('sine', 750, 1, 100);
  }
}
function endTurn() {
  combo = 0;
  turns++;
  if (Win) {
    score++;
    window.setTimeout(function() {
      soundBeep('sine', 1000, 1, 100)
    }, 100);
  } else {
    score--;
    window.setTimeout(function() {
      soundBeep('sine', 500, 1, 100)
    }, 100);
  }
  if (score >= threshold) {
    end1(1, '100%');
    window.setTimeout(function() {
      soundBeep('sine', 1500, 1, 100)
    }, 200);
  } else if (score <= -threshold) {
    end1(-1, '-300%');
    window.setTimeout(function() {
      soundBeep('sine', 330, 1, 100);
    }, 200);
  }
  else {
    updateProgress();
  }
  updateScore();
  newGame();
}
function end1(num, x) {
  score = 0;
  level += num;
  if (level < 1) {
    level = 1;
  }
    animing = 2;
    document.getElementById('pa').style.left = x;
}
function levelChange() {
  //no transition, move to center, replace transition
  document.getElementById('pa').style.transition = '0s';
  document.getElementById('pa').style.left = '-100%';
  window.setTimeout(function() {
    document.getElementById('pa').style.transition = 'left .5s';
    animing = 0;
  }, 0);
}
function ButtonBackColor(a, zLux) {
  if (document.getElementById(a)) {
    document.getElementById(a).style.transition = 'background 0s';
    document.getElementById(a).style.backgroundColor = 'hsl(' + hslClrs[a][0] + ', 100%, ' + zLux + '%)'; //hslLs[a];

    window.setTimeout(function(){
      document.getElementById(a).style.transition = 'background .3s';
      document.getElementById(a).style.backgroundColor = 'hsl(' + hslClrs[a][0] + ', 100%, ' + hslClrs[a][1] + '%)'; //hsls[a];
    }, (t * .5));
  }
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
  updateProgress();
  storageSave('mem', mem);
}
