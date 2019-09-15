const assert = require('assert');
const path = require('path');
const fs = require('fs');
const ReactDOMServer = require('react-dom/server');
import React from 'react';
const compose = require('koa-compose');
const initialProps = require('./view/initialProps');
const render = require('./view/render');
const beautify = require('./view/beautify');
const redux = require('./view/redux');
const partial = require('./view/partial');

const defaults = {
    //   view: path.resolve(process.cwd(), 'view'),
    extname: 'js'
};

const {
    renderToString,
    renderToStaticMarkup,
    renderToNodeStream,
    renderToStaticNodeStream,
} = ReactDOMServer;

module.exports = (options, app) => {
    console.log(options.view)
    options = options || {};
    options = Object.assign(options, defaults);
    console.log(options.view)
    assert(typeof options.view === 'string', 'options.view required, and must be a string');
    assert(fs.existsSync(options.view), `Directory ${options.view} not exists`);
    options.extname = options.extname.trim().replace(/^\.?/, '.');

    // Compose user defined middlewares
    const fn = compose([
        initialProps,
        redux,
        partial,
        render,
        beautify
    ]);

    const renderElement = function (...args) {
        return options.static
            ? renderToStaticMarkup(...args)
            : renderToString(...args);
    }
    
    const renderElementToStream = function (...args) {
        return options.static
            ? renderToStaticNodeStream(...args)
            : renderToNodeStream(...args);
    }

    app.context.render = async function (filename, _context) {
        console.log(123)
        if (!path.extname(filename)) {
            filename += options.extname;
        }
        let filepath = path.isAbsolute(filename) ? filename : path.resolve(options.view, filename);
        const props = {
            context:  Object.assign({}, this.state, _context)
        }

        try {
            // 获取server/admin.js编译后的文件
            let Component = require(filepath);
            Component = Component.default || Component;

            const context = {
                props,
                filepath,
                Component: Component,
                html: '',
                view: {
                    renderElement,
                    renderElementToStream,
                    options: {}
                },
                config: {},
                // options: this.options,
            };

            await fn(context)
            // view是一个函数，调用后返回一个react组件，然后把react组件渲染成html字符串
            this.body = context.html;
            this.type = 'html';
           
            return this.body
        } catch (err) {
            err.code = 'REACT';
            throw err;
        }
    }
};