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

chrome.storage.sync.set({ "whitelist": { "www.facebook.com": true } });
chrome.storage.sync.get(["whitelist"], (result) => {
    console.log(result.whitelist);
});