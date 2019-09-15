const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');
const path = require('path');
const router = new Router();
const routes = require('./router');
const reactView = require('./middleware/react_view');
const { basicPolyfill, setGlobal } = require('./isomorphic/polyfill');
var webpack = require('webpack');
var webpackDevMiddleware = require('koa-webpack-dev-middleware');
var webpackHotMiddleware = require('koa-webpack-hot-middleware');
var webpackClientConfig = require('../webpack.client');
var compiler = webpack(webpackClientConfig);
// var compiler2 = webpack(webpackClientConfig);

// var compiler = new webpack.MultiCompiler([webpackConfig, webpackClientConfig].map(options => webpack(options)));

const app = new Koa();

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
}));

app.use(webpackHotMiddleware(compiler));

basicPolyfill();
app.config = {}
setGlobal(app.config.env);


// 给koa对象增加一个router属性
Object.defineProperties(app, {
  router: {
    get() {
      return router;
    }
  }
});

// 给koa的上下文ctx对象增加render方法
console.log(path.resolve(__dirname, './view'))
reactView({
  view: path.resolve(__dirname, './view')
}, app);

routes(app);

app.use(serve(path.resolve(__dirname, '../build')));

app.use(router.routes());

app.on('error', function(err, ctx){
  console.log('server error', err, ctx);
});


module.exports = app;