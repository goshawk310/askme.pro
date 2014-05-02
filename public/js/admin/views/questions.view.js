askmePro.views.AdminQuestionsGridView = Backbone.View.extend({
    initialize: function () {
        
    },
    render: function() {
        var Collection = Backbone.PageableCollection.extend({
            model: askmePro.models.QuestionModel,
            url: '/api/admin/questions',
            state: {
                pageSize: 60
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
        var collection = new Collection();
        collection.on('request', function () {
            $('.panel-body').loading()('show');
        }).on('sync', function () {
            $('.panel-body').loading()('hide');
        }).on('error', function () {
            $('.panel-body').loading()('hide');
        });
        var grid = new Backgrid.Grid({
            columns: [{
                name: 'from.username',
                sortable: false,
                label: 'Od',
                cell: Backgrid.UriCell.extend({
                    render: function () {
                        Backgrid.UriCell.prototype.render.call(this);
                        if (this.model.get('from') === null) {
                            if (this.model.get('og_from') !== null) {
                                this.$('a').remove();
                                this.$el.append($('<span>anonimowo</span>'));
                                this.$el.append('<br><a class="text-muted small" href="/admin/users#' + this.model.get('og_from').username + '">przejdź</a>');
                            } else {
                                this.$('a').remove();
                                this.$el.append($('<span>anonimowo</span>'));
                            }
                        } else {
                            this.$('a').attr('href', '/' + this.$('a').attr('href'));
                            this.$el.append('<br><a class="text-muted small" href="/admin/users#' + this.model.get('from').username + '">przejdź</a>');
                        }
                        return this;
                    }
                })
            }, {
                name: 'ip',
                sortable: false,
                label: 'IP',
                cell: 'string'
            }, {
                name: 'contents',
                sortable: false,
                label: 'Pytanie',
                cell: Backgrid.StringCell.extend({
                    render: function () {
                        Backgrid.StringCell.prototype.render.call(this);
                        this.$el.html(askmePro.views.helpers.parseUsersText(this.$el.html()));
                        return this;
                    }
                })
            }, {
                name: 'to.username',
                sortable: false,
                label: 'Do',
                cell: Backgrid.UriCell.extend({
                    render: function () {
                        Backgrid.UriCell.prototype.render.call(this);
                        this.$('a').attr('href', '/' + this.$('a').attr('href'));
                        this.$el.append('<br><a class="text-muted small" href="/admin/users#' + this.model.get('to').username + '">przejdź</a>');
                        return this;
                    }
                })
            }, {
                name: 'answer',
                sortable: false,
                label: 'Odpowiedź',
                cell: Backgrid.StringCell.extend({
                    render: function () {
                        Backgrid.StringCell.prototype.render.call(this);
                        this.$el.html(askmePro.views.helpers.parseUsersText(this.$el.html()));
                        if (this.model.get('image') !== null) {
                            this.$el.append('<br><img src="' + askmePro.settings.upload.answer.url + this.model.get('image') + '" class="img-thumbnail">');
                        }
                        if (this.model.get('yt_video') !== null) {
                            this.$el.append('<br><iframe width="640" height="360" src="//www.youtube.com/embed/' + this.model.get('yt_video') + '?wmode=opaque" frameborder="0" allowfullscreen></iframe>');

                        }
                        return this;
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
                        url: '/api/admin/questions/:id',
                        buttonClassName: 'btn btn-warning btn-xs',
                        callbacks: {
                            success: function (tableCol) {
                                tableCol.remove();
                            }
                        }
                    }
                })   
            }],
            collection: collection,
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
            collection: collection
        });
        collection.fetch({reset: true});
        var paginatorElem = paginator.render().$el;
        $('.panel-footer').append(paginatorElem);
        
        // ServerSideFilter delegates the searching to the server by submitting a query.
        var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
            collection: collection,
            name: 'query',
            placeholder: 'filtruj'
        });
        $('.panel-heading').append(serverSideFilter.render().el);

        return this;
    }
});
