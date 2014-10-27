function Reader (element) {
	var $container = $(element), $body = $(document.body);
	var pages;
	var me = this, $this = $(this);

	var visible = false;

	var currentDoc, currentIndex, pageElements = [];

	$container.wrap($('<div class="reader-overlay">'));
	$overlay = $container.parent();

	var $oldContents = $container.children();
	$overlay.append($oldContents);

	var $pageNavContainer = $('<nav>');
	$overlay.append($pageNavContainer);
	var pageNav = new PageNav($pageNavContainer, { reader: this, readerNav: true });

	var $closeButton = $('<button>×</button>');
	$closeButton.addClass('btn btn-close');
	$overlay.append($closeButton);

	var $title = $('<h2>');
	$overlay.append($title);

	function showOverlay () {
		$overlay.removeClass('hidden');
		$body.addClass('blur');
		visible = true;
	}
	function hideOverlay () {
		$overlay.addClass('hidden');
		$body.removeClass('blur');
		visible = false;
	}
	function handleScroll () {
		var i=0, found=null;
		for (var l=pageElements.length; i<l; i++) {
			var $el = pageElements[i],
			$img = $el.find('.lazy'),
			y = $el.position().top,
			h = $el.height(),
			fromTop = y + h,
			fromBottom = $(window).height() - y,
			center = y + h/2;
			if (fromTop > -200 && fromBottom > -200) {
				$img.attr('src', $img.attr('data-highres'));
				$img.removeClass('lazy');
			}
			if (center >= 0 && found === null) found = i;
		}
		if (found !== currentIndex) {
			currentIndex = found;
			$this.trigger('reader:pagechange', currentIndex);
		}
	}

	$closeButton.click(hideOverlay);

	var keyBehaviors = {
		27: function escape () { $closeButton.trigger('click'); },
		37: function leftKey (ev) { me.previousPage(); return false; },
		39: function rightKey (ev) { me.nextPage(); return false; }
	};

	$body.keydown(function (ev) {
		if (!visible) return;
		if (keyBehaviors[ev.keyCode]) return keyBehaviors[ev.keyCode](ev);
	});
	$overlay.on('click', 'img', function (ev) { ev.stopImmediatePropagation(); });
	// We're already doing this with css, but for some bizzare reason this causes
	// a bug in Chrome where the height of the elements previously invisible
	// is not re-calculated. This forces the brpwser to update the heights.
	// That bug was not fun to work around.
	$overlay.on('mouseenter', function (ev) { $(this).find('hideable').removeClass('hidden'); });
	$overlay.on('mouseleave', function (ev) { $(this).find('hideable').addClass('hidden'); });
	$overlay.click(hideOverlay);
	hideOverlay();

	$overlay.scroll(handleScroll);
	$(window).resize(handleScroll);

	function pageConstructor (pgNumber) {
		var $p = $('<p>'), $img = $('<img>');
		$img.addClass('lazy');
		$img.attr('src', H.imgSrc(pgNumber, true));
		$img.attr('data-highres', H.imgSrc(pgNumber));
		$img.attr(config.pageSize);
		$p.append($img);
		$p.attr('id', 'reader-' + pgNumber);
		pageElements.push($p);
		return $p;
	}

	this.update = function (doc) {
		currentDoc = doc;
		this.clear();
		doc[1].map(pageConstructor).forEach(function ($page) {
			$container.append($page);
		});
		pageNav.update(doc);
		$title.text(doc[0]);
	}

	this.show = function (doc) {
		if (doc && currentDoc !== doc) {
			currentIndex = 0;
			this.update(doc);
		}
		showOverlay();
		handleScroll();
	}

	this.goTo = function (index) {
		var pos;
		if (index < 0) {
			pos = 0;
		} else if (index > pageElements.length-1) {
			pos = $container.height();
		} else {
			pos = $overlay.scrollTop() + pageElements[index].position().top;
		}
		$overlay.scrollTop(pos);
	}

	this.previousPage = function () {
		this.goTo(currentIndex-1);
	}
	this.nextPage = function () {
		if (currentIndex > pageElements.length - 1) return false;
		this.goTo(currentIndex+1);
	}

	this.clear = function () {
		$container.empty();
		pageElements = [];
	}

	this.getCurrentIndex = function () {
		return currentIndex;
	}
}
