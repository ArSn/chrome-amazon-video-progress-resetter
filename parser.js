"use strict";

console.log('start of parser');

function pageLooksLikeSeasonPage() {
	// todo: check whether page looks like video page and there are episodes to reset
	return true;
}

function parseEpisodes() {
	let titles = document.querySelectorAll('.js-episode-title-name span');
	if (!titles) {
		return false;
	}

	let names = [];

	titles.forEach(function (element, index) {
		names.push({
            'index': index,
            'title': element.innerHTML,
        });
	});

	console.log(names);
}


chrome.runtime.onMessage.addListener(function (msg) {

	console.log('message received');

	if (msg.text === 'reset_progress') {
		console.log('parsing ...');

		parseEpisodes();

		return;
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