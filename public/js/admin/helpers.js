askmePro.Backgrid = {};
askmePro.Backgrid.ButtonCell = Backgrid.Cell.extend({
    className: 'button-cell',
    defaultButtonOptions: {
        text: '',
        loadingText: '',
        confirm: '',
        method: 'delete',
        url: '',
        buttonClassName: 'btn btn-primary btn-xs',
        callbacks: {
            success: function (tableCol) {
                askmePro.views.helpers.gird.columnStatus(tableCol, 'success'); 
            },
            error: function (tableCol) {
                askmePro.views.helpers.gird.columnStatus(tableCol, 'danger'); 
            }
        }
    },
    initialize: function (options) {
        Backgrid.Cell.prototype.initialize.call(this, options);
        _.defaults(this.buttonOptions, this.defaultButtonOptions);
    },
    events: {
        'click': 'enterEditMode',
        'click .btn': 'onClick'
    },
    onClick: function onClick() {
        if (window.confirm(this.buttonOptions.confirm)) {
            var thisObj = this,
                model = this.model,
                buttonElem = this.$('button.btn'),
                tableCol = thisObj.$el.parent(),
                id = this.formatter.fromRaw(model.get(this.column.get('name')), model);
            buttonElem.button('loading');    
            $.ajax(this.buttonOptions.url.replace(':id', id), {
                type: 'post',
                data: null,
                beforeSend: function(xhr){
                   xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-param"]').attr('content'));
                   xhr.setRequestHeader('X-HTTP-Method-Override', thisObj.buttonOptions.method);
                }
            }).done(function () {
                thisObj.buttonOptions.callbacks.success(tableCol);      
            }).fail(function () {
                thisObj.buttonOptions.callbacks.success(tableCol);
            }).always(function () {
                buttonElem.button('reset');   
            });
        }
    },
    render: function () {
        this.$el.empty();
        this.$el.html('<button class="' +  this.buttonOptions.buttonClassName + '" data-loading-text="' +
            this.buttonOptions.loadingText + '">' + this.buttonOptions.text + '</button>');
        this.delegateEvents();
        return this;
    }
});

askmePro.Backgrid.ButtonDropdownCell = Backgrid.Cell.extend({
    className: 'button-cell button-dropdown-cell',
    defaultButtonOptions: {
        text: '',
        loadingText: '',
        confirm: '',
        listClassName: 'dropdown-menu',
        method: 'delete',
        url: '',
        actions: []
    },
    initialize: function (options) {
        Backgrid.Cell.prototype.initialize.call(this, options);
        _.defaults(this.buttonOptions, this.defaultButtonOptions);
    },
    events: {
        'click': 'enterEditMode',
        'click .btn-group li a': 'action'
    },
    action: function action(e) {
        e.preventDefault();
        var thisObj = this,
            $this = $(e.target),
            index = parseInt($this.data('i'), 10),
            confirmMessage = this.buttonOptions.actions[index].confirm || this.buttonOptions.confirm,
            method = this.buttonOptions.actions[index].method || this.buttonOptions.method,
            loadingText = this.buttonOptions.actions[index].loadingText || this.buttonOptions.loadingText,
            url = this.buttonOptions.actions[index].url || this.buttonOptions.url,
            callbacks = {
                success: function (tableCol) {
                    if (thisObj.buttonOptions.actions[index].callbacks && thisObj.buttonOptions.actions[index].callbacks.success) {
                        thisObj.buttonOptions.actions[index].callbacks.success(tableCol);
                    } else {
                        askmePro.views.helpers.gird.columnStatus(tableCol, 'success');
                    }
                },
                error: function (tableCol) {
                    if (thisObj.buttonOptions.actions[index].callbacks && thisObj.buttonOptions.actions[index].callbacks.error) {
                        thisObj.buttonOptions.actions[index].callbacks.error(tableCol);
                    } else {
                        askmePro.views.helpers.gird.columnStatus(tableCol, 'danger');
                    }
                }
            };
        if (window.confirm(confirmMessage)) {
            var model = this.model,
                buttonElem = this.$('button.btn'),
                tableCol = thisObj.$el.parent(),
                id = this.formatter.fromRaw(model.get(this.column.get('name')), model);
            buttonElem.data('loading-text', loadingText);
            buttonElem.button('loading');    
            $.ajax(url.replace(':id', id), {
                type: 'post',
                data: null,
                beforeSend: function(xhr){
                   xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-param"]').attr('content'));
                   xhr.setRequestHeader('X-HTTP-Method-Override', method);
                }
            }).done(function () {
                callbacks.success(tableCol);
            }).fail(function () {
                callbacks.error(tableCol);
            }).always(function () {
                buttonElem.button('reset');   
            });
        }
    },
    render: function () {
        this.$el.empty();
        var ddElem = $('<div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle btn-xs" data-toggle="dropdown" data-loading-text="' + this.buttonOptions.loadingText + '">' + this.buttonOptions.text + ' <span class="caret"></span></button><ul class="' + this.buttonOptions.listClassName + '" role="menu"></ul></div>'),
            ulElem = ddElem.find('ul');
        _.each(this.buttonOptions.actions, function (action, index) {
            ulElem.append('<li><a href="' + action.url + '" data-i="' + index + '">' + action.label + '</a></li>');
        });  
        this.$el.html(ddElem);
        this.delegateEvents();
        return this;
    }
});
askmePro.views.helpers.gird = {};
askmePro.views.helpers.gird.columnStatus = function columnStatus(column, className) {
    column.addClass(className);
    var t = setTimeout(function () {
        column.removeClass(className);
        clearTimeout(t);
        t = null;
    }, 4000);
};