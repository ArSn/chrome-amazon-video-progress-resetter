'use strict';

chrome.runtime.onInstalled.addListener(function () {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: {hostContains: '.amazon.'},
					})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});

	chrome.pageAction.onClicked.addListener(function (tab) {

		console.log('clicked...');
		chrome.tabs.sendMessage(tab.id, {text: 'get_reset_confirmation'});

	});

	chrome.runtime.onMessage.addListener(function (msg) {

		if (msg.text === 'trigger_reset') {
			console.log('background received task to reset the following episodes');
			console.log(msg.items);
		}

	});
});


console.log('background registered');