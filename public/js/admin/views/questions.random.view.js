askmePro.views.AdminQuestionsRandomGridView = Backbone.View.extend({
    initialize: function () {
        
    },
    render: function() {
        var Collection = Backbone.PageableCollection.extend({
            model: askmePro.models.AdminQuestionRandomModel,
            url: '/api/admin/questions/random',
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
                name: 'contents',
                label: 'Pytanie',
                cell: 'string'
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
                            url: '/api/admin/questions/random/:id',
                            method: 'delete',
                            loadingText: 'Trwa usuwanie...',
                            confirm: 'Czy napewno usunąć pytanie?',
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
        $('#content-container').html(grid.render().el);
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
        $('.panel-footer').html(paginatorElem);
        return this;
    }
});


askmePro.views.AdminQuestionsRandomActionsView = Backbone.View.extend({
    el: '',
    initialize: function () {
        
    },
    render: function() {
        var form = new Backbone.Form({
            model: new askmePro.models.AdminQuestionRandomModel()
        });
        var _interpolateBackup = _.templateSettings;
        _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g,
            evaluate: /<%([\s\S]+?)%>/g
        };
        var modal = new Backbone.BootstrapModal({
            content: form,
            title: 'Dodaj',
            animate: true,
            allowCancel: true,
            cancelText: 'Anuluj',
            okText: 'Zapisz',
            template: _.template($('#form-modal-tpl').html())
        }).open(function () {
            modal.preventClose();
            var errors = form.commit();
            if (!errors) {
                form.model.url = '/api/admin/questions/random';
                form.model.save({}, {
                    success: function () {
                        askmePro.router.navigate('/', {trigger: true, replace: true});
                        modal.close();
                    },
                    error: function () {
                        askmePro.router.navigate('/', {trigger: true, replace: true});
                        modal.close();
                    }
                });
            }
        });
        _.templateSettings = _interpolateBackup;
        modal.on('cancel', function () {
            askmePro.router.navigate('/', {trigger: true, replace: true});
        });
        return this;
    }
});
