// const Koa = require('koa');
// const consola = require('consola');
// const cors = require('@koa/cors');
// const routes = require('./routes');
// // const morgan = require('koa-morgan');

// const { Nuxt, Builder } = require('nuxt');

// const app = new Koa();
// const host = process.env.HOST || '0.0.0.0';
// const port = process.env.PORT || 3000;

// // Import and Set Nuxt.js options
// let config = require('../nuxt.config.js');
// config.dev = !(app.env === 'production');

// async function start() {
//     // Instantiate nuxt.js
//     const nuxt = new Nuxt(config);

//     // Build in development
//     if (config.dev) {
//         const builder = new Builder(nuxt);
//         await builder.build();
//     }

//     // log
//     // app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
//     //     stream: accessLogStream
//     // }));

//     // app.use(session(sessionConfig, app));
//     // app.use(bodyParser());
//     app.use(cors());
//     app.use(routes.routes(), routes.allowedMethods());

//     app.use(ctx => {
//         ctx.status = 200; // koa defaults to 404 when it sees that status is unset
//         ctx.req.session=ctx.session;

//         return new Promise((resolve, reject) => {
//             ctx.res.on('close', resolve);
//             ctx.res.on('finish', resolve);
//             nuxt.render(ctx.req, ctx.res, promise => {
//                 // nuxt.render passes a rejected promise into callback on error.
//                 promise.then(resolve).catch(reject);
//             });
//         });
//     });

//     app.listen(port, host);
//     consola.ready({
//         message: `Server listening on http://${host}:${port}`,
//         badge: true
//     });
// }

// start();



const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '0.0.0.0',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

