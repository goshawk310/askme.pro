askmePro.views.AdminUsersGridView = Backbone.View.extend({
    initialize: function (options) {
        this.queryData = options.queryData || null;
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
                label: 'Zdjęcia profilowe',
                sortable: false,
                editable: false,
                cell: askmePro.Backgrid.ButtonDropdownCell.extend({
                    buttonOptions: {
                        text: 'Wybierz',
                        loadingText: 'Trwa usuwanie...',
                        confirm: 'Czy napewno usunąć element?',
                        listClassName: 'dropdown-menu pull-right',
                        actions: [{
                            label: 'Top',
                            url: '/api/admin/users/:id/top_bg',
                            method: 'delete'
                        }, {
                            label: 'Tło',
                            url: '/api/admin/users/:id/custom_bg',
                            method: 'delete'
                        }, {
                            label: 'Avatar',
                            url: '/api/admin/users/:id/avatar',
                            method: 'delete'
                        }]
                    }
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
        $('#content-container').html(grid.render().el);
        
        // Initialize the paginator
        var GridPaginator = Backgrid.Extension.Paginator.extend({
            render: function () {
                Backgrid.Extension.Paginator.prototype.render.call(this);
                this.$('ul').addClass('pagination');
                return this;
            }
        });
        var paginator = new GridPaginator({
            collection: users
        });

        if (this.queryData) {
            users.fetch({reset: true, data: this.queryData});
        } else {
            users.fetch({reset: true});
        }
        
        var paginatorElem = paginator.render().$el;
        $('.panel-footer').html(paginatorElem);
        
        // ServerSideFilter delegates the searching to the server by submitting a query.
        var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
            collection: users,
            name: 'query',
            placeholder: 'filtruj'
        });
        $('.panel-heading').find('form').remove();
        $('.panel-heading').append(serverSideFilter.render().el);

        return this;
    }
});
