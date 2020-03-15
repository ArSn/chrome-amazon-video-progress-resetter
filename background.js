'use strict';

let shouldDebug = true;
function kazDebug(...args) {
	if (shouldDebug) {
		console.log(...args);
	}
}

let backgroundTotalEpisodeCount = 0;
let backgroundSenderTabId = 0;
let episodeList = [];

function resetEpisodes() {

	if (episodeList.length === 0) {
		kazDebug('No episodes left to reset. Process finished.');
		chrome.tabs.sendMessage(backgroundSenderTabId, {
			text: 'report_reset_finished',
		});
		return;
	}

	let item = episodeList.shift();

	kazDebug('Working on item with id: ' + item.id + ' ...');

	if (item.progress <= 20) {
		kazDebug('Progress (' + item.progress + ') is below threshold, skipping reset.');
		reportResetStatus();
		setTimeout(function () {
			resetEpisodes();
		}, 1000);
		return;
	}

	let url;
	url = 'https://' + item.domain + '/gp/video/detail/' + item.id + '/?autoplay=1&t=1';

	chrome.tabs.create({ url: url }, function (tab) {
		chrome.tabs.update(tab.id, {muted:true});
		kazDebug('Created the tab!');
		kazDebug(tab);

		chrome.tabs.executeScript(tab.id, {file: 'video-progress-sniffer.js'});
	});

	// todo: add popup html things to do the frontendwork and actually call this page
}

function reportResetStatus()
{
	chrome.tabs.sendMessage(backgroundSenderTabId, {
		text: 'report_reset_status',
		totalEpisodeCount: backgroundTotalEpisodeCount,
		remainingEpisodeCount: episodeList.length,
	});
}

chrome.runtime.onInstalled.addListener(function () {

	chrome.pageAction.onClicked.addListener(function (tab) {

		kazDebug('clicked...');
		chrome.tabs.sendMessage(tab.id, {text: 'get_reset_confirmation'});

	});

	chrome.runtime.onMessage.addListener(function (msg, sender) {

		if (msg.text === 'trigger_reset') {
			kazDebug('background received task to reset the following episodes');
			backgroundSenderTabId = sender.tab.id;
			backgroundTotalEpisodeCount = msg.items.length;
			episodeList = msg.items;
			reportResetStatus();
			resetEpisodes();
		} else if (msg.text === 'hide_page_action') {
			kazDebug('hiding tab with id ' + sender.tab.id);
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
			kazDebug('showing tab with id ' + sender.tab.id);
			chrome.pageAction.show(sender.tab.id);
			chrome.tabs.executeScript(sender.tab.id, {file: 'parser.js'}, function() {
				chrome.tabs.insertCSS(sender.tab.id, {file: 'dialog.css'}, function () {
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
			});
		} else if (msg.text === 'unfocus_video_tab') {
			chrome.tabs.update(backgroundSenderTabId, { active: true });
		} else if (msg.text === 'close_video_tab') {
			kazDebug('Closing tab again');
			chrome.tabs.remove(sender.tab.id);

			if (episodeList.length > 0) {
				reportResetStatus();
				setTimeout(function () {
					resetEpisodes();
				}, 1000);
			} else {
				chrome.tabs.sendMessage(backgroundSenderTabId, {
					text: 'report_reset_finished',
				});
			}
		}

	});
});


kazDebug('background registered');