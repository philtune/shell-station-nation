import {trackImpression} from "./Tracker.js";

const LABELS = {
	start: 'start',
	start_autoplay: 'start_autoplay',
	quarter: '25percent',
	quarter_autoplay: '25percent_autoplay',
	half: '50percent',
	half_autoplay: '50percent_autoplay',
	threequarter: '75percent',
	threequarter_autoplay: '75percent_autoplay',
	full: '100percent',
	full_autoplay: '100percent_autoplay',
	playaudio: 'playWithAudio',
	replay: 'replay'
}

export class TrackVideo {
	constructor(videoPlayer) {
		this.videoPlayer = videoPlayer
		this.tracked_arr = []
		this.curr = 0
		this.started = false
	}

	watch({labels = {}, prefix, set ={}}={}) {
		this.started = true
		this.labels = labels
		this.setPrefix(prefix)
		this.init()
	}

	setPrefix(prefix) {
		this.prefix = prefix !== undefined ? prefix + '_' : ''
		this.tags = [
			'start',
			'start_autoplay',
			'quarter',
			'quarter_autoplay',
			'half',
			'half_autoplay',
			'threequarter',
			'threequarter_autoplay',
			'full',
			'full_autoplay',
			'playaudio',
			'replay'
		].reduce((carry, key) => {
			carry[key] = this.prefix + ( this.labels[key] ?? LABELS[key] )
			return carry
		}, {})
	}

	track(id) {
		if ( this.started ) {
			let tag = this.tags[id] ?? null
			if ( tag ) {
				trackImpression(tag)
			}
		}
	}

	restart() {
		if ( this.started ) {
			this.newTracker(++this.curr)
		}
	}

	newTracker(i) {
		this.tracked_arr[i] = {
			start: false,
			quarter: false,
			half: false,
			threequarter: false,
			full: false
		}
	}

	init() {
		this.newTracker(this.curr)
		this.videoPlayer._video.addEventListener('play', () => {
			if ( !this.tracked_arr[this.curr].start ) {
				trackImpression(this.tags[`start${this.videoPlayer.autoplaying ? '_autoplay' : ''}`])
				this.tracked_arr[this.curr].start = true
			}
		})
		this.videoPlayer._video.addEventListener('timeupdate', () => {
			const progress = this.videoPlayer._video.currentTime / this.videoPlayer._video.duration
			const suffix = this.videoPlayer.autoplaying ? '_autoplay' : ''
			if ( !this.tracked_arr[this.curr].quarter && progress >= 0.25 ) {
				trackImpression(this.tags[`quarter${suffix}`])
				this.tracked_arr[this.curr].quarter = true
			}
			if ( !this.tracked_arr[this.curr].half && progress >= 0.5 ) {
				trackImpression(this.tags[`half${suffix}`])
				this.tracked_arr[this.curr].half = true
			}
			if ( !this.tracked_arr[this.curr].threequarter && progress >= 0.75 ) {
				trackImpression(this.tags[`threequarter${suffix}`])
				this.tracked_arr[this.curr].threequarter = true
			}
			if ( !this.tracked_arr[this.curr].full && progress >= 1 ) {
				trackImpression(this.tags[`full${suffix}`])
				this.tracked_arr[this.curr].full = true
			}
		})
		this.videoPlayer._video.addEventListener('ended', () => {
			if ( !this.tracked_arr[this.curr].full ) {
				trackImpression(this.tags[`full${this.videoPlayer.autoplaying ? '_autoplay' : ''}`])
				this.tracked_arr[this.curr].full = true
			}
		})
	}
}
