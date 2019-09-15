// 'use strict';

// const React = require('react');
// const ReactDOM = require('react-dom/server');

// module.exports = async function (viewCtx, next) {
//   const { Component, props } = viewCtx;

//   const instance = React.createElement(Component, props);
//   viewCtx.html += ReactDOM.renderToStaticMarkup(instance);
//   await next();
// };


'use strict';

const React = require('react');
const through = require('through');

module.exports = async function(viewCtx, next) {
  await next();
  const { Component, props, view, html } = viewCtx;
  const instance = React.createElement(Component, props);
  let res = '';
  if (view.options.stream) {
    res = through();
    process.nextTick(async () => {
      const renderedStream = view.renderElementToStream(instance);
      await new Promise((resolve, reject) => {
        renderedStream.pipe(
          res,
          {
            end: false,
          }
        );
        renderedStream.on('error', reject);
        renderedStream.on('end', resolve);
      });
      res.write(html);
      res.end();
    });
  } else {
    res = view.renderElement(instance);
    res += html;
  }
  viewCtx.html = res;
};
