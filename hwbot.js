const compose = require('koa-compose');
const Context = require('./context');
const Request = require('./request');
const ErrorReponse = require('./error')
const debug   = require('debug')('hwbot:hwbot');

class HwBot {
    constructor(appId = null) {
        this.appId = appId;
        this.middlewares = [];
        this.intentListeners = {};
        this.textListeners   = {};
        this.regExpListeners = {};
        this.errorListener   = null;
        this.defaultListener = {};
    }

    run(port, host, tlsOptions) {
        this.server = tlsOptions ? 
                      require('https').createServer(tlsOptions, this.callback()) 
                      : require('http').createServer(this.callback());
        this.server.listen(port, host, () => { debug(`AixBot listening on port: ${port}`)});
    }

    use(middleware) {
        if (typeof middleware !== 'function') throw new TypeError('middleware must be a function!');
        this.middlewares.push(middleware);
        return this;
    }

    callback() {
        this.middlewares.push(this.getFinalHandler());
        const aixbotHandlers = compose(this.middlewares);

        const responseJson = (res, data, statusCode = 200) => {
            const body = JSON.stringify(data);
            debug('resonse data', data, statusCode)
            res.writeHead(statusCode, {
                'Content-Length': Buffer.byteLength(body),
                'Content-Type': 'application/json' });
            res.end(body);
        }
        let that = this;
        return (req, res) => {
            if (!req.headers['content-type']
                || req.headers['content-type'].indexOf('application/json') === -1) {
                responseJson(res, {cause : 'incorrect content type, wish json!'}, 404);
                return;
            }
            let reqBody = "";
            req.on('data', function(chunk) {
                reqBody += chunk;
            });
            req.on('end', async function() {
                try {
                    let resBody = await that.handleRequest(JSON.parse(reqBody), aixbotHandlers);
                    responseJson(res, resBody);
                } catch (err) {
                    responseJson(res, {cause : `${err}`}, 404);
                }
            });
        };
    }

    httpHandler() {
        this.middlewares.push(this.getFinalHandler());
        const aixbotHandlers = compose(this.middlewares);
        let that = this;
        return async (ctx, next) => {
            try {
                ctx.response.body = await that.handleRequest(ctx.request.body, aixbotHandlers);
                ctx.response.status = 200;
            } catch(err) {
                ctx.response.status = 404;
                ctx.response.body = {cause : `${err}`};
            }
            next();
        }
    }

    async handleRequest(request, handler) {
        if (!handler) handler = this.getFinalHandler();
        debug('receive request,', JSON.stringify(request))
        let req = new Request(request);
        let ctx = new Context(req);
        await handler(ctx);
        return ctx.body;
    }  
    
    getFinalHandler() {
        let that = this;
        return async function(ctx) {
            try {
                if ((that.appId !== null)&&(ctx.request.appId != that.appId)) {
                    throw(new Error(`appId(${ctx.request.appId}) does not match the aixbot(${that.appId})`));
                }
                await that.handle(ctx);
                return ctx.body;
            } catch(err) {
                if (that.errorListener) {
                    await that.errorListener(err, ctx);
                    throw err
                } else {
                    debug('Unhandled error occurred!')
                    throw err;
                }
            }
        }
    }    

    async handle(ctx) {
        if (await this.doHandle(ctx, this.intentListeners[ctx.request.intentName], () => {
            return this.intentListeners.hasOwnProperty(ctx.request.intentName);
        })) return;
        if (await this.doHandle(ctx, this.textListeners[ctx.utterance.origin], () => {
            return ctx.utterance.type === 'text' 
            && this.textListeners.hasOwnProperty(ctx.utterance.origin);
        })) return;
        if (await this.doHandle(ctx, 
            this.getRegExpHandler(ctx.utterance.origin)),
            ctx.utterance.type === 'text') return;
        if (await this.doHandle(ctx, this.defaultListener)) return;
    }

    async doHandle(ctx, handler, trigger) {
        if (!handler) return false;
        if ((trigger != undefined)&&(trigger != null)) {
            if ((typeof trigger === 'boolean') && !trigger) return false;
            if ((typeof trigger === 'function') && !trigger()) return false;
        }
        await handler(ctx);
        return true;
    }

    onIntent(intent, handler) {
        this.verifyHandler(handler);
        if (this.intentListeners.hasOwnProperty(intent)) {
            debug(`Warning: override the existing handler of intent ${intent}`);
        }
        this.intentListeners[intent] = handler;
    }

    onError(handler) {
        this.verifyHandler(handler);
        this.errorListener = handler;
    }

    onDefault(handler) {
        this.verifyHandler(handler)
        this.defaultListener = handler
    }

    hears(text, handler) {
        this.verifyHandler(handler);
        if (text instanceof RegExp) {
            this.onRegExp(text, handler);
        } else if(typeof text === 'string') {
            this.onText(text, handler);
        }
        else {
            throw new Error(`ApiBot only support hearing String or RegExp!`);
        }
    }

    onRegExp(regex, handler) {
        let regexStr = (new RegExp(regex)).source;
        if (this.regExpListeners.hasOwnProperty(regexStr)) {
            debug(`Warning: override the existing handler of regex ${regex}`);
        }        
        this.regExpListeners[regexStr] = handler;
    }
    
    onText(text, handler) {
        if (this.textListeners.hasOwnProperty(text)) {
            debug(`Warning: override the existing handler of text ${text}`);
        }        
        this.textListeners[text] = handler;
    }

    verifyHandler(handler) {
        if (!handler) {
            throw new Error(`Event handler must not be empty`);
        }
        if (typeof handler != 'function') {
            throw new TypeError(`Event handler must be a function`);
        }        
    }

    getRegExpHandler(query) {
        for (let regexStr in this.regExpListeners) {
            if(RegExp(regexStr).test(query)) return this.regExpListeners[regexStr];
        }
        return null;
    }    
}

module.exports = HwBot;