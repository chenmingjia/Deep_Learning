import React from 'react';

const Layout = ({state,  children}) => {
  return (
    <html>
    <head>
      <title>{state.title}</title>
      <link rel="stylesheet" href="/admin.css"></link>
      <link rel="stylesheet" href="/0.css"></link>
    </head>
    <body>
      <div id="root">
        { children }
      </div>
      <script dangerouslySetInnerHTML={{__html: `window.__STATE__ = ${JSON.stringify(state)}`}}/>
      <script src="/static/js/admin.js"></script>
      <script src="/static/js/runtime.js"></script>
      <script src="/static/js/admin.chunk.js"></script>
    </body>
    </html>
  );
};

export default Layout;