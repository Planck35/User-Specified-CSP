var whitelist;
var requests;


chrome.storage.sync.get(["whitelist", "blacklist"], (result) => {
    whitelist = result.whitelist;
    blacklist = result.blacklist;

    chrome.storage.sync.get(["requests"], (result) => {
        requests = result.requests;
        for (var key in requests) {
            var request = $("<div></div>");
            var request_url = $("<span></span>");
            var allow = $("<button>allow</button>");
            var disallow = $("<button>disallow</button>");
            request.addClass("request");
            request_url.text(key).addClass("btn btn-warning btn-sm").css("width", "220px");
            allow.addClass("btn btn-success btn-sm").css("width", "80px");;
            disallow.addClass("btn btn-danger btn-sm").css("width", "80px");
            allow.click(function () {
                var request = $(this).parent()
                request.hide()
                var hostname = request.find("span").text();
                whitelist[hostname] = true;
                delete requests[hostname];
                // save the new whitelist into local storage

                chrome.browserAction.setBadgeText({ text: Object.keys(requests).length.toString() });
                chrome.storage.sync.set({ "whitelist": whitelist });
                chrome.storage.sync.set({ "requests": requests });
            })
            disallow.click(function () {
                var request = $(this).parent()
                request.hide()
                var hostname = request.find("span").text();
                blacklist[hostname] = true;
                delete requests[hostname];
                // save the new whitelist into local storage
                chrome.browserAction.setBadgeText({ text: Object.keys(requests).length.toString() });
                chrome.storage.sync.set({ "blacklist": blacklist });
                chrome.storage.sync.set({ "requests": requests });
            })

            request.append(allow);
            request.append(request_url);
            request.append(disallow);
            $("body").append(request);
        }
    });
});

