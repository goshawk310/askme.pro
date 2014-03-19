askmePro.models.AdminStickerModel = Backbone.Model.extend({
    idAttribute: '_id',
    schema: {
        name: {
            type: 'Text',
            title: 'Nazwa',
            validators: ['required']
        },
        file: {
            type: askmePro.views.helpers.form.editors.File,
            title: 'Plik',
            validators: ['required']
        }
    },
    initialize: function () {
    },
    validate: function (attrs) {
    }
});