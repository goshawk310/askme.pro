askmePro.views.QuestionView = Backbone.View.extend({
    template: _.template($('#question-tpl').html()),
    initialize: function () {
        
    },
    render: function () {
        var thisObj = this;
        this.setElement($(this.template({question: this.model.attributes})));
        return this;
    },
    events: {
        
    }
});