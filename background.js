'use strict';

function resetEpisodes(items) {
	items.forEach(function (element) {
		resetSingleEpisode(element);
	});
}

function resetSingleEpisode(item) {
	let url;
	url = 'https://' + item.domain + '/gp/video/detail/' + item.id + '/?autoplay=1&t=1';

	console.log(item);

	// todo: add popup html things to do the frontendwork and actually call this page
}

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
			resetEpisodes(msg.items);
		}

	});
});


console.log('background registered');