askmePro.views.AdminUserImagesGridView = Backbone.View.extend({
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
                name: 'avatar',
                sortable: false,
                label: 'Avatar',
                cell: Backgrid.StringCell.extend({
                    render: function () {
                        Backgrid.StringCell.prototype.render.call(this);
                        if (this.model.get('avatar')) {
                            this.$el.html('<img src="/uploads/avatars/' + this.model.get('avatar') + '" class="img-thumbnail img-avatar">');
                        }
                        return this; 
                    }
                })
            }, {
                name: 'top_bg',
                sortable: false,
                label: 'Top',
                cell: Backgrid.StringCell.extend({
                    render: function () {
                        Backgrid.StringCell.prototype.render.call(this);
                        if (this.model.get('top_bg')) {
                            this.$el.html('<img src="/uploads/tops/' + this.model.get('top_bg') + '" class="img-thumbnail img-top">');
                        }
                        return this;
                    }
                })
            }, {
                name: 'custom_background',
                sortable: false,
                label: 'Tło',
                cell: Backgrid.StringCell.extend({
                    render: function () {
                        Backgrid.StringCell.prototype.render.call(this);
                        if (this.model.get('custom_background')) {
                            this.$el.html('<img src="/uploads/backgrounds/' + this.model.get('custom_background') + '" class="img-thumbnail img-bg">');
                        }
                        return this;
                    }
                })
            }, {
                name: '_id',
                label: 'Usuń',
                sortable: false,
                editable: false,
                cell: askmePro.Backgrid.ButtonDropdownCell.extend({
                    buttonOptions: {
                        text: 'Wybierz',
                        loadingText: 'Trwa usuwanie...',
                        confirm: 'Czy napewno usunąć element?',
                        listClassName: 'dropdown-menu pull-right',
                        actions: [{
                            label: 'Avatar',
                            url: '/api/admin/users/:id/avatar',
                            method: 'delete',
                            callbacks: {
                                success: function (tableCol) {
                                    tableCol.find('img.img-avatar').remove();
                                    askmePro.views.helpers.gird.columnStatus(tableCol, 'success');
                                }
                            }
                        }, {
                            label: 'Top',
                            url: '/api/admin/users/:id/top_bg',
                            method: 'delete',
                            callbacks: {
                                success: function (tableCol) {
                                    tableCol.find('img.img-top').remove();
                                    askmePro.views.helpers.gird.columnStatus(tableCol, 'success');
                                }
                            }
                        }, {
                            label: 'Tło',
                            url: '/api/admin/users/:id/custom_bg',
                            method: 'delete',
                            callbacks: {
                                success: function (tableCol) {
                                    tableCol.find('img.img-bg').remove();
                                    askmePro.views.helpers.gird.columnStatus(tableCol, 'success');
                                }
                            }
                        }]
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
