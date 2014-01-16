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
    }
}