// function loadHeader() {
//     chrome.storage.sync.get('headPolicies', (data) => {
//         if (data.headPolicies == undefined) {
//             document.getElementById("header").innerHTML = "None";
//         } else {
//             document.getElementById("header").innerHTML = data.headPolicies.replace(/\n/g, "<br />");;
//         }
//     });

//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.executeScript(
//             tabs[0].id,
//             {
//                 file: 'scriptHTML.js'
//             }, () => {
//                 chrome.storage.sync.get('metaPolicies', (data) => {

//                     if (data.metaPolicies == undefined || data.metaPolicies == "") {
//                         document.getElementById("tags").innerHTML = "None";
//                     } else {
//                         document.getElementById("tags").innerHTML = data.metaPolicies.replace(/\n/g, "<br />");
//                     }
//                 });
//                 chrome.storage.sync.get('xFrame', (data) => {
//                     if (data.xFrame == undefined || data.xFrame == "") {
//                         document.getElementById("xFrame").innerHTML = "None";
//                     } else {
//                         document.getElementById("xFrame").innerHTML = data.xFrame;
//                     }
//                 });
//             });
//     });
// }

// function debug() {

// }
// debug();
// loadHeader();

// chrome.storage.sync.set({ "whitelist": { "www.facebook.com": true } });
// chrome.storage.sync.get(["whitelist"], (result) => {
//     console.log(result.whitelist);
// });

var whitelist;
var requests;

// alert("white");
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
            allow.click(function() {
                var request = $(this).parent()
                request.hide()
                var hostname = request.find("span").text();
                whitelist[hostname] = true;
                delete requests[hostname];
                // save the new whitelist into local storage
                chrome.storage.sync.set({ "whitelist": whitelist });
                chrome.storage.sync.set({ "requests": requests });
            })
            disallow.click(function() {
                var request = $(this).parent()
                request.hide()
                var hostname = request.find("span").text();
                blacklist[hostname] = true;
                delete requests[hostname];
                // save the new whitelist into local storage
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

