// Amazon a different beast
// We won't see the player immediately
// When we do see the player, there _MIGHT_ be 2 of them, so we have to pick the correct one

// TODO : fix Extension context invalidated errors in amazon -> When a new link is loaded, we need to reload the context

//
// if player is null -> try again
getPlayerAddEvents();

function getPlayerAddEvents() {
  let playerList = document.getElementsByTagName("video");
  playerList = [].slice.call(playerList); // convert HTMLCollection to array
  if (playerList.length == 0) {
    // we have no players available, retry
    setTimeout(() => {
      getPlayerAddEvents();
    }, 1000);
  } else {
    for (i in playerList) {
      // There is another video element that has "tst" in it that we need to rule out
      if (playerList[i].classList.toString().includes("tst")) {
        playerList.splice(i, 1);
      }
    }
    if (playerList.length == 0) {
      // none of the players on the page are the 'real' player, retry
      setTimeout(() => {
        getPlayerAddEvents();
      }, 1000);
    } else {
      // ladies and gentlemen, we got em
      console.log("FOUND PLAYER");
      let player = playerList[0];

      chrome.runtime.sendMessage({ videoSpeed: player.playbackRate });

      player.addEventListener("ratechange", (event) => {
        chrome.runtime.sendMessage({ videoSpeed: player.playbackRate });
      });

      chrome.runtime.onDisconnect = () => {
        //clean up when content script gets disconnected
        console.log("DISCONNECT");
        playerList = [];
        getPlayerAddEvents();
      };

      window.addEventListener(
        "keydown",
        function (e) {
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
        },
        false
      );
    }
  }
}

// Inject event listener into youtube that allows me to go at 3x speed
// let player = document.querySelector("video");

// // We are running a document_idle (directly after document.onload) - send onload
// chrome.runtime.sendMessage({ videoSpeed: player.playbackRate });
