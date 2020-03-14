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
		console.log('does not look like season page');
		chrome.runtime.sendMessage({
			text: "hide_page_action",
		});
	} else {
		chrome.runtime.sendMessage({
			text: "show_page_action",
		});
		console.log('looks like season page');
	}
}

verifyValidPage();