var metaArray = document.getElementsByTagName("meta");
var metaPolicy = {}

if (metaArray.length > 0) {

    for (var i = 0; i < metaArray.length; i++) {
        if (metaArray[i].getAttribute("http-equiv") == "Content-Security-Policy") {
            var rawInput = metaArray[i].content;
            if (rawInput == 'upgrade-insecure-requests') {
                metaPolicy['upgrade-insecure-requests'] = 'upgrade-insecure-requests';
            } else {
                var splited = rawInput.split(';');
                for (var index = 0; index < splited.length; index++) {
                    var subPolicy = splited[index].trim();
                    var subPolicySplit = subPolicy.split(' ');
                    var subPolicyName = subPolicySplit[0];
                    var subPolicyArray = subPolicySplit.slice(1);
                    if (metaPolicy[subPolicyName] == undefined) {
                        metaPolicy[subPolicyName] = new Set([]);
                    }
                    for (var subIndex = 0; subIndex < subPolicyArray.length; subIndex++) {
                        metaPolicy[subPolicyName].add(subPolicyArray[subIndex]);
                    }
                }
            }
        }
    }
}


var metaPolicyOuput = "";
for (var key in metaPolicy) {
    if (key == 'upgrade-insecure-requests') {
        metaPolicyOuput = metaPolicyOuput + 'upgrade-insecure-requests' + '\n';
    } else {
        var temp = Array.from(metaPolicy[key]);
        metaPolicyOuput = metaPolicyOuput + key.toString() + ':' + temp.join(',') + '\n';
    }
}
chrome.storage.sync.set({ metaPolicies: metaPolicyOuput }, () => {
    console.log("finish storing meta Policies");
});