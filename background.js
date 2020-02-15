'use strict';

let backgroundTotalEpisodeCount = 0;
let backgroundSenderTabId = 0;

function resetEpisodes(episodeList) {

	if (episodeList.length === 0) {
		console.log('No episodes left to reset. Process finished.');
		chrome.tabs.sendMessage(backgroundSenderTabId, {
			text: 'report_reset_finished',
		});
		return;
	}

	let item = episodeList.shift();

	console.log('Working on item with id: ' + item.id + ' ...');

	if (item.progress <= 20) {
		console.log('Progress (' + item.progress + ') is below threshold, skipping reset.');
		resetEpisodes(episodeList);
		return;
	}

	let url;
	url = 'https://' + item.domain + '/gp/video/detail/' + item.id + '/?autoplay=1&t=1';

	chrome.tabs.create({ url: url }, function (tab) {
		chrome.tabs.update(tab.id, {muted:true});
		console.log('Created the tab!');
		console.log(tab);

		setTimeout(function () {
			chrome.tabs.update(backgroundSenderTabId, { active: true });
		}, 5000);

		setTimeout(function () {
			console.log('Closing tab again');
			chrome.tabs.remove(tab.id);

			if (episodeList.length > 0) {
				chrome.tabs.sendMessage(backgroundSenderTabId, {
					text: 'report_reset_status',
					totalEpisodeCount: backgroundTotalEpisodeCount,
					remainingEpisodeCount: episodeList.length,
				});
				resetEpisodes(episodeList);
			} else {
				chrome.tabs.sendMessage(backgroundSenderTabId, {
					text: 'report_reset_finished',
				});
			}
			// todo: https://www.w3schools.com/tags/av_event_play.asp --> wait 2 seconds or so after play start, not just 7 secs total
		}, 10000);
	});


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

	chrome.runtime.onMessage.addListener(function (msg, sender) {

		if (msg.text === 'trigger_reset') {
			console.log('background received task to reset the following episodes');
			backgroundSenderTabId = sender.tab.id;
			backgroundTotalEpisodeCount = msg.items.length;
			resetEpisodes(msg.items);
		}

	});
});


console.log('background registered');