chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`sent from tab.id= ${sender.tab.id}`);
  console.log(`DATA DUMP - message: ${message}`);
  console.log(`DATA DUMP - sender: ${sender}`);
  console.log(`DATA DUMP - sendRespond: ${sendResponse}`);
  for (let key of Object.keys(message)) {
    switch (key) {
      case "videoSpeed":
        chrome.browserAction.setBadgeText({
          tabId: sender.tab.id,
          text: String(message[key]),
        });
        chrome.browserAction.setBadgeBackgroundColor({
          tabId: sender.tab.id,
          color: "#555555",
        });
        break;
    }
  }
});

// chrome.webRequest.onBeforeRequest.addListener((det) => {
//   console.log(det);
// });
