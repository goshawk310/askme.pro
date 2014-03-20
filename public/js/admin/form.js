askmePro.views.helpers.form = {
    editors: {}
};
askmePro.views.helpers.form.editors.File = Backbone.Form.editors.Base.extend({
    tagName: 'input',
    events: {
        'change': function() {
            this.trigger('change', this);
        },
        'focus': function() {
            this.trigger('focus', this);
        },
        'blur': function() {
            this.trigger('blur', this);
        }
    },
    initialize: function(options) {
        Backbone.Form.editors.Base.prototype.initialize.call(this, options);
        this.$el.attr('type', 'file');
        var element = $('\
        <div class="file-wrapper">\
            <span class="btn btn-default fileinput-button">\
                <span>wybierz...</span>\
            </span>\
        </div>\
        ');
        element.find('.fileinput-button').append(this.$el);
        this.setElement(element);
        
    },
    render: function() {
        this.setValue(this.value);
        return this;
    },
    getValue: function() {
        return this.$('input').val();
    },
    setValue: function(value) {
        this.$('input').val(value);
    },
    focus: function() {
        if (this.hasFocus) return;
        this.$('.fileinput-button').focus();
    },
    blur: function() {
        if (!this.hasFocus) return;
        this.$('.fileinput-button').blur();
    }
});