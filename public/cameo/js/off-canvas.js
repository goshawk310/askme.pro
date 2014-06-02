! function ($) {
    "use strict";

    var container = $("#content"), canvasDirection;

    function closeOffCanvas() {
        setTimeout(function(){
          container.removeClass("off-canvas");
          canvasDirection = undefined;
        }, 300);
    }

    $(".col-md-7").append('<div class="site-overlay"></div>');

    $(document).on("click", "#navbar-logo > a", function (e) {

        e.preventDefault();

        if ($(this).data("move") === canvasDirection) {
            closeOffCanvas();
        }

        if ($(this).data("move") !== undefined && $(this).data("move") === "rtl") {
            container.toggleClass("move-right").removeClass("move-left");
            canvasDirection = "rtl";
        } else {
            container.toggleClass("move-left").removeClass("move-right");
            canvasDirection = "ltr";
        }

        if (container.hasClass("move-right") || container.hasClass("move-left")) {
            container.addClass("off-canvas");
        }

    });

    $(".main-content").on("click", ".site-overlay", function (e) {

        e.preventDefault();

        if (container.hasClass("move-right") || container.hasClass("move-left")) {
            closeOffCanvas();
        }

        if (container.hasClass("move-right")) {
            container.toggleClass("move-right");
        }

        if (container.hasClass("move-left")) {
            container.toggleClass("move-left");
        }
    });

}(window.jQuery);
