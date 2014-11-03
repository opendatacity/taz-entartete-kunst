$(function () {

var searchField = { $el: $('#search-query'), state: 1 };
searchField.original = searchField.$el.attr('placeholder');

var w;

function responsive () {
	w = $(window).width();
	if (w < 550 && searchField.state !== 0) {
		searchField.state = 0;
		searchField.$el.attr('placeholder', searchField.$el.attr('data-placeholder-short'));
	} else if (w >= 550 && searchField.state !== 1) {
		searchField.state = 1;
		searchField.$el.attr('placeholder', searchField.original);
	}
}
responsive();
$(window).resize(responsive);
});
