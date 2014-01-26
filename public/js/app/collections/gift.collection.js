askmePro.collections.GiftCollection = Backbone.Collection.extend({
    url: '/api/gifts',
    model: askmePro.models.GiftModel
});