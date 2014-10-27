function PageNav (el, options) {
	var $container = $(el),
	$target = $('<ul class="pages">'),
	pageElements = [],
	currentContents,
	currentIndex = 0,
	noImages,
	reader;

	$container.append($target);

	if (options.reader) {
		reader = options.reader;
		$target.on('click', 'a', function (ev) {
			ev.preventDefault();
			ev.stopImmediatePropagation();
			if (!options.readerNav) reader.show(currentContents);
			reader.goTo($(this).data('index'));
		});
		$(options.reader).on('reader:pagechange', function (ev, index) {
			try {
				pageElements[currentIndex].removeClass('active');
				pageElements[index].addClass('active');
			}
			catch (e) {}
			currentIndex = index;
		});
	}

	function pageElement (pgNumber, index) {
		var $li = $('<li>');
		$li.html('<span class="page-number">'+pgNumber+'</span>');

		if (!noImages) {
			var $img = $('<img>'),
			$a = $('<a>');

			$img.attr({
				src: H.imgSrc(pgNumber, true),
				alt: '' + pgNumber
			});
			$a.attr('href', '#reader-'+pgNumber);
			$a.data('index', index);
			$a.append($img);
			$li.append($a);
		}
		pageElements.push($li);
		return $li;
	}

	this.update = function (contents, argNoImages) {
		$container.addClass('result');
		currentContents = contents;
		noImages = !!argNoImages;
		$('h2').text(contents[0]);
		this.clear();
		contents[1].forEach(function (page, index) { $target.append(pageElement(page, index)); });
	}

	this.clear = function () {
		$container.addClass('empty');
		$target.empty();
		pageElements = [];
		currentIndex = 0;
	}
}
