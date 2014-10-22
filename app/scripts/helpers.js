var H = (function () {
	function zerofill (n, length) {
		n = ''+n;
		for (var i=n.length; i<length; i++) {
			n = '0' + n;
		}
		return n;
	}
	
	function imgSrc (pgNumber, thumbnail) {
		if (thumbnail) return '/images/thumbs/'+pgNumber+'.jpg'
		return '/images/reader/'+pgNumber+'.jpg';
	}

	return {
		zerofill: zerofill,
		imgSrc: imgSrc
	}
})();
