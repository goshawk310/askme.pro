'use strict';

var askmePro = {
    index: function index() {
        var carousel = $('#fade-carousel'),
            elements = carousel.children('img'),
            elementLength = elements.length,
            index = 1;
        elements.first().show();
        setInterval(function () {
            $(elements).fadeOut();
            $(elements[index]).fadeIn();
            index += 1;
            if (index >= elementLength) {
                index = 0;
            }
        }, 4000);
    }
};
