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
        var thisObj = this;
        if (this.response !== null) {
            return this.setHtml();
        }
        $.ajax('/api/users/followed')
        .done(function(response) {
            thisObj.response = response;
        })
        .always(function () {
            thisObj.setHtml();
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
    if ($(window).width() > 1680) {
        toggleRight.trigger('click');
    }
})