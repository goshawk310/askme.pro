module.exports = {
    req: null,
    res: null,
    server: null,
    next: null,
    setReq: function setReq(value) {
        this.req = value;
        return this;
    },
    setRes: function setRes(value) {
        this.res = value;
        return this;
    },
    setServer: function setServer(value) {
        this.server = value;
        return this;
    },
    setNext: function setNext(value) {
        this.next = value;
        return this;
    },
    getReq: function getReq() {
        return this.req;
    },
    getRes: function getRes() {
        return this.res;
    },
    getServer: function getServer() {
        return this.server;
    },
    getNext: function getNext() {
        return this.next;
    },
    paginate: function paginate(query, callback) {
        var req = this.getReq(),
            limit = req.param('per_page') ? parseInt(req.param('per_page'), 10) : 15,
            skip = (req.param('page') ? parseInt(req.param('page'), 10) - 1 : 0) * limit,
            sortBy = req.param('sort_by') || null,
            sortOrder = req.param('order') === 'desc' ? -1 : 1;
        if (limit > 50) {
            limit = 50;
        }
        if (limit) {
            query.limit(limit);
        }
        if (skip) {
            query.skip(skip);
        }
        if (sortBy) {
            var sort = {};
            sort[sortBy] = sortOrder;
            query.sort(sort);
        }
        if (typeof callback === 'function') {
            return callback(query);
        }
        return query;
    }
};