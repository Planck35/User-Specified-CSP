var blacktype;
var original_types = ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"];
var types = ["Main Website", "Website as component hosted in main website", "Document of webpage styles; beautifier", "Script", "Image", "Font", "Elements from external sources", "Request", "Request (by hyperlink)", "Violation report", "Media", "Real-time communication tunnel", "other"];
var typeText = []

const helpTextScript = new HelpTextScript();
for (var i = 0; i < types.length; i++) {
    var resource = $("<tr></tr>");
    var btn = $('<td><label class="switch"><input type="checkbox"/><span class="slider round"></span></label></td>');
    var info = $('<td class="align-middle"></td>');
    const btnName = "btn_help_" + i;
    var questionMark = $("<td class=\"align-middle\"><button id=" + btnName + " class =\"help-icon btn-primary\">?</td>")
    btn.find("input").attr("id", original_types[i] + "-checkbox");
    btn.find("input").attr("resource-type", original_types[i]);

    info.text(types[i]);
    resource.append(btn);
    resource.append(info);
    resource.append(questionMark)
    $("#resources").append(resource);
    const typeName = types[i]
    const textContent = helpTextScript.getHelpText(i)
    const originalTypeNameText = "Technical name: " + original_types[i]
    $("#" + btnName).on("click", (e) => {
        // alert(typeName)
        $("#modal-title-type-name").text(typeName)
        $("#modal-text-help").text(textContent)
        $("#modal-title-original-type-name").text(originalTypeNameText)
        $("#btn_showHelpModal").click();
    })
}

chrome.storage.sync.get(["blacktype"], (result) => {

    blacktype = result.blacktype;
    // console.log(blacktype);
    if (blacktype == undefined) {
        blacktype = {};
    }
    console.log("start!");
    for (var i = 0; i < types.length; i++) {
        if (types[i] in blacktype) {
            $("#" + original_types[i] + "-checkbox").prop('checked', blacktype[original_types[i]]);
        }
        console.log("triggered!");
        $("#" + original_types[i] + "-checkbox").click(function () {
            if ($(this).is(":checked")) {
                console.log($(this).attr("resource-type") + " checked");
                blacktype[$(this).attr("resource-type")] = true;
            } else {
                blacktype[$(this).attr("resource-type")] = false;
                console.log($(this).attr("resource-type") + " unchecked");
            }
        })
    }
    console.log("finish!");
    $("#save-type-setting").click(function () {
        console.log("triggered!");
        console.log(blacktype);
        chrome.storage.sync.set({ "blacktype": blacktype }, function () {
            alert("Your setting has been saved!");
            console.log(blacktype);
        });
    })
})