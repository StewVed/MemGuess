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
    tMem = 1;
    swapButton('mem', 'ges');
    document.getElementById('settCont').addEventListener('transitionend', settinsCloseEvent);
  } else if (targ.id === 'ges') {
    //User pressed the 'Guess' button
    tMem = 0;
    swapButton('ges', 'mem');
    document.getElementById('settCont').addEventListener('transitionend', settinsCloseEvent);
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
  //custom mouse wheell events go here
  /*
    note that scrolling is done in globalScripts
    and you put letScroll in the elements of stuff
    you want to scroll using upSetClass(element)
  */
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

function resizeEvents() {
  var z = resizeCheckOrientation();
  //simple method of scaling the entire thing - make the font size a percent of the space.
  document.getElementById('cont').style.width =
  document.getElementById('cont').style.height = z[0] + 'px';
  //resizeSetSize(z[0]);
  document.getElementById('pt').style.lineHeight =
  document.getElementById('pt').offsetHeight + 'px';

  if (document.body.offsetHeight < document.body.offsetWidth) {
    /* little fix for landscape mode for font size
       because this is a square app
    */
    document.body.style.fontSize = (document.body.offsetHeight * .002) + 'em';
  }
}

function sliderEvents(sliderPercent, sve) {
  //volume control in Settings is already done.
}

function settinsCloseEvent() {
  //fires when the settings windows has closed.

  //remove the event listener now if it is there
  document.getElementById('settCont').removeEventListener('transitionend', settinsCloseEvent);

  if (document.getElementById('settCont').style.left == 0) {
    if (tMem != mem) {
      mem = tMem

      turns = 0;
      level = 1;
      score = 0;
      updateScore();
      updateProgress();
      storageSave('mem', mem);
    }
    //sometimes it seems that animing is stuck on after settings:
    animing = 0;
    newGame();
  }

}

