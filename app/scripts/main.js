var raubkunst, debug;

$(function () {

var reader = new Reader('.reader'),
pageNav = new PageNav('#read nav', { reader: reader }),
searchField;

$.getJSON('data/raubkunst.json', function (data) {
	raubkunst = {
		artists: data[0],
		merchants: data[1]
	};
});

searchField = search.init();
searchField.on('typeahead:cursorchanged typeahead:autocompleted', function (ev, result) {
	prepare(result);
});
searchField.on('typeahead:selected', function (ev, result) {
	found(result);
});
debug = searchField;

function prepare (result) {
	pageNav.update(result, true);
}
function found (result) {
	pageNav.update(result);
}

$('#btn-download-currently-shown').click(function () {
	PDF.make(currentlyShown[1], PDF.download(currentlyShown[0]));
});
	
});
