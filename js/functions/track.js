export const track = url => {
	url = url.replace('%%CACHEBUSTER%%', Date.now());
	const _img = document.createElement('img');
	_img.src = url;
	_img.height = 1;
	_img.width = 1;
	_img.style.opacity = '0';
	_img.style.position = 'absolute';
	document.querySelector('body').appendChild(_img);
	console.log(_img.src);
	_img.onload = () => {
		setTimeout(() => {
			_img.parentNode.removeChild(_img);
		}, 2000);
	}
}
