const DEBUG = true;
let player = false;
let url = window.location.href;

getPlayerAddEvents();

const sendFunc = () => {
  try {
    chrome.runtime.sendMessage({ videoSpeed: player.playbackRate });
  } catch {
    if (DEBUG) {
      console.log("DISCONNECT3");
    }
    getPlayerAddEvents();
    // player.removeEventListener("ratechange", sendFunc);
    // window.removeEventListener("keydown", keyHandler, false);
  }
};

const keyHandler = (e) => {
  try {
    if (e.key == "e") {
      player.playbackRate = player.playbackRate += 0.5;
    } else if (e.key == "E") {
      player.playbackRate = player.playbackRate += 1;
    } else if (e.key == "r") {
      player.playbackRate = 1;
    }
  } catch (e) {
    console.log("Error: ", e);
  }
};

function getPlayerAddEvents() {
  let playerList = document.getElementsByTagName("video");
  playerList = [].slice.call(playerList); // convert HTMLCollection to array
  if (playerList.length == 0) {
    // we have no players available, retry
    setTimeout(() => {
      getPlayerAddEvents();
    }, 1000);
  } else if (playerList.length == 1) {
    // ladies and gentlemen, we got em
    if (DEBUG) {
      console.log("FOUND PLAYER");
      console.log(playerList);
    }

    player = playerList[0];

    sendFunc();
    player.addEventListener("ratechange", sendFunc);

    chrome.runtime.onDisconnect = () => {
      //clean up when content script gets disconnected
      if (DEBUG) {
        console.log("DISCONNECT1");
      }
      playerList = [];
      getPlayerAddEvents();
    };

    window.addEventListener("keydown", keyHandler, false);
  }
}

let urlCheck = setInterval(() => {
  if (DEBUG) {
    console.log(`checking URL`);
  }

  if (window.location.href != url) {
    url = window.location.href;
    if (DEBUG) {
      console.log("DISCONNECT: URL CHANGED");
    }
    playerList = [];
    player = null;
    getPlayerAddEvents();
    // player.removeEventListener("ratechange", sendFunc);
    // window.removeEventListener("keydown", keyHandler, false);
  }
}, 1000);

// Inject event listener into youtube that allows me to go at 3x speed
// let player = document.querySelector("video");

// // We are running a document_idle (directly after document.onload) - send onload
// chrome.runtime.sendMessage({ videoSpeed: player.playbackRate });
