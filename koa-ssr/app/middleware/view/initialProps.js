'use strict';

const is = require('is-type-of');

module.exports = async function (viewCtx, next) {
  const { Component, props } = viewCtx;

  // check static method in Component
  const injectProps = Component.getInitialProps;
  if (typeof injectProps === 'function') {
    let mapping = is.asyncFunction(injectProps)
      ? await injectProps(props)
      : injectProps(props);

    if (is.promise(mapping)) {
      mapping = await mapping;
    }

    for (const key of Object.keys(mapping)) {
      if (key in props) {
        console.log(
          '[beidou:react:initialprops] `%s` already exists in props, ' +
            'origin value will be overwritten',
          key
        );
      }

      props[key] = mapping[key];
    }
  }

  await next();
};
