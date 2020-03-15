'use strict';

let shouldDebug = true;
function kazDebug(...args) {
	if (shouldDebug) {
		console.log(...args);
	}
}

function pageLooksLikeSeasonPage() {
	let itemsNodes = document.querySelectorAll('.dv-episode-playback-title');
	if (!itemsNodes || !itemsNodes.length) {
		return false;
	}
	return true;
}

function verifyValidPage()
{
	if (!pageLooksLikeSeasonPage()) {
		kazDebug('does not look like season page');
		chrome.runtime.sendMessage({
			text: "hide_page_action",
		});
	} else {
		chrome.runtime.sendMessage({
			text: "show_page_action",
		});
		kazDebug('looks like season page');
	}
}

verifyValidPage();