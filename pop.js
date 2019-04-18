var whitelist;
var requests;

$("#btn_option").click((e) => {
    chrome.tabs.create({ 'url': 'chrome-extension://' + chrome.runtime.id + '/options.html' });
})

chrome.storage.sync.get(["whitelist", "blacklist"], (result) => {
    whitelist = result.whitelist;
    blacklist = result.blacklist;

    chrome.storage.sync.get(["requests"], (result) => {
        requests = result.requests;
        var list_group = $("<ul></ul>");
        list_group.addClass("list-group");
        for (var key in requests) {
            var request = $("<li></li>");
            request.addClass("list-group-item");
            request.addClass("list-group-item-action");
            request.addClass("d-flex");
            request.addClass("justify-content-between");
            request.addClass("align-items-center");
            request.text(key);

            var btn_group = $("<div></div>");
            btn_group.addClass("btn-group");

            // var request_url = $("<span></span>");
            var allow = $("<button>load</button>");
            var disallow = $("<button>block</button>");
            allow.addClass("btn");
            allow.addClass("btn-outline-success");
            disallow.addClass("btn");
            disallow.addClass("btn-outline-danger");
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
            btn_group.append(allow);
            btn_group.append(disallow);
            request.append(btn_group);
            // request.append(allow);
            // request.append(disallow);
            list_group.append(request);
        }
        $("body").append(list_group);
    });
});