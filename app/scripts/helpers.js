var H = (function () {
	function zerofill (n, length) {
		n = ''+n;
		for (var i=n.length; i<length; i++) {
			n = '0' + n;
		}
		return n;
	}
	
	function imgSrc (pgNumber) {
		return '/images/raubkunst_Page_'+H.zerofill(pgNumber, 3)+'_Image_0001.jpg';
	}

	return {
		zerofill: zerofill,
		imgSrc: imgSrc
	}
})();
