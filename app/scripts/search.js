var search = (function () {

var headers = {
	artists: 'Künstler·innen', merchants: 'Händler·innen'
}

function makeFindFunction (key, async) {
	var searchArray;
	if (key === '*') {
		searchArray = [];
		for (var k in raubkunst) {
			raubkunst[k].forEach(function (i) { searchArray.push(i); });
		}
	} else {
		searchArray = raubkunst[key];
	}
	var fuse = new Fuse(searchArray, {keys: [0], threshold: 0.3, shouldSort: false, includeScore: true});

	return function find (query, callback) {
		var results = fuse.search(query);
		results.sort(function (a, b) {
			if (b.score === 0 && a.score !== 0) return 1;
			if (a.score === 0 && b.score !== 0) return -1;
			return ((1-b.score) * b.item[1].length) - ((1-a.score) * a.item[1].length);
		});
		results = results.map(function (r) { return r.item; }).slice(0, 10);
		if (!async) return results;
		callback(results);
	}
}

function dataSource (key) {
	return {
		name: key,
		source: makeFindFunction(key, true),
		displayKey: function (el) { return el[0]; },
		templates: {
			header: '<h3>'+headers[key]+'</h3>',
			empty: '<p class="empty">Keine Ergebnisse</p>'
		}
	}
}

var $form, $searchField, findGlobal;

function init () {
	var typeahead = $('#search-query').typeahead({
		minLength: 1,
		highlight: true
	},
	dataSource('artists'),
	dataSource('merchants')
	);

	findGlobal = makeFindFunction('*', false);

	$form = $('#search-form');
	$searchField = $('#tf-query');

	typeahead.on('typeahead:selected', function () { $form.submit(); });

	typeahead.focus();

	return typeahead;
}

function search (query) {
	return findGlobal(query)[0];
}

return { init: init, query: search }
})();
