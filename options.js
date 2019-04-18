// Saves options to chrome.storage
// function save_options() {
//     var color = document.getElementById('color').value;
//     var likesColor = document.getElementById('like').checked;
//     chrome.storage.sync.set({
//         favoriteColor: color,
//         likesColor: likesColor
//     }, function () {
//         // Update status to let user know options were saved.
//         var status = document.getElementById('status');
//         status.textContent = 'Options saved.';
//         setTimeout(function () {
//             status.textContent = '';
//         }, 750);
//     });
// }

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
// function restore_options() {
//     // Use default value color = 'red' and likesColor = true.
//     chrome.storage.sync.get({
//         favoriteColor: 'red',
//         likesColor: true
//     }, function (items) {
//         document.getElementById('color').value = items.favoriteColor;
//         document.getElementById('like').checked = items.likesColor;
//     });
// }
//
// document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('save').addEventListener('click',
//     save_options);
var whitelist
var blacklist

function addToWL(key){
    let request = $("<tr id='tr_"+ key +"'></tr>");
    let request_url = $("<td class='keyName'>").text(key);;
    let btn_delete = $("<td><button>Delete</button></td>")
    btn_delete.click(function () {
        var request = $(this).parent()
        request.hide()
        var key = request.find(".keyName").text();
        delete whitelist[key];
        // save the new whitelist into local storage
        chrome.storage.sync.set({ "whitelist": whitelist });
    })
    request.append(request_url);
    request.append(btn_delete);
    $("#tbody_wl").append(request);
}

function addToBL(key){
    let request = $("<tr id='tr_"+ key +"'></tr>");
    let request_url = $("<td class='keyName'>").text(key);;
    let btn_delete = $("<td><button>Delete</button></td>")
    btn_delete.click(function () {
        var request = $(this).parent()
        request.hide()
        var key = request.find(".keyName").text();
        delete blacklist[key];
        console.log(blacklist)
        console.log(key)
        chrome.storage.sync.set({ "blacklist": blacklist});
    })
    request.append(request_url);
    request.append(btn_delete);
    $("#tbody_bl").append(request);
}
$("#form_addToWL").submit((e)=>{
    e.preventDefault();
    let url = $("#input_wlURL").val();
    if(blacklist[url] != undefined || blacklist[url]!=null){
        alert("This url is found in blacklist! Please click the \"move to WL\" button next to the URL");
    } else {
        whitelist[url] = true;
        chrome.storage.sync.set({ "whitelist": whitelist });
        addToWL(url);
    }
})

$("#form_addToBL").submit((e)=>{
    e.preventDefault();
    let url = $("#input_blURL").val();
    if(whitelist[url] != undefined || whitelist[url]!=null){
        alert("This url is found in whitelist! Please click the \"move to BL\" button next to the URL");
    } else {
        blacklist[url] = true;
        chrome.storage.sync.set({ "blacklist": blacklist});
        addToBL(url);
    }
})

chrome.storage.sync.get(["whitelist", "blacklist"], (result) => {
    whitelist = result.whitelist;
    blacklist = result.blacklist;
    console.log(whitelist)
    for (var key in whitelist) {
        addToWL(key);
    }

    for (var key in blacklist) {
        addToBL(key);
    }

});


