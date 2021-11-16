let activeTab = "";

chrome.tabs.onActivated.addListener(load);

function load() {
  activeTab = undefined
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    activeTab = tabs[0];
    let url = String(activeTab.url);
    chrome.contextMenus.removeAll();
    if (url.includes("amazon")) {
      chrome.contextMenus.create({
        title: "CCCamel",
        onclick: openCCCamelAmazon,
        id: "camel",
      });
    } else {
      chrome.contextMenus.removeAll();
    }
  });
}

function openCCCamelAmazon() {
  if (activeTab == undefined || activeTab.url == undefined) {
    setTimeout(openCCCamelAmazon, 1000);
  } else {
    let splitUrl = activeTab.url.split("/");
    let dirtyItem = splitUrl[5];
    let item = dirtyItem.split("?")[0];
  
    chrome.tabs.create({
      active: true,
      url: `https://www.camelcamelcamel.com/product/${item}`,
    });
    delete item
  }
}
