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

// define event handler
hwbot.onEvent('enterSkill', (ctx) => {
    ctx.query('你好');
});

// define text handler
hwbot.hears('你是谁', (ctx) => {
    ctx.speak(`我是${ctx.db.username}`).wait();
});

// define regex handler
hwbot.hears(/\W+/, (ctx) => {
    ctx.speak(ctx.request.query);
});

// close session
hwbot.onEvent('quitSkill', (ctx) => {
    ctx.reply('再见').closeSession();
});

// define error handler
hwbot.onError((err, ctx) => {
    logger.error(`error occurred: ${err}`);
    ctx.reply('内部错误，稍后再试').closeSession();
});

// run http server
hwbot.run(8080);
