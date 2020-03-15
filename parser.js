'use strict';

kazDebug('start of parser');

function pageLooksLikeSeasonPage() {
	let itemsNodes = document.querySelectorAll('.dv-episode-playback-title');
	if (!itemsNodes || !itemsNodes.length) {
		return false;
	}
	return true;
}

function parseEpisodes() {
	if (!pageLooksLikeSeasonPage()) {
		return [];
	}

	let itemsNodes = document.querySelectorAll('.dv-episode-playback-title');

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

function getResettableEpisodeCount()
{
	let counter = 0;
	parseEpisodes().forEach((item) => {
		counter += item.progress > 20 ? 1 : 0;
	});
	return counter;
}

let progress;

function showDialog()
{
	let resettableEpisodesCount = getResettableEpisodeCount();
	if (resettableEpisodesCount === 0) {
		alert('No episodes on this page seem to have any progress. Nothing to reset. Please open a season page that does have episodes where the progress can be reset.');
		return;
	}

	let backdrop = document.createElement('div');
	backdrop.id = 'kaz-av-backdrop';

	let dialog = document.createElement('div');
	dialog.id = 'kaz-av-dialog';

	let episodesCount = parseEpisodes().length;
	dialog.innerHTML = '<p>I found <strong>' + resettableEpisodesCount +  ' episodes</strong> of a total ' + episodesCount + ' episodes that I can reset for you.</p>';

	progress = document.createElement('div');
	dialog.append(progress);

	let confirmationQuestion = document.createElement('p');
	confirmationQuestion.innerText = 'Do you want me to start with it?';

	let confirmButton = document.createElement('button');
	confirmButton.innerText = 'Start!';
	confirmButton.className = 'confirm';
	confirmButton.addEventListener('click', function () {
		kazDebug('I would do it now');
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
	kazDebug('Closing dialog!');
	document.getElementById('kaz-av-backdrop').remove();
	document.getElementById('kaz-av-dialog').remove();
}

function updateProgress(totalCount, remainingCount)
{
	let currentEpisode = (totalCount - remainingCount);
	let percentage = Math.round((currentEpisode / totalCount) * 100);
	currentEpisode++;
	currentEpisode = Math.min(totalCount, currentEpisode);
	progress.innerHTML = '<p>Working on resetting episode ' + currentEpisode + ' of a total of ' + totalCount + ' episodes.</p>' +
		'<p>Please wait <span class="spinner"></span></p>' +
		'<div class="progress-bar">' +
		'	<div class="progress" style="width:' + percentage + '%">' + percentage +  '%</div>' +
		'</div>';
}

function reportResetFinished()
{
	progress.innerHTML = '<p>All episodes have been successfully reset.</p>' +
		'<p>Please go to the next season page if you want to continue resetting.</p>' +
		'<p><strong>Note:</strong> Closing this dialog will refresh the page.</p>' +
		'<button id="kaz-av-close" class="confirm success">Close and refresh</button>';

	let button = document.getElementById('kaz-av-close');
	button.addEventListener('click', function () {
		button.innerText = 'Closing ...';
		window.location.reload();
	});
}

function verifyValidPage()
{
	if (!pageLooksLikeSeasonPage()) {
		kazDebug('does not look like season page');
		chrome.runtime.sendMessage({
			text: "hide_page_action",
		});
	} else {
		kazDebug('looks like season page');
	}
}

chrome.runtime.onMessage.addListener(function (msg) {

	kazDebug('message received');

	if (msg.text === 'get_reset_confirmation') {
		kazDebug('parsing ...');

		// parseEpisodes();
		// return;

		if (pageLooksLikeSeasonPage()) {
			// let confirmation = confirm('Are you sure you want to reset the progress?');
			let confirmation = true; // just for debug
			kazDebug('continue resetting? ', confirmation);

			showDialog();

		} else {
			alert('No seasons found on this page');
		}
	} else if (msg.text === 'report_reset_status') {
		updateProgress(msg.totalEpisodeCount, msg.remainingEpisodeCount);
	} else if (msg.text === 'report_reset_finished') {
		reportResetFinished();
	} else if (msg.text === 'verify_valid_page') {
		// verifyValidPage();
	}
});

kazDebug('parser registered');