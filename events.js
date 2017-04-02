function keyDownEvents() {
  //this is for an editEnable input element
}
function keyDownGameEvents(theKey) {
  //this is for in-game events.
  if(isFinite(keysCurrent[theKey])) {
    endUp(keysCurrent[theKey]);
  }
}
function keyUpEvents() {
  //this is for an editEnable input element
}
function keyUpGameEvents(theKey) {
  //this is for in-game events.
}
function mouseClickEvents() {
  var targ = mouseVars.start.target;
  if (isFinite(parseInt(targ.id))) {
    //is a button
    endUp(targ.id);
  } else if (targ.id === 'mem') {
    //User pressed the 'Memory' button
    mem = 1;
    swapButton('mem', 'ges');
  } else if (targ.id === 'ges') {
    //User pressed the 'Guess' button
    mem = 0;
    swapButton('ges', 'mem');
  }
}

function mouseDownEvents() {
  //custom mouse/touch down events for your app go here
}
function mouseMoveEvents() {
  //custom mouse/touch move events for your app go here
}
function mouseMoveEnter(targ) {
  /*
   * use this for hovering over things.
   * eg. when you enter a new thing, highlight it.
  */
}
function mouseMoveOut(targ) {
  /*
   * opposite of enter...
   * eg. unhighlight something as the mouse moves off of it.
   *
  */
}
function mouseMoveOver(targ) {
  /*
   * for actively tracking while on an object.
   * eg. moving, dynamic tooltip.
  */
}
function mouseUpEvents() {
  //custom mouse/touch up events for your app go here
}

function mouseWheelEvents(targ, d) {
  if (targ.classList.contains('letScroll')) {
    //very dodgy hard-code - only one thing can be scrolled.
    targ = document.getElementById('toastPopup');
    var zSpeed;
    if (d < 0) {
      zSpeed = -1000;
    } else {
      zSpeed = 1000;
    }
    divScroller(targ, zSpeed, new Date().getTime());
  }
}

function gamePadsButtonDown(zButton) {
  //custom gamepad button down events for your app go here
}
function gamePadsButtonUp(zButton) {
  //custom gamepad button down events for your app go here
  endUp(gamepadReMap[zButton]);
}

function anEvent() {
  /*
    this one is for evergy-saving with static games.
    If your game waits for an input and then does something,
    then put something here to set it going.
  */

  /*
    If your game has a running animation loop, you can use this var
    in your main loop to trigger stuff happening!
  */
  //gameVars.go = 1; //obviously, you can call it whatever you want...lol
}

function resizeEvents(a ,b ,portraitLayout) {
  //simple method of scaling the entire thing - make the font size a percent of the space.
  document.getElementById('gArea').style.width = document.getElementById('gArea').style.height = document.getElementById('scoreInner').style.width = document.getElementById('scoreInner').style.height = a + 'px';
  document.getElementById('gArea').style.fontSize = a * 1.5 + '%';
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
  document.getElementById('scoreInner').style.fontSize = a + '%';
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

function sliderEvents(sliderPercent, sve) {
  //volume control in Settings is already done.
}
