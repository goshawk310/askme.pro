askmePro.models.QuestionModel = Backbone.DeepModel.extend({
    idAttribute: '_id',
    initialize: function () {
    },
    defaults: {
        stats: {
            likes: 0,
            comments: 0
        }
    },
    validate: function (attrs) {
        
    }
});