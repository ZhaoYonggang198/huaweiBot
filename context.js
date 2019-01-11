const Response = require('./response');
const delegate = require('delegates');

class Context {
    constructor(req) {
        this.req = req;
        this.res = new Response();
    }

    get request() {
        return this.req;
    }

    get response() {
        return this.res;
    }
}

delegate(Context.prototype, 'res')
    .method('speak')
    .method('reply')
    .method('playAudio')
    .method('stopAudio')
    .method('setPlayMode')
    .method('setAuthStatus')
    .method('appendToCommands')
    .method('closeSession')
    .getter('body');

module.exports = Context;