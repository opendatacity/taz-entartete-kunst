var raubkunst, debug;

$(function () {

var reader = new Reader('.reader'),
pageNav = new PageNav('#read nav', { reader: reader }),
$body = $(document.body),
searchField;

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

	searchField.on('keyup mouseup', function () {
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


$('#search-form').submit(function (ev) {
	// If page is displayed in a frame, we want the default behaviour
	if (window !== window.top) return true;
	ev.preventDefault();

	var v = searchField.val();

	bestGuess(v);
});
window.addEventListener('popstate', function (ev) {
	searchField.val(ev.state);
	bestGuess(ev.state);
});
	
});
