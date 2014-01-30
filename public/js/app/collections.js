askmePro.collections.QuestionCollection = Backbone.Collection.extend({
    model: askmePro.models.QuestionModel
});

askmePro.collections.QuestionLikeCollection = Backbone.Collection.extend({
    model: askmePro.models.QuestionLikeModel
});

askmePro.collections.QuestionCommentCollection = Backbone.Collection.extend({
    model: askmePro.models.QuestionCommentModel
});

askmePro.collections.GiftCollection = Backbone.Collection.extend({
    url: '/api/gifts',
    model: askmePro.models.GiftModel
});

askmePro.collections.UsersCollection = Backbone.Collection.extend({
    model: askmePro.models.UserModel
});

askmePro.collections.PhotosCollection = Backbone.Collection.extend({
    model: askmePro.models.PhotoModel
});

askmePro.collections.VideosCollection = Backbone.Collection.extend({
    model: askmePro.models.VideoModel
});