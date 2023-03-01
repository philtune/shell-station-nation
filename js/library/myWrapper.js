/**
 * Wrapper factory to add functionality to elements
 */
export const _$ = (key_str, arg_str = null) => {
	const all_elems = document.querySelectorAll(_$.getSelector(key_str, arg_str))
	const wrapped = {
		each: cb => {
			all_elems.forEach((_me) => {
				const helpers = {
					_me: _me,
					args: _$.getArgs(_me.getAttribute('data-' + key_str)),
					findAll: (key, arg_str) => _$.findAll(key, arg_str, _me),
					first: (key, arg_str) => _$.first(key, arg_str, _me),
					lookUp: (key, arg_str) => _$.lookUp(_me, key, arg_str)
				}

				cb(helpers)
			})
			return wrapped
		}
	}
	all_elems.forEach((elem, i) => {
		wrapped[i] = elem
	})
	return wrapped
}
_$.wrapElem = (_me) => ( {
	findAll: (key, arg_str) => _$.findAll(key, arg_str, _me),
	first: (key, arg_str) => _$.first(key, arg_str, _me),
	lookUp: (key, arg_str) => _$.lookUp(_me, key, arg_str)
} )
_$.getSelector = (key_str, arg_str = null) =>
	arg_str === null ?
		`[data-${key_str}]` :
		`[data-${key_str}="${arg_str}"]`
_$.findAll = (key_str, arg_str = null, _ancestor = document) =>
	_ancestor.querySelectorAll(_$.getSelector(key_str, arg_str))
_$.first = (key_str, arg_str = null, _ancestor = document) =>
	_ancestor.querySelector(_$.getSelector(key_str, arg_str))
_$.lookUp = (_descendant, key, arg_str = null) =>
	_descendant.closest(_$.getSelector(key, arg_str))
_$.getArgs = str => {
	const
		args_list = str.toString().trim().split(','),
		args = {}
	args_list.forEach((arg, i) => {
		let spl = arg.trim().split('=')
		args[i] = arg.trim()
		args[spl[0]] =
			( spl.length === 1 ) ? true : spl[1]
	})
	return args
}
const wrappers = {}
_$.myWrapper = (key, cb) => {
	if ( !( key in wrappers ) ) {
		wrappers[key] = _$(key).each(cb)
	}
	return wrappers[key]
}
_$.wrapAll = kvps => Object.entries(kvps).forEach(([key, cb]) => _$(key).each(cb))
