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
                pageSize: 20,
                totalRecords: 120000
            },
            mode: 'server'
        });
        Backgrid.Column.prototype.defaults.editable = false;
        var users = new UsersCollection();
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
            }],
            collection: users,
            className: 'table'
        });
        $('#content-container').append(grid.render().el);

        
        // Initialize the paginator
        
        var oldRender = Backgrid.Extension.Paginator.prototype.render;
        console.log(oldRender);
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
        console.log(paginator);
        users.fetch({reset: true});
        var paginatorElem = paginator.render().$el;
        $('.panel-footer').append(paginatorElem);
        setTimeout(function () {
            paginatorElem.children('ul').addClass('pagination')
        }, 1000);
        
        
    }
});
