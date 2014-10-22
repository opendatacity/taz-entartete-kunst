var PDF = (function () {
	var canvas = document.createElement('canvas'),
	ctx = canvas.getContext('2d'),
	img = document.createElement('img');

	function zerofill (n, length) {
		n = ''+n;
		for (var i=n.length; i<length; i++) {
			n = '0' + n;
		}
		return n;
	}

	function getImageData(page) {
		img.setAttribute('src', '/images/raubkunst_Page_'+zerofill(page, 3)+'_Image_0001.jpg');
		var w = img.width/2, h = img.height/2;
		canvas.width = w;
		canvas.height = h;
		ctx.clearRect(0, 0, w, h);
		ctx.drawImage(img, 0, 0, w, h);
		return canvas.toDataURL();
	}

	return {
		make: function (pages, callback) {
			var doc = jsPDF('p', 'mm', 'raubkunst');

			pages.forEach(function (page, i) {
				if (i>0) doc.addPage();

				doc.addImage(getImageData(page), 'JPEG', 0, 0, 210, 210*1.3333);
			});

			callback(doc);
		},

		download: function (name) {
			return function (doc) {
				doc.save(name + '.pdf');
			}
		}
	}
})();
