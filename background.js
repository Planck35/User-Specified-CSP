var whitelist = {};
var blacklist = {};
whitelist[chrome.runtime.id] = true;

chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.set({ "whitelist": whitelist });
    chrome.storage.sync.set({ "blacklist": blacklist });
});

chrome.storage.sync.get(["whitelist"], (result) => {
    console.log("----");
    console.log(result.whitelist);
    console.log("----");
    whitelist = result.whitelist;
});

chrome.storage.sync.get(["blacklist"], (result) => {
    console.log("****");
    console.log(result.blacklist);
    console.log("****");
    blacklist = result.blacklist;
});



// console.log(whitelist);
chrome.storage.onChanged.addListener((changes, areaName) => {
    // console.log(changes);

    if (changes["whitelist"] != undefined) {
        chrome.storage.sync.get(["whitelist"], (result) => {
            whitelist = result.whitelist;
        });
    }

    if (changes["blacklist"] != undefined) {
        chrome.storage.sync.get(["blacklist"], (result) => {
            blacklist = result.blacklist;
        });
    }
});

// chrome.storage.sync.get(["whitelist"], (result) => {
//     console.log(result.whitelist);
// });

chrome.webRequest.onBeforeRequest.addListener((details) => {
    var thisURL = new URL(details.url);
    var hostName = thisURL.host;
    // console.log(hostName);

    if (whitelist[hostName] == undefined && blacklist[hostName] == undefined) {
        // console.log("blocking" + details.url);
        chrome.storage.sync.get(["requests"], (result) => {
            var requests;
            if (result.requests == undefined) {
                requests = {};
            } else {
                requests = result.requests;
            }
            if (requests[hostName] != true) {
                requests[hostName] = true;
                chrome.storage.sync.set({ "requests": requests });
            }
        });
        return { cancel: true };
    } else if (whitelist[hostName] != undefined && blacklist[hostName] == undefined) {
        // console.log("good to go" + details.url);
        return { cancel: false };
    } else if (blacklist[hostName] != undefined && whitelist[hostName] == undefined) {
        // console.log("Not good to go" + details.url);
        return { cancel: true };
    } else {
        console.log("error: appear on both WL and BL")
        return { cancel: true };
    }
},
    { urls: ["<all_urls>"] },
    ["blocking", "requestBody"]
);