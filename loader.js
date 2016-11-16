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
//just have one file loading.
//fileList = ['main'];

var loadType = 1;
//simple shows the files in debugger, progress obfuscates them, but can be shown in various ways.
var loadingVars = [];
//add service worker registration to the app:
addServiceWorker();
/*
 * set the loadType here:
 * 0 = simple and easy
 * 1 = Webtop: Server-xmlHTTPRequest
 * 2 = (experimental) sizeOf File compared to element.innerHTML.length (poll every animationFrame perhaps?)
 * for now, lets just poll every 50ms - I imagine that will be fast enough - dropped - wont work
*/
if (loadType) {
  loaderProgress();
} else {
  loaderSimple();
}
function loaderProgress() {
  //fLoad('spriteImg.png', 'img', 'spriteImg', 'Images', '', 0); //fileVer
  for (var fileName of fileList) {
    fLoad(fileName + '.js', 'script', fileName, fileName + ' file', '', 0);
  }
}
function fLoad(zSrc, zType, zId, zText, zLoad, WinNo) {
  //remove the dot and any slashes in the name, so that it can be used for the name of the progressbar
  var zFileName = zSrc.replace(/\./, '').replace(/\//, '');
  fLoadProgressBar(zFileName, zText);
  //Create a new request to the server
  var xhr = new XMLHttpRequest();
  xhr.open('GET', zSrc, true);
  //was false so it blocks until a response is got, but recoded to true with a loading pulser instead.
  //change the responseType to blob in the case of an image - blob=not changed/as-is
  if (zType === 'img') {
    xhr.responseType = 'blob';
  }
  //create an onLoad event for when the server has sent the data through to the browser
  xhr.addEventListener('loadend', function() {
    //Create an empty element of the type required (link=css, script=javascript, img=image)
    var zElem = document.createElement(zType);
    //if there is an ID for this script, add it to the new element
    if (zId) {
      zElem.id = zId;
    }
    if (zType === 'img') {
      window.URL.revokeObjectURL(zElem.src);
      //make sure there is no src
      zElem.src = window.URL.createObjectURL(xhr.response);
      //add the downloaded src to the element
    } else {
      zElem.innerHTML = xhr.responseText;
    }
    document.head.appendChild(zElem);
  }, false);
  xhr.addEventListener('error', function() {
    alert('somert went wrong!');
  }, false);
  xhr.addEventListener('progress', function(e) {
    fileProgress(e, zFileName)
  }, false);
  xhr.send();
  //create a new global variable with the name of the file so that the progress bar moves a little bit even with no response from the server
  //window[zFileName + 'Timer'] = window.setInterval(function() {fileProgresser(zFileName)}, 100);
  //create an object to keep the time and amount downloaded for dl speed:
  loadingVars[zFileName] = [];
  loadingVars[zFileName].text = zText;
  loadingVars[zFileName].time = performance.now();
  //high resolution version of date.now()
  loadingVars[zFileName].tick = performance.now();
  //high resolution version of date.now()
  loadingVars[zFileName].frame = window.requestAnimationFrame(function() {
    fileProgresser(zFileName)
  });
  loadingVars[zFileName].size = 0;
  //the amount of data currently downlaoded.
  loadingVars[zFileName].speed = 2;
  //bytes per second (I think)
  loadingVars[zFileName].total = 0;
  //the total amount to be downloaded.
}
function fLoadProgressBar(zFileName, zText) {
  if (document.getElementById('loading')) {
    //create new element for the progressbar of this loader
    var pBar = '<div id="' + zFileName + 'C" class="loadC">' + '<div id="' + zFileName + 'Pi" class="loadPi"></div>' + '<div id="' + zFileName + 'Pc" class="loadPc">' + zText + ' (...)</div>' + '</div>';
    //add the progreassBar to the game
    document.getElementById('loading').innerHTML += pBar;
    loaderReHeight();
  }
}
function fileProgress(e, zFileName) {
  if (document.getElementById(zFileName + 'Pi')) {
    if (e.lengthComputable) {
      if (loadingVars[zFileName].sizeUnknown) {
        loadingVars[zFileName].sizeUnknown = 0;
        window.clearInterval(loadingVars[zFileName].endCheckTimer);
        loadingVars[zFileName].endCheckTimer = null;
      }
      document.getElementById(zFileName + 'Pi').classList.remove('loadVV');
      //calculate the amount of time that has passed since last update:
      var timeNow = performance.now();
      //on slower devices, this might change by the end of the function, so make a var of the time.
      var timePassed = timeNow - loadingVars[zFileName].time;
      var amountDownloaded = e.loaded - loadingVars[zFileName].size;
      loadingVars[zFileName].speed = amountDownloaded / timePassed;
      //bytes per millisecond (I think)
      loadingVars[zFileName].time = timeNow;
      //high resolution version of date.now()
      loadingVars[zFileName].size = e.loaded;
      //the amount of data currently downlaoded
      if (!loadingVars[zFileName].total) {
        loadingVars[zFileName].total = e.total;
      }
      var pCent = (e.loaded / e.total) * 100;
      document.getElementById(zFileName + 'Pi').style.width = pCent + '%';
      document.getElementById(zFileName + 'Pc').innerHTML = loadingVars[zFileName].text + ' (' + pCent.toFixed(1) + '%)';

    } else {
      /*
        this appears to happen on github, which is reallllly annoying, but let's hack through it :D
        v1 - non-hack; move the inner progress back and forth in knight-rider/cylon/linux style...
        heh thinking about it.. maybe I should make it glowing... but still green!
      */
      //try pure css animation for the job:  
      if (!loadingVars[zFileName].sizeUnknown) {
        loadingVars[zFileName].sizeUnknown = 1;
        loadingVars[zFileName].endCheckTimer = window.setInterval(function(){filesLoadedCheck()}, 500);
      }
      document.getElementById(zFileName + 'Pi').classList.add('loadVV');
    }
  }
}
function fileProgresser(zFileName) {
  if (document.getElementById(zFileName + 'Pi')) {
    var zNum = parseFloat(document.getElementById(zFileName + 'Pi').style.width || 0) ;
    if (zNum < 100) {
      if (loadingVars[zFileName].total) {
        /*
         * additional bit to calculate download speed since last fileProgress...
         * All I need is the amount of time that has elapsed, and the amount
         * that has been downloaded during that time, and the total.
        */
        //calculate the amount of time that has passed since last update:
        var timeNow = performance.now();
        //on slower devices, this might change by the end of the function, so make a var of the time.
        var timePassed = timeNow - loadingVars[zFileName].tick;
        var amountToAdd = parseFloat(loadingVars[zFileName].speed * timePassed);
        //300 because that is the amount of the timer Interval
        var percentToAdd = parseFloat((amountToAdd / loadingVars[zFileName].total) * 100);
        var pCent = (zNum + percentToAdd);
        document.getElementById(zFileName + 'Pi').style.width = pCent + '%';
        document.getElementById(zFileName + 'Pc').innerHTML = loadingVars[zFileName].text + ' (' + pCent.toFixed(1) + '%)';
      } else {
        document.getElementById(zFileName + 'Pc').innerHTML = loadingVars[zFileName].text + ' (...)';
        document.getElementById(zFileName + 'Pi').classList.add('loadVV');
      }
      loadingVars[zFileName].tick = timeNow;
      //high resolution version of date.now()
      loadingVars[zFileName].frame = window.requestAnimationFrame(function() {
        fileProgresser(zFileName)
      });
    } else {
      //window.clearInterval(window[zFileName + 'Timer']);
      document.getElementById(zFileName + 'C').style.transition = '1s';
      document.getElementById(zFileName + 'C').style.opacity = 0;
      window.setTimeout(function() {
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
    for (var fileName of fileList) {
      if (!document.getElementById(fileName)) {
        return;
        //a script has not yet, so don't start up yet.
      }
    }
    //getting this far means everything is loaded. continue...
    //make sure to only run this once :D
    if (loadType != -1) {
      loadType = -1;
      //loadType will only ever be -1 when set here... and will only happen once :D
      document.getElementById('loading').parentNode.removeChild(document.getElementById('loading'));
      Init();
    }
  }
}
function loaderReHeight() {
  document.getElementById('loading').style.top = ((window.innerHeight - document.getElementById('loading').offsetHeight) / 2) + 'px';
}
function loaderSimple() {
  var firstScript = document.getElementsByTagName('script')[0];
  for (var fileName of fileList) {
    var zScript = document.createElement('script');
    zScript.type = 'text/javascript';
    zScript.id = fileName + 'l';
    zScript.src = fileName + '.js';
    zScript.addEventListener('load', function() {
      this.id = this.id.slice(0, -1);
      filesLoadedCheck();
    });
    firstScript.parentNode.insertBefore(zScript, firstScript);
  }
}
/*serviceworker (mostly) learned from:
https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
*/
function addServiceWorker() {
  if ('serviceWorker'in navigator) {
    //should the user be prompted whether they'd like this made available offline?
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      /*
        let the user know that this is available offline,
        and offer to 'install' (add to home page) maybe.
      */
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  }
}
