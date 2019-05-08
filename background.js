var whitelist = {};
var blacklist = {};
var blacktype = {};
var easylist = new Set();
// key: tabId, value: visit times
var maliciousRecode = {};
var authorizedBlackList = new Set();
var strict_mode = false;
var ad_filter = false;

chrome.runtime.onInstalled.addListener((details) => {
    var easyListUrl = chrome.runtime.getURL("adEasyList.txt");

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

chrome.storage.sync.set({ "maliciousRecode": maliciousRecode });

// because this file might be big, we don't store it in storage service
var authorizedBlackListUrl = chrome.runtime.getURL("processed-bad-domains.json");
fetch(authorizedBlackListUrl)
    .then((response) => (response.json()))
    .then(content => {
        authorizedBlackList = new Set(content);
        console.log("initialize authorized blacklist, size:" + authorizedBlackList.size);
    });

chrome.storage.sync.get(["whitelist", "blacklist", "blacktype", "easylist", "strict_mode", "ad_filter"], (result) => {
    if (result.whitelist != undefined) {
        whitelist = result.whitelist;
        console.log("initial whitelist");
        console.log(whitelist);
    }
    if (result.blacklist != undefined) {
        blacklist = result.blacklist;
        console.log("initial blacklist");
        console.log(blacklist);
    }
    if (result.blacktype != undefined) {
        blacktype = result.blacktype;
        console.log("initial blacktype");
        console.log(blacktype);
    }
    if (result.easylist != undefined) {
        easylist = result.easylist;
        console.log("initial easylist");
        console.log("easylist set size:" + easylist.size);
    }
    if (result.strict_mode != undefined) {
        strict_mode = result.strict_mode;
    }
    if (result.ad_filter != undefined) {
        ad_filter = result.ad_filter;
    }
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
    if (changes["maliciousRecode"] != undefined) {
        chrome.storage.sync.get(["maliciousRecode"], (result) => {
            maliciousRecode = result.maliciousRecode;
            console.log(maliciousRecode);
            if (Object.keys(maliciousRecode).length == 0) {
                chrome.browserAction.setBadgeBackgroundColor({ color: "#0000FF" });
            } else {
                console.log("its bad!");
                chrome.browserAction.setBadgeBackgroundColor({ color: "#EF500B" });
            }
        });
    }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (maliciousRecode[tabId] != undefined) {
        delete maliciousRecode[tabId];
        chrome.storage.sync.set({ "maliciousRecode": maliciousRecode });
    }
});

function isAdURL(hostName) {
    // console.log(hostName);
    // console.log("easylist set size:" + easylist.size);
    hostName = hostName.replace('www.', '');
    do {
        // console.log(hostName);
        if (easylist.has(hostName)) {
            return true;
        } else {
            if (hostName.indexOf(".") == -1) {
                return easylist.has(hostName);
            } else {
                hostName = hostName.substring(hostName.indexOf(".") + 1);
            }
        }

    } while (hostName.indexOf(".") != -1)
    // return easylist.has(hostName);
    return easylist.has(hostName);
}

chrome.webRequest.onBeforeRequest.addListener((details) => {

    var thisURL = new URL(details.url);
    var hostName = thisURL.host;
    var shortedHostName = hostName.replace('www.', '');
    // console.log("load resource type " + details.type + " from url: " + details.url + " host is: " + hostName);
    if (authorizedBlackList.has(shortedHostName)) {
        if (maliciousRecode[details.tabId] == undefined) {
            maliciousRecode[details.tabId] = 1;
        } else {
            maliciousRecode[details.tabId] += 1;
        }
        chrome.storage.sync.set({ "maliciousRecode": maliciousRecode });
        return { cancel: true };
    }

    if (ad_filter && isAdURL(hostName)) {
        console.log("blocking " + hostName);
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
