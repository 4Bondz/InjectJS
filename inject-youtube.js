// Inject event listener into youtube that allows me to go at 3x speed

// TODO: IMPROVE THIS SO THAT IF THE PLAYER IS null / undefined, we reload the case
// TODO: FUNCTIONIZE THE ENTIRE THING

getPlayerAddEvents();

function getPlayerAddEvents() {
  let player = document.querySelector("video");
  if (!player) {
    setTimeout(getPlayerAddEvents, 1000);
  }

  // We are running a document_idle (directly after document.onload) - send onload
  chrome.runtime.sendMessage({ videoSpeed: player.playbackRate });

  try {
    player.addEventListener("ratechange", (event) => {
      chrome.runtime.sendMessage({ videoSpeed: player.playbackRate });
    });
  } catch {
    // BUGFIX for "chrome context invalidated, reload the context within the contents script"
    chrome.runtime.reload();
    chrome.runtime.sendMessage({ videoSpeed: player.playbackRate });
  }

  window.addEventListener(
    "keydown",
    function (e) {
      console.log("EVENT");
      try {
        //let video = document.getElementsByTagName("video")[0];
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
