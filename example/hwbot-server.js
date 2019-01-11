const HwBot = require('../hwbot');

const hwbot = new HwBot();

// define middleware
hwbot.use(async (ctx, next) => {
    console.log(`process request for '${ctx.request.query}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    console.log(`... response in duration ${execTime}ms`);
});

hwbot.use(async (ctx, next) => {
    ctx.db = {
        username : 'Bowen'
    };
    await next();
});

// define text handler
hwbot.hears('你是谁', (ctx) => {
    ctx.speak(`我是${ctx.db.username}`).closeSession()
});

// define regex handler
hwbot.hears(/\W+/, (ctx) => {
    ctx.speak(ctx.request.query).closeSession;
});

// define error handler
hwbot.onError((err, ctx) => {
    console.error(`error occurred: ${err}`);
    ctx.reply('内部错误，稍后再试').closeSession();
});

hwbot.onDefault((ctx) => {
    
})
// run http server
hwbot.run(8080);
