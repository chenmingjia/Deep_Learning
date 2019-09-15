import React from 'react';
import './Admin.css'
// import 'babel-polyfill';

class App extends React.Component {

  async getData() {
    return 556
  }

  async getData2() {
    return 789
  }

  constructor () {
    super()
    this.getData2().then((res) => {
      console.log(res)
    })
  }

  componentDidMount () {
    this.getData().then((res) => {
      console.log(res)
    })
  }

  render () {
    return <div className="main">Hello11 { this.props.msg }</div>
  }
};

export default App;