$(function () {
	var w = $(window),
		containers = $('#main-navbar > .container, #content > .container, #profile-top-full > .bg-container > .container'),
		mainContainer = $('#content > .container'),
		canvasRight = $('.canvas-right'),
		canvasLeft = $('.canvas-left'),
		toggleLeft = $('.toggle-canvas-left'),
		toggleRight = $('.toggle-canvas-right'),
		body = $('body');
	containers.addClass('off-canvas-container');	
	$('#wrapper').append('<div class="canvas-overlay"></div>');
	function resizeOffCanvasRight() {
		var width = w.width(),
			mainContainerWidth = mainContainer.outerWidth(),
			offContainers = containers.filter('.off-canvas'),
			marginLeft = width / 2 - mainContainerWidth / 2,
			offValue =  width - mainContainerWidth - 250;
		offValue = offValue > 0 ? offValue : 0;
		if (width > 1246 && width < 1680) {
			if (offContainers.length) {
				offContainers.css({'margin-left': offValue + 'px'});
			} else {
				containers.css({'margin-left': marginLeft + 'px'});
			}
		} else {
			containers.css({'margin-left': 'auto'});
		}
	};
	resizeOffCanvasRight();
	$(window).on('resize', resizeOffCanvasRight);
	toggleRight.on('click', function (e) {
		e.preventDefault();
		var width = w.width();
		if (toggleLeft.hasClass('active')) {
			toggleLeft.trigger('click');
		}
		if (canvasRight.hasClass('visible')) {
			canvasRight.removeClass('visible');
			containers.removeClass('off-canvas');
			body.removeClass('off-canvas').removeClass('right');
			toggleRight.removeClass('active');
		} else {
			canvasRight.addClass('visible');
			containers.addClass('off-canvas');
			body.addClass('off-canvas').addClass('right');
			toggleRight.addClass('active');
		}
		if (width > 1246 && width < 1680) {
			var marginLeft = w.width() / 2 - mainContainer.outerWidth() / 2;
			containers.filter('.off-canvas').css({'margin-left': marginLeft + 'px'});
		}
		resizeOffCanvasRight();
	});

	toggleLeft.on('click', function (e) {
		e.preventDefault();
		var width = w.width();
		if (toggleRight.hasClass('active')) {
			toggleRight.trigger('click');
		}
		if (canvasLeft.hasClass('visible')) {
			canvasLeft.removeClass('visible');
			body.removeClass('off-canvas').removeClass('left');
			toggleLeft.removeClass('active');
		} else {
			canvasLeft.addClass('visible');
			body.addClass('off-canvas').addClass('left');
			toggleLeft.addClass('active');
		}
	});
});