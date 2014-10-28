function PageNav (el, options) {
	var $container = $(el),
	$target = $('<ul class="pages">'),
	$window = $(window),
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
			var index = $(this).data('index');
			if (!options.readerNav) reader.show(currentContents);
			// we need to wait until Safari knows the height of the indiviual pages.
			window.setTimeout(function () { reader.goTo(index); }, 1);
		});
		$(options.reader).on('reader:pagechange', function (ev, index) {
			try {
				pageElements[currentIndex].removeClass('active');

				var $el = pageElements[index];
				$el.addClass('active');
				// make sure the element remains within view
				var top = $el.position().top, height = $el.height();
				if (top + height > $window.height()) {
					var $parent = $target.parent(), s = $parent.scrollTop();
					$parent.scrollTop(s + top - $window.height() + height);
				} else if (top < 0) {
					var $parent = $target.parent();
					$parent.scrollTop($parent.scrollTop() + top);
				}
			}
			catch (e) {
			}
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
