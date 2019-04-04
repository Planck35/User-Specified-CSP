var tabIndex;
var windowIndex;

var csp = {};
var useHttps = false;


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete") {

        tabIndex = tab.index;
        windowIndex = tab.windowId;
        // alert(`tabIndex ${tabIndex} windowIndex${windowIndex}`);
        var output = "";
        if (useHttps) {
            output = "Use https: TRUE\n";
        } else {
            output = "Use https: FALSE\n";
        }
        for (var key in csp) {
            if (key == 'upgrade-insecure-requests') {
                output = output + 'upgrade-insecure-requests' + '\n';
            } else {
                var temp = Array.from(csp[key]);
                output = output + key.toString() + ':' + temp.join(',') + '\n';
            }
        }

        chrome.storage.sync.set({ headPolicies: output }, () => {
            console.log("finish storing head Policies");
        });
        // alert(output);
        csp = {};
    }
});


chrome.webRequest.onHeadersReceived.addListener((details) => {
    if (details.url.slice(0, 5).toUpperCase() == "HTTPS") {
        useHttps = true;
    }
    for (var pointer = 0; pointer < details.responseHeaders.length; pointer += 1) {
        if (details.responseHeaders[pointer]["name"] == "content-security-policy") {
            if (details.responseHeaders[pointer]["value"] == 'upgrade-insecure-requests') {
                csp['upgrade-insecure-requests'] = 'upgrade-insecure-requests';
            } else {
                var rawInput = details.responseHeaders[pointer]["value"];
                var splited = rawInput.split(';');
                for (var index = 0; index < splited.length; index++) {
                    var subPolicy = splited[index].trim();
                    var subPolicySplit = subPolicy.split(' ');
                    var subPolicyName = subPolicySplit[0];
                    var subPolicyArray = subPolicySplit.slice(1);
                    if (csp[subPolicyName] == undefined) {
                        csp[subPolicyName] = new Set([]);
                    }
                    for (var subIndex = 0; subIndex < subPolicyArray.length; subIndex++) {
                        csp[subPolicyName].add(subPolicyArray[subIndex]);
                    }
                }
            }
        } else if (details.responseHeaders[pointer]["name"] == "x-frame-options") {
            chrome.storage.sync.set({ xFrame: details.responseHeaders[pointer]["value"] }, () => {
                console.log("finish storing X-Frame Policies");
            });
        }
    }

},
    { urls: ['https://*/*', 'http://*/*'] },
    ['responseHeaders']);