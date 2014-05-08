askmePro.views.QuestionFormView = Backbone.View.extend({
    initialize: function(options) {
        this.setElement($('#question-form-wrapper'));
        if (this.$('#question-form').length) {
            this.$('#question-contents').charsLimiter(200, this.$('#question-contents-count'));
            this.ask();
        }
    },
    events: {
        'click #question-form-message-container a': 'hideMessage'
    },
    ask: function ask() {
        var form = this.$('#question-form'),
            message = this.$('#question-form-message-container'),
            success = message.children('.success'),
            error = message.children('.error'),
            rules = {
                'question[contents]': {
                    required: true
                }
            };
        if (this.$('#question-captcha').length) {
            rules['captcha'] = {
                required: true
            }
        }    
        form.validate({
            rules: rules,
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
        this.$('#question-captcha').val('');
        $('#captcha-image').trigger('click');
        this.$('#question-contents-count').html(200);
    }
});

askmePro.views.ProfileIndexView = Backbone.View.extend({
    template: $('#profile-index-tpl').length ? _.template($('#profile-index-tpl').html()) : null,
    questions: [],
    gifts: [],
    giftBounds: [],
    page: 0,
    path: null,
    adDisplayed: false,
    initialize: function(options) {
        this.path = options.path || null;
        this.render();
    },
    render: function() {
        var buttonsContainer = $('#profile-info-container, #profile-buttons-container-small');
        this.setElement($(this.template()));
        this.loadAnswers();
        this.setupPointsProgress();
        buttonsContainer.on('click', '.btn-follow', this.follow);
        buttonsContainer.on('click', '.btn-unfollow', this.unfollow);
        buttonsContainer.on('click', '.btn-block-user', this.block);
        buttonsContainer.on('click', '.btn-unblock-user', this.unblock);
        return this;
    },
    events: {
        'click .more': 'more'
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
        loader('show');
        $.get(window.location.pathname + '/answers?p=' + p)
            .done(function (response) {
                thisObj.collection = new askmePro.collections.QuestionCollection(response.questions);
                thisObj.collection.each(function (question, i) {
                    thisObj.questions.push(new askmePro.views.QuestionView({
                        model: question,
                        attributes: {
                            parent: thisObj
                        },
                        showAdd: (i === 0 && !thisObj.adDisplayed) ? true : false
                    }));
                    container.append(thisObj.questions[thisObj.questions.length - 1].render().$el);
                    if (!thisObj.adDisplayed && thisObj.questions[thisObj.questions.length - 1].showAdd) {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                        thisObj.adDisplayed = true;
                    }
                });
                if (response.hasMore === false) {
                    thisObj.page =  0;
                    moreContainer.hide();
                } else {
                    thisObj.page = response.hasMore;
                    moreContainer.show();
                }
            })
            .fail(function () {

            })
            .always(function () {
                loader('hide');
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
            view = new askmePro.views.ProfileCurrentGiftView({
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
    follow: function follow (e) {
        e.preventDefault();
        var $this = $(this),
            altText = $this.data('alttext'),
            text = $this.html(),
            buttons = $('.btn-follow');
        if ($this.hasClass('disabled')) {
            return;
        }    
        buttons.addClass('disabled');
        $.ajax('/api/users/' + askmePro.data.profile.id + '/follow', {
            type: 'post',
            beforeSend: function(xhr){
               xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-param"]').attr('content'));
            }
        }).done(function () {
            buttons.removeClass('btn-follow')
                .addClass('btn-unfollow')
                .html(altText).data('alttext', text);
        }).fail(function () {

        }).always(function () {
            buttons.removeClass('disabled');
        });
    },
    unfollow: function unfollow (e) {
        e.preventDefault();
        var $this = $(this),
            altText = $this.data('alttext'),
            text = $this.html(),
            buttons = $('.btn-unfollow');
        if ($this.hasClass('disabled')) {
            return;
        }
        buttons.addClass('disabled');
        $.ajax('/api/users/' + askmePro.data.profile.id + '/follow', {
            type: 'post',
            beforeSend: function(xhr){
               xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-param"]').attr('content'));
               xhr.setRequestHeader('X-HTTP-Method-Override', 'delete');
            }
        }).done(function () {
            buttons.removeClass('btn-unfollow')
                .addClass('btn-follow')
                .html(altText).data('alttext', text);
        }).fail(function () {

        }).always(function () {
            buttons.removeClass('disabled');
        });
    },
    block: function block (e) {
        e.preventDefault();
        var $this = $(this),
            altText = $this.data('alttext'),
            text = $this.html(),
            buttons = $('.btn-block-user');
        if ($this.hasClass('disabled')) {
            return;
        }    
        buttons.addClass('disabled');
        $.ajax('/api/users/' + askmePro.data.profile.id + '/block', {
            type: 'post',
            beforeSend: function(xhr){
               xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-param"]').attr('content'));
            }
        }).done(function () {
            buttons.removeClass('btn-block-user')
                .addClass('btn-unblock-user')
                .html(altText).data('alttext', text);
        }).fail(function () {

        }).always(function () {
            buttons.removeClass('disabled');
        });
    },
    unblock: function unblock (e) {
        e.preventDefault();
        var $this = $(this),
            altText = $this.data('alttext'),
            text = $this.html(),
            buttons = $('.btn-unblock-user');
        if ($this.hasClass('disabled')) {
            return;
        }    
        buttons.addClass('disabled');
        $.ajax('/api/users/' + askmePro.data.profile.id + '/block', {
            type: 'post',
            beforeSend: function(xhr){
               xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-param"]').attr('content'));
               xhr.setRequestHeader('X-HTTP-Method-Override', 'delete');
            }
        }).done(function () {
            buttons.removeClass('btn-unblock-user')
                .addClass('btn-block-user')
                .html(altText).data('alttext', text);
        }).fail(function () {

        }).always(function () {
            buttons.removeClass('disabled');
        });
    }
});

askmePro.views.ProfileCurrentGiftView = Backbone.View.extend({
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
    template: _.template($('#profile-send-gifts-modal-tpl').html()),
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
        this.loader('show');
        this.$el.modal('show');
        this.collection.fetch({
            success: function (collection, response, options) {
                thisObj.loader('hide');
                collection.each(function (gift) {
                    body.append(new askmePro.views.ProfileSendGiftView({
                        model: gift,
                        parent: thisObj
                    }).render().$el);
                });
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});

askmePro.views.ProfileSendGiftView = Backbone.View.extend({
    template: _.template($('#profile-send-gift-tpl').html()),
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
        this.parent.loader('show');
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
                thisObj.parent.loader('hide');
            },
            error: function (response) {
                var btnGroupElement = thisObj.$('.btn-group'),
                    messageElement = $('<div class="message"></div>');
                messageElement.addClass('text-danger').html(response.message);
                btnGroupElement.before(messageElement);
                btnGroupElement.css({opacity: 0, visibility: 'hidden'});
                thisObj.parent.loader('hide');
            }
        });
    }
});

askmePro.views.ProfileGiftsView = Backbone.View.extend({
    template: _.template($('#profile-gifts-tpl').html()),
    loader: null,
    paginationTemplate: null,
    pagination: null,
    initialize: function(options) {
        this.limit = options.limit || 18;
    },
    render: function() {
        this.setElement($(this.template()));
        return this;
    },
    events: {

    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#profile-gifts-container');
        this.loader = body.loading();
        this.loader('show');
        this.collection.fetch({
            add: false,
            url: '/api/users/' + askmePro.data.profile.username + '/gifts',
            data: {limit: thisObj.limit, page: page || 0},
            success: function (collection, response, options) {
                thisObj.loader('hide');
                if (!response.total) {
                    return;
                }
                var html = '';
                collection.add(response.gifts);
                collection.each(function (gift) {
                    html += new askmePro.views.ProfileGiftView({
                        model: gift,
                        parent: thisObj
                    }).render().$el.get(0).outerHTML;
                });
                body.html(html);
                if (thisObj.pagination === null) {
                    thisObj.pagination = new askmePro.views.PaginationView({
                        total: response.total,
                        limit: 18,
                        url: '#gifts/'
                    });
                    thisObj.$('#profile-gifts-pagination-container').html(thisObj.pagination.render().$el);
                }
                thisObj.pagination.setPage(page);
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});

askmePro.views.ProfileGiftView = Backbone.View.extend({
    template: _.template($('#profile-gift-tpl').html()),
    initialize: function(options) {
        this.parent = options.parent || null;
    },
    render: function() {
        this.setElement($(this.template({gift: this.model.attributes})));
        return this;
    },
    events: {
        
    }
});

askmePro.views.ProfileFollowsView = Backbone.View.extend({
    template: _.template($('#profile-users-tpl').html()),
    loader: null,
    pagination: null,
    initialize: function(options) {
        this.limit = options.limit || 18;
    },
    render: function() {
        this.setElement($(this.template()));
        return this;
    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#profile-users-container');
        this.loader = body.loading();
        this.loader('show');
        this.collection.url = '/api/users/' + askmePro.data.profile.username + '/follows';
        this.collection.fetch({
            add: false,
            data: {limit: thisObj.limit, page: page || 0},
            success: function (collection, response, options) {
                thisObj.loader('hide');
                if (!response.total) {
                    return;
                }
                body.html('');
                collection.add(response.users);
                collection.each(function (user) {
                    if (user.attributes.user) {
                        user.url = '/api/users/' + user.attributes.user._id + '/follow';
                        body.append(new askmePro.views.ProfileUserView({
                            model: user,
                            parent: thisObj,
                            editable: true
                        }).render().$el);
                    }
                });
                if (response.total > thisObj.limit) {
                    if (thisObj.pagination === null) {
                        thisObj.pagination = new askmePro.views.PaginationView({
                            total: response.total,
                            limit: thisObj.limit,
                            url: '#follows/'
                        });
                        thisObj.$('#profile-users-pagination-container').html(thisObj.pagination.render().$el);
                    }
                    thisObj.pagination.setPage(page);
                }
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});

askmePro.views.ProfileFollowersView = Backbone.View.extend({
    template: _.template($('#profile-users-tpl').html()),
    loader: null,
    pagination: null,
    initialize: function(options) {
        this.limit = options.limit || 18;
    },
    render: function() {
        this.setElement($(this.template()));
        return this;
    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#profile-users-container');
        this.loader = body.loading();
        this.loader('show');
        this.collection.url = '/api/users/' + askmePro.data.profile.username + '/followers';
        this.collection.fetch({
            add: false,
            data: {limit: thisObj.limit, page: page || 0},
            success: function (collection, response, options) {
                thisObj.loader('hide');
                if (!response.total) {
                    return;
                }
                body.html('');
                collection.add(response.users);
                collection.each(function (user) {
                    user.attributes.user = user.attributes.by;
                    body.append(new askmePro.views.ProfileUserView({
                        model: user,
                        parent: thisObj
                    }).render().$el);
                });
                if (response.total > thisObj.limit) {
                    if (thisObj.pagination === null) {
                        thisObj.pagination = new askmePro.views.PaginationView({
                            total: response.total,
                            limit: thisObj.limit,
                            url: '#followers/'
                        });
                        thisObj.$('#profile-users-pagination-container').html(thisObj.pagination.render().$el);
                    }
                    thisObj.pagination.setPage(page);
                }
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});


askmePro.views.ProfileUserView = Backbone.View.extend({
    template: _.template($('#profile-user-tpl').html()),
    initialize: function(options) {
        this.parent = options.parent || null;
        this.editable = options.editable || false;
    },
    render: function render() {
        this.setElement($(this.template({user: this.model.attributes, editable: this.editable})));
        return this;
    },
    events: {
        'click .user-remove': 'removeUser'
    },
    removeUser: function removeUser(e) {
        var thisObj = this,
            $this = $(e.target);
        $this.attr('disabled', true);
        this.model.destroy({
            success: function () {
                thisObj.remove();
                if (thisObj.parent.pagination) {
                    thisObj.parent.pagination.total -= 1;
                    thisObj.parent.$('#profile-users-pagination-container').html(thisObj.parent.pagination.render().$el);
                    thisObj.parent.pagination.setPage(thisObj.parent.pagination.page);
                }
            },
            error: function () {

            }
        });
    }
});

askmePro.views.ProfilePhotosView = Backbone.View.extend({
    template: _.template($('#profile-photos-tpl').html()),
    loader: null,
    pagination: null,
    initialize: function(options) {
        this.limit = options.limit || 18;
    },
    render: function() {
        this.setElement($(this.template()));
        return this;
    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#profile-photos-container');
        this.loader = body.loading();
        this.loader('show');
        this.collection.url = '/api/users/' + askmePro.data.profile.username + '/photos';
        this.collection.fetch({
            add: false,
            data: {limit: thisObj.limit, page: page || 0},
            success: function (collection, response, options) {
                thisObj.loader('hide');
                if (!response.total) {
                    return;
                }
                body.html('');
                collection.add(response.photos);
                collection.each(function (photo) {
                    body.append(new askmePro.views.ProfilePhotoView({
                        model: photo,
                        parent: thisObj,
                    }).render().$el);
                });
                body.find('.magnific').magnificPopup({
                    type:'image',
                    mainClass: 'mfp-fade'
                });
                if (response.total > thisObj.limit) {
                    if (thisObj.pagination === null) {
                        thisObj.pagination = new askmePro.views.PaginationView({
                            total: response.total,
                            limit: thisObj.limit,
                            url: '#photos/'
                        });
                        thisObj.$('#profile-photos-pagination-container').html(thisObj.pagination.render().$el);
                    }
                    thisObj.pagination.setPage(page);
                }
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});

askmePro.views.ProfilePhotoView = Backbone.View.extend({
    template: _.template($('#profile-photo-tpl').html()),
    initialize: function(options) {
        this.parent = options.parent || null;
    },
    render: function render() {
        this.setElement($(this.template({photo: this.model.attributes})));
        return this;
    },
    events: {
        'click .photo-remove': 'destroy'
    },
    destroy: function destroy(e) {
        var thisObj = this,
            $this = $(e.target);
        $this.attr('disabled', true);
        this.model.url = '/api/questions/' + this.model.get('_id') + '/photos';
        this.model.destroy({
            success: function () {
                thisObj.remove();
                if (thisObj.parent.pagination) {
                    thisObj.parent.pagination.total -= 1;
                    thisObj.parent.$('#profile-photos-pagination-container').html(thisObj.parent.pagination.render().$el);
                    thisObj.parent.pagination.setPage(thisObj.parent.pagination.page);
                }
            },
            error: function () {

            }
        });
    }
});

askmePro.views.ProfileVideosView = Backbone.View.extend({
    template: _.template($('#profile-videos-tpl').html()),
    loader: null,
    pagination: null,
    initialize: function(options) {
        this.limit = options.limit || 6;
    },
    render: function() {
        this.setElement($(this.template()));
        return this;
    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#profile-videos-container');
        this.loader = body.loading();
        this.loader('show');
        this.collection.url = '/api/users/' + askmePro.data.profile.username + '/videos';
        this.collection.fetch({
            add: false,
            data: {limit: thisObj.limit, page: page || 0},
            success: function (collection, response, options) {
                thisObj.loader('hide');
                if (!response.total) {
                    return;
                }
                body.html('');
                collection.add(response.videos);
                collection.each(function (video) {
                    body.append(new askmePro.views.ProfileVideoView({
                        model: video,
                        parent: thisObj,
                    }).render().$el);
                });
                if (response.total > thisObj.limit) {
                    if (thisObj.pagination === null) {
                        thisObj.pagination = new askmePro.views.PaginationView({
                            total: response.total,
                            limit: thisObj.limit,
                            url: '#videos/'
                        });
                        thisObj.$('#profile-videos-pagination-container').html(thisObj.pagination.render().$el);
                    }
                    thisObj.pagination.setPage(page);
                }
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});

askmePro.views.ProfileVideoView = Backbone.View.extend({
    template: _.template($('#profile-video-tpl').html()),
    initialize: function(options) {
        this.parent = options.parent || null;
    },
    render: function render() {
        this.setElement($(this.template({video: this.model.attributes})));
        return this;
    },
    events: {
        'click .video-remove': 'destroy'
    },
    destroy: function destroy(e) {
        var thisObj = this,
            $this = $(e.target);
        $this.attr('disabled', true);
        this.model.url = '/api/questions/' + this.model.get('_id') + '/videos';
        this.model.destroy({
            success: function () {
                thisObj.remove();
                if (thisObj.parent.pagination) {
                    thisObj.parent.pagination.total -= 1;
                    thisObj.parent.$('#profile-videos-pagination-container').html(thisObj.parent.pagination.render().$el);
                    thisObj.parent.pagination.setPage(thisObj.parent.pagination.page);
                }
            },
            error: function () {

            }
        });
    }
});
