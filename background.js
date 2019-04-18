var whitelist = {};
var blacklist = {};
var blacktype = {};

whitelist[chrome.runtime.id] = true;

chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.set({ "whitelist": whitelist });
    chrome.storage.sync.set({ "blacklist": blacklist });
});

chrome.storage.sync.get(["whitelist", "blacklist", "blacktype"], (result) => {
    if (result.whitelist != undefined) {
        whitelist = result.whitelist;
    }
    if (result.blacklist != undefined) {
        blacklist = result.blacklist;
    }
    if (result.blacktype != undefined) {
        blacktype = result.blacktype;
    }
});

console.log("initial whitelist");
console.log(whitelist);
console.log("initial blacklist");
console.log(blacklist);
console.log("initial blacktype");
console.log(blacktype);

whitelist[chrome.runtime.id] = true;

chrome.storage.onChanged.addListener((changes, areaName) => {
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
    if (changes["blacktype"] != undefined) {
        chrome.storage.sync.get(["blacktype"], (result) => {
            blacktype = result.blacktype;
        });
    }
});


chrome.webRequest.onBeforeRequest.addListener((details) => {

    var thisURL = new URL(details.url);
    var hostName = thisURL.host;
    // console.log("load resource type " + details.type + " from host: " + details.url);

    if (blacktype[details.type] == undefined || blacktype[details.type] == false) {

    } else {
        return { cancel: true };
    }

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
                chrome.browserAction.setBadgeText({ text: Object.keys(requests).length.toString() });
                chrome.storage.sync.set({ "requests": requests });
            }

        });

        return { cancel: true };

    } else if (whitelist[hostName] != undefined && blacklist[hostName] == undefined) {
        return { cancel: false };
        // console.log("good to go" + details.url);
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