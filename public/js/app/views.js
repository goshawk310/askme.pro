askmePro.views.PaginationView = Backbone.View.extend({
    initialized: false,
    page: 0,
    initialize: function(options) {
        var thisObj = this;
        this.parent = options.parent || null;
        this.template = options.template || _.template($('#pagination-tpl').html());
        this.total = options.total || 0;
        this.limit = options.limit || 18;
        this.url = options.url || '';
    },
    render: function () {
        var thisObj = this;
        this.pages = Math.ceil(this.total / this.limit);
        this.setElement($(this.template({
            pages: thisObj.pages,
            url: thisObj.url
        })));
        return this;
    },
    setPage: function setPage(page) {
        var elements = null,
            elementsCount,
            element,
            diff = 0,
            visibleElems = 8,
            veHalf  = visibleElems / 2;
        this.page = page;    
        if (this.pages < 2) {
            return;
        }
        elements = this.$('li');
        elementsCount = elements.length;
        elements.removeClass('active');
        elements.each(function (i) {
            if (i > 0 && i < elementsCount - 1) {
                element = $(this);
                if (page <= veHalf) {
                    if (i <= visibleElems) {
                        element.css({display: 'inline'});
                    } else {
                        element.hide();
                    }
                } else if (page >= elementsCount - 1 - veHalf) {
                    if (i >= elementsCount - 1 - visibleElems) {
                        element.css({display: 'inline'});
                    } else {
                        element.hide();
                    }
                } else {
                    diff = i - page;
                    if (diff > -veHalf && diff <= veHalf) {
                        element.css({display: 'inline'});
                    } else {
                        element.hide();
                    }
                }
            }
        });
        this.$('li[data-page="' + page + '"]').addClass('active');
        if (this.pages > 1) {
            if (page === 0) {
                this.$('li.prev').addClass('disabled').children('a').removeAttr('href');
            } else {
                this.$('li.prev').removeClass('disabled').children('a').attr('href', this.url + (page - 1));
            }
            if (page < this.pages - 1) {
                this.$('li.next').removeClass('disabled').children('a').attr('href', this.url + (page + 1));
            } else {
                this.$('li.next').addClass('disabled').children('a').removeAttr('href');
            }
        }
        return this;
    },
    events: {
        
    }
});