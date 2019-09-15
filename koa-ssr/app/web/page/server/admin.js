import React from 'react';

import AdminLayout from '../../component/app/layout/AdminLayout';
import AdminApp from '../../component/app/Admin';
const testStr = 'base view test';
// const server = context => {
//   return (
//     <AdminLayout state={context}>
//       <AdminApp {...context}/>
//     </AdminLayout>
//   )
// };

export default class View extends React.Component {

    static getInitialProps () {
        return { title: "Chenmingjia" }
    }

    static async getStore() {
        return {
            getState: () => ({ testStr }),
        };
    }

    render() {
        const { store, state, title, context } = this.props;
        console.log('getStore', store)
        return <AdminLayout state={{
            context,
            title,
            state,
            store
        }}>
            <AdminApp {...context}/>
        </AdminLayout>
    }
}

if (__CLIENT__) {
    console.log('Hello Client')
}

// export default server;