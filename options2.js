var blacktype;
var types = ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"];
var typeText = []

const helpTextScript = new HelpTextScript();
for (var i = 0; i < types.length; i++) {
    var resource = $("<tr></tr>");
    var btn = $('<td><label class="switch"><input type="checkbox"/><span class="slider round"></span></label></td>');
    var info = $('<td class="align-middle"></td>');
    const btnName = "btn_help_"+i;
    var questionMark = $("<td class=\"align-middle\"><button id=" + btnName + " class =\"help-icon btn-primary\">?</td>")
    btn.find("input").attr("id", types[i] + "-checkbox");
    btn.find("input").attr("resource-type", types[i]);

    info.text(types[i]);
    resource.append(btn);
    resource.append(info);
    resource.append(questionMark)
    $("#resources").append(resource);
    const typeName = types[i]
    const textContent = helpTextScript.getHelpText(i)
    $("#"+btnName).on("click",(e)=>{
        // alert(typeName)
        $("#modal-title-type-name").text(typeName)
        $("#modal-text-help").text(textContent)
        $("#btn_showHelpModal").click();
    })
}

var save_btn = $('<tr><td><button id="save-type-setting" class="btn btn-outline-primary">Save</button></td><td></td></tr>');
$("#resources").append(save_btn);

chrome.storage.sync.get(["blacktype"], (result) => {
    blacktype = result.blacktype;
    console.log(blacktype);
    if (blacktype == undefined) {
        blacktype = {};
    }

    for (var i = 0; i < types.length; i++) {
        if (types[i] in blacktype) {
            $("#" + types[i] + "-checkbox").prop('checked', blacktype[types[i]]);
        }
        $("#" + types[i] + "-checkbox").click(function() {
            if ($(this).is(":checked")) {
                console.log($(this).attr("resource-type") + " checked");
                blacktype[$(this).attr("resource-type")] = true;
            } else  {
                blacktype[$(this).attr("resource-type")] = false;
                console.log($(this).attr("resource-type") + " unchecked");
            }
        })
    }
    $("#save-type-setting").click(function() {
        console.log(blacktype);
        chrome.storage.sync.set({ "blacktype": blacktype }, function() {
            alert("Your setting has been saved!");
            console.log(blacktype);
        });
    })
})