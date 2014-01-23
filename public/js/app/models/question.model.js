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

askmePro.models.QuestionLikeModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot : '/question/like',
    initialize: function () {
    },
    defaults: {
        question_id: null,
        to: null
    },
    validate: function (attrs) {
        
    }
});