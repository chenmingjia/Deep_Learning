import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';

import AdminApp from '../../component/app/Admin';

ReactDOM.hydrate((<AdminApp {...window.__STATE__.context}/>), document.getElementById('root'));

if (__CLIENT__) {
    console.log('Hello Client')
}