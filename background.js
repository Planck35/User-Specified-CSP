var whitelist;

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (changes["whitelist"] != undefined) {
        whitelist = changes["whitelist"];
    }
});


chrome.webRequest.onBeforeRequest.addListener((details) => {
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
