const _tracking_pixels = document.createElement('div')
document.body.appendChild(_tracking_pixels)

let global_tracker = null
const API_ROOT = `https://ruv80zbas1.execute-api.us-east-1.amazonaws.com/prod`

export class Tracker {
	constructor({oid, cid}) {
		this.oid = oid
		this.cid = cid
	}

	static set({oid, cid}) {
		global_tracker = new Tracker({oid, cid})
		return global_tracker
	}

	static get() {
		return global_tracker
	}

	track(url) {
		url = url.replace('%%CACHEBUSTER%%', Date.now());
		const _img = document.createElement('img');
		_img.src = url;
		_img.height = 1;
		_img.width = 1;
		_img.style.opacity = '0';
		_img.style.position = 'absolute';
		_img.style.zIndex = '-1';
		_tracking_pixels.appendChild(_img);
		_img.onload = () => {
			console.log(( () => {
				let a = url.replace(API_ROOT, '').split('?')
				return a[1].split('&').reduce((carry, item) => {
					let b = item.split('=')
					carry[b[0]] = b[1]
					return carry
				}, {type: a[0]})
			} )());
			setTimeout(() => {
				_img.parentNode.removeChild(_img);
			}, 2000);
		}
	}

	trackImpression(tag) {
		this.track(this.getImpressionUrl(tag))
	}

	getImpressionUrl(tag) {
		return `${API_ROOT}/view?creative_id=${this.cid}&operative_id=${this.oid}&tag_name=${tag}&ord=%%CACHEBUSTER%%`
	}

	getRedirectUrl(url, tag) {
		return `${API_ROOT}/jump?redirect_url=${encodeURI(url)}&creative_id=${this.cid}&tag_name=${tag}&operative_id=${this.oid}`
	}
}
export const track = url => global_tracker ? global_tracker.track(url) : null
export const trackImpression = tag => global_tracker ? global_tracker.trackImpression(tag) : null
export const getRedirectUrl = (url, tag) => global_tracker ? global_tracker.getRedirectUrl(url, tag) : ''
export const getImpressionUrl = tag => global_tracker ? global_tracker.getImpressionUrl(tag) : ''
