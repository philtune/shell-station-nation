import {track} from "./track.js";

export default (_video, tracking) => {
	var
		duration = _video.duration,
		progressedObj = {
			start: false,
			quarter: false,
			half: false,
			threequarter: false,
			full: false,
			playaudio: false,
			replay: false
		},
		onPlay = function() {
			if ( !progressedObj.start ) {
				track(tracking.start)
				progressedObj.start = true;
			}
		},
		onTimeUpdate = function(e) {
			var
				currentTime = _video.currentTime,
				progress = currentTime / _video.duration
			;
			if ( !progressedObj.quarter && progress >= 0.25 ) {
				track(tracking.quarter);
				progressedObj.quarter = true;
			}
			if ( !progressedObj.half && progress >= 0.5 ) {
				track(tracking.half);
				progressedObj.half = true;
			}
			if ( !progressedObj.threequarter && progress >= 0.75 ) {
				track(tracking.threequarter);
				progressedObj.threequarter = true;
			}
			if ( !progressedObj.full && progress >= 0.99 ) {
				track(tracking.full);
				progressedObj.full = true;
			}
		},
		onEnded = function() {
			if ( !progressedObj.full ) {
				track(tracking.full);
				progressedObj.full = true;
			}
		}
	;
	_video.addEventListener('play', onPlay);
	_video.addEventListener('timeupdate', onTimeUpdate);
	_video.addEventListener('ended', onEnded);
}
