// 'use strict';
// todo: for some reason this file does not work in strict mode (yet) - figure out why and resolve this

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
	let playing = false;
	videos.forEach(function (video) {
		if (video.playing) {
			playing = true;
		}
	});
	return playing;
}

let intervalId = window.setInterval(function () {
	if (!isVideoPlaying()) {
		kazDebug('video not playing yet, waiting');
		return;
	}
	kazDebug('video playing yet, initiating closing');
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

