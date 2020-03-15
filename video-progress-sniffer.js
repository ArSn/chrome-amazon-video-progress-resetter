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

let intervalId = window.setInterval(function () {
	if (!isVideoPlaying()) {
		console.log('video not playing yet, waiting');
		return;
	}
	console.log('video playing yet, initiating closing');
	window.clearInterval(intervalId);
	window.setTimeout(function () {
		chrome.runtime.sendMessage({
			text: "unfocus_video_tab",
		});
	}, 500);
	window.setTimeout(function () {
		chrome.runtime.sendMessage({
			text: "close_video_tab",
		});
	}, 4000);
}, 1000);

