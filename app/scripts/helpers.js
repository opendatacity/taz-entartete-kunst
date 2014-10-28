var H = (function () {
	function zerofill (n, length) {
		n = ''+n;
		for (var i=n.length; i<length; i++) {
			n = '0' + n;
		}
		return n;
	}
	
	var dict = [
		[/ä/g, 'ae'],
		[/ö/g, 'oe'],
		[/ü/g, 'ue'],
		[/ß/g, 'ss'],
		[/é/g, 'e']
	];

	function filename (string) {
		string = string.toLowerCase();
		dict.forEach(function (l) {
			string = string.replace(l[0], l[1]);
		});
		return string.replace(/[^a-z0-9]+/g, '-');
	}
	
	function imgSrc (pgNumber, thumbnail) {
		if (thumbnail) return 'images/thumbs/'+pgNumber+'.jpg'
		return 'images/reader/'+pgNumber+'.jpg';
	}

	return {
		zerofill: zerofill,
		imgSrc: imgSrc,
		filename: filename
	}
})();
