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
    initialize: function () {
    },
    defaults: {
        question_id: null,
        to: null
    },
    validate: function (attrs) {
        
    }
});

askmePro.models.QuestionCommentModel = Backbone.Model.extend({
    idAttribute: '_id',
    initialize: function () {
    },
    validate: function (attrs) {
        
    }
});

askmePro.models.GiftModel = Backbone.DeepModel.extend({
    idAttribute: '_id',
    initialize: function () {
    },
    validate: function (attrs) {
    },
    isNew: function() {
        return false;
    }
});

askmePro.models.UserModel = Backbone.DeepModel.extend({
    idAttribute: '_id',
    initialize: function () {
    },
    validate: function (attrs) {
    }
});

askmePro.models.PhotoModel = Backbone.Model.extend({
    idAttribute: '_id',
    initialize: function () {
    },
    validate: function (attrs) {
    }
});

askmePro.models.VideoModel = Backbone.Model.extend({
    idAttribute: '_id',
    initialize: function () {
    },
    validate: function (attrs) {
    }
});