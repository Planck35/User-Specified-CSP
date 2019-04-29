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

    }
    chrome.storage.sync.get(["requests"], (result) => {
        requests = result.requests;
        var list_group = $("<ul></ul>");
        list_group.addClass("list-group");
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