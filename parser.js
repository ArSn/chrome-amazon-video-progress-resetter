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

let progress;

function showDialog()
{
	let backdrop = document.createElement('div');
	backdrop.id = 'kaz-av-backdrop';

	let dialog = document.createElement('div');
	dialog.id = 'kaz-av-dialog';

	let episodesCount = parseEpisodes().length;

	dialog.innerHTML = '<p>I found a total of <strong>' + episodesCount + ' episodes</strong> that I can reset for you.</p>';

	progress = document.createElement('div');
	dialog.append(progress);

	let confirmationQuestion = document.createElement('p');
	confirmationQuestion.innerText = 'Do you want me to start with it?';

	let confirmButton = document.createElement('button');
	confirmButton.innerText = 'Start!';
	confirmButton.className = 'confirm';
	confirmButton.addEventListener('click', function () {
		console.log('I would do it now');
		progress.innerHTML = '<p>Starting ...</p>';
		chrome.runtime.sendMessage({
			text: "trigger_reset",
			items: parseEpisodes(),
		});
	});

	let cancelButton = document.createElement('button');
	cancelButton.innerText = 'Cancel';
	cancelButton.className = 'cancel';
	cancelButton.addEventListener('click', hideDialog);

	progress.append(confirmationQuestion, confirmButton, cancelButton);

	document.querySelector('body').append(backdrop, dialog);
}

function hideDialog()
{
	console.log('Closing dialog!');
	document.getElementById('kaz-av-backdrop').remove();
	document.getElementById('kaz-av-dialog').remove();
}

function updateProgress(totalCount, remainingCount)
{
	progress.innerHTML = '<p>There are ' + remainingCount + ' of ' + totalCount + ' episodes remaining to be reset.</p><p>Please wait ...</p>';
}

function reportResetFinished()
{
	progress.innerHTML = '<p>All episodes have been successfully reset.</p>' +
		'<p>Please go to the next season page if you want to continue resetting.</p>' +
		'<button id="kaz-av-close" class="confirm success">Close</button>';

	document.getElementById('kaz-av-close').addEventListener('click', hideDialog);
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

			showDialog();

		} else {
			alert('No seasons found on this page');
		}
	} else if (msg.text === 'report_reset_status') {
		updateProgress(msg.totalEpisodeCount, msg.remainingEpisodeCount);
	} else if (msg.text === 'report_reset_finished') {
		reportResetFinished();
	}
});

console.log('parser registered');