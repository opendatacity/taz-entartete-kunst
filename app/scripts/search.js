var search = (function () {

var headers = {
	artists: 'Maler·innen', merchants: 'Händler·innen'
}

function dataSource (key) {

	var fuse = new Fuse(raubkunst[key], {keys: [0], threshold: 0.3, shouldSort: false, includeScore: true});

	function find (query, callback) {
		var results = fuse.search(query);
		results.sort(function (a, b) {
			return ((1-b.score) * b.item[1].length) - ((1-a.score) * a.item[1].length);
		});
		callback(results.map(function (r) { return r.item; }).slice(0, 10));
	}

	return {
		name: key,
		source: find,
		displayKey: function (el) { return el[0]; },
		templates: {
			header: '<h3>'+headers[key]+'</h3>',
			empty: '<p class="empty">Keine Ergebnisse</p>'
		}
	}
}

function init () {
	var typeahead = $('#search-query').typeahead({
		minLength: 1,
		highlight: true
	},
	dataSource('artists'),
	dataSource('merchants')
	);
	typeahead.focus();
	return typeahead;
}

return { init: init }
})();
