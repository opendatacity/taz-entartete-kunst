var raubkunst, debug;

$(function () {

var reader = new Reader('.reader'),
pageNav = new PageNav('#read nav', { reader: reader }),
searchField;

var initialQuery = (function () {
	var q = window.location.search.match(/(?:\?|&)q=([^&]*)/);
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
	searchField.on('typeahead:cursorchanged typeahead:autocompleted', function (ev, result) {
		prepare(result);
	});

	if (initialQuery) bestGuess(initialQuery);	
});

function clear () {
	pageNav.clear();
}
function prepare (result) {
	pageNav.update(result, true);
}
function found (result) {
	Title.set(result[0]);
	searchField.val(result[0]);
	pageNav.update(result);
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

	if (window.history.pushState) window.history.pushState(v, v, '?q='+v);
	bestGuess(v);
});
window.addEventListener('popstate', function (ev) {
	searchField.val(ev.state);
	bestGuess(ev.state);
});
	
});
