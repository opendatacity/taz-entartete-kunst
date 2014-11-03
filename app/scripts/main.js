var raubkunst, debug;

$(function () {

var reader = new Reader('.reader'),
pageNav = new PageNav('#read nav', { reader: reader }),
$body = $(document.body),
$searchForm = $('#form form'),
searchField;

new FastClick(document.body);

var initialQuery = (function () {
	var q = window.location.search.match(/(?:\?|&)q=([^&#]*)/);
	if (q === null) return null;
	return decodeURIComponent(q[1]);
})();
if (initialQuery) $('#search-query').val(initialQuery);

$.getJSON('data/raubkunst.json', function (data) {
	raubkunst = {
		artists: data[0],
		merchants: data[1]
	};
	searchField = search.init();

	searchField.on('keyup mouseup', function (ev) {
		// Somehow Safari won't trigger a submit on enter, so we'll do it manually.
		if (ev.keyCode === 13) {
			ev.preventDefault();
			$searchForm.submit();
			return;
		}

		// Timeout is necessary because of "clear" button that is displayed
		// by some browsers. Otherwise the event will fire before the value
		// has been cleared.
		window.setTimeout(function () {
			search.dirty(searchField.val());
		}, 1);
	});
	searchField.on('typeahead:cursorchanged typeahead:autocompleted', function (ev, result) {
		prepare(result);
	});
	$(search).on('search:dirty', function () { artistDownloadButton(); })

	window.addEventListener('popstate', function (ev) {
		$('#search-query').val(ev.state);
		bestGuess(ev.state);
	});

	if (initialQuery) bestGuess(initialQuery);	
});

function clear () {
	pageNav.clear();
}
function prepare (result) {
	// pageNav.update(result, true);
}
function found (result) {
	Title.set(result[0]);
	searchField.blur();
	searchField.val(result[0]);
	pageNav.update(result);
	search.clean(result[0]);
	artistDownloadButton(result);
	
	if (window.history.pushState) window.history.pushState(result[0], result[0], '?q='+result[0]);
}
function bestGuess (query, errorCallback) {
	var result = search.query(query);
	if (result.length > 1) {
		found(result);
		return true;
	}
	if (errorCallback) errorCallback();
	return false;
}

artistDownloadButton = (function () {
	var $btn = $('#artist-download'),
	$desc = $btn.find('.step1'),
	$filesize = $btn.find('.js-filesize'),
	initialDesc = $desc.text();
	return function (item) {
		if (!item) {
			$desc.text(initialDesc);
			$btn.attr('href')
			$btn.addClass('disabled');
			return false;
		}
		var name = item[0], pages = item[1].length, filename = H.filename(name);
		$btn.removeClass('disabled');
		if (lang === 'en') {
			$desc.text('Download All Pages about ' + name);
		} else {
			$desc.text('Alle Seiten zu ' + name + ' herunterladen');
		}
		$btn.attr('href', 'pdf/' + filename + '.pdf');
		$filesize.text('ca. ' + Math.ceil((pages+1)*.11) + ' MB');
	}
})();

$searchForm.submit(function (ev) {
	// If page is displayed in a frame, we want the default behaviour
	if (H.framed) return true;
	ev.preventDefault();

	var v = searchField.val();

	bestGuess(v);
});
	
});
