var popHTML = "chrome-extension://" + chrome.runtime.id + "/pop.html";
var popJS = "chrome-extension://" + chrome.runtime.id + "/pop.js";

console.log(popJS);
var whitelist = {
    popHTML: true,
    popJS: true
};

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
    console.log(details.url);
    // console.log(chrome.runtime.id);
    var thisURL = new URL(details.url);
    var hostName = thisURL.host;

    if (whitelist[hostName] == undefined) {
        return { cancel: true };
    } else {
        return { cancel: false };
    }
},
    { urls: ["<all_urls>"] },
    ["blocking", "requestBody"]
);
