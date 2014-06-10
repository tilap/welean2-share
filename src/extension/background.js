


setPourcentage = function(number) {
    chrome.browserAction.setBadgeText({text:number.toString()});
}

setPourcentage(60);

chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "http://share:1337";
    chrome.tabs.create({ url: newURL });
});


chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    sendResponse('hello');
  });