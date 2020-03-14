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

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
	get: function(){
		return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
	}
});

function isVideoPlaying() {
	let videos = document.querySelectorAll('video');
	if (!videos || !videos.length) {
		return false;
	}
	return videos[0].playing;
}

window.setInterval(function () {
	console.log('playing?', isVideoPlaying());
}, 1000)

