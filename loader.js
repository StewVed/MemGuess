/*
 * Purpose of this file:
 * to give the user a progressbar for each file that is being loaded.
 * it is not smooth, but at the moment, this is the only way I've
 * found to show progress.
 *
 * I hope to develop a new/better way of loading files in the future,
 *
 * hmm how about getting the size of the file, then comparing it
 * against the length of the element.innerHTML of the element
 * that the file is being sownloaded to?
 *
 * annoyingly, it seems that the data is downlaoded by large chunks
 * and not linierly. I suppose that is determined by the network MTU?
 * anyway, because of this, the ONLY way to create a smooth progressbar
 * is the way I am already doing it; move the progressbar blindly forward
 * a little bit per animationFrame/50ms or so.
 *
 * So, I will make it smoother by adding a downlaod speed estimater :D
 * experimental loader dropped until/unless something new turns up like HTML5 file from server
 *
 * anyway, for simplicity and wase of bug hunting, I'll also have
 * simple adding code.
*/

var fileList = ['initialize', 'inputs', 'storage', 'main'];
//var fileList = ['game'];

var loadType = 0; //simple shows the files in debugger, progress obfuscates them, but can be shown in various ways.

var loadingVars = [];

/*
 * set the loadType here:
 * 0 = simple and easy
 * 1 = Webtop: Server-xmlHTTPRequest
 * 2 = (experimental) sizeOf File compared to element.innerHTML.length (poll every animationFrame perhaps?)
 * for now, lets just poll every 50ms - I imagine that will be fast enough - dropped - wont work
*/
loadType = 0;


if (loadType){
  loaderProgress();
}
else {
  loaderSimple();
}


function loaderProgress() {

  //fLoad('spriteImg.png', 'img', 'spriteImg', 'Images', '', 0); //fileVer

  for (var fileName of fileList){
    fLoad(fileName + '.js', 'script', fileName, fileName + ' file', '', 0);
  }

}


function fLoad(zSrc, zType, zId, zText, zLoad, WinNo) {
  //remove the dot and any slashes in the name, so that it can be used for the name of the progressbar
  var zFileName = zSrc.replace(/\./, '').replace(/\//, '');

  fLoadProgressBar(zFileName, zText);

  //Create a new request to the server
  var xhr = new XMLHttpRequest();

  xhr.open('GET', zSrc, true); //was false so it blocks until a response is got, but recoded to true with a loading pulser instead.

  //change the responseType to blob in the case of an image - blob=not changed/as-is
  if (zType === 'img') {
    xhr.responseType = 'blob';
  }

  //create an onLoad event for when the server has sent the data through to the browser
  xhr.addEventListener('loadend',function(){ ///was load
    //Create an empty element of the type required (link=css, script=javascript, img=image)
    var zElem = document.createElement(zType);

    //if there is an ID for this script, add it to the new element
    if (zId) {
      zElem.id = zId;
    }

    if (zType === 'img') {
      window.URL.revokeObjectURL(zElem.src); //make sure there is no src
      zElem.src = window.URL.createObjectURL(xhr.response); //add the downloaded src to the element
    }
    else {
      zElem.innerHTML = xhr.responseText;//add the downloaded stuff to the eleme
      //zElem.src = zSrc; //hopefully to get it to show in chrome debugger
    }

    document.head.appendChild(zElem); //append the element to the webpage
/*
    //call any onload functions that the element requires
    if (zLoad) {
      window[zLoad](WinNo);
    }
*/

    //filesLoadedCheck();

  }, false);

  xhr.addEventListener('error',function(){alert('somert went wrong!');}, false);
  xhr.addEventListener('progress',function(e){fileProgress(e, zFileName)}, false);


  xhr.send();


  //create a new global variable with the name of the file so that the progress bar moves a little bit even with no response from the server
  //window[zFileName + 'Timer'] = window.setInterval(function() {fileProgresser(zFileName)}, 100);

  //create an object to keep the time and amount downloaded for dl speed:
  loadingVars[zFileName] = [];
  loadingVars[zFileName].text = zText;
  loadingVars[zFileName].time = performance.now(); //high resolution version of date.now()
  loadingVars[zFileName].tick = performance.now(); //high resolution version of date.now()
  loadingVars[zFileName].frame = window.requestAnimationFrame(function(){fileProgresser(zFileName)});
  loadingVars[zFileName].size = 0; //the amount of data currently downlaoded.
  loadingVars[zFileName].speed = 2; //bytes per second (I think)
  loadingVars[zFileName].total = 0; //the total amount to be downloaded.
}


function fLoadProgressBar(zFileName, zText) {
  //create new element for the progressbar of this loader
  var pBar =
    '<div id="' + zFileName + 'C" style="width:50%;position:relative;margin:2px auto;border-radius: 24px;border:2px solid hsl(0, 0%, 50%);text-align:left;">' +
      '<div id="' + zFileName + 'Pi" style="position:relative;border-radius:inherit;height:24px;width:0%;background:linear-gradient(hsl(120, 100%, 80%), hsl(120, 100%, 30%));"></div>' +
      '<div id="' + zFileName + 'Pc" style="border-radius:inherit;position:absolute;width:100%;text-align:center;color:hsl(0, 0%, 50%);font-weight:bold;font-size:125%;line-height:24px;top:0px;">' + zText + ' (Calculating...)</div>' +
    '</div>';

  //add the progreassBar to the game
  document.getElementById('loading').innerHTML += pBar;

  loaderReHeight();
}


function fileProgress(e, zFileName) {
  if (e.lengthComputable && document.getElementById(zFileName + 'Pi')) {
    //calculate the amount of time that has passed since last update:
    var timeNow = performance.now(); //on slower devices, this might change by the end of the function, so make a var of the time.
    var timePassed = timeNow - loadingVars[zFileName].time;

    var amountDownloaded = e.loaded - loadingVars[zFileName].size;

    loadingVars[zFileName].speed = amountDownloaded / timePassed; //bytes per millisecond (I think)

    loadingVars[zFileName].time = timeNow; //high resolution version of date.now()
    loadingVars[zFileName].size = e.loaded; //the amount of data currently downlaoded

    if (!loadingVars[zFileName].total) {
      loadingVars[zFileName].total = e.total;
    }

    var pCent = (e.loaded / e.total) * 100;

    document.getElementById(zFileName + 'Pi').style.width = pCent + '%';
    document.getElementById(zFileName + 'Pc').innerHTML = loadingVars[zFileName].text + ' (' + pCent.toFixed(1) + '%)';
  }
}

function fileProgresser(zFileName) {
  if (document.getElementById(zFileName + 'Pi')) {
    var zNum = parseFloat(document.getElementById(zFileName + 'Pi').style.width);
    if (zNum < 100) {
      /*
       * additional bit to calculate download speed since last fileProgress...
       * All I need is the amount of time that has elapsed, and the amount
       * that has been downloaded during that time, and the total.
      */
      //calculate the amount of time that has passed since last update:
      var timeNow = performance.now(); //on slower devices, this might change by the end of the function, so make a var of the time.
      var timePassed = timeNow - loadingVars[zFileName].tick;

      var amountToAdd = parseFloat(loadingVars[zFileName].speed * timePassed); //300 because that is the amount of the timer Interval
      var percentToAdd = parseFloat((amountToAdd / loadingVars[zFileName].total) * 100);
      var pCent = (zNum + percentToAdd);
      document.getElementById(zFileName + 'Pi').style.width = pCent + '%';
      document.getElementById(zFileName + 'Pc').innerHTML = loadingVars[zFileName].text + ' (' + pCent.toFixed(1) + '%)';
      loadingVars[zFileName].tick = timeNow; //high resolution version of date.now()
      loadingVars[zFileName].frame = window.requestAnimationFrame(function(){fileProgresser(zFileName)});
    }
    else {
      //window.clearInterval(window[zFileName + 'Timer']);
      document.getElementById(zFileName + 'C').style.transition = '1s';
      document.getElementById(zFileName + 'C').style.opacity = 0;
      window.setTimeout(function(){
        if (document.getElementById(zFileName + 'C')) {
          document.getElementById(zFileName + 'C').parentNode.removeChild(document.getElementById(zFileName + 'C'));
          loaderReHeight();
        }
        filesLoadedCheck();
      }, 1000);
    }
  }
}


function filesLoadedCheck() {
  //if all essential data is loaded, initialize. Once only
  if (document.getElementById('loading')) {
    //check for the scripts:
    for (var fileName of fileList){
      if (!document.getElementById(fileName)) {
        return; //a script has not yet, so don't start up yet.
      }
    }

    //getting this far means everything is loaded. continue...
    //make sure to only run this once :D
    if (loadType != -1) {
      loadType = -1; //loadType will only ever be -1 when set here... and will only happen once :D
      Init();
    }
  }
}

function loaderReHeight() {
  document.getElementById('loading').style.top = (
    (document.getElementById('gameContainer').offsetHeight / 2) -
    (document.getElementById('loading').offsetHeight / 2)
  ) + 'px';
}

function loaderSimple() {
  var firstScript = document.getElementsByTagName('script')[0];
/*
  gameSprite = new Image();
  gameSprite.id = 'gameSpritel';
  gameSprite.src = 'spriteImg.png';
  gameSprite.addEventListener('load',function(){
    this.id = this.id.slice(0,-1);
    filesLoadedCheck();
  });
  firstScript.parentNode.insertBefore(gameSprite, firstScript);
*/

  for (var fileName of fileList){
    var zScript = document.createElement('script');
    zScript.type = 'text/javascript';
    zScript.id = fileName + 'l';
    zScript.src = fileName + '.js';
    zScript.addEventListener('load',function(){
      this.id = this.id.slice(0,-1);
      filesLoadedCheck();
    });
    firstScript.parentNode.insertBefore(zScript, firstScript);
  }
}


/*

window['lIR'] = function() {
  document.getElementById('spritePre').id = 'gameSprite';
}
*/
