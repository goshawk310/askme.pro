askmePro.routerIndex = 'AdminUsersRouter';
askmePro.routers.AdminUsersRouter = Backbone.Router.extend({
    routes: {
        '*path': 'index'
    },
    index: function index() {
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
                            var thisObj = this;
                            this.model.save({
                                'status.value': parseInt(thisObj.$el.val(), 10)
                            }, {patch: true});
                        }
                    })
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
    }
});
