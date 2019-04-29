var strictMode;
var adFilter;
chrome.storage.sync.get(["strict_mode", "ad_filter"], (result) => {
    strictMode = result.strict_mode;
    adblockMode = result.ad_filter;
    console.log("adblockMode: " + adblockMode);
    //console.log(blacktype);
    if (strictMode == undefined) {
        strictMode = false;
    }
    if (adblockMode == undefined) {
        adblockMode = false;
    }
    if (strictMode) {
        $("#strict-mode-switch").prop("checked", true);
        setStrictMode();
    } else {
        $("#strict-mode-switch").prop("checked", false);
        setRegularMode();
    }
    if (adblockMode) {
        $("#ad-filter-switch").prop("checked", true);
        startAdblock();
    } else {
        $("#ad-filter-switch").prop("checked", false);
        stopAdblock();
    }

})

$("#strict-mode-switch").click(function() {
    if ($(this).is(":checked")) {
        chrome.storage.sync.set({ "strict_mode": true }, function() {
            alert("You have changed to strict mode!");
            setStrictMode();
        });
    } else  {
        chrome.storage.sync.set({ "strict_mode": false }, function() {
            alert("You have changed to regular mode!");
            setRegularMode();
        });
    }
})

$("#ad-filter-switch").click(function() {
    if ($(this).is(":checked")) {
        chrome.storage.sync.set({ "ad_filter": true }, function() {
            alert("You have changed to adblock mode!");
            startAdblock();
        });
    } else  {
        chrome.storage.sync.set({ "ad_filter": false }, function() {
            alert("You have exited adblock mode!");
            stopAdblock();
        });
    }
})

function setStrictMode() {
    var desc_unknown = $("#desc_unknown");
    desc_unknown.removeClass("badge-success");
    desc_unknown.addClass("badge-warning");
    desc_unknown.text("Ask you")
}

function setRegularMode() {
    var desc_unknown = $("#desc_unknown");
    desc_unknown.removeClass("badge-warning");
    desc_unknown.addClass("badge-success");
    desc_unknown.text("Allowed")
}

function startAdblock() {
    var desc_adblock = $("#desc_ad");
    desc_adblock.removeClass("badge-success");
    desc_adblock.addClass("badge-danger");
    desc_adblock.text("Blocked");
}

function stopAdblock() {
    var desc_adblock = $("#desc_ad");
    desc_adblock.removeClass("badge-danger");
    desc_adblock.addClass("badge-success");
    desc_adblock.text("Allowed");
}
