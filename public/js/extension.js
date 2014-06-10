var hasExtension = false;
var extensionId = "boknicagoipdeompcgnhjdalnbenclik";
chrome.runtime.sendMessage(extensionId, { message: "version" },
    function (reply) {

            alert(reply);
    }
);