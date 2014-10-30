$(function () {
	$('.toggler').each(function () {
		var $this = $(this);
		var $togglee = $($this.attr('href'));
		$togglee.addClass('hidden');
		$this.click(function (ev) {
			ev.preventDefault();
			$togglee.toggleClass('hidden');
			$(window).scrollTop($togglee.position().top);
		});
	});
});
