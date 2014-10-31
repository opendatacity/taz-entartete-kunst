var search = (function () {

var returnObject = {};

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
			empty: '<p class="empty">Keine Ergebnisse</p>',
			suggestion: function(d) {
				// Otherwise suggestions wouldn't be tappable on iOS
				return '<p class="needsclick">'+d[0]+'</p>';
			}
		}
	}
}

var $form, $searchField, findGlobal, clean, dirty, isClean, isDirty;

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

	// Mobile optimization
	if (H.framed) {
		typeahead.on('touchend', function () {
			// There are weird bugs where the search field doesn't focus on iOS when
			// displayed in an iframe. There doesn't seem to be a non-hacky solution to
			// this, so we'll resort to putting in a space.
			var $t = $(this);
			$t.val(' ');
		});
	}

	$(document).keydown(function (ev) {
		var code = ev.keyCode;
		if (typeahead.is(':focus')) return;
		if (code >= 65 && code <= 90) {
			// A-Z
			typeahead.focus();
			var pos = typeahead.val().length;
			typeahead[0].setSelectionRange(pos, pos);
			dirty(typeahead.val());
		} else if (code === 8) {
			// backspace
			typeahead.focus();
			var pos = typeahead.val().length;
			typeahead[0].setSelectionRange(pos, pos);
			if (isClean()) typeahead.val('');
			dirty(typeahead.val());
		}
	});

	return typeahead;
}

(function () {
	var lastCleanState, _isClean = true;
	var $body = $(document.body);
	clean = function (value) {
		if (value) lastCleanState = value;
		_isClean = true;
		$body.addClass('clean').removeClass('dirty');
		$(returnObject).trigger('search:clean');
	};
	dirty = function (value) {
		if (value !== lastCleanState) {
			if (_isClean) { // avoid unnecessary DOM manipulation
				_isClean = false;
				$body.removeClass('clean').addClass('dirty');
				$(returnObject).trigger('search:dirty');
			}
		} else {
			clean(value);
		}
	};
	isClean = function () { return _isClean; };
	isDirty = function () { return !_isClean; };
})();

function search (query) {
	return findGlobal(query)[0];
}

returnObject.init = init;
returnObject.query = search;
returnObject.clean = clean;
returnObject.dirty = dirty;
returnObject.isClean = isClean;
returnObject.isDirty = isDirty;
return returnObject;

})();
