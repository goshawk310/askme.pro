askmePro.Backgrid = {};
askmePro.Backgrid.ButtonCell = Backgrid.Cell.extend({
    className: 'button-cell',
    defaultButtonOptions: {
        text: '',
        loadingText: '',
        confirm: '',
        method: 'delete',
        url: ''
    },
    initialize: function (options) {
        Backgrid.Cell.prototype.initialize.call(this, options);
        _.defaults(this.buttonOptions, this.defaultButtonOptions);
    },
    events: {
        'click': 'enterEditMode',
        'click .btn': 'removeAll'
    },
    removeAll: function removeAll() {
        if (confirm(this.buttonOptions.confirm)) {
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
        this.$el.html('<button class="btn btn-primary btn-xs" data-loading-text="' + this.buttonOptions.loadingText + '">' + this.buttonOptions.text + '</button>');
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
    initialize: function() {
        
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
                cell: 'string'
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
                label: 'Pytania',
                sortable: false,
                editable: false,
                cell: Backgrid.Cell.extend({
                    className: 'button-cell',
                    render: function () {
                        this.$el.empty();
                        //var model = this.model,
                        //    id = this.formatter.fromRaw(model.get(this.column.get("name")), model);
                        this.$el.html('<button class="btn btn-primary btn-xs">Usuń wszystkie</button>');
                        this.delegateEvents();
                        return this;
                    }
                })
            }, {
                name: '_id',
                label: 'Odpowiedzi',
                sortable: false,
                editable: false,
                cell: askmePro.Backgrid.ButtonCell.extend({
                    buttonOptions: {
                        text: 'Usuń wszystkie',
                        loadingText: 'Trwa usuwanie...',
                        confirm: 'Czy napewno usunąć wszystkie odpowiedzi?',
                        url: '/api/admin/users/:id/answers'
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
