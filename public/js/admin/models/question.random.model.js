askmePro.models.AdminQuestionRandomModel = Backbone.Model.extend({
    idAttribute: '_id',
    schema: {
        contents: {
            type: 'TextArea',
            title: 'Pytania',
            validators: ['required'],
            editorAttrs: {
                rows: 20
            }
        }
    },
    initialize: function () {
    },
    validate: function (attrs) {
    }
});