askmePro.views.AdminStickersGridView = Backbone.View.extend({
    initialize: function () {
        
    },
    render: function() {
        var Collection = Backbone.PageableCollection.extend({
            model: askmePro.models.AdminStickerModel,
            url: '/api/admin/stickers',
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
        var rows = new Collection();
        rows.on('request', function () {
            $('.panel-body').loading()('show');
        }).on('sync', function () {
            $('.panel-body').loading()('hide');
        }).on('error', function () {
            $('.panel-body').loading()('hide');
        });
        var grid = new Backgrid.Grid({
            columns: [{
                name: 'name',
                label: 'Nazwa',
                cell: 'string'
            }, {
                name: 'file',
                label: 'Plik',
                cell: Backgrid.UriCell.extend({
                    className: 'sortable renderable file-cell sticker-cell',
                    render: function () {
                        var rawValue = this.model.get(this.column.get("name"));
                        var formattedValue = this.formatter.fromRaw(rawValue, this.model);
                        this.$el.append($("<img>", {
                            tabIndex: -1,
                            src: ('/images/stickers/' + rawValue)
                        }));
                        this.delegateEvents();
                        return this;
                    }
                })
            }, {
                name: '_id',
                label: 'Akcja',
                sortable: false,
                editable: false,
                cell: askmePro.Backgrid.ButtonDropdownCell.extend({
                    buttonOptions: {
                        text: 'Wybierz',
                        listClassName: 'dropdown-menu pull-right',
                        actions: [{
                            label: 'Usuń',
                            url: '/api/admin/stickers/:id',
                            method: 'delete',
                            loadingText: 'Trwa usuwanie...',
                            confirm: 'Czy napewno usunąć wstążkę?',
                            callbacks: {
                                success: function (tableCol) {
                                    tableCol.remove();
                                }
                            }
                        }]
                    }
                })
            }],
            collection: rows,
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
            collection: rows,
        });
        rows.fetch({reset: true});
        var paginatorElem = paginator.render().$el;
        $('.panel-footer').append(paginatorElem);
        return this;
    }
});


askmePro.views.AdminStickerActionsView = Backbone.View.extend({
    el: '',
    initialize: function () {
        
    },
    render: function() {
        var form = new Backbone.Form({
            model: new askmePro.models.AdminStickerModel(),
            template: _.template('\
            <form action="/api/admin/stickers/image" method="post" enctype="multipart/form-data" class="form-horizontal" role="form" data-fieldsets></form>\
            ')
        });
        var _interpolateBackup = _.templateSettings;
        _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g,
            evaluate: /<%([\s\S]+?)%>/g
        };
        var modal = new Backbone.BootstrapModal({
            content: form,
            title: 'Dodaj wstążkę',
            animate: true,
            allowCancel: true,
            cancelText: 'Anuluj',
            okText: 'Zapisz',
            template: _.template($('#form-modal-tpl').html())
        }).open(function () {
            var errors = form.commit();
        });
        _.templateSettings = _interpolateBackup;

        askmePro.upload.image(
            form.$el,
            form.$('.progress'),
            form.$('.image-container'),
            '/images/stickers/',
            null, 
            function (e, data, formElem, progressElem, imgContainer, path) {
                var uploadObj = this,
                    filename = '';
                if (data.result.status === 'success' && data.result.filename) {
                    filename = path + data.result.filename;
                    imgContainer.html('<img src="' + filename + '"  class="img-thumbnail">');
                } else {
                    askmePro.utils.showAlert(data.result);
                }
                uploadObj.hideProgress(progressElem);
            }
        );

        modal.on('cancel', function () {
            askmePro.router.navigate('/', {trigger: true, replace: true});
        });
        return this;
    }
});
