askmePro.models.AdminStickerModel = Backbone.Model.extend({
    idAttribute: '_id',
    schema: {
        name: {
            type: 'Text',
            title: 'Nazwa',
            validators: ['required']
        },
        file: {
            type: 'Text',
            title: 'Plik',
            validators: ['required']
        }
    },
    initialize: function () {
    },
    validate: function (attrs) {
    }
});