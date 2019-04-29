var whitelist;
var requests;
var maliciousRecode;

$("#btn_option").click((e) => {
    chrome.tabs.create({ 'url': 'chrome-extension://' + chrome.runtime.id + '/options.html' });
})

chrome.storage.sync.get(["whitelist", "blacklist", "maliciousRecode"], (result) => {
    whitelist = result.whitelist;
    blacklist = result.blacklist;
    maliciousRecode = result.maliciousRecode;

    if (Object.keys(maliciousRecode).length != 0) {
        var list_group = $("<ul></ul>");
        list_group.addClass("list-group");
        var title = $("<li></li>");

        title.addClass("list-group-item");
        title.addClass("list-group-item-action");
        title.css("background-color", "#ef694f");
        title.append($("<h4>Suspicious webpage detected!</h4>"));
        title.append($("<p>Below websites is trying to send requests to publicly blacklisted URL. Please close them immediately</p>"))
        list_group.append(title);
        var keyArray = Object.keys(maliciousRecode);
        for (var index = 0; index < keyArray.length; index++) {
            // console.log(keyArray[index]);
            const currentIndex = index;
            chrome.tabs.get(parseInt(keyArray[index]), (tab) => {
                var item = $("<li></li>");
                item.addClass("list-group-item");
                item.addClass("list-group-item-action");

                // console.log("enter herer");
                var thisURL = new URL(tab.url);
                var hostName = thisURL.host;
                item.append($(`<div>${hostName} - visit time: ${maliciousRecode[keyArray[currentIndex]]}</div>`));
                list_group.append(item);
                console.log(index);
                console.log(typeof index);
                console.log(keyArray.length - 1);
                if (currentIndex == keyArray.length - 1) {
                    console.log("add it");
                    $("body").append(list_group);
                }
            });
        }
    }
    chrome.storage.sync.get(["requests"], (result) => {
        requests = result.requests;
        var list_group = $("<ul></ul>");
        list_group.addClass("list-group");
        if (requests && Object.keys(requests).length != 0) {
            var title = $("<li></li>");
            title.addClass("list-group-item");
            title.addClass("list-group-item-action");
            title.append($("<h4>unknown hostname list</h4>"));
            list_group.append(title);
        }
        for (var key in requests) {
            var request = $("<li></li>");
            var requestDiv = $("<div></div>");

            request.addClass("list-group-item");
            request.addClass("list-group-item-action");

            var hostNameSpan = $("<div></div>");
            hostNameSpan.text(key);
            hostNameSpan.addClass("col-8");
            requestDiv.append(hostNameSpan);
            requestDiv.addClass("row");

            var btn_group = $("<div></div>");
            btn_group.addClass("btn-group");
            btn_group.addClass("col-4");

            var allow = $("<button>load</button>");
            var disallow = $("<button>block</button>");
            allow.addClass("btn");
            allow.addClass("btn-outline-success");
            disallow.addClass("btn");
            disallow.addClass("btn-outline-danger");
            allow.click(function () {
                var request = $(this).parent();
                request.parent().parent().hide();
                var hostname = request.prev()["0"].textContent;

                whitelist[hostname] = true;
                delete requests[hostname];
                // console.log(hostname);
                // save the new whitelist into local storage

                chrome.browserAction.setBadgeText({ text: Object.keys(requests).length.toString() });
                chrome.storage.sync.set({ "whitelist": whitelist });
                chrome.storage.sync.set({ "requests": requests });
            })
            disallow.click(function () {
                var request = $(this).parent();
                request.parent().parent().hide();
                var hostname = request.prev()["0"].textContent;

                blacklist[hostname] = true;
                delete requests[hostname];
                // save the new whitelist into local storage
                chrome.browserAction.setBadgeText({ text: Object.keys(requests).length.toString() });
                chrome.storage.sync.set({ "blacklist": blacklist });
                chrome.storage.sync.set({ "requests": requests });
            })

            btn_group.append(allow);
            btn_group.append(disallow);
            requestDiv.append(hostNameSpan);
            requestDiv.append(btn_group);
            request.append(requestDiv);
            // request.append(allow);
            // request.append(disallow);
            list_group.append(request);
        }
        $("body").append(list_group);
    });

});