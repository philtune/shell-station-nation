export class ScrollWatcher2 {
	triggerPos = 'top'
	callbacks = {}

	constructor(_elem, triggerPos) {
		this._elem = _elem
		this.setTriggerPos(triggerPos)
		window.addEventListener('resize', this.onEvent)
		window.addEventListener('scroll', this.onEvent)
		setTimeout(this.onEvent, 200)
	}

	setTriggerPos = triggerPos => {
		if ( triggerPos !== undefined ) {
			this.triggerPos = triggerPos
		}
		return this
	}

	setCallback = (name, cb) => {
		this.callbacks[name] = cb
		return this
	}
	before = callback => this.setCallback('doBefore', callback)
	afterStarted = callback => this.setCallback('doAfterStarted', callback)

	getProgress = () => this._elem.getBoundingClientRect().top / window.innerHeight - ( {
		top: 0,
		middle: 0.5,
		bottom: 1
	}[this.triggerPos] ?? this.triggerPos )

	onEvent = () => {
		const progress = this.getProgress()
		if ( this.callbacks['doBefore'] !== undefined && progress > 0 ) {
			this.callbacks['doBefore'](this)
		}
		if ( this.callbacks['doAfterStarted'] !== undefined && progress <= 0 ) {
			this.callbacks['doAfterStarted'](this)
		}
	}
}
