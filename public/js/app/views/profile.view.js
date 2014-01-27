askmePro.views.ProfileIndexView = Backbone.View.extend({
    template: $('#profile-index-tpl').length ? _.template($('#profile-index-tpl').html()) : null,
    questions: [],
    gifts: [],
    giftBounds: [],
    page: 0,
    path: null,
    initialize: function(options) {
        this.path = options.path || null;
        this.render();
    },
    render: function() {
        this.setElement($(this.template()));
        if (this.$('#question-form').length) {
            this.$('#question-contents').charsLimiter(200, this.$('#question-contents-count'));
            this.ask();
        }
        this.loadAnswers();
        this.setupPointsProgress();
        $('#btn-stats-answered').on('click', this.showAnswered);
        return this;
    },
    events: {
        'click #question-form-message-container a': 'hideMessage',
        'click .more': 'more'
    },
    ask: function ask() {
        var form = this.$('#question-form'),
            message = this.$('#question-form-message-container'),
            success = message.children('.success'),
            error = message.children('.error');
        form.validate({
            rules: {
                'question[contents]': {
                    required: true
                }
            },
            submitHandler: function(form) {
                var $form = $(form),
                    submit = $form.find('button[type="submit"]');
                submit.attr('disabled', true);
                $.post($form.attr('action'), $form.serialize())
                    .done(function(response) {
                        message.show();
                        if (response.status === 'success') {
                            success.show();
                            error.hide();
                        } else {
                            error.show();
                            success.hide();
                        }
                    })
                    .fail(function() {
                        message.show();
                        success.hide();
                        error.show();
                    })
                    .always(function() {
                        submit.attr('disabled', false);
                    });
            }
        });

    },
    hideMessage: function hideMessage(e) {
        e.preventDefault();
        var message = this.$('#question-form-message-container');
        message.children('.message').hide();
        message.hide();
        this.$('#question-contents').val('');
        this.$('#question-contents-count').html(200);
    },
    setupPointsProgress: function setupPointsProgress() {
        var progressElem = $('#user-points-progress-bar'),
            points = parseInt(progressElem.attr('aria-valuenow'), 10),
            progress = 0,
            cssClass = 'levelone';
        if (points < 101) {
            progress = points;
        } else if (points > 100 && points < 501) {
            progress = (progress - 100) / 400 * 100;
            cssClass = 'leveltwo';
        } else if (points > 500 && points < 1001) {
            progress = (points - 500) / 500 * 100;
            cssClass = 'levelthree';
        } else if (points > 1000 && points < 5001) {
            progress = (points - 1000) / 4000 * 100;
            cssClass = 'levelfour';
        } else if (points > 5000) {
            progress = 100;
            cssClass = 'levelfive';
        }
        progressElem.addClass(cssClass).css('width', progress + '%');
    },
    loadAnswers: function loadAnswers(page) {
        var thisObj = this,
            loader = this.$('#answers-wrapper').loading(),
            container = this.$('#answers-container'),
            moreContainer = this.$('.more-container'),
            more = moreContainer.children('.more'),
            p = page || 0;
        loader.css({display: 'block', opacity: 1});
        $.get(window.location.pathname + '/answers?p=' + p)
            .done(function (response) {
                thisObj.collection = new askmePro.collections.QuestionCollection(response.questions);
                thisObj.collection.each(function (question) {
                    thisObj.questions.push(new askmePro.views.QuestionView({
                        model: question,
                        attributes: {
                            parent: thisObj
                        }
                    }));
                    container.append(thisObj.questions[thisObj.questions.length - 1].render().$el);
                });
                if (response.hasMore === false) {
                    thisObj.page =  0;
                    moreContainer.hide();
                } else {
                    thisObj.page = response.hasMore;
                    moreContainer.show();
                }
                if (p === 0 && thisObj.path === 'answers') {
                    thisObj.showAnswered();
                }
            })
            .fail(function () {

            })
            .always(function () {
                loader.hide();
            });

    },
    more: function more() {
        this.loadAnswers(this.page);
    },
    loadGifts: function loadGifts(data, editable) {
        var thisObj = this,
            container = $('#profile-top'),
            view = null,
            position = container.offset(),
            giftElems = null;
        this.bounds = [
            position.left - 50,
            position.top - 50,
            container.width() + position.left - 70,
            container.height() + position.top + 200
        ];
        container.addClass('gifts-visible');    
        _.each(data, function (gift) {
            var x = gift.pos.x / gift.bounds.w * 100,
                y = gift.pos.y / gift.bounds.h * 100;;
            view = new askmePro.views.ProfileGiftView({
                model: new askmePro.models.GiftModel(gift),
                attributes: {
                    src: '/uploads/gifts/' + gift.gift.file,
                    style: 'left: ' + x + '%; top: ' + gift.pos.y + 'px'
                },
                editable: editable,
                bounds: thisObj.bounds
            });
            thisObj.gifts.push(view.render());
            container.append(view.$el);
        });
        giftElems = container.children('.gift');
        giftElems.draggable({containment: this.bounds});
        $(window).on('resize', function () {
            giftElems.draggable('destroy');
            container = $('#profile-top');
            position = container.offset(),
            thisObj.bounds = [
                position.left - 50,
                position.top - 50,
                container.width() + position.left - 70,
                container.height() + position.top + 200
            ];
            giftElems.draggable({containment: thisObj.bounds});
        });
    },
    showAnswered: function showAnswered() {
        $('html, body').animate({scrollTop: $('#answers-wrapper').offset().top - 90});
    }
});

askmePro.views.ProfileGiftView = Backbone.View.extend({
    tagName: 'img',
    className: 'gift',
    editable: false,
    bounds: [],
    initialize: function(options) {
        this.editable = options.editable || false;
        this.bounds = options.bounds;
    },
    render: function() {
        return this;
    },
    events: {
        'dragstop': 'updatePosition'
    },
    updatePosition: function updatePosition(e, ui) {
        if (!this.editable) {
            return;
        }
        var thisObj = this,
            model = this.model;
        model.url  = '/api/gifts/' + model.get('_id') + '/position';
        model.save({
            position : {
                x: ui.position.left,
                y: ui.position.top
            },
            bounds: {
                w: thisObj.bounds[2] - thisObj.bounds[0],
                h: thisObj.bounds[3] - thisObj.bounds[1]
            }
        }, {
            patch: true,
            success: function () {

            },
            error: function () {

            }
        });
    }
});

askmePro.views.ProfileInfoView = Backbone.View.extend({
    template: _.template($('#profile-info-tpl').html()),
    initialize: function() {
        this.render();
    },
    render: function() {
        this.setElement($(this.template()));
        return this;
    },
    events: {

    }
});

askmePro.views.ProfileSendGiftsView = Backbone.View.extend({
    template: _.template($('#profile-gifts-modal-tpl').html()),
    initialized: false,
    loader: null,
    initialize: function() {
        
    },
    render: function() {
        this.setElement($(this.template()));
        this.to = this.$el.data('to');
        this.points = this.$el.data('points');
        return this;
    },
    events: {

    },
    load: function load(router) {
        var thisObj = this,
            body = this.$('.modal-body > .row');
        if (typeof router !== 'undefined') {    
            if (!this.initialized) {
                this.$el.on('hidden.bs.modal', function () {
                    router.navigate('', {trigger: true});
                });
                this.initialized = true;
            }
        }
        body.html('');
        this.loader = body.loading();
        this.loader.css({display: 'block', opacity: 1});
        this.$el.modal('show');
        this.collection.fetch({
            success: function (collection, response, options) {
                thisObj.loader.hide();
                collection.each(function (gift) {
                    body.append(new askmePro.views.ProfileSendGiftView({
                        model: gift,
                        parent: thisObj
                    }).render().$el);
                });
            },
            error: function () {
                thisObj.loader.hide();
            }
        });
    }
});

askmePro.views.ProfileSendGiftView = Backbone.View.extend({
    template: _.template($('#profile-gift-tpl').html()),
    initialize: function(options) {
        this.parent = options.parent || null;
    },
    render: function() {
        this.setElement($(this.template({gift: this.model.attributes, points: this.parent.points})));
        return this;
    },
    events: {
        'click .send-gift-button': 'sendGift'
    },
    sendGift: function sendGift(e) {
        var thisObj = this;
        this.parent.loader.css({display: 'block', opacity: 1});
        this.model.set('to', this.parent.to);
        this.model.set('type', $(e.currentTarget).data('type'));
        Backbone.sync('create', this.model, {
            url: '/api/gifts/' + thisObj.model.get('_id') + '/send',
            success: function (response) {
                var btnGroupElement = thisObj.$('.btn-group'),
                    messageElement = $('<div class="message"></div>'),
                    pointsElement = thisObj.parent.$('.profile-gifts-wrapper').find('.points');
                thisObj.parent.points = parseInt(pointsElement.html(), 10) - 20;
                if (response.status === 'success') {
                    pointsElement.html(thisObj.parent.points);
                    if (thisObj.parent.points === 0) {
                        thisObj.parent.$('.profile-gifts-wrapper > .row').addClass('disabled').data('points', 0);
                        thisObj.parent.load(askmePro.router);
                    }
                    messageElement.addClass('text-success');
                } else {
                    messageElement.addClass('text-danger');
                }
                messageElement.html(response.message);
                btnGroupElement.before(messageElement);
                btnGroupElement.css({opacity: 0, visibility: 'hidden'});
                thisObj.parent.loader.hide();
            },
            error: function (response) {
                var btnGroupElement = thisObj.$('.btn-group'),
                    messageElement = $('<div class="message"></div>');
                messageElement.addClass('text-danger').html(response.message);
                btnGroupElement.before(messageElement);
                btnGroupElement.css({opacity: 0, visibility: 'hidden'});
                thisObj.parent.loader.hide();
            }
        });
    }
});