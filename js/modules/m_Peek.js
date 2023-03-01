import {ScrollWatcher2} from "../library/ScrollWatcher2.js";

export const m_Peek = ({_me}) => {
	const bottomWatcher = new ScrollWatcher2(_me, 'bottom')
	const watcher70 = new ScrollWatcher2(_me, 0.7)
	const watcher85 = new ScrollWatcher2(_me, 0.85)
	const watcher95 = new ScrollWatcher2(_me, 0.95)
	bottomWatcher
		.before(() => _me.classList.remove('bottomPeek'))
		.afterStarted(() => _me.classList.add('bottomPeek'))
	watcher70
		.before(() => _me.classList.remove('peek70'))
		.afterStarted(() => _me.classList.add('peek70'))
	watcher85
		.before(() => _me.classList.remove('peek85'))
		.afterStarted(() => _me.classList.add('peek85'))
	watcher95
		.before(() => _me.classList.remove('peek95'))
		.afterStarted(() => _me.classList.add('peek95'))
	;( new ScrollWatcher2(_me, 0.6) )
		.before(() => _me.classList.remove('peek60'))
		.afterStarted(() => _me.classList.add('peek60'))
}
