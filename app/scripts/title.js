var Title = (function () {
	var initialTitle = document.title;
	return {
		set: function (string) {
			if (string && string !== '') {
				document.title = string + ': ' + initialTitle;
			} else {
				document.title = initialTitle;
			}
		}
	}
})();
