askmePro.views.RightCanvasView = Backbone.View.extend({
    template: _.template($('#canvas-users-followed-tpl').html()),
    response: null,
    rendered: false,
    initialize: function(options) {
    },
    render: function () {
        this.setElement($(this.template({
            elements: this.response
        })));
        this.rendered = true;
        return this;
    },
    setHtml: function () {
        if (!this.rendered) {
            this.render();
        }
        $('.canvas-right > .content').html(this.$el);

        $('.no-touch .canvas-right > .content').slimScroll({
            color: '#292C35',
            size: '4px',
            height: '100%',
            alwaysVisible: false,
            distance: '2px',
            allowPageScroll: false
        });
    },
    load: function load(callback) {
        var thisObj = this
            canvasRight = $('.canvas-right');
        if (this.response !== null) {
            return this.setHtml();
        }
        canvasRight.loading()('show');
        $.ajax('/api/users/followed', {
            localCache: true,
            cacheTTL : 60,
            cacheKey: 'canvas_right_users_' + askmePro.data.user.id,
            dataType: 'json',
        })
        .done(function(response) {
            thisObj.response = response;
        })
        .always(function () {
            thisObj.setHtml();
            canvasRight.loading()('hide');
        });
    }
});

$(function () {
    var toggleRight = $('.toggle-canvas-right');
    toggleRight.on('click', function (e) {
        e.preventDefault();
        var rightCanvasView = new askmePro.views.RightCanvasView();
        rightCanvasView.load();
    });
    if ($('body').hasClass('app-layout') && $(window).width() > 1680) {
        toggleRight.trigger('click');
    }
})