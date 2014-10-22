function Reader (element) {
	var $container = $(element), $body = $(document.body);
	var pages;
	var me = this, $this = $(this);

	var currentDocument, currentIndex, pageElements = [];

	$container.wrap($('<div class="reader-overlay">'));
	$overlay = $container.parent();

	var $pageNavContainer = $('<nav>');
	$overlay.append($pageNavContainer);
	var pageNav = new PageNav($pageNavContainer, { reader: this, readerNav: true });

	var $closeButton = $('<button>×</button>');
	$closeButton.addClass('btn btn-close');
	$overlay.append($closeButton);

	function showOverlay () {
		$overlay.removeClass('hidden');
		$body.addClass('blur');
	}
	function hideOverlay () {
		$overlay.addClass('hidden');
		$body.removeClass('blur');
	}
	function handleScroll () {
		var i=0;
		for (var l=pageElements.length; i<l; i++) {
			var p = pageElements[i].position().top + pageElements[i].height()/2;
			if (p >= 0) break;
		}
		if (i !== currentIndex) {
			currentIndex = i;
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
		if (keyBehaviors[ev.keyCode]) return keyBehaviors[ev.keyCode](ev);
	});
	$overlay.on('click', 'img', function (ev) { ev.stopImmediatePropagation(); });
	$overlay.click(hideOverlay);
	hideOverlay();

	$overlay.scroll(handleScroll);
	$(window).resize(handleScroll);

	function pageConstructor (pgNumber) {
		var $p = $('<p>'), $img = $('<img>')
		$img.attr('src', H.imgSrc(pgNumber));
		$p.append($img);
		$p.attr('id', 'reader-' + pgNumber);
		pageElements.push($p);
		return $p;
	}

	this.update = function (document) {
		if (currentDocument === document) return;
		this.clear();
		document[1].map(pageConstructor).forEach(function ($page) {
			$container.append($page);
		});
		pageNav.update(document);
	}

	this.show = function (document) {
		if (document) {
		if (currentDocument === document) return;
			this.update(document);
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
