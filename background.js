
chrome.browserAction.onClicked.addListener(function (tab){
	var url = chrome.extension.getURL("options.html");
	var createProperties = {
		"url": url
	};
	chrome.tabs.create(createProperties);
});