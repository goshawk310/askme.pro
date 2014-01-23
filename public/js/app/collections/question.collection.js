askmePro.collections.QuestionCollection = Backbone.Collection.extend({
    model: askmePro.models.QuestionModel
});

askmePro.collections.QuestionLikeCollection = Backbone.Collection.extend({
    model: askmePro.models.QuestionLikeModel
});