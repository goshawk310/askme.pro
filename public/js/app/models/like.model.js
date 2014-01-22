askmePro.models.LikeModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot : '/like',
    initialize: function () {
    },
    defaults: {
        question_id: null,
        to: null
    },
    validate: function (attrs) {
        
    }
});