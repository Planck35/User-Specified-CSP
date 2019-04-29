var whitelist = {};
var blacklist = {};
var blacktype = {};
var easylist = new Set();
var strict_mode = false;
var ad_filter = true;

chrome.runtime.onInstalled.addListener((details) => {
    var easyListUrl = chrome.runtime.getURL('adEasyList.txt');
    fetch(easyListUrl)
        .then((response) => response.text())
        .then(content => {
            var easyListArray = content.split("|");
            easylist = new Set(easyListArray);
            whitelist[chrome.runtime.id] = true;
            chrome.storage.sync.set({ "easylist": easylist });
            chrome.storage.sync.set({ "whitelist": whitelist });
            chrome.storage.sync.set({ "blacklist": blacklist });
        });
});

chrome.storage.sync.get(["whitelist", "blacklist", "blacktype", "easylist", "strict_mode", "ad_filter"], (result) => {
    if (result.whitelist != undefined) {
        whitelist = result.whitelist;
    }
    if (result.blacklist != undefined) {
        blacklist = result.blacklist;
    }
    if (result.blacktype != undefined) {
        blacktype = result.blacktype;
    }
    if (result.easylist != undefined) {
        easylist = result.easylist;
    }
    if (result.strict_mode != undefined) {
        strict_mode = result.strict_mode;
    }
    if (result.ad_filter != undefined) {
        ad_filter = result.ad_filter;
    }
    console.log("initial whitelist");
    console.log(whitelist);
    console.log("initial blacklist");
    console.log(blacklist);
    console.log("initial blacktype");
    console.log(blacktype);
    console.log("initial easylist");
    console.log("easylist set size:" + easylist.size);
    console.log("init strict mode:" + strict_mode + " ad_filter:" + ad_filter);
});

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
    if (changes["strict_mode"] != undefined) {
        chrome.storage.sync.get(["strict_mode"], (result) => {
            strict_mode = result.strict_mode;
        });
    }
    if (changes["ad_filter"] != undefined) {
        chrome.storage.sync.get(["ad_filter"], (result) => {
            ad_filter = result.ad_filter;
        });
    }
});

function isAdURL(hostName) {
    console.log(hostName);
    // console.log("easylist set size:" + easylist.size);
    hostName = hostName.replace('www.', '');
    return easylist.has(hostName);
}

chrome.webRequest.onBeforeRequest.addListener((details) => {

    var thisURL = new URL(details.url);
    var hostName = thisURL.host;
    // console.log("load resource type " + details.type + " from host: " + details.url);

    // console.log("request from:" + details.tabId);
    if (ad_filter && isAdURL(hostName)) {
        return { cancel: true };
    } else {
        if (!(blacktype[details.type] == undefined || blacktype[details.type] == false)) {
            // if details.type exist in the black type, thisbranch will be executed
            return { cancel: true };
        }

        if (whitelist[hostName] == undefined && blacklist[hostName] == undefined) {
            // new host
            if (strict_mode) {
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
            } else {
                return { cancel: false };
            }
        } else if (whitelist[hostName] != undefined && blacklist[hostName] == undefined) {
            // exist in whitelist
            return { cancel: false };
        } else if (blacklist[hostName] != undefined && whitelist[hostName] == undefined) {
            // exist in blacklist
            return { cancel: true };
        } else {
            console.log("error: appear on both WL and BL")
            return { cancel: true };
        }
    }
},
    { urls: ["<all_urls>"] },
    ["blocking", "requestBody"]
);