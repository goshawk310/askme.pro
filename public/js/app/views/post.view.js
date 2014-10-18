askmePro.views.PostIndexView = Backbone.View.extend({
    template: _.template($('#post-modal-tpl').html()),
    modal: null,
    initialize: function () {
        this.setElement($(this.template()));
        this.modal = this.$el.modal();
    },
    render: function () {
       this.modal.modal('show');
    }
});