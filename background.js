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

	// for debug
	// chrome.declarativeContent.onPageChanged.getRules(undefined, function(rule) {
	// 	console.log('single rule', rule);
	// });

	// chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
	// 	console.log('adding rules!');
	// 	chrome.declarativeContent.onPageChanged.addRules([
	// 		{
	// 			conditions: [
	// 				new chrome.declarativeContent.PageStateMatcher({
	// 					pageUrl: {hostContains: '.amazon.'},
	// 					css: ['.dv-episode-playback-title'],
	// 				})
	// 			],
	// 			actions: [
	// 				// new chrome.declarativeContent.ShowPageAction(),
	// 				new chrome.declarativeContent.RequestContentScript({
	// 					js: ['parser.js'],
	// 					css: ['dialog.css'],
	// 				}),
	// 			]
	// 		},
	// 		{
	// 			conditions: [
	// 				new chrome.declarativeContent.PageStateMatcher({
	// 					pageUrl: {hostContains: '.amazon.'},
	// 				})
	// 			],
	// 			actions: [
	// 				new chrome.declarativeContent.RequestContentScript({
	// 					js: ['page-action-handler.js'],
	// 				}),
	// 			]
	// 		}
	// 	]);
	// });

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
		} else if (msg.text === 'hide_page_action') {
			console.log('hiding tab with id ' + sender.tab.id);
			chrome.pageAction.hide(sender.tab.id);
			chrome.pageAction.setIcon({
				tabId: sender.tab.id,
				path: {
					20: 'images/logo-20-gray.png',
					40: 'images/logo-40-gray.png',
					60: 'images/logo-60-gray.png',
					80: 'images/logo-80-gray.png',
					200: 'images/logo-200-gray.png',
					668: 'images/logo-668-gray.png',
				},
			});
		} else if (msg.text === 'show_page_action') {
			console.log('showing tab with id ' + sender.tab.id);
			chrome.pageAction.show(sender.tab.id);
			chrome.tabs.executeScript(sender.tab.id, {file: 'parser.js'}, function() {
				chrome.pageAction.setIcon({
					tabId: sender.tab.id,
					path: {
						20: 'images/logo-20.png',
						40: 'images/logo-40.png',
						60: 'images/logo-60.png',
						80: 'images/logo-80.png',
						200: 'images/logo-200.png',
						668: 'images/logo-668.png',
					},
				});
			});
		}

	});
});


console.log('background registered');