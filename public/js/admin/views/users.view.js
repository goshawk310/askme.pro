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
                askmePro.views.helpers.gird.columnStatus(tableCol, 'success'); 
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
        var $this = $(e.target),
            index = parseInt($this.data('i'), 10),
            confirmMessage = this.buttonOptions.actions[index].confirm || this.buttonOptions.confirm,
            method = this.buttonOptions.actions[index].method || this.buttonOptions.method,
            loadingText = this.buttonOptions.actions[index].loadingText || this.buttonOptions.loadingText,
            url = this.buttonOptions.actions[index].url || this.buttonOptions.url;
        if (window.confirm(confirmMessage)) {
            var thisObj = this,
                model = this.model,
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
                askmePro.views.helpers.gird.columnStatus(tableCol, 'success');         
            }).fail(function () {
                askmePro.views.helpers.gird.columnStatus(tableCol, 'danger');
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
askmePro.views.AdminUsersGridView = Backbone.View.extend({
    initialize: function () {
        
    },
    render: function() {
        var UsersCollection = Backbone.PageableCollection.extend({
            model: askmePro.models.UserModel,
            url: '/api/admin/users',
            state: {
                pageSize: 20
            },
            parseState: function (resp, queryParams, state, options) {
                return {totalRecords: resp.total};
            },
            parseRecords: function (resp, options) {
                return resp.rows;
            },
            mode: 'server'
        });
        Backgrid.Column.prototype.defaults.editable = false;
        var users = new UsersCollection();
        users.on('request', function () {
            $('.panel-body').loading()('show');
        }).on('sync', function () {
            $('.panel-body').loading()('hide');
        }).on('error', function () {
            $('.panel-body').loading()('hide');
        });
        var grid = new Backgrid.Grid({
            columns: [{
                name: 'username',
                label: 'Login',
                cell: Backgrid.UriCell.extend({
                    render: function () {
                        Backgrid.UriCell.prototype.render.call(this);
                        this.$('a').attr('href', '/' + this.$('a').attr('href'));
                        return this;
                    }
                })
            }, {
                name: 'name',
                label: 'Imię',
                cell: 'string'
            }, {
                name: 'lastname',
                label: 'Nazwisko',
                cell: 'string'
            }, {
                name: 'status.value',
                label: 'Status',
                sortable: false,
                editable: true,
                headerCell: Backgrid.HeaderCell.extend({
                    className: 'user-status-cell select-cell'
                }),
                cell: Backgrid.SelectCell.extend({
                    className: 'user-status-cell select-cell',
                    optionValues: [['Aktywny', 1], ['Dezaktywowany', 0], ['Ban', 2]],
                    editor: Backgrid.SelectCellEditor.extend({
                        className: 'form-control input-sm',
                        events: {
                            'change': 'change'
                        },
                        change: function () {
                            var thisObj = this,
                                tableCol = thisObj.$el.parent().parent();
                            this.model.save({
                                'status.value': parseInt(thisObj.$el.val(), 10)
                            }, {
                                patch: true,
                                success: function () {
                                    askmePro.views.helpers.gird.columnStatus(tableCol, 'success');
                                },
                                error: function () {
                                    askmePro.views.helpers.gird.columnStatus(tableCol, 'danger');
                                }
                            });
                        }
                    })
                })
            }, {
                name: '_id',
                label: 'Usuń wszystkie',
                sortable: false,
                editable: false,
                cell: askmePro.Backgrid.ButtonDropdownCell.extend({
                    buttonOptions: {
                        text: 'Wybierz',
                        loadingText: 'Trwa usuwanie...',
                        url: '/api/admin/users/:id/answers',
                        confirm: 'Czy napewno usunąć wszystkie elementy?',
                        listClassName: 'dropdown-menu pull-right',
                        actions: [{
                            label: 'Odpowiedzi',
                            url: '/api/admin/users/:id/answers',
                            method: 'delete'
                        }, {
                            label: 'Pytania',
                            url: '/api/admin/users/:id/questions',
                            method: 'delete'
                        }, {
                            label: 'Gifty wysłane',
                            url: '/api/admin/users/:id/gifts/sent',
                            method: 'delete'
                        }, {
                            label: 'Gifty otrzymane',
                            url: '/api/admin/users/:id/gifts/recived',
                            method: 'delete'
                        }, {
                            label: 'Polubienia wysłane',
                            url: '/api/admin/users/:id/likes/sent',
                            method: 'delete'
                        }, {
                            label: 'Polubienia otrzymane',
                            url: '/api/admin/users/:id/likes/recived',
                            method: 'delete'
                        }, {
                            label: 'Komentarze wysłane',
                            url: '/api/admin/users/:id/comments/sent',
                            method: 'delete'
                        }, {
                            label: 'Komentarze otrzymane',
                            url: '/api/admin/users/:id/comments/recived',
                            method: 'delete'
                        }]
                    }
                })
            }, {
                name: '_id',
                label: 'Usuń',
                sortable: false,
                editable: false,
                cell: askmePro.Backgrid.ButtonCell.extend({
                    buttonOptions: {
                        text: 'Usuń',
                        loadingText: 'Trwa usuwanie...',
                        url: '/api/admin/users/:id',
                        confirm: 'Czy napewno chcesz usunąć użytkownika?',
                        buttonClassName: 'btn btn-warning btn-xs',
                        callbacks: {
                            success: function (tableCol) {
                                tableCol.remove();
                            }
                        }
                    }
                })   
            }],
            collection: users,
            className: 'table table-striped table-bordered table-hover'
        });
        $('#content-container').append(grid.render().el);
        
        // Initialize the paginator
        var GridPaginator = Backgrid.Extension.Paginator.extend({
            render: function () {
                Backgrid.Extension.Paginator.prototype.render.call(this);
                this.$('ul').addClass('pagination');
                return this;
            }
        });
        var paginator = new GridPaginator({
            collection: users,
        });
        users.fetch({reset: true});
        var paginatorElem = paginator.render().$el;
        $('.panel-footer').append(paginatorElem);
        
        // ServerSideFilter delegates the searching to the server by submitting a query.
        var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
            collection: users,
            name: 'query',
            placeholder: 'filtruj'
        });
        $('.panel-heading').append(serverSideFilter.render().el);

        return this;
    }
});
