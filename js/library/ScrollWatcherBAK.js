Number.prototype.clamp = function(min, max) {
	return Math.min(Math.max(this, min), max);
}

const getRootOffset = _elem => {
	if ( !_elem ) {
		return {offsetTop: 0, offsetLeft: 0};
	}
	const parentOffset = getRootOffset(_elem.offsetParent)
	return {
		offsetTop: parentOffset.offsetTop + _elem.offsetTop,
		offsetLeft: parentOffset.offsetLeft + _elem.offsetLeft
	}
}

export class ScrollWatcherBAK {
	triggerPos = 'top'
	callbacks = {}

	constructor(_elem, triggerPos) {
		this._elem = _elem
		this.setTriggerPos(triggerPos)
		window.addEventListener('resize', this.onEvent)
		window.addEventListener('scroll', this.onEvent)
		setTimeout(this.onEvent, 200)
	}

	static create = (_elem, triggerPos) => {
		return new this(_elem, triggerPos)
	}

	setTriggerPos = triggerPos => {
		if ( triggerPos !== undefined ) {
			this.triggerPos = triggerPos
		}
		return this
	}
	getTriggerY = () => {
		if ( this.triggerPos === 'middle' ) {
			return window.scrollY + ( window.innerHeight * 0.5 )
		} else if ( this.triggerPos === 'top' ) {
			return window.scrollY
		} else if ( this.triggerPos === 'bottom' ) {
			return window.scrollY + window.innerHeight
		} else { //assume percentage
			return window.scrollY + ( window.innerHeight * this.triggerPos )
		}
	}
	getProgress = () => ( ( this.getTriggerY() - getRootOffset(this._elem).offsetTop ) / this._elem.clientHeight )
	calcProgress = (start = 0, end = 1) => ( this.getProgress() * ( end - start ) ) + start
	calcPercent = (start = 0, end = 1) => this.calcProgress(start / 100, end / 100) * 100 + '%'

	setCallback = (name, cb) => {
		this.callbacks[name] = cb
		return this
	}
	always = (callback, triggerPos) => this.setCallback('doAlways', callback).setTriggerPos(triggerPos)
	before = (callback, triggerPos) => this.setCallback('doBefore', callback).setTriggerPos(triggerPos)
	outside = (callback, triggerPos) => this.setCallback('doOutside', callback).setTriggerPos(triggerPos)
	after = (callback, triggerPos) => this.setCallback('doAfter', callback).setTriggerPos(triggerPos)
	during = (callback, triggerPos) => this.setCallback('doDuring', callback).setTriggerPos(triggerPos)
	beforeFinished = (callback, triggerPos) => this.setCallback('doBeforeFinished', callback).setTriggerPos(triggerPos)
	afterStarted = (callback, triggerPos) => this.setCallback('doAfterStarted', callback).setTriggerPos(triggerPos)

	onEvent = () => {
		const progress = this.getProgress()
		if ( this.callbacks['doAlways'] !== undefined ) {
			this.callbacks['doAlways'](this)
		}
		if ( this.callbacks['doBefore'] !== undefined && progress < 0 ) {
			this.callbacks['doBefore'](this)
		}
		if ( this.callbacks['doAfter'] !== undefined && progress > 1 ) {
			this.callbacks['doAfter'](this)
		}
		if ( this.callbacks['doOutside'] !== undefined && ( progress < 0 || progress > 1 ) ) {
			this.callbacks['doOutside'](this)
		}
		if ( this.callbacks['doDuring'] !== undefined && progress >= 0 && progress <= 1 ) {
			this.callbacks['doDuring'](this)
		}
		if ( this.callbacks['doBeforeFinished'] !== undefined && progress <= 1 ) {
			this.callbacks['doBeforeFinished'](this)
		}
		if ( this.callbacks['doAfterStarted'] !== undefined && progress >= 0 ) {
			this.callbacks['doAfterStarted'](this)
		}
	}
}
