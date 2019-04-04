var whitelist = {};
whitelist[chrome.runtime.id] = true;

console.log(whitelist);
chrome.storage.onChanged.addListener((changes, areaName) => {
    console.log(changes);
    if (changes["whitelist"] != undefined) {
        whitelist = changes["whitelist"]["newValue"];
    }
});

chrome.storage.sync.get(["whitelist"], (result) => {
    console.log(result.whitelist);
});

chrome.webRequest.onBeforeRequest.addListener((details) => {
    var thisURL = new URL(details.url);
    var hostName = thisURL.host;
    console.log(hostName);
    if (whitelist[hostName] == undefined) {
        console.log("blocking" + details.url);
        return { cancel: true };
    } else {
        console.log("good to go" + details.url);
        return { cancel: false };
    }
},
    { urls: ["<all_urls>"] },
    ["blocking", "requestBody"]
);