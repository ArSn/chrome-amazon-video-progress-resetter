'use strict';

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

	itemsNodes.forEach(function (element) {

		progress = 0;
		progressNode = element.querySelector('span[aria-valuemax="100"]');
		if (progressNode) {
			progress = progressNode.getAttribute('aria-valuenow');
		}

		items.push({
            'id': element.querySelector('a[data-title-id]').getAttribute('data-title-id'),
			'domain': window.top.location.host,
			'title': element.querySelector('.js-episode-title-name span').innerHTML,
			'progress': parseInt(progress),
        });
	});

	return items;
}

function showOverlay()
{

	let backdrop = document.createElement('div');
	backdrop.id = 'kaz-av-backdrop';

	let overlay = document.createElement('div');
	overlay.id = 'kaz-av-dialog';

	let episodesCount = parseEpisodes().length;

	overlay.innerHTML = '<p>I found a total of <strong>' + episodesCount + ' episodes</strong> that I can reset for you.<br><br>Do you want me to start with it?</p>';

	let confirmButton = document.createElement('button');
	confirmButton.innerText = 'Start!';
	confirmButton.className = 'confirm';
	confirmButton.addEventListener('click', function () {
		console.log('I would do it now');
	});

	let cancelButton = document.createElement('button');
	cancelButton.innerText = 'Cancel';
	cancelButton.className = 'cancel';
	cancelButton.addEventListener('click', function () {
		console.log('Closing overlay!');
		document.querySelector('body').removeChild(backdrop);
		document.querySelector('body').removeChild(overlay);
	});

	overlay.append(confirmButton, cancelButton);

	document.querySelector('body').append(backdrop, overlay);
}


chrome.runtime.onMessage.addListener(function (msg) {

	console.log('message received');

	if (msg.text === 'get_reset_confirmation') {
		console.log('parsing ...');

		// parseEpisodes();
		// return;

		if (pageLooksLikeSeasonPage()) {
			// let confirmation = confirm('Are you sure you want to reset the progress?');
			let confirmation = true; // just for debug
			console.log('continue resetting? ', confirmation);

			showOverlay();

			if (confirmation) {
				// chrome.runtime.sendMessage({text: "trigger_reset", items: parseEpisodes()});
			}

		} else {
			alert('No seasons found on this page');
		}
	}
});

console.log('parser registered');