import {_$} from "./library/myWrapper.js";
import {Tracker, trackImpression} from "./library/Tracker.js";
import {m_Peek} from "./modules/m_Peek.js";
import {m_VideoPlayer} from "./modules/m_VideoPlayer.js";
import Hammer from "./library/SwipeDetect.js";
import {VideoPlayer} from "./library/VideoPlayer.js";

const tracker = Tracker.set({oid: 62341, cid: 1104})
// tracker.trackImpression('blackbird-overall')

_$.wrapAll({
	'video-player': m_VideoPlayer,
	'peek': m_Peek,
	'impression': ({_me, args:{0:tag}}) => _me.addEventListener('click', () => trackImpression(tag)),
	'swipe-horz': ({_me}) => {
		const hammer = new Hammer(_me)
		hammer.on('swipeleft', () => {
			_me.classList.add('swipeleft')
			_me.classList.remove('swiperight')
		})
		hammer.on('swiperight', () => {
			_me.classList.add('swiperight')
			_me.classList.remove('swipeleft')
		})
	},
	'pause-all-videos': ({_me}) => {
		_me.addEventListener('click', () => {
			VideoPlayer.pauseAllVideos()
		})
	}
})
