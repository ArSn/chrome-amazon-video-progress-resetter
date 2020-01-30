"use strict";

console.log('start of parser');

function pageLooksLikeSeasonPage() {
	return parseEpisodes() !== false;
}

function parseEpisodes() {
	let itemsNodes = document.querySelectorAll('.dv-episode-playback-title');
	if (!itemsNodes || !itemsNodes.length) {
		return false;
	}

	let items = [];
	let progressNode, progress;

	itemsNodes.forEach(function (element, index) {

		progress = 0;
		progressNode = element.querySelector('span[aria-valuemax="100"]');
		if (progressNode) {
			progress = progressNode.getAttribute('aria-valuenow');
		}

		items.push({
            'index': index,
            'title': element.querySelector('.js-episode-title-name span').innerHTML,
			'progress': parseInt(progress),
        });
	});

	console.log(items);
}


chrome.runtime.onMessage.addListener(function (msg) {

	console.log('message received');

	if (msg.text === 'reset_progress') {
		console.log('parsing ...');

		// parseEpisodes();
		// return;

		if (pageLooksLikeSeasonPage()) {
			let confirmation = confirm('Are you sure you want to reset the progress?');
			console.log('continue resetting? ', confirmation);
			// todo: implement actual resetting here
		} else {
			alert('No seasons found on this page');
		}
	}
});

console.log('parser registered');