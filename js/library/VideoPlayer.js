import {TrackVideo} from "./TrackVideo.js";

const allVideoPlayers = []

export class VideoPlayer {
	constructor({
					_player,
					_container,
					_video,
					_source,
					_play_button,
					_pause_button = null,
					_reset_button,
					autoplay = false,
					loop = false,
					desktop_src = null,
					mobile_src = null
				}) {
		this._player = _player
		this._container = _container
		this._video = _video
		this._source = _source
		this._play_button = _play_button
		this._pause_button = _pause_button
		this._reset_button = _reset_button
		this.autoplay = autoplay
		this.loop = loop;
		this.desktop_src = desktop_src;
		this.mobile_src = mobile_src;
		this.is_playing = false
		this.autoplaying = false
		this.did_end = false
		this.tracker = new TrackVideo(this)

		this.init()
	}

	static create(config) {
		const videoPlayer = new VideoPlayer(config)
		allVideoPlayers.push(videoPlayer)
		return videoPlayer
	}

	static getAll() {
		return allVideoPlayers;
	}

	static pauseAllVideos() {
		allVideoPlayers.forEach(vP => vP.manualPause())
	}

	/**
	 * Get allVideoPlayers that are inside _container
	 * @param _container
	 * @returns {*[]}
	 */
	static mine(_container) {
		return allVideoPlayers.filter(vP =>
			Array.from(_container.querySelectorAll('[data-video-player]')).includes(vP._player))
	}

	track = ({labels = {}, prefix}={}) => this.tracker.watch({labels, prefix})

	init() {
		// Responsive video replacement
		if ( this.desktop_src && this.mobile_src ) {
			this._source.src =
				document.documentElement.clientWidth >= 1024 ?
					this.desktop_src :
					this.mobile_src
			this._video.load()
		}
		this.listeners()
		this.autoPlay()
	}

	listeners() {

		this._play_button.addEventListener('click', () => this.manualPlay())

		this._video.addEventListener('playing', () => this.is_playing = true)
		this._video.addEventListener('pause', () => this.is_playing = false)
		this._video.addEventListener('ended', () => this.finished())

		if ( this._pause_button ) {
			this._pause_button.addEventListener('click', () => this.manualPause())
		}

		if ( this._reset_button ) {
			this._reset_button.addEventListener('click', () => this.autoPlay())
		}

		document.addEventListener('visibilitychange', () => {
			if ( document.visibilityState === 'hidden' && !this.autoplaying ) {
				this.manualPause()
			}
		})

		// Check if in viewport
		;( (listeners, isInViewport) => {
			listeners.forEach(listener => {
				window.addEventListener(listener, () => {
					if ( !this.autoplaying && !isInViewport(this._player) ) {
						this.manualPause()
					}
				})
			})
		} )(['DOMContentLoaded', 'load', 'scroll', 'resize'], _elem => {
			const rect = _elem.getBoundingClientRect()
			return rect.bottom >= 0 &&
				rect.right >= 0 &&
				rect.top <= document.documentElement.clientHeight &&
				rect.left <= document.documentElement.clientWidth
		})

	}

	manualPlay() {
		this.manualPause()
		this._video.currentTime = 0
		this._video.controls = true
		this._video.muted = false
		this._video.play()
		this.autoplaying = false
		this._container.classList.add('playWithAudio')
		this._container.classList.remove('autoPlay')
		this._player.classList.add('playWithAudio')
		this._player.classList.remove('autoPlay')
		this.pauseOtherVideos()
		if ( this.did_end ) {
			this.tracker.track('replay')
		} else {
			this.tracker.track('playaudio')
		}
		this.tracker.restart()
	}

	pauseOtherVideos(me) {
		allVideoPlayers
			.filter(vP => vP !== me && !vP.autoplaying)
			.forEach(vP => vP.manualPause())
	}

	autoPlay() {
		this.manualPause()
		this._video.currentTime = 0
		this._video.controls = false
		this._container.classList.remove('ended')
		this._player.classList.remove('ended')
		this._container.classList.remove('playWithAudio')
		this._player.classList.remove('playWithAudio')
		if ( this.autoplay && !this.is_playing ) {
			this.tracker.track('autoplay')
			this._video.muted = true
			this.autoplaying = true
			this._container.classList.add('autoPlay')
			this._player.classList.add('autoPlay')
			this._video.play()
		}
	}

	manualPause() {
		if ( !this._video.paused && this.is_playing ) {
			this._container.classList.remove('playWithAudio')
			this._player.classList.remove('playWithAudio')
			this._video.pause()
			this.is_playing = false
		}
	}

	finished() {
		this._container.classList.add('ended')
		this._player.classList.add('ended')
		this.is_playing = false
		if ( !this.autoplaying ) {
			this.did_end = true
		}
		this.autoPlay()
	}

}
