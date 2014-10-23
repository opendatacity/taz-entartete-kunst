var Title = (function () {
	var initialTitle = document.title;
	return {
		set: function (string) {
			if (string && string !== '') {
				document.title = initialTitle + ': ' + string;
			} else {
				document.title = initialTitle;
			}
		}
	}
})();
