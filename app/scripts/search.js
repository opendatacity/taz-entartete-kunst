var search = (function () {

var headers = {
	artists: 'Künstler·innen', merchants: 'Händler·innen'
}

function dataSource (key) {

	// var fuse = new Fuse(raubkunst[key], {keys: [0]});

	function find (query, callback) {
		query = query.toLowerCase();
		var results = [];
		raubkunst[key].forEach(function (el) {
			var index = el[0].toLowerCase().indexOf(query);
			if (index !== -1) {
				el.relevance = (1 - index / el[0].length) * el[1].length;
			} else {
				el.relevance = 0;
			}
			if (el.relevance > 0) results.push(el);
		});
		results.sort(function (a, b) { return b.relevance - a.relevance; });
		callback(results.slice(0, 10));
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
	return typeahead;
}

return { init: init }
})();
